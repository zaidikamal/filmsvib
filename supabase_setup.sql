-- ============================================================
-- Cinema News — Supabase Database Setup
-- Run this script in the Supabase SQL Editor
-- ============================================================

-- ── 1. Movie Reviews ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.movie_reviews (
    id            BIGSERIAL    PRIMARY KEY,
    movie_id      INTEGER      NOT NULL,
    reviewer_name TEXT         NOT NULL DEFAULT 'زائر مجهول',
    review_text   TEXT,
    rating        NUMERIC(3,1) CHECK (rating >= 0 AND rating <= 10),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by movie
CREATE INDEX IF NOT EXISTS idx_reviews_movie_id ON public.movie_reviews (movie_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created  ON public.movie_reviews (created_at DESC);

-- Enable Row-Level Security (read: everyone | write: everyone for now)
ALTER TABLE public.movie_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read"
    ON public.movie_reviews FOR SELECT
    USING (true);

CREATE POLICY "Allow public insert"
    ON public.movie_reviews FOR INSERT
    WITH CHECK (true);

-- ── 2. Newsletter Subscribers ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter (
    id             BIGSERIAL   PRIMARY KEY,
    email          TEXT        UNIQUE NOT NULL,
    subscribed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active      BOOLEAN     NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter (email);

ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert"
    ON public.newsletter FOR INSERT
    WITH CHECK (true);

-- Only admins should SELECT newsletter (no public read policy)

-- ── 3. Sample Data ───────────────────────────────────────────
INSERT INTO public.movie_reviews (movie_id, reviewer_name, review_text, rating)
VALUES
    (550,   'محمد السينمائي',  'فيلم استثنائي يستحق المشاهدة أكثر من مرة! قصة عميقة وإخراج رائع.', 9.5),
    (13,    'سارة م.',         'من أروع الأفلام التي شاهدتها على الإطلاق. أداء رائع من الممثلين.', 9.0),
    (680,   'أحمد ك.',         'تحفة سينمائية! كتابة ممتازة وإخراج يدل على عبقرية كوينتين.', 9.8),
    (27205, 'ليلى ع.',         'فيلم يجعلك تفكر في طبيعة الأحلام والواقع. تجربة لا تُنسى.', 8.5),
    (157336,'خالد ج.',        'كرستوفر نولان أبدع مرة أخرى. مشاهد الفضاء خلّابة!', 9.2),
    (299536,'نورة ط.',        'معركة أفنجرز لا تُنسى! لحظات عديدة جعلتني أبكي.', 8.8)
ON CONFLICT DO NOTHING;

-- ── 4. Useful Views ──────────────────────────────────────────
CREATE OR REPLACE VIEW public.top_movies_by_rating AS
    SELECT
        movie_id,
        COUNT(*)                        AS review_count,
        ROUND(AVG(rating), 2)          AS avg_rating,
        MAX(created_at)                AS last_reviewed
    FROM public.movie_reviews
    GROUP BY movie_id
    ORDER BY avg_rating DESC, review_count DESC;

-- ── 5. User Watchlists ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.watchlists (
    id             BIGSERIAL   PRIMARY KEY,
    user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id       INTEGER     NOT NULL,
    movie_title    TEXT        NOT NULL,
    poster_path    TEXT,
    vote_average   NUMERIC(3,1),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, movie_id)
);

CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON public.watchlists (user_id);

ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own watchlists"
    ON public.watchlists FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own watchlists"
    ON public.watchlists FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own watchlists"
    ON public.watchlists FOR DELETE
    USING (auth.uid() = user_id);

-- ── 6. News & Articles ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.articles (
    id             BIGSERIAL   PRIMARY KEY,
    author_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id       INTEGER,    -- Optional: Link article to a specific movie
    title          TEXT        NOT NULL,
    slug           TEXT        UNIQUE NOT NULL,
    content        TEXT        NOT NULL,
    cover_image    TEXT,       -- URL to the image (Supabase Storage or external)
    is_published   BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_author on public.articles (author_id);
CREATE INDEX IF NOT EXISTS idx_articles_movie on public.articles (movie_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug on public.articles (slug);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Anyone can read published articles
CREATE POLICY "Public can view published articles"
    ON public.articles FOR SELECT
    USING (is_published = true);

-- Authenticated Users (or Admins optionally) can insert
CREATE POLICY "Users can create articles"
    ON public.articles FOR INSERT
    WITH CHECK (auth.uid() = author_id);

-- Authors can update their own articles
CREATE POLICY "Authors can update their articles"
    ON public.articles FOR UPDATE
    USING (auth.uid() = author_id);

-- Authors can delete their own articles
CREATE POLICY "Authors can delete their articles"
    ON public.articles FOR DELETE
    USING (auth.uid() = author_id);

-- ── 7. Article Bookmarks ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.article_bookmarks (
    id             BIGSERIAL   PRIMARY KEY,
    user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id     BIGINT      NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, article_id)
);

CREATE INDEX IF NOT EXISTS idx_article_bookmarks_user ON public.article_bookmarks (user_id);
CREATE INDEX IF NOT EXISTS idx_article_bookmarks_article ON public.article_bookmarks (article_id);

ALTER TABLE public.article_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view their own bookmarks"
    ON public.article_bookmarks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
    ON public.article_bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
    ON public.article_bookmarks FOR DELETE
    USING (auth.uid() = user_id);


