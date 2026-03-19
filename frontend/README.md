#  منصة البحث عن شركاء السكن - Roommates Platform Frontend

<div dir="rtl">

**منصة ذكية وحديثة للبحث عن شركاء سكن متوافقين مع المطابقة الذكية والمحادثات الفورية والأدوات الإدارية المتقدمة**

**A modern, full-stack platform for finding compatible roommates with AI-powered matching, real-time chat, and comprehensive admin tools.**

###  الموقع المباشر | Live Demo

**[ زيارة الموقع المباشر: https://roommates-frontend.netlify.app/](https://roommates-frontend.netlify.app/)**

---

##  المحتويات | Table of Contents

- [نظرة عامة](#نظرة-عامة)
- [المميزات](#المميزات)
- [التقنيات](#التقنيات-المستخدمة)
- [البدء السريع](#البدء-السريع)
- [التثبيت](#التثبيت)
- [الاستخدام](#كيفية-الاستخدام)
- [النشر](#النشر)

---

## نظرة عامة | Overview

منصة **Roommates** تطبيق ويب حديث يسهل البحث عن شركاء سكن متوافقين

 **محرك مطابقة ذكي**   **محادثات فورية**   **خريطة تفاعلية**   **مساعد ذكي**   **لوحة تحكم**

---

## المميزات | Features

###  للمستخدمين
-  بحث متقدم مع فلاتر
-  محادثات آنية
-  جدولة الزيارات
-  قائمة المفضلة
-  مطابقة ذكية

###  للمالكين
-  إنشاء إعلانات
-  إحصائيات
-  رفع صور
-  اقتراحات أسعار
-  إدارة الزيارات

---

## التقنيات | Tech Stack

- **React 18** + TypeScript
- **Vite** - Build Tool
- **Tailwind CSS v4** - Styling
- **Axios** - HTTP Client
- **React Router v6** - Navigation
- **Socket.io** - Real-time
- **react-i18next** - Bilingual (AR/EN)

---

## البدء السريع | Quick Start

```bash
# استنساخ وتثبيت
git clone https://github.com/Ah-Fayyad/Roommates-Frontend
cd Roommates-Frontend
npm install

# إعداد المتغيرات
echo "VITE_API_URL=http://localhost:5000" > .env.development

# التشغيل
npm run dev
```

**يعمل على:** http://localhost:5174

---

## التثبيت الكامل | Full Installation

### المتطلبات
- Node.js v18+
- npm v9+
- Backend قيد التشغيل

### خطوات التثبيت
1. استنساخ المستودع
2. تثبيت المكتبات: `npm install`
3. إعداد `.env.development`
4. تشغيل: `npm run dev`

### متغيرات البيئة
```env
# .env.development
VITE_API_URL=http://localhost:5000

# .env.production
VITE_API_URL=https://your-backend-api.com
```

---

## كيفية الاستخدام | Usage

1. **التسجيل**  Signup (User/Landlord)
2. **البحث**  Listings (مع فلاتر وخريطة)
3. **التواصل**  Chat (رسائل فورية)
4. **الزيارات**  Schedule visits

---

## البنية | Project Structure

```
src/
 pages/          # الصفحات
 components/     # المكونات
 context/        # React Context
 services/       # API Services
 locales/        # الترجمات (AR/EN)
 types/          # TypeScript
```

---

## الأوامر | Commands

```bash
npm run dev       # تطوير
npm run build     # بناء
npm run preview   # معاينة
npm test          # اختبارات
npm run lint      # فحص
```

---

## النشر | Deployment

### Netlify (موصى به)
```bash
# من GitHub أو Terminal
npm run build
netlify deploy --prod --dir=dist
```

### Vercel
```bash
npm install -g vercel
vercel
```

---

## الأمان | Security

 HTTPS Only
 XSS Protection
 Input Validation
 JWT Tokens

---

## الدعم | Support

-  support@roommates.com
-  GitHub Issues
-  Documentation

---

## الترخيص | License

MIT License

<div dir="ltr">

**Last Updated:** February 22, 2026
**Status:**  Production Ready
**Version:** 1.0.0

</div>

</div>
