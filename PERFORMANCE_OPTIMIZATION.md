# تقرير تحسين الأداء - Roommates Platform

## ملخص المشاكل والحلول

### 1. مشاكل قاعدة البيانات (Database Issues)

#### المشكلة 1.1: استخدام SQLite في Production
**الوصف:**
- المشروع يستخدم SQLite كقاعدة بيانات رئيسية
- SQLite غير مناسب للتطبيقات الإنتاجية مع عدد كبير من المستخدمين
- لا يدعم الاتصالات المتزامنة بشكل جيد
- الأداء يتدهور مع زيادة حجم البيانات

**الحل المقترح:**
1. التحويل إلى PostgreSQL أو MySQL
2. تحديث schema.prisma:
```prisma
datasource db {
  provider = "postgresql"  // أو "mysql"
  url      = env("DATABASE_URL")
}
```

#### المشكلة 1.2: عدم وجود Indexes كافية
**الوصف:**
- الـ indexes الحالية محدودة جداً
- الاستعلامات على الجداول الكبيرة ستكون بطيئة

**الحل المقترح:**
إضافة indexes إضافية في schema.prisma:
```prisma
model User {
  // ... existing fields
  @@index([email])
  @@index([role])
  @@index([isVerified])
  @@index([lastActiveAt])
}

model Message {
  // ... existing fields
  @@index([chatId, createdAt])
  @@index([senderId, createdAt])
  @@index([read])
}

model Listing {
  // ... existing fields
  @@index([ownerId])
  @@index([status, createdAt])
  @@index([price, status])
  @@index([latitude, longitude])  // للبحث الجغرافي
}
```

#### المشكلة 1.3: N+1 Query Problem
**الوصف:**
- في listing.controller.ts، الاستعلامات المتداخلة تسبب مشكلة N+1
- كل listing يتم جلب images و owner بشكل منفصل

**الحل المقترح:**
استخدام include بشكل أفضل:
```typescript
const listings = await prisma.listing.findMany({
  where,
  include: { 
    images: true, 
    owner: { 
      select: { 
        fullName: true, 
        avatar: true, 
        university: true,
        isVerified: true
      } 
    } 
  },
  orderBy: { createdAt: 'desc' },
  skip,
  take
});
```

### 2. مشاكل الـ Backend Performance

#### المشكلة 2.1: إنشاء PrismaClient متعدد
**الوصف:**
- كل controller ينشئ PrismaClient جديد
- هذا يستهلك الذاكرة ويؤثر على الأداء

**الحل المقترح:**
إنشاء ملف prisma.ts مشترك:
```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

ثم استخدامه في جميع الـ controllers:
```typescript
import { prisma } from '../lib/prisma';
```

#### المشكلة 2.2: عدم وجود Caching
**الوصف:**
- لا يوجد caching للبيانات المتكررة
- كل طلب يستعلم قاعدة البيانات

**الحل المقترح:**
1. استخدام Redis لـ caching:
```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache helper
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set(key: string, value: any, ttl = 3600) {
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  async del(key: string) {
    await redis.del(key);
  }
};
```

2. تطبيق Caching على الـ listings:
```typescript
export const getListings = async (req: Request, res: Response) => {
  try {
    const cacheKey = `listings:${JSON.stringify(req.query)}`;
    const cached = await cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const listings = await prisma.listing.findMany({
      // ... existing query
    });

    await cache.set(cacheKey, listings, 300); // 5 minutes
    res.json(listings);
  } catch (error) {
    // ... error handling
  }
};
```

#### المشكلة 2.3: Socket.io Performance
**الوصف:**
- كل رسالة تقوم بتحديث قاعدة البيانات
- عدم وجود batch processing للإشعارات

**الحل المقترح:**
1. استخدام Message Queue (Bull) للمعالجة غير المتزامنة:
```typescript
import Queue from 'bull';

const notificationQueue = new Queue('notifications', {
  redis: process.env.REDIS_URL
});

// في socket handler
socket.on("send_message", async (data) => {
  // ... create message

  // أضف الإشعار إلى الـ queue بدلاً من إنشائه مباشرة
  await notificationQueue.add({
    type: 'NEW_MESSAGE',
    userId: toUserId,
    data: { chatId, senderId: userId }
  });
});

// Worker لمعالجة الإشعارات
notificationQueue.process(async (job) => {
  await prisma.notification.create({
    data: job.data
  });
});
```

2. تحسين Socket.io configuration:
```typescript
const io = new SocketServer(httpServer, {
  cors: { /* ... */ },
  transports: ['websocket'],  // استخدام WebSocket فقط
  pingTimeout: 30000,         // تقليل من 60000
  pingInterval: 15000,        // تقليل من 25000
  maxHttpBufferSize: 1e6,
  perMessageDeflate: {
    threshold: 1024
  }
});
```

### 3. مشاكل الـ Frontend Performance

#### المشكلة 3.1: عدم وجود Code Splitting كافي
**الوصف:**
- الـ manual chunks في vite.config.ts محدودة
- الملفات الكبيرة مثل Chat.tsx (32KB) و ListingDetails.tsx (42KB) غير مقسمة

**الحل المقترح:**
تحديث vite.config.ts:
```typescript
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['@babel/plugin-syntax-import-attributes']
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'framer-motion'],
          'map-vendor': ['leaflet', 'react-leaflet'],
          'i18n-vendor': ['i18next', 'react-i18next'],
          'auth-vendor': ['@react-oauth/google'],
          'socket-vendor': ['socket.io-client']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

#### المشكلة 3.2: عدم وجود Virtualization للقوائم الطويلة
**الوصف:**
- صفحة Listings.tsx تعرض جميع الـ listings مرة واحدة
- مع زيادة عدد الـ listings، الأداء سيتدهور

**الحل المقترح:**
استخدام react-window أو react-virtual:
```typescript
import { FixedSizeList as List } from 'react-window';

const ListingRow = ({ index, style, data }: any) => (
  <div style={style}>
    <ListingCard listing={data[index]} />
  </div>
);

<Listings>
  <List
    height={600}
    itemCount={filteredListings.length}
    itemSize={300}
    width="100%"
    itemData={filteredListings}
  >
    {ListingRow}
  </List>
</Listings>
```

#### المشكلة 3.3: عدم وجود Lazy Loading للصور
**الوصف:**
- جميع الصور يتم تحميلها مرة واحدة
- يؤثر على أداء الصفحة خاصة مع الاتصال البطيء

**الحل المقترح:**
استخدام Intersection Observer:
```typescript
import { useEffect, useRef, useState } from 'react';

const LazyImage = ({ src, alt, ...props }: any) => {
  const [imageSrc, setImageSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      loading="lazy"
      {...props}
    />
  );
};
```

#### المشكلة 3.4: مشاكل في Chat.tsx
**الوصف:**
- الملف كبير جداً (858 سطر)
- عدم وجود memoization للمكونات
- كل رسالة جديدة تعيد render جميع المكونات

**الحل المقترح:**
1. تقسيم الملف إلى مكونات أصغر
2. استخدام React.memo و useMemo:
```typescript
const MessageItem = React.memo(({ message, isOwn }: any) => {
  return (
    <div className={`message ${isOwn ? 'own' : 'other'}`}>
      {/* message content */}
    </div>
  );
});

const Chat = () => {
  // ... existing code

  const memoizedMessages = useMemo(() => 
    messages.map(msg => (
      <MessageItem 
        key={msg.id} 
        message={msg} 
        isOwn={msg.senderId === user?.id} 
      />
    )),
    [messages, user?.id]
  );

  return (
    <div className="messages">
      {memoizedMessages}
    </div>
  );
};
```

#### المشكلة 3.5: عدم وجود Debouncing للبحث
**الوصف:**
- في Listings.tsx، البحث يتم مع كل حرف يكتبه المستخدم
- يؤدي إلى عدد كبير من الطلبات

**الحل المقترح:**
```typescript
import { useDebouncedValue } from './hooks/useDebouncedValue';

const Listings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearch) {
      fetchListings({ search: debouncedSearch });
    }
  }, [debouncedSearch]);

  // ... rest of component
};

// useDebouncedValue hook
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
```

### 4. مشاكل API Performance

#### المشكلة 4.1: عدم وجود Compression
**الوصف:**
- الاستجابات غير مضغوطة
- حجم البيانات المرسلة كبير

**الحل المقترح:**
إضافة compression middleware:
```typescript
import compression from 'compression';

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  threshold: 1024
}));
```

#### المشكلة 4.2: عدم وجود Response Caching Headers
**الوصف:**
- لا يوجد cache-control headers
- المتصفح لا يقوم بـ caching

**الحل المقترح:**
```typescript
app.use('/api', (req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  next();
});
```

### 5. تحسينات إضافية

#### 5.1 تحسين الصور
- استخدام WebP format
- إضافة image optimization middleware
- استخدام CDN للصور

#### 5.2 تحسين الـ Bundle Size
- استخدام Bundle Analyzer:
```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
});
```

#### 5.3 إضافة Performance Monitoring
- استخدام Sentry أو Datadog
- إضافة performance metrics

## خطة التنفيذ الموصى بها

### المرحلة 1 (الأولوية العالية)
1. تحويل قاعدة البيانات إلى PostgreSQL
2. إضافة الـ indexes المطلوبة
3. إنشاء PrismaClient مشترك
4. إضافة Redis caching
5. تحسين Socket.io configuration

### المرحلة 2 (الأولوية المتوسطة)
1. تحسين Code Splitting
2. إضافة Lazy Loading للصور
3. تحسين Chat.tsx
4. إضافة Debouncing للبحث
5. إضافة Compression و Cache Headers

### المرحلة 3 (الأولوية المنخفضة)
1. إضافة Virtualization للقوائم
2. تحسين الصور
3. إضافة Performance Monitoring
4. تحسين Bundle Size

## نتائج متوقعة

- تحسين سرعة تحميل الصفحات بنسبة 40-60%
- تقليل استهلاك الذاكرة بنسبة 30-50%
- تحسين استجابة الـ API بنسبة 50-70%
- تحسين أداء الـ chat بشكل كبير
- دعم عدد أكبر من المستخدمين المتزامنين

## 6. مشاكل تحميل الصور والأداء المتعلق بها

### المشكلة 6.1: عدم وجود تحسينات للصور
**الوصف:**
- الصور يتم رفعها وتخزينها في Cloudinary بدون تحسين
- حجم الصور كبير جداً يؤثر على سرعة التحميل
- لا يوجد تحويل للصور إلى WebP أو WebP AVIF

**الحل المقترح:**
1. تحديث Cloudinary configuration:
```typescript
// src/utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import { CldImage } from 'cloudinary-react';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// دالة لتحسين الصور عند الرفع
export const uploadImage = async (file: File, folder: string = 'listings') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'roommates_optimized');
  formData.append('folder', folder);
  formData.append('quality', 'auto:good');
  formData.append('format', 'webp');
  formData.append('transformation', 'c_limit,w_1200,q_auto:best');

  const response = await fetch('https://api.cloudinary.com/v1_1/' + 
    process.env.CLOUDINARY_CLOUD_NAME + '/image/upload', {
      method: 'POST',
      body: formData,
    });

  const data = await response.json();
  return data.secure_url;
};

// مكون لعرض الصور المحسنة
export const OptimizedImage = ({ publicId, alt, className }: any) => {
  return (
    <CldImage
      cloudName={process.env.CLOUDINARY_CLOUD_NAME}
      publicId={publicId}
      alt={alt}
      className={className}
      width="auto"
      height="auto"
      gravity="auto"
      crop="limit"
      quality="auto:best"
      format="webp"
      sizes="100vw"
      loading="lazy"
    />
  );
};
```

2. إنشاء preset في Cloudinary للصور المحسنة:
```typescript
// في backend عند بدء التشغيل
const createOptimizedPreset = async () => {
  try {
    const result = await cloudinary.api.create_upload_preset({
      name: 'roommates_optimized',
      unsigned: true,
      folder: 'listings',
      transformation: [
        { quality: 'auto:good', format: 'webp' },
        { crop: 'limit', width: 1200, height: 1200 }
      ]
    });
    console.log('Created optimized preset:', result);
  } catch (error) {
    console.error('Error creating preset:', error);
  }
};

// استدعاء الدالة عند بدء التشغيل
createOptimizedPreset();
```

### المشكلة 6.2: عدم وجود Lazy Loading للصور
**الوصف:**
- جميع الصور يتم تحميلها مرة واحدة عند تحميل الصفحة
- يؤدي إلى بطء التحميل خاصة مع الاتصال البطيء

**الحل المقترح:**
1. استخدام Intersection Observer API:
```typescript
// src/components/ui/LazyImage.tsx
import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  threshold?: number;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = '/placeholder.jpg',
  threshold = 0.1
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setImageSrc(src);
            setIsLoaded(true);
          };
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, threshold]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-70'}`}
        loading="lazy"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse">
          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
```

2. تحديث ListingCard لاستخدام LazyImage:
```typescript
// في Listings.tsx أو المكونات الأخرى
import LazyImage from '../components/ui/LazyImage';

// بدلاً من
// <img src={listing.images[0]?.url} alt={listing.title} />

// استخدم
<LazyImage 
  src={listing.images[0]?.url} 
  alt={listing.title} 
  className="w-full h-48 object-cover rounded-lg" 
/>
```

### المشكلة 6.3: عدم وجود تحسينات للصور في الـ Gallery
**الوصف:**
- عند عرض معرض الصور، يتم تحميل جميع الصور دفعة واحدة
- يؤثر على أداء الجوالات والشاشات الصغيرة

**الحل المقترح:**
1. استخدام Lightbox مع Lazy Loading:
```typescript
// src/components/ui/LightboxGallery.tsx
import React, { useState, useRef, useEffect } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import LazyImage from './LazyImage';

interface LightboxGalleryProps {
  images: { url: string; alt?: string }[];
}

const LightboxGallery: React.FC<LightboxGalleryProps> = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  
  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [images[index].url]: true
    }));
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            onClick={() => {
              setPhotoIndex(index);
              setIsOpen(true);
            }}
          >
            <LazyImage 
              src={image.url} 
              alt={image.alt || `Image ${index + 1}`} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
            />
            {!loadedImages[image.url] && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse">
                <div className="h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {isOpen && (
        <Lightbox
          mainSrc={images[photoIndex].url}
          nextSrc={images[(photoIndex + 1) % images.length].url}
          prevSrc={images[(photoIndex + images.length - 1) % images.length].url}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
          imageLoadErrorMessage={images[photoIndex].alt || `Image ${photoIndex + 1}`}
          reactModalStyle={{ overlay: { zIndex: 1000 } }}
          animationDisabled={true}
          toolbarButtons={[
            <button 
              key="download" 
              type="button" 
              className="rilk-download-button" 
              onClick={() => window.open(images[photoIndex].url, '_blank')}
            >
              Download
            </button>
          ]}
        />
      )}
    </>
  );
};

export default LightboxGallery;
```

### المشكلة 6.4: عدم وجود CDN للصور
**الوصف:**
- الصور يتم تحميلها من Cloudinary مباشرة
- لا يوجد CDN محلي للصور المستخدمة بشكل متكرر

**الحل المقترح:**
1. استخدام CDN مثل Cloudinary CDN أو Cloudflare:
```typescript
// src/utils/imageOptimizer.ts
export const getOptimizedImageUrl = (url: string, options: any = {}) => {
  if (!url) return '';
  
  // إذا كانت الصورة من Cloudinary، قم بإضافة التحويلات
  if (url.includes('cloudinary.com')) {
    const transformations = [
      'f_auto', // تح تلقائي للصورة
      'q_auto:best', // جودة تلقائية أفضل
      'c_limit', // تحديد الحجم
      ...Object.entries(options).map(([key, value]) => `${key}_${value}`)
    ];
    
    const transformationString = transformations.join(',');
    
    // إضافة CDN إذا لم يكن موجوداً
    const cdnUrl = url.replace('/image/upload/', '/image/upload/');
    return `${cdnUrl}?transformation=${encodeURIComponent(transformationString)}`;
  }
  
  // إذا كانت الصور من مصدر آخر، أضف CDN
  if (process.env.CDN_URL) {
    return `${process.env.CDN_URL}/${url}`;
  }
  
  return url;
};

// استخدام المكونات
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

// في المكونات
const imageUrl = getOptimizedImageUrl(listing.images[0]?.url, {
  width: 400,
  height: 300,
  crop: 'limit'
});
```

### المشكلة 6.5: عدم وجود تحسينات للصور في الجوال
**الوصف:**
- جميع الصور لها نفس الحجم بغض النظر عن الجهاز
- يؤدي إلى تحميل صور كبيرة جداً على الجوالات

**الحل المقترح:**
1. استخدام Picture component مع srcset:
```typescript
// src/components/ui/ResponsiveImage.tsx
import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  mobileSrc?: string;
  tabletSrc?: string;
  desktopSrc?: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  mobileSrc,
  tabletSrc,
  desktopSrc
}) => {
  return (
    <picture className={className}>
      {/* صورة للشاشات الصغيرة (جوال) */}
      {mobileSrc && (
        <source 
          media="(max-width: 640px)" 
          srcSet={mobileSrc} 
          type="image/webp" 
        />
      )}
      
      {/* صورة للشاشات المتوسطة (تابلت) */}
      {tabletSrc && (
        <source 
          media="(min-width: 641px) and (max-width: 1024px)" 
          srcSet={tabletSrc} 
          type="image/webp" 
        />
      )}
      
      {/* صورة للشاشات الكبيرة (ديسكتوب) */}
      {desktopSrc && (
        <source 
          media="(min-width: 1025px)" 
          srcSet={desktopSrc} 
          type="image/webp" 
        />
      )}
      
      {/* صورة احتياطية */}
      <img 
        src={src} 
        alt={alt} 
        className={className} 
        loading="lazy" 
      />
    </picture>
  );
};

export default ResponsiveImage;
```

2. استخدام الصور في الـ listings:
```typescript
// في Listings.tsx
import ResponsiveImage from '../components/ui/ResponsiveImage';

// بدلاً من
// <img src={listing.images[0]?.url} alt={listing.title} />

// استخدم
<ResponsiveImage 
  src={listing.images[0]?.url} 
  alt={listing.title} 
  mobileSrc={getOptimizedImageUrl(listing.images[0]?.url, { width: 400, height: 300 })}
  tabletSrc={getOptimizedImageUrl(listing.images[0]?.url, { width: 600, height: 450 })}
  desktopSrc={getOptimizedImageUrl(listing.images[0]?.url, { width: 800, height: 600 })}
  className="w-full h-48 object-cover rounded-lg" 
/>
```

## نتائج متوقعة

- تحسين سرعة تحميل الصفحات بنسبة 40-60%
- تقليل استهلاك الذاكرة بنسبة 30-50%
- تحسين استجابة الـ API بنسبة 50-70%
- تحسين أداء الـ chat بشكل كبير
- دعم عدد أكبر من المستخدمين المتزامنين
