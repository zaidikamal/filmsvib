-- Filmsvib Final Hardening & Scalability Migration
-- Includes: Soft Delete, Analytics, Role Protection, and Enhanced RLS

-- 1. Table Structure Enhancements
ALTER TABLE articles 
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Ensure Slugs are Unique (CRITICAL for SEO)
-- Note: This might fail if you have duplicate slugs currently.
-- Clean them first if necessary.
ALTER TABLE articles ADD CONSTRAINT unique_article_slug UNIQUE (slug);

-- 2. Performance Indexing for new columns
CREATE INDEX IF NOT EXISTS idx_articles_deleted_at ON articles(deleted_at) WHERE (deleted_at IS NULL);
CREATE INDEX IF NOT EXISTS idx_articles_views ON articles(views DESC);

-- 3. Security: Permission Escalation Protection (RLS on profiles)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
    -- Protect ROLE from being changed by the user themselves
    (CASE WHEN (SELECT role FROM profiles WHERE id = auth.uid()) = role THEN true ELSE false END)
    OR 
    -- Admins can change roles
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
);

-- 4. Re-Unified Master Policies (Soft-Delete Aware)

DROP POLICY IF EXISTS "Unified select policy" ON articles;
CREATE POLICY "Unified select policy"
ON articles FOR SELECT
USING (
  deleted_at IS NULL AND (
    status = 'published'
    OR auth.uid() = author_id
    OR (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
      )
    )
  )
);

DROP POLICY IF EXISTS "Unified update policy" ON articles;
CREATE POLICY "Unified update policy"
ON articles FOR UPDATE
USING (
  deleted_at IS NULL AND (
    (auth.uid() = author_id AND status = 'draft')
    OR (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
      )
    )
  )
);

-- Protect DELETE (Convert to Soft Delete via UPDATE policy)
-- This policy explicitly denies hard deletion for non-super-admins
DROP POLICY IF EXISTS "Admins only delete" ON articles;
CREATE POLICY "Super Admins only hard delete"
ON articles FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- 5. Rate Limiting Support in Profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_submission_at TIMESTAMPTZ;

-- 6. Atomic Increment Function for Views
CREATE OR REPLACE FUNCTION increment_article_views(article_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE articles
    SET views = COALESCE(views, 0) + 1
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
