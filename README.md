# 🎬 سينما نيوز — Cinema News

> **منصة أخبار السينما التفاعلية** — مصدرك الأول لأخبار الأفلام والمسلسلات العالمية، مدعومة بواجهة برمجية TMDB وقاعدة بيانات Supabase.

![Cinema News Banner](https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80)

---

## 🗂️ هيكلية المشروع

```
filmsvib/
├── index.html          # الصفحة الرئيسية — Hero + Trending + Top Rated + Reviews + Newsletter
├── watchlist.html      # صفحة المفضلة — عرض الأفلام المحفوظة في LocalStorage
├── 404.html            # صفحة الخطأ — تصميم احترافي مع عداد إعادة توجيه تلقائي
├── sitemap.xml         # خريطة الموقع لمحركات البحث
├── robots.txt          # توجيهات محركات البحث
├── README.md           # هذا الملف
└── assets/
    ├── css/
    │   └── style.css   # نظام التصميم الكامل (Luxury Noir)
    └── js/
        └── main.js     # منطق العمل — TMDB API + Supabase + Toast + Caching
```

---

## ✨ الميزات

| الميزة | التقنية |
|--------|---------|
| 🎥 Hero ديناميكي | TMDB Now Playing |
| 🔥 كاروسيل الأكثر مشاهدة | TMDB Trending Weekly |
| 🏆 أعلى التقييمات | TMDB Top Rated — بطاقات بوستر مع رقم الترتيب |
| 🎞️ شبكة الأفلام | TMDB Popular + Discover بالتصنيف |
| 🔍 بحث فوري | TMDB Search + Dropdown مع Enter |
| 📺 مشاهدة التريلر | YouTube Embed داخل Modal |
| ⭐ نظام التقييمات | Supabase PostgreSQL |
| 📌 قائمة المفضلة | LocalStorage + صفحة مخصصة |
| 🔔 Toast Notifications | Pure JS — نجاح / معلومة / خطأ |
| 📧 النشرة البريدية | Supabase Insert |
| 💾 API Caching | In-Memory + TTL 5 دقائق |
| 🚀 Lazy Loading | IntersectionObserver |
| 📱 Responsive | Mobile-First + Dark Mode |
| 🔖 SEO كامل | Meta + OG + Twitter Cards + Canonical |
| 🗺️ Sitemap | XML مع تواريخ التحديث |

---

## 🔑 الاعتمادات والمتغيرات

```js
// TMDB
TMDB_API_KEY    = '89247d9fb7c53ca3db276c24c43499cf'
TMDB_BASE_URL   = 'https://api.themoviedb.org/3'
TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

// Supabase
SUPABASE_URL = 'https://sjvkhibcavyjggtywrhv.supabase.co'
SUPABASE_KEY = 'sb_publishable_DZo_iAwyvroj_fgi-KvMiQ_M-NlkuPX'
```

> ⚠️ **تحذير:** قبل النشر في الإنتاج، انقل هذه المفاتيح إلى متغيرات البيئة أو Edge Functions للحماية.

---

## 🛢️ جداول Supabase المطلوبة

```sql
-- تقييمات الأفلام
CREATE TABLE movie_reviews (
  id            BIGSERIAL PRIMARY KEY,
  movie_id      INTEGER NOT NULL,
  reviewer_name TEXT,
  review_text   TEXT,
  rating        NUMERIC(3,1),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- النشرة البريدية
CREATE TABLE newsletter (
  id             BIGSERIAL PRIMARY KEY,
  email          TEXT UNIQUE NOT NULL,
  subscribed_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎨 نظام التصميم

| العنصر | القيمة |
|--------|--------|
| **الثيم** | Luxury Noir — خلفية `#0a0a0f` |
| **اللون الأساسي** | بنفسجي `#7c4dff` + أحمر `#ff1744` |
| **الخطوط** | Orbitron (العناوين) + Cairo (النصوص) |
| **التأثيرات** | Neon Glow + Glassmorphism + Smooth Transitions |
| **الحركات** | Float + Pulse Glow + Fade In Up + Glitch |

---

## 🚀 النشر

### Vercel (موصى به)
```bash
# 1. ثبّت Vercel CLI
npm i -g vercel

# 2. من مجلد المشروع
cd filmsvib
vercel --prod
```

### Netlify
```bash
# اسحب مجلد filmsvib إلى netlify.com/drop
```

### GitHub Pages
```bash
git init
git add .
git commit -m "🎬 Cinema News — Initial Production Release"
git remote add origin https://github.com/YOUR_USERNAME/filmsvib.git
git push -u origin main
# فعّل GitHub Pages من إعدادات الريبو → branch: main
```

---

## 🗺️ خريطة التطوير القادمة

- [ ] 🔐 **نظام تسجيل الدخول** — Supabase Auth (Google / Email)
- [ ] ☁️ **مزامنة المفضلة** — نقل من LocalStorage إلى Supabase
- [ ] 📺 **قسم المسلسلات** — TMDB TV endpoint
- [ ] 🌍 **تعدد اللغات** — عربي / إنجليزي / فرنسي
- [ ] 🔔 **إشعارات Push** — Web Push API
- [ ] 🎭 **صفحة ممثل/مخرج** — TMDB Person endpoint
- [ ] 📊 **لوحة تحكم** — إدارة التقييمات

---

## 📄 الترخيص

MIT License — حر الاستخدام مع الإشارة للمصدر.

---

<p align="center">
  صُنع بكل ❤️ بواسطة <strong>Cinema News Team</strong> — 2024
</p>
