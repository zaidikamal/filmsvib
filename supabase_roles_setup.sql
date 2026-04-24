-- 1. Create the `profiles` table to store User context and roles
CREATE TABLE public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
-- Everyone can read profiles
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.profiles FOR SELECT USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile." 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update own profile
CREATE POLICY "Users can update own profile." 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Admins can do anything (Update roles)
CREATE POLICY "Admins can update all profiles." 
ON public.profiles FOR UPDATE USING (
  EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Create trigger to automatically add user to profiles upon registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- كيفية تعيين نفسك كـ Admin أو مسؤول:
-- بعد أن تسجل حسابك في التطبيق باستخدام بريدك، انسخ السطر التالي وقم بتعديل الإيميل ليكون إيميلك واضغط Run:

-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'your_email@example.com';
