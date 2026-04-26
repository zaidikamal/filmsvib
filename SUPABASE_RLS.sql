-- FILMSVIB DATABASE SECURITY POLICIES (RLS)
-- Copy and run this script in the Supabase SQL Editor

-- 1. ARTICLES TABLE
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to articles
DROP POLICY IF EXISTS "Allow public read access" ON articles;
CREATE POLICY "Allow public read access" ON articles
FOR SELECT USING (true);

-- Allow admins to manage (INSERT, UPDATE, DELETE) articles
DROP POLICY IF EXISTS "Allow admin management" ON articles;
CREATE POLICY "Allow admin management" ON articles
FOR ALL TO authenticated
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- 2. PROFILES TABLE
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to see profiles
DROP POLICY IF EXISTS "Public profiles are viewable" ON profiles;
CREATE POLICY "Public profiles are viewable" ON profiles
FOR SELECT USING (true);

-- Allow users to update their own profiles
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- 3. COMMENTS TABLE (If applicable)
-- ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
-- CREATE POLICY "Authenticated users can post comments" ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
