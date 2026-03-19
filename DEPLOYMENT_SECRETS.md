# 🚀 Deployment Guide - Complete Instructions

## 📋 Overview
هذا الدليل يحتوي على كل المعلومات اللي تحتاجها لرفع المشروع على الإنترنت.

---

## 1️⃣ Backend Deployment (Railway)

### الخطوة 1: إعداد المتغيرات البيئية
في Railway Dashboard -> Variables، أضف المتغيرات التالية:

```env
PORT=5000
NODE_ENV=production

# Database - استخدم Connection Pooler (Port 6543) للاستقرار
DATABASE_URL=postgresql://postgres:admin1234%23%23@db.lszomwyawfydplooyafi.supabase.co:6543/postgres

# Direct URL - للـ Migrations (Port 5432)
DIRECT_URL=postgresql://postgres:admin1234%23%23@db.lszomwyawfydplooyafi.supabase.co:5432/postgres

# JWT Secret - غيره لأي حاجة صعبة
JWT_SECRET=super_secret_jwt_key_change_this_in_production_2025

# اختياري - لو عايز تستخدم الصور والذكاء الاصطناعي
CLAUDE_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### الخطوة 2: إعداد Build Command
في Railway -> Settings -> Build:

**Build Command:**
```bash
npm install && npm run build && npx prisma db push --accept-data-loss
```

**Start Command:**
```bash
npm start
```

### الخطوة 3: Generate Domain
في Settings -> Networking -> Generate Domain
احفظ الرابط (مثلاً: `roommates-backend-production.up.railway.app`)

---

## 2️⃣ Frontend Deployment (Netlify)

### الخطوة 1: Build Settings
عند ربط الريبو، استخدم الإعدادات التالية:

**Build command:** `npm run build`  
**Publish directory:** `dist`

### الخطوة 2: إعداد المتغيرات البيئية
في Netlify -> Site configuration -> Environment variables:

```env
# ⚠️ مهم: استخدم رابط Railway بدون /api في النهاية
VITE_API_URL=https://roommates-backend-production.up.railway.app

VITE_APP_NAME=Roommates Finder
VITE_ENVIRONMENT=production
```

**ملاحظة مهمة:** لا تضع `/api` في نهاية `VITE_API_URL` - الكود يضيفها تلقائياً!

### الخطوة 3: Redeploy
بعد إضافة المتغيرات:
- Deploys -> Trigger deploy -> Clear cache and deploy site

---

## 3️⃣ Supabase Configuration (مهم جداً!)

### تفعيل الاتصالات الخارجية:
1. افتح Supabase Dashboard
2. Settings -> Database -> Network Restrictions
3. تأكد من تفعيل: **"Allow access from anywhere (0.0.0.0/0)"**
   (أو أضف IP بتاع Railway لو تعرفه)

---

## 4️⃣ Testing الموقع بعد الرفع

### Backend Test:
افتح في المتصفح:
```
https://roommates-backend-production.up.railway.app/api/listings
```
**النتيجة المتوقعة:** `[]` (قوسين فاضيين) أو بيانات JSON

### Frontend Test:
افتح رابط Netlify (مثلاً: `https://roommates-finder.netlify.app`)
- جرب Signup/Login
- جرب تصفح الإعلانات

---

## 🔧 Troubleshooting

### Backend مش شغال؟
1. تحقق من Logs في Railway -> Deployments -> View Logs
2. تأكد من `DATABASE_URL` و `DIRECT_URL` صحيحين
3. تأكد من Supabase Network Restrictions مفتوحة

### Frontend مش بيتصل بالـ Backend؟
1. تحقق من `VITE_API_URL` في Netlify
2. تأكد إنه **بدون** `/api` في النهاية
3. افتح Console في المتصفح وشوف الأخطاء

### Database Connection Failed؟
- جرب استخدام Port **6543** بدلاً من **5432**
- تأكد من الباسورد صحيح وURL-encoded (`##` = `%23%23`)

---

## 📝 ملاحظات نهائية

- **الباسورد في الأمثلة:** `admin1234##` (مشفر: `admin1234%23%23`)
- **لا ترفع ملفات `.env` على GitHub أبداً!**
- **Railway Free Tier:** $5 شهرياً مجاناً (كافي للتجربة)
- **Netlify:** مجاني تماماً للـ Frontend

بالتوفيق! 🚀
