-- Filmsvib CMS Production Setup Migration
-- This script prepares the database for the professional content management workflow

-- 1. Create Article Status Type
DO $$ BEGIN
    CREATE TYPE article_status AS ENUM ('draft', 'pending', 'published', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Update Articles Table Structure
ALTER TABLE articles ADD COLUMN IF NOT EXISTS status article_status DEFAULT 'pending';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 4. Security Policies

-- Policy: Public can view published articles only
DROP POLICY IF EXISTS "Public can view published articles" ON articles;
CREATE POLICY "Public can view published articles" 
ON articles FOR SELECT 
USING (status = 'published');

-- Policy: Users can view their own articles (even if pending or rejected)
DROP POLICY IF EXISTS "Users can view own articles" ON articles;
CREATE POLICY "Users can view own articles" 
ON articles FOR SELECT 
USING (auth.uid() = author_id);

-- Policy: Users can only insert articles where they are the author
DROP POLICY IF EXISTS "Users can insert own articles" ON articles;
CREATE POLICY "Users can insert own articles" 
ON articles FOR INSERT 
WITH CHECK (auth.uid() = author_id);

-- Policy: Admins have full access to everything
-- Note: This assumes a profile system where admin status is defined by email or a role column
DROP POLICY IF EXISTS "Admins have full access" ON articles;
CREATE POLICY "Admins have full access" 
ON articles ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR email = 'fr.capsules20@gmail.com')
  )
);

-- 5. Trigger for automated timestamps (if not already exists)
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = now();
--     RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- CREATE TRIGGER update_articles_updated_at
--     BEFORE UPDATE ON articles
--     FOR EACH ROW
--     EXECUTE PROCEDURE update_updated_at_column();
