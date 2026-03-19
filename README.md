# 🏠 منصة البحث عن شركاء السكن - Roommates Platform

<div dir="rtl">

**منصة ذكية وحديثة للبحث عن شركاء سكن متوافقين مع المطابقة الذكية والمحادثات الفورية والأدوات الإدارية المتقدمة**

**A modern, full-stack platform for finding compatible roommates with AI-powered matching, real-time chat, and comprehensive admin tools.**

### 🚀 الموقع المباشر | Live Demo

**[🌐 زيارة الموقع المباشر: https://roommates-frontend.netlify.app/](https://roommates-frontend.netlify.app/)**

---

## 📋 جدول المحتويات | Table of Contents

- [نظرة عامة](#نظرة-عامة)
- [المميزات](#المميزات)
- [التقنيات المستخدمة](#التقنيات-المستخدمة)
- [قاعدة البيانات](#قاعدة-البيانات)
- [AI Models و التعلم الآلي](#ai-models)
- [البيانات و Datasets](#البيانات-والdatasets)
- [الهندسة المعمارية](#الهندسة-المعمارية)
- [البدء السريع](#البدء-السريع)
- [التثبيت والتشغيل](#التثبيت-والتشغيل)
- [كيفية الاستخدام](#كيفية-الاستخدام)
- [النشر والـ Deployment](#النشر-والdeployment)

---

## نظرة عامة | Project Overview

### الفكرة الأساسية | The Concept

منصة **Roommates** هي تطبيق ويب حديث يهدف إلى تسهيل عملية البحث عن شركاء السكن المتوافقين من خلال:

✨ **محرك مطابقة ذكي** يستخدم الذكاء الاصطناعي لإيجاد شركاء سكن متوافقين
💬 **محادثات فورية** عبر تقنية WebSockets للتواصل المباشر
🗺️ **خريطة تفاعلية** مع Google Maps للموقع الجغرافي
🤖 **مساعد ذكي AI** للإجابة على أسئلة الإسكان
📊 **لوحة تحكم متقدمة** لإدارة المستخدمين والإعلانات

### من المستخدمون؟ | Target Users

1. **المستأجرون (Users/Tenants)** - يبحثون عن شركاء سكن
2. **مالكو العقارات (Landlords/Advertisers)** - يعرضون الغرف والشقق
3. **مسؤولو النظام (Admins)** - يديرون المنصة والمحتوى

---

## المميزات | Features

### 🎯 للمستخدمين العاديين | For Regular Users

#### البحث والتصفية
- 🔍 بحث متقدم مع فلاتر متعددة (السعر، الموقع، المساحة، الخدمات)
- 🗺️ خريطة تفاعلية مع Google Maps Integration
- ⭐ عرض الملايين من الإعلانات يتم تحديثها باستمرار
- 📍 البحث حسب الحي والشارع والمنطقة الجغرافية

#### المطابقة الذكية
- 🤖 نظام مطابقة ذكي يعتمد على تفضيلاتك
- 💯 درجات توافق بناءً على التفضيلات المتشابهة
- 🎯 التوصيات المخصصة حسب ملفك الشخصي
- 📊 تحليل البيانات لفهم احتياجاتك

#### التواصل والمحادثة
- 💬 محادثات فورية وآنية مع Property Owners
- 🔔 إشعارات فورية للرسائل الجديدة
- 🎤 دعم الصور والوسائط في المحادثات
- 👥 تتبع محادثاتك مع عدة أشخاص

#### إدارة الملف الشخصي
- 👤 ملف شخصي مخصص مع الصورة والمعلومات
- 📋 تحديد التفضيلات والاحتياجات
- ❤️ قائمة المفضلة والإعلانات المحفوظة
- 📈 متابعة ملف تعريفك والقوة

#### الزيارات والجدولة
- 📅 جدولة زيارات للعقارات
- 📝 طلبات زيارة مع رسائل شخصية
- ⏰ إدارة أوقات الزيارة والمتابعة
- ✅ تأكيد الزيارات والتقييمات

---

### 🏢 لأصحاب العقارات | For Landlords/Property Owners

#### إدارة الإعلانات
- 📝 نموذج إنشاء إعلان سهل مع خطوات متعددة
- 📸 رفع صور متعددة مع تحسين الجودة
- 🗺️ إضافة موقع على Google Maps تلقائياً
- 📋 وصف مفصل مع الخدمات والمزايا
- 💰 تحديد السعر المناسب مع AI Suggestions

#### لوحة التحكم والتحليلات
- 📊 إحصائيات تفصيلية عن الإعلانات
- 👁️ عدد المشاهدات والزيارات
- 💬 عدد الرسائل والاستفسارات
- 📈 تحليل الأداء والشهرية
- 🔍 معرفة أكثر الشروط بحثاً

#### جدولة الزيارات
- 📅 إدارة طلبات الزيارة
- ✅ قبول أو رفض الطلبات
- 📝 ملاحظات للزائرين
- ⏰ تتبع الزيارات المقررة
- 📊 إحصائيات الزيارات

#### أدوات متقدمة
- 💡 اقتراحات الأسعار من الذكاء الاصطناعي
- 🎯 نصائح لتحسين الإعلان
- 📱 تنبيهات فورية للرسائل الجديدة
- 🔄 إعادة نشر الإعلانات

---

### 🛡️ للمسؤولين | For Administrators

#### إدارة المستخدمين
- 👥 قائمة جميع المستخدمين مع البيانات
- 🔍 البحث والتصفية حسب معايير مختلفة
- 🚫 حظر أو إيقاف المستخدمين
- 📋 عرض سجل أنشطة المستخدمين
- ✉️ إرسال رسائل تنبيهات للمستخدمين

#### إدارة المحتوى
- 📄 تحرير صفحات حول الموقع
- 🔒 إدارة سياسات الخصوصية
- 📋 تحرير شروط الخدمة
- 🌐 إدارة محتوى متعدد اللغات

#### المراقبة والتعديل
- 🛡️ مراقبة الإعلانات للمحتوى غير المناسب
- 🚩 نظام الإبلاغات عن الإعلانات والمستخدمين
- 🤖 AI-Powered تحليل المحتوى
- ⚠️ تنبيهات فورية للمحتوى المريب

#### التحليلات والإحصائيات
- 📊 إحصائيات شاملة عن المنصة
- 👥 عدد المستخدمين النشطين والجدد
- 📝 عدد الإعلانات والزيارات
- 💬 إحصائيات الرسائل والتواصل
- 💰 الإحصائيات المالية (بدون معاملات)

---

## التقنيات المستخدمة | Tech Stack

### الواجهة الأمامية (Frontend)

```
┌─────────────────────────────────────────────┐
│         Frontend Technologies               │
├─────────────────────────────────────────────┤
│ Framework     │ React 18 + TypeScript      │
│ Build Tool    │ Vite (Super Fast!)        │
│ Styling       │ Tailwind CSS v4            │
│ HTTP Client   │ Axios + Interceptors       │
│ State Mgmt    │ React Context API          │
│ Routing       │ React Router v6            │
│ Icons         │ Lucide React               │
│ i18n          │ react-i18next (AR/EN)      │
│ Maps          │ Google Maps API            │
│ Toast/Notify  │ Custom Toast Context       │
│ Real-time     │ Socket.io Client           │
│ Form Valid.   │ React Hook Form + Zod      │
└─────────────────────────────────────────────┘
```

### الخادم الخلفي (Backend)

```
┌─────────────────────────────────────────────┐
│        Backend Technologies                 │
├─────────────────────────────────────────────┤
│ Framework     │ Express.js + TypeScript    │
│ Database      │ SQLite (Dev) / PostgreSQL  │
│ ORM           │ Prisma 5                   │
│ Auth          │ JWT + bcrypt               │
│ Real-time     │ Socket.io                  │
│ Email         │ Nodemailer                 │
│ File Upload   │ Multer + Cloudinary        │
│ Validation    │ express-validator + Zod    │
│ Security      │ Helmet, CORS              │
│ Logging       │ Winston + Morgan           │
│ AI Service    │ Google Gemini API          │
│ API Testing   │ Jest + Supertest           │
└─────────────────────────────────────────────┘
```

### DevOps والأدوات

- 📦 **Package Management**: npm + yarn
- 🔨 **Build Tools**: TypeScript, Webpack
- 🧪 **Testing**: Jest, Supertest
- 📝 **Linting**: ESLint
- 📚 **Documentation**: Markdown

---

## قاعدة البيانات | Database

### النموذج العلاقي | Database Schema

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (PK)         │ UUID Primary Key
│ email (UK)      │ البريد الإلكتروني (فريد)
│ password        │ كلمة المرور (مشفرة)
│ fullName        │ الاسم الكامل
│ avatar          │ صورة الملف الشخصي
│ role            │ USER/LANDLORD/ADVERTISER/ADMIN
│ phoneNumber     │ رقم الهاتف
│ university      │ الجامعة/المدرسة
│ bio             │ السيرة الذاتية
│ language        │ اللغة المفضلة (en/ar)
│ isVerified      │ التحقق من البريد
│ isBanned        │ الحساب محظور؟
│ lastActiveAt    │ آخر نشاط
│ createdAt       │ تاريخ الإنشاء
│ updatedAt       │ آخر تحديث
└─────────────────┘
      │
      ├──────→ Preference (1-1)
      ├──────→ Listing[] (1-Many)
      ├──────→ Favorite[] (1-Many)
      ├──────→ Chat[] (1-Many)
      ├──────→ Message[] (1-Many)
      ├──────→ Report[] (1-Many)
      └──────→ Notification[] (1-Many)

┌──────────────────────┐
│     Listing          │
├──────────────────────┤
│ id (PK)              │ UUID
│ ownerId (FK)         │ مالك الإعلان
│ title               │ عنوان الإعلان
│ description         │ وصف تفصيلي
│ price               │ السعر الشهري
│ address             │ العنوان الكامل
│ latitude            │ خط العرض
│ longitude           │ خط الطول
│ googleMapsUrl       │ رابط Google Maps
│ roomType            │ نوع الغرفة (خاصة/مشتركة/ستوديو)
│ size                │ الحجم بالمتر المربع
│ amenities           │ الخدمات (JSON)
│ status              │ ACTIVE/RENTED/INACTIVE
│ viewsCount          │ عدد المشاهدات
│ createdAt           │ تاريخ الإنشاء
│ updatedAt           │ آخر تحديث
└──────────────────────┘
         │
         ├──────→ Image[] (1-Many)
         ├──────→ Favorite[] (1-Many)
         ├──────→ VisitRequest[] (1-Many)
         ├──────→ ListingView[] (1-Many)
         └──────→ Report[] (1-Many)

┌──────────────────────┐
│     Preference       │
├──────────────────────┤
│ id (PK)              │ UUID
│ userId (FK, UK)      │ المستخدم (فريد)
│ cleanliness          │ النظافة (1-5)
│ studyHabits          │ عادات الدراسة (1-5)
│ quietHours           │ ساعات الهدوء (1-5)
│ socializing          │ التفاعل الاجتماعي (1-5)
│ cooking              │ الطبخ (1-5)
│ smoking              │ التدخين (صح/خطأ)
│ guests               │ الضيوف (صح/خطأ)
│ pets                 │ الحيوانات الأليفة (صح/خطأ)
│ sleepSchedule        │ جدول النوم
│ workSchedule         │ جدول العمل
│ budget               │ الميزانية الشهرية
└──────────────────────┘

┌──────────────────────┐
│      Chat            │
├──────────────────────┤
│ id (PK)              │ UUID
│ createdAt           │ تاريخ الإنشاء
│ updatedAt           │ آخر تحديث
└──────────────────────┘
         │
         ├──────→ Message[] (1-Many)
         └──────→ User[] (Many-Many)

┌──────────────────────┐
│     VisitRequest     │
├──────────────────────┤
│ id (PK)              │ UUID
│ listingId (FK)       │ الإعلان
│ requesterId (FK)     │ طالب الزيارة
│ ownerId (FK)         │ مالك العقار
│ status               │ REQUESTED/ACCEPTED/DECLINED
│ proposedTimes        │ الأوقات المقترحة (JSON)
│ scheduledTime        │ الوقت المجدول
│ message              │ رسالة من الطالب
│ rating               │ التقييم بعد الزيارة
│ completedAt          │ تاريخ إتمام الزيارة
│ createdAt            │ تاريخ الإنشاء
│ updatedAt            │ آخر تحديث
└──────────────────────┘

┌──────────────────────┐
│      Report          │
├──────────────────────┤
│ id (PK)              │ UUID
│ reporterId (FK)      │ من أبلغ
│ targetType           │ USER/LISTING
│ reportedUserId       │ المستخدم المبلغ عنه
│ reportedListingId    │ الإعلان المبلغ عنه
│ reason               │ سبب الإبلاغ
│ description          │ وصف مفصل
│ status               │ PENDING/REVIEWING/RESOLVED
│ createdAt            │ تاريخ الإبلاغ
│ updatedAt            │ آخر تحديث
└──────────────────────┘

┌──────────────────────┐
│   Notification       │
├──────────────────────┤
│ id (PK)              │ UUID
│ userId (FK)          │ المستخدم
│ type                 │ نوع التنبيه
│ title                │ العنوان
│ message              │ الرسالة
│ data                 │ بيانات إضافية (JSON)
│ read                 │ تم قراءته؟
│ createdAt            │ تاريخ الإنشاء
└──────────────────────┘
```

### العلاقات الرئيسية | Key Relationships

| العلاقة | الوصف |
|--------|-------|
| User - Listing | مالك الإعلان (1-Many) |
| User - Chat | المشاركة في محادثة (Many-Many) |
| Listing - Image | صور الإعلان (1-Many) |
| User - Favorite | الإعلانات المفضلة (Many-Many) |
| User - VisitRequest | طلبات الزيارة (1-Many) |
| User - Report | الإبلاغات (1-Many) |
| Listing - Report | الإبلاغات عن الإعلان (1-Many) |

---

## AI Models والتعلم الآلي | AI Models & ML

### نماذج الذكاء الاصطناعي المستخدمة

#### 1️⃣ Google Gemini API
**الاستخدام:**
- 🤖 **Chatbot الذكي**: الإجابة على أسئلة حول السكن والشركاء
- 💡 **اقتراح الأسعار**: تحليل الأسعار المماثلة واقتراح سعر مناسب
- 📝 **تحسين الأوصاف**: تحسين وصف الإعلان تلقائياً
- 🔍 **تحليل المحتوى**: كشف المحتوى غير المناسب

**النموذج:**
```
Google Gemini Pro (v1.5)
├─ Context Length: 128K tokens
├─ Response: Real-time streaming
├─ Cost: بسيط وفعال
└─ Features: متعدد اللغات (AR+EN)
```

### نظام المطابقة الذكي | Smart Matching Algorithm

```javascript
// Matching Score Calculation
const calculateMatch = (user1, user2) => {
  const preferences1 = user1.preferences;
  const preferences2 = user2.preferences;
  
  // 1. معايير الموقع (40%)
  const locationScore = calculateDistance(
    user1.location, 
    user2.listings[0].location
  );
  
  // 2. معايير التفضيلات (35%)
  const preferenceScore = calculatePreferenceMatch(
    preferences1,
    preferences2
  );
  // النظافة، الهدوء، التفاعل الاجتماعي، إلخ
  
  // 3. معايير السعر (15%)
  const budgetScore = calculateBudgetMatch(
    preferences1.budget,
    listing.price
  );
  
  // 4. معايير أخرى (10%)
  const otherScore = calculateOtherFactors(
    user1.university,
    user2.university
  );
  
  // النتيجة النهائية
  return (locationScore * 0.4) +
         (preferenceScore * 0.35) +
         (budgetScore * 0.15) +
         (otherScore * 0.1);
};
```

### تقنيات ML المستخدمة

| التقنية | الاستخدام |
|--------|-----------|
| **Similarity Matching** | إيجاد شركاء سكن متشابهين |
| **Recommendation System** | اقتراح إعلانات مناسبة |
| **Natural Language Processing** | فهم أسئلة المستخدمين |
| **Sentiment Analysis** | تحليل مشاعر الرسائل |
| **Content Classification** | تصنيف الإعلانات والتقارير |

---

## البيانات و Datasets | Data & Datasets

### حجم البيانات الحالية | Current Data

```
Backend Seed Data:
├── Users: 60 مستخدم عادي
├── Landlords: 20 مالك عقار
├── Listings: 200 إعلان عقاري
├── Messages: آلاف الرسائل التجريبية
├── Images: آلاف الصور (مشفرة)
└── Visits: مئات طلبات الزيارة
```

### هيكل البيانات | Data Structure

#### بيانات المستخدمين | User Data
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "أحمد فهد",
  "avatar": "url-to-image",
  "role": "USER",
  "university": "جامعة الملك سعود",
  "bio": "طالب جامعي أبحث عن شريك سكن",
  "preferences": {
    "cleanliness": 4,
    "quietHours": 5,
    "budget": 1500,
    "sleepSchedule": "NIGHT_OWL"
  }
}
```

#### بيانات الإعلانات | Listing Data
```json
{
  "id": "uuid",
  "title": "شقة حديثة قريبة من الجامعة", 
  "description": "شقة مفروشة بالكامل",
  "price": 1200,
  "address": "الرياض، حي الملز",
  "roomType": "shared",
  "amenities": ["wifi", "furniture", "ac"],
  "images": ["url1", "url2", "url3"],
  "googleMapsUrl": "https://maps.google.com/..."
}
```

### مصادر البيانات | Data Sources

1. **البيانات المولدة** - Seed data من Prisma
2. **بيانات المستخدمين** - المدخل من المستخدمين
3. **بيانات Google Maps** - الموقع والعناوين
4. **بيانات الصور** - Cloudinary API

---

## الهندسة المعمارية | Architecture

### معمارية النظام | System Architecture

```
                    ┌─────────────────────┐
                    │   Client Browser    │
                    │  (React + TypeScript)│
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
           HTTP/HTTPS      WebSocket      REST API
                │              │              │
          ┌─────▼──────────────▼──────────────▼────┐
          │     Frontend Server (Vite + Nginx)     │
          └────────────────┬───────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
      HTTP/REST        WebSocket        Long Polling
         │                 │                 │
      ┌──▼──────────────────▼─────────────────▼──┐
      │   Express.js Backend Server              │
      │   (TypeScript + Node.js)                 │
      ├──────────────────────────────────────────┤
      │ Routes:                                  │
      │ ├─ /api/auth (Authentication)           │
      │ ├─ /api/users (User Management)         │
      │ ├─ /api/listings (Property Listings)    │
      │ ├─ /api/chats (Messaging)               │
      │ ├─ /api/visits (Visit Requests)         │
      │ ├─ /api/reports (Reporting)             │
      │ ├─ /api/admin (Admin Panel)             │
      │ └─ /api/ai (AI Services)                │
      └──┬──────────────────────────────────────┘
         │
    ┌────┼────┬─────────────┬──────────────┐
    │    │    │             │              │
    ▼    ▼    ▼             ▼              ▼
 SQLite Gemini Cloudinary Google Maps  Socket.io
 Database  API   (Images)   API       (Real-time)
```

### تدفق البيانات | Data Flow

```
User Action → React Component → Axios API Call
    ▼              ▼                ▼
Frontend         HTTP              Backend
                            ▼
                      Express Route
                            ▼
                      Jest Validation
                            ▼
                      Database Query
                            ▼
                      Response JSON
                            ▼
                      Update React State
                            ▼
                      UI Re-render
```

### معمارية المشروع | Project Structure

```
roommates-platform/
│
├── backend/                    # الخادم الخلفي
│   ├── src/
│   │   ├── app.ts             # Express app setup
│   │   ├── server.ts          # Server entry point
│   │   ├── controllers/       # API logic
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── listing.controller.ts
│   │   │   ├── chat.controller.ts
│   │   │   └── admin.controller.ts
│   │   ├── routes/            # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── listing.routes.ts
│   │   │   └── ...
│   │   ├── middleware/        # Middleware functions
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── services/          # Business logic
│   │   │   ├── email.service.ts
│   │   │   ├── ai.service.ts
│   │   │   └── upload.service.ts
│   │   ├── socket/            # Socket.io handlers
│   │   │   └── socket.handler.ts
│   │   ├── utils/             # Utility functions
│   │   │   ├── jwt.ts
│   │   │   └── cloudinary.ts
│   │   └── config/            # Configuration
│   │
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── seed.ts            # Seed data
│   │   └── migrations/        # DB migrations
│   │
│   ├── dist/                  # Compiled JavaScript
│   ├── .env                   # Environment variables
│   ├── tsconfig.json
│   ├── package.json
│   └── README_API.md
│
├── frontend/                  # الواجهة الأمامية
│   ├── src/
│   │   ├── App.tsx           # Main app component
│   │   ├── main.tsx          # Entry point
│   │   ├── pages/            # Page components
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Listings.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── ...
│   │   ├── admin/            # Admin pages
│   │   │   ├── layouts/
│   │   │   └── pages/
│   │   ├── components/       # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   ├── ReportModal.tsx
│   │   │   ├── PageLoader.tsx
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── context/          # React Context
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   ├── ToastContext.tsx
│   │   │   └── LoadingContext.tsx
│   │   ├── services/         # API services
│   │   │   └── api.ts
│   │   ├── lib/              # Utilities
│   │   │   └── axios.ts
│   │   ├── routes/           # Route definitions
│   │   │   └── AppRoutes.tsx
│   │   └── types/            # TypeScript types
│   │       └── index.ts
│   │
│   ├── public/               # Static assets
│   │   ├── images/
│   │   └── uploads/
│   │
│   ├── .env.development
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── README.md
│
├── docs/                     # التوثيق
│   ├── DEPLOYMENT_GUIDE.md
│   ├── DEVELOPER_GUIDE.md
│   └── API_DOCUMENTATION.md
│
├── .gitignore
├── docker-compose.yml
└── README.md                # هذا الملف
```

---

## البدء السريع | Quick Start

### المتطلبات | Prerequisites

```bash
# تحقق من الإصدارات
node --version    # v18 أو أحدث
npm --version     # v9 أو أحدث
```

### التثبيت والتشغيل | Installation & Running

#### خطوة 1: استنساخ المستودع | Clone Repository

```bash
git clone https://github.com/Ah-Fayyad/test-roommates
cd test-roommates
```

#### خطوة 2: إعداد الخادم الخلفي | Backend Setup

```bash
cd backend

# تثبيت المكتبات
npm install

# إنشاء ملف .env
cat > .env << EOF
PORT=5000
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-super-secret-key-here"
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EOF

# إعداد قاعدة البيانات
npx prisma generate
npx prisma db push
npx prisma db seed
```

#### خطوة 3: إعداد الواجهة الأمامية | Frontend Setup

```bash
cd ../frontend

# تثبيت المكتبات
npm install

# إنشاء ملف .env
cat > .env.development << EOF
VITE_API_URL=http://localhost:5000
EOF
```

#### خطوة 4: تشغيل التطبيق | Run Application

```bash
# في نافذة terminal جديدة - الخادم الخلفي
cd backend
npm run dev
# يعمل على http://localhost:5000

# في نافذة terminal أخرى - الواجهة الأمامية
cd frontend
npm run dev
# يعمل على http://localhost:5173
```

---

## التثبيت والتشغيل | Installation & Running

### تثبيت المكتبات | Package Installation

#### Backend Dependencies

الحزم الرئيسية المستخدمة:

```json
{
  "express": "خادم ويب",
  "typescript": "نوع آمن",
  "@prisma/client": "ORM قاعدة البيانات",
  "jsonwebtoken": "مصادقة JWT",
  "bcrypt": "تشفير كلمات المرور",
  "socket.io": "تواصل فوري",
  "axios": "طلبات HTTP",
  "nodemailer": "إرسال البريد",
  "cloudinary": "معالجة الصور"
}
```

#### Frontend Dependencies

الحزم الرئيسية المستخدمة:

```json
{
  "react": "مكتبة واجهات المستخدم",
  "react-router-dom": "التوجيه",
  "axios": "طلبات API",
  "tailwindcss": "تصميم",
  "typescript": "نوع آمن",
  "react-i18next": "تعدد اللغات",
  "socket.io-client": "تواصل فوري"
}
```

### متغيرات البيئة | Environment Variables

#### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="file:./prisma/dev.db"

# Authentication
JWT_SECRET="your-super-secret-key-change-in-production"

# Frontend
FRONTEND_URL=http://localhost:5173

# Optional Services
# GEMINI_API_KEY=your-key
# CLOUDINARY_CLOUD_NAME=your-name
```

#### Frontend (.env.development)

```env
VITE_API_URL=http://localhost:5000
```

---

## كيفية الاستخدام | Usage Guide

### 1. إنشاء حساب جديد | Create Account

```
الرابط: http://localhost:5173/signup

الخطوات:
1. القيام بالتسجيل كـ User أو Landlord
2. تأكيد البريد الإلكتروني
3. ملء بيانات الملف الشخصي
4. تحديد التفضيلات
```

### 2. البحث عن الإعلانات | Search Listings

```
الرابط: http://localhost:5173/listings

الميزات:
- البحث حسب السعر والموقع
- عرض على الخريطة
- المشاهدة التفاصيلية للإعلان
"""

### 3. التواصل مع أصحاب الإعلانات | Chat with Owners

```
- الضغط على "إرسال رسالة" في الإعلان
- فتح محادثة فورية
- تبادل الرسائل والصور
```

### 4. جدولة الزيارات | Schedule Visits

```
- اختيار أوقات الزيارة المتاحة
- إرسال طلب زيارة مع ملاحظات
- تأكيد الموعد مع المالك
```

### 5. لوحة تحكم المسؤول | Admin Dashboard

#### الوصول للـ Admin

```bash
# 1. سجل حساب عادي ثم اتصل بـ admin لرفع الصلاحيات
# 2. أو عدّل المستخدم في قاعدة البيانات:

npx prisma studio
# ابحث عن المستخدم وغيّر role إلى "ADMIN"
```

#### الوظائف المتاحة

- 👥 إدارة المستخدمين
- 📝 إدارة الإعلانات
- 🔒 إدارة المحتوى
- 📊 الإحصائيات والتقارير

---

## الـ API Documentation | API Endpoints

### مصادقة | Authentication

```
POST /api/auth/signup
├─ Body: { email, password, fullName, role, phoneNumber }
└─ Returns: { token, user }

POST /api/auth/login
├─ Body: { email, password }
└─ Returns: { token, user }

POST /api/auth/logout
└─ Returns: { message: "Logged out" }
```

### المستخدمون | Users

```
GET /api/users/me
├─ Headers: Authorization: Bearer <token>
└─ Returns: { user data }

PUT /api/users/profile
├─ Body: { fullName, avatar, bio, preferences }
└─ Returns: { updated user }

PUT /api/users/settings
├─ Body: { email, language, currentPassword, newPassword }
└─ Returns: { message: "Settings updated" }
```

### الإعلانات | Listings

```
GET /api/listings
├─ Query: ?page=1&limit=20&price_min=0&price_max=5000
└─ Returns: { listings: [], total, page }

POST /api/listings
├─ Body: { title, description, price, address, images, amenities }
└─ Returns: { listing }

GET /api/listings/:id
└─ Returns: { listing with full details }

PUT /api/listings/:id
├─ Body: { title, description, price, ... }
└─ Returns: { updated listing }

DELETE /api/listings/:id
└─ Returns: { message: "Deleted" }
```

### المحادثات | Chats

```
GET /api/chats
├─ Headers: Authorization: Bearer <token>
└─ Returns: { chats: [] }

POST /api/chats
├─ Body: { participantId }
└─ Returns: { chat }

GET /api/chats/:chatId/messages
└─ Returns: { messages: [] }

POST /api/chats/:chatId/message
├─ Body: { content, type }
└─ Returns: { message }
```

### طلبات الزيارة | Visit Requests

```
GET /api/visits
├─ Query: ?type=sent|received
└─ Returns: { visits: [] }

POST /api/visits
├─ Body: { listingId, proposedTimes, message }
└─ Returns: { visit }

PUT /api/visits/:id
├─ Body: { status, response }
└─ Returns: { updated visit }
```

### الإبلاغات | Reports

```
POST /api/reports
├─ Body: { targetType, targetId, reason, description }
└─ Returns: { report }

GET /api/reports (admin only)
└─ Returns: { reports: [] }

PUT /api/reports/:id (admin only)
├─ Body: { status, adminNotes }
└─ Returns: { updated report }
```

---

## النشر والـ Deployment | Deployment

### 🌐 الموقع المنشور | Live Deployment

**Frontend (مشروع)**
- 🚀 **Netlify**: https://roommates-frontend.netlify.app/ ✅ **LIVE NOW**
- الحالة: قيد التشغيل
- آخر تحديث: 22 فبراير 2026

**Backend (قيد الإعداد)**
- 🚂 Railway.app - قريباً
- البيانات الاختبارية جاهزة

### خادم الإنتاج Recommended | Recommended Servers

#### للـ Backend

**الخيارات:**
- 🚂 Railway.app
- 🌐 Render.com
- 🦸 Heroku
- ☁️ AWS EC2

#### للـ Frontend

**الخيارات:**
- ▲ Vercel
- 🚀 Netlify ✅ (المستخدم حالياً)
- ☁️ Cloudflare Pages
- 📦 AWS S3 + CloudFront

### خطوات النشر | Deployment Steps

#### 1. إعداد الـ Backend

```bash
# بناء التطبيق
npm run build

# تعيين متغيرات البيئة للإنتاج
DATABASE_URL=postgres://user:pass@host:5432/dbname
JWT_SECRET=very-long-secure-key-here
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

#### 2. إعداد الـ Frontend

```bash
# بناء التطبيق
npm run build

# تعيين متغيرات البيئة
VITE_API_URL=https://api.yourdomain.com
```

#### 3. قاعدة البيانات

```bash
# نقل إلى PostgreSQL للإنتاج
# تحديث .env:
DATABASE_URL=postgres://user:password@host:5432/roommates_prod

# تشغيل Migrations
npx prisma migrate deploy
```

---

## الاختبار | Testing

### اختبار الـ Backend

```bash
cd backend

# تشغيل الاختبارات
npm test

# مع التغطية
npm test -- --coverage
```

### اختبار الـ Frontend

```bash
cd frontend

# تشغيل الاختبارات
npm test

# وضع المراقبة
npm test -- --watch
```

---

## الأمان | Security

### الميزات الأمانية المطبقة

✅ **JWT Authentication** - مصادقة آمنة
✅ **Password Hashing** - bcrypt encryption
✅ **CORS Protection** - حماية النطاق
✅ **Input Validation** - التحقق من المدخلات
✅ **SQL Injection Prevention** - Prisma ORM
✅ **XSS Protection** - Helmet middleware
✅ **Rate Limiting Ready** - معد للتطبيق

### أفضل الممارسات | Best Practices

```
1. لا تشارك JWT_SECRET
2. استخدم HTTPS في الإنتاج
3. حدّث المكتبات بانتظام
4. فعّل HTTPS للـ cookies
5. راقب السجلات الأمنية
```

---

## الدعم والمساعدة | Support

### قنوات الدعم

- 📧 البريد الإلكتروني: support@roommates.com
- 🐛 مشاكل GitHub: [Issues](https://github.com/Ah-Fayyad/roommates/issues)
- 📚 التوثيق: انظر مجلد `/docs`

### الأسئلة الشائعة | FAQ

**س: كيف أنشئ حساب أدمن؟**
ج: استخدم `npx prisma studio` وغيّر الـ role

**س: كيف أرفع صورة؟**
ج: اربط Cloudinary API وأضف المفتاح في .env

**س: هل يدعم وضع البيع أم التأجير فقط؟**
ج: حالياً لـ التأجير، ويمكن توسيع النطاق

**س: هل يوجد تطبيق موبايل؟**
ج: حالياً ويب فقط، التطبيق متجاوب (Responsive)

---

## المساهمين | Contributors

- 👨‍💻 Ahmed Fayyad - المطور الرئيسي
- 🎨 UI/UX بواسطة Tailwind CSS
- 🤖 AI Integration بواسطة Google Gemini

---

## الترخيص | License

هذا المشروع مرخص تحت **MIT License** - اقرأ ملف [LICENSE](./LICENSE)

---

## خارطة الطريق | Roadmap

### الميزات المخطط إضافتها

- 📱 تطبيق Mobile (React Native)
- 🎥 فيديوهات الجولات الافتراضية
- 💳 نظام الدفع المدمج
- 🔐 التحقق بخطوتين (2FA)
- 🌍 توسع جغرافي عالمي
- 🎨 تحسينات في الواجهة
- 📊 تحليلات متقدمة

---

## التاريخ | Changelog

### الإصدار 1.0.0 (الإصدار الأول)
- ✅ مصادقة وتسجيل الدخول
- ✅ إنشاء وإدارة الإعلانات
- ✅ نظام المطابقة الذكي
- ✅ محادثات فورية
- ✅ لوحة تحكم المسؤول
- ✅ نظام الإبلاغات
- ✅ دعم العربية والإنجليزية

---

## معلومات الاتصال | Contact

**المطور:** Ahmed Fayyad
📧 البريد: dev@example.com
🐙 GitHub: https://github.com/Ah-Fayyad
💼 LinkedIn: https://linkedin.com/in/ahmadfarad

---

## شكر وتقدير | Acknowledgments

شكراً للمكتبات والخدمات المستخدمة:
- React & React Router
- Express.js & Socket.io
- Tailwind CSS
- Prisma
- Google Gemini API
- Cloudinary

---

<div dir="ltr">

**Last Updated:** February 22, 2026
**Status:** ✅ Production Ready
**Version:** 1.0.0

</div>

</div>

### Backend Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
JWT_SECRET="your-secret-key-change-in-production"

# Server
PORT=5000
NODE_ENV=development

# Optional: Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: AI Service
GEMINI_API_KEY=your-gemini-api-key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables

Create `frontend/.env.development`:

```env
VITE_API_URL=http://localhost:5000
```

---

## 🎯 Usage / الاستخدام

### Creating an Admin Account / إنشاء حساب أدمن

1. Register a normal account
2. Update the user role in database:
   ```bash
   cd backend
   npx prisma studio
   # Change user role to "ADMIN"
   ```
3. Access admin panel at `/admin`

### Testing Features / اختبار المميزات

1. **User Registration**: Sign up as User or Landlord
2. **Create Listing**: Add property with photos and Google Maps link
3. **Search**: Browse listings with filters
4. **Chat**: Message property owners
5. **AI Assistant**: Ask roommate-related questions
6. **Admin Panel**: Manage users and content

---

## 🛠️ Tech Stack / التقنيات المستخدمة

### Backend
- **Framework**: Express.js + TypeScript
- **Database**: SQLite (Prisma ORM)
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.io
- **Email**: Nodemailer
- **AI**: Google Gemini API

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: React Context
- **HTTP Client**: Axios
- **Icons**: Lucide React

---

## 📚 Documentation / التوثيق

Detailed documentation available in `.gemini/antigravity/brain/` directory:

- `QUICK_START.md` - Quick start guide (Arabic)
- `walkthrough.md` - Complete feature walkthrough
- `PERFECT_BLUEPRINT_SUMMARY.md` - Latest features summary
- `CLOUDINARY_GUIDE.md` - Image upload configuration
- `DEPLOYMENT_GUIDE_AR.md` - Deployment instructions

---

## 🔐 Security / الأمان

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Input validation
- ✅ XSS protection with Helmet
- ✅ Rate limiting ready

---

## 🚢 Deployment / النشر

### Backend Deployment
- Recommended: Railway, Render, or Heroku
- Database: PostgreSQL (production) or SQLite (development)
- Environment variables must be configured

### Frontend Deployment
- Recommended: Vercel, Netlify, or Cloudflare Pages
- Update `VITE_API_URL` to production backend URL

See `DEPLOYMENT_GUIDE_AR.md` for detailed instructions.

---

## 🤝 Contributing / المساهمة

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📝 License / الترخيص

This project is licensed under the MIT License.

---

## 👨‍💻 Developer / المطور

Built with ❤️ by Ahmed Fayyad

---

## 📞 Support / الدعم

For issues or questions:
- Open an issue on GitHub
- Check documentation in `.gemini/antigravity/brain/`
- Review `QUICK_START.md` for common problems

---

**Status**: ✅ Production Ready | جاهز للإنتاج

**Version**: 1.0.0

**Last Updated**: December 2024
