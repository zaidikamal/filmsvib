-- ==========================================
-- FILMSVIB PRODUCTION CMS SETUP (V2.0)
-- ==========================================
-- This script sets up a production-ready CMS with:
-- 1. Enhanced Article Lifecycle (Draft, Pending, Published, Rejected)
-- 2. Security Hardening (RLS, Role Protection)
-- 3. High-Performance Analytics (Atomic Views, Trending Algorithm)
-- 4. Audit Trails & Operational Integrity

-- 1. Tables Extensions
ALTER TABLE articles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES auth.users(id);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- 2. Profiles Hardening
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_submission_at TIMESTAMP WITH TIME ZONE;

-- 3. Unique Constraints for SEO
-- Note: Ensure titles/slugs are unique for production SEO
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'articles_slug_key') THEN
        ALTER TABLE articles ADD CONSTRAINT articles_slug_key UNIQUE (slug);
    END IF;
END $$;

-- 4. High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_deleted_at ON articles(deleted_at);

-- 5. Atomic Functions (Analytics & Trending)

-- Increment views without race conditions
CREATE OR REPLACE FUNCTION increment_article_views(article_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE articles
    SET views = views + 1
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trending Algorithm (Decay-based Ranking)
-- Score = Views / (Hours + 2) ^ 1.5
CREATE OR REPLACE FUNCTION get_trending_articles(limit_count INT DEFAULT 3)
RETURNS SETOF articles AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM articles
    WHERE status = 'published' 
      AND deleted_at IS NULL
    ORDER BY (views / power(EXTRACT(EPOCH FROM (now() - published_at))/3600 + 2, 1.5)) DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Row Level Security (RLS) - Production Hardening

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can see published, non-deleted articles
CREATE POLICY "Public articles are viewable by everyone" 
ON articles FOR SELECT 
USING (status = 'published' AND deleted_at IS NULL);

-- Policy: Authors can see their own articles (even drafts/pending)
CREATE POLICY "Authors can view own articles" 
ON articles FOR SELECT 
USING (auth.uid() = author_id);

-- Policy: Admins can see EVERYTHING
CREATE POLICY "Admins can view all" 
ON articles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')
  )
);

-- Policy: Role Protection (Prevent users from upgrading themselves)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Only admins can update roles" 
ON profiles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'super_admin')
  )
);

-- 7. Audit Trail (Log all status changes)
CREATE TABLE IF NOT EXISTS article_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID REFERENCES articles(id),
    changed_by UUID REFERENCES auth.users(id),
    old_status TEXT,
    new_status TEXT,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
