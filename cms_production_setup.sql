-- Filmsvib Production CMS Migration (Professional Version)
-- Final check: RLS Combined, Audit Trail, Performance Indexes, No Email Fallback

-- 1. Enum and Table Updates
DO $$ BEGIN
    CREATE TYPE article_status AS ENUM ('draft', 'pending', 'published', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE articles 
    ADD COLUMN IF NOT EXISTS status article_status DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
    ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
    ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES auth.users(id),
    ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS last_submission_at TIMESTAMPTZ DEFAULT now();

-- 2. Performance Indexing
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);

-- 3. Security: Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- CLEANUP: Remove old policies to prevent OR collision
DROP POLICY IF EXISTS "Public can view published articles" ON articles;
DROP POLICY IF EXISTS "Users can view own articles" ON articles;
DROP POLICY IF EXISTS "Users can insert own articles" ON articles;
DROP POLICY IF EXISTS "Admins have full access" ON articles;
DROP POLICY IF EXISTS "Safe select policy" ON articles;

-- 4. THE MASTER POLICIES (Combined Logic)

-- SELECT: Public (Published) + Owners (All) + Admins (All)
CREATE POLICY "Unified select policy"
ON articles FOR SELECT
USING (
  status = 'published'
  OR auth.uid() = author_id
  OR (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  )
);

-- INSERT: Authenticated users only, setting themselves as author
CREATE POLICY "Users can insert own articles"
ON articles FOR INSERT
WITH CHECK (
  auth.uid() = author_id 
  AND (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role IS NOT NULL
    )
  )
);

-- UPDATE: Owners (Drafts only) + Admins (Everything)
CREATE POLICY "Unified update policy"
ON articles FOR UPDATE
USING (
  (auth.uid() = author_id AND status = 'draft')
  OR (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  )
)
WITH CHECK (
  (auth.uid() = author_id AND status IN ('draft', 'pending'))
  OR (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  )
);

-- DELETE: Admins only (Standard Production Rule)
CREATE POLICY "Admins only delete"
ON articles FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);
