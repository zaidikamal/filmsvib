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
