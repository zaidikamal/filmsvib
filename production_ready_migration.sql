-- ============================================================
-- FINAL PRODUCTION MIGRATION
-- Run this in Supabase SQL Editor to enable AI and Analytics
-- ============================================================

-- 1. Add view_count to articles (if not exists)
ALTER TABLE public.articles 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- 2. Create AI Usage Logs table
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id             BIGSERIAL   PRIMARY KEY,
    user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt_text    TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for analytics
CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON public.ai_usage_logs (user_id);

-- Enable RLS (Security)
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Only user can see their own logs
CREATE POLICY "Users can only view their own AI logs"
    ON public.ai_usage_logs FOR SELECT
    USING (auth.uid() = user_id);

-- Only service role or auth users can insert
CREATE POLICY "Users can insert their own AI logs"
    ON public.ai_usage_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 3. Verify Profiles table (ensure it's production ready)
-- This ensures that even if supabase_roles_setup.sql wasn't run, we have it.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        CREATE TABLE public.profiles (
            id uuid references auth.users on delete cascade not null primary key,
            email text,
            role text default 'user' check (role in ('user', 'admin')),
            created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
        CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;
