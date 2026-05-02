-- 1. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'article_approved', 'article_rejected', 'article_published', 'system'
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- 2. Article Views Unique Tracking
CREATE TABLE IF NOT EXISTS article_views_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for Views Log (Strict)
ALTER TABLE article_views_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "System only views log" ON article_views_log FOR ALL USING (false);

-- 3. Analytics Views
-- Author Performance View
CREATE OR REPLACE VIEW author_performance AS
SELECT 
    p.full_name as author_name,
    p.id as author_id,
    COUNT(a.id) as total_articles,
    SUM(a.views) as total_views,
    AVG(a.views) as avg_views_per_article
FROM profiles p
JOIN articles a ON p.id = a.author_id
WHERE a.status = 'published'
GROUP BY p.id, p.full_name;

-- Category Performance View
CREATE OR REPLACE VIEW category_performance AS
SELECT 
    category,
    COUNT(id) as article_count,
    SUM(views) as total_views,
    AVG(views) as avg_views
FROM articles
WHERE status = 'published'
GROUP BY category;

-- 4. Secure RPC for Unique View Counting
CREATE OR REPLACE FUNCTION increment_article_views_unique(
  target_article_id UUID,
  viewer_user_id UUID DEFAULT NULL,
  viewer_ip TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM article_views_log
    WHERE article_id = target_article_id
    AND (
      (viewer_user_id IS NOT NULL AND user_id = viewer_user_id)
      OR (viewer_ip IS NOT NULL AND ip_address = viewer_ip)
    )
    AND created_at > NOW() - INTERVAL '24 hours'
  ) THEN
    RETURN;
  END IF;

  INSERT INTO article_views_log (article_id, user_id, ip_address)
  VALUES (target_article_id, viewer_user_id, viewer_ip);

  UPDATE articles
  SET views = COALESCE(views, 0) + 1
  WHERE id = target_article_id;
END;
$$;
