# 🎬 Filmsvib — Professional Cinema SaaS CMS

> **منصة الأفلام والتحليلات السينمائية المتكاملة** — تحول من مجرد مدونة إلى نظام إدارة محتوى (CMS) احترافي يدعم الإنتاج (Production-ready).

![Filmsvib Banner](https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80)

---

## 🚀 نظرة عامة (Filmsvib 2.0)
تمت إعادة بناء النظام بالكامل باستخدام **Next.js 14** ليكون منصة SaaS حقيقية تركز على الأداء، الأمان، وتجربة المستخدم.

### 🏗️ المعمارية التقنية
- **Framework:** Next.js 14 (App Router)
- **Database & Auth:** Supabase (PostgreSQL)
- **Security:** Row Level Security (RLS) + Atomic Rate Limiting
- **Design:** Luxury Noir System (TailwindCSS/Vanilla CSS)
- **Analytics:** Decay-based Trending Algorithm

---

## 🔐 نظام الأمان وتصلب البيانات (Hardening)
المنصة محصنة ضد أشهر ثغرات الويب وهجمات الإغراق:
- **Atomic Rate Limiting:** منع إرسال أكثر من مقال في الدقيقة عبر السيرفر لمنع الـ Spam.
- **XSS Protection:** تطهير كامل للمحتوى (Sanitization) باستخدام `isomorphic-dompurify`.
- **Slug Collision Retry:** نظام ذكي يعيد محاولة توليد الروابط تلقائياً عند التكرار.
- **Role Protection:** حماية رتب المستخدمين برمجياً وعبر قاعدة البيانات (RLS) لمنع التلاعب بالصلاحيات.

---

## 🔥 خوارزمية الرواج (Trending Algorithm)
يستخدم النظام خوارزمية ترتيب متقدمة تعتمد على **الاضمحلال الزمني (Time Decay)** لضمان ظهور المحتوى الساخن والجديد:
```
Score = Views / (Hours_Since_Publish + 2) ^ 1.5
```
هذا يضمن توازناً مثالياً بين المقالات ذات المشاهدات العالية والمقالات الحديثة.

---

## 🛠️ دليل التثبيت والتشغيل

### 1. إعداد قاعدة البيانات (MANDATORY)
يجب تنفيذ ملف الـ SQL التالي في واجهة Supabase Dashboard لتفعيل كافة الميزات المتقدمة:
👉 **[cms_production_setup.sql](./cms_production_setup.sql)**

### 2. متغيرات البيئة (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role (for admin actions)
```

### 3. التشغيل المحلي
```bash
npm install
npm run dev
```

---

## 📋 دورة حياة المحتوى (CMS Workflow)
1. **Draft:** يكتب المستخدم مسودته.
2. **Pending:** يتم إرسال المقال للمراجعة (Moderation).
3. **Review:** يقوم المدير (Admin) بقبول أو رفض المقال مع ذكر السبب.
4. **Published:** يظهر المقال في واجهة "الرواج" والأخبار بناءً على خوارزمية الـ Ranking.
5. **Soft Delete:** الحذف في النظام "ناعم"؛ لا تضيع البيانات أبداً ويتم الاحتفاظ بـ Audit Trail.

---

## 🚨 جاهزية التشغيل (Operational Readiness)
- **Structured Logging:** تتبع كافة الأخطاء والعمليات الحساسة في السيرفر.
- **Analytics Ready:** جاهزية تامة للربط مع Vercel Analytics أو Sentry.
- **Atomic Increases:** تحديثات العدادات (المشاهدات) تتم داخل قاعدة البيانات لمنع تضارب البيانات.

---

## 📄 الترخيص
MIT License — 2024 Filmsvib Team.
