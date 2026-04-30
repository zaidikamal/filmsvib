-- ==========================================
-- FILMSVIB FINAL PRODUCTION SCHEMA
-- ==========================================

-- Tables, Triggers, and RLS are already set up.
-- This file contains the Analytics Views and extra configurations.

-- 1. Category Performance View
CREATE OR REPLACE VIEW category_performance AS
SELECT 
    category,
    count(*) as total_articles,
    sum(views) as total_views,
    round(avg(views), 2) as avg_views_per_article
FROM articles
WHERE status = 'published'
GROUP BY category;

-- 2. Author Performance View
CREATE OR REPLACE VIEW author_performance AS
SELECT 
    p.email,
    count(a.id) as articles_written,
    sum(a.views) as total_reach
FROM profiles p
JOIN articles a ON p.id = a.author_id
WHERE a.status = 'published'
GROUP BY p.email;

-- Note: Realtime for 'articles', 'comments', and 'notifications' 
-- should be enabled via the Supabase Dashboard if not already active.
