# Full-Stack Deployment Guide
## Connecting Frontend (React) and Backend (Node.js/Express)

This guide provides a complete, step-by-step approach to deploying your full-stack application with separate repositories for Frontend and Backend.

---

## Table of Contents
1. [Project Structure](#1-project-structure)
2. [Environment Variables Setup](#2-environment-variables-setup)
3. [Frontend Configuration](#3-frontend-configuration)
4. [Backend Configuration](#4-backend-configuration)
5. [CORS Configuration](#5-cors-configuration)
6. [Database Connection](#6-database-connection)
7. [Deployment Steps](#7-deployment-steps)
8. [Testing the Connection](#8-testing-the-connection)
9. [Security Best Practices](#9-security-best-practices)

---

## 1. Project Structure

### Frontend Repository Structure
```
roommates-frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api.ts          # API configuration
│   ├── config/
│   │   └── constants.ts    # Environment constants
│   └── App.tsx
├── .env.development
├── .env.production
├── .gitignore
├── package.json
├── vite.config.ts
└── README.md
```

### Backend Repository Structure
```
roommates-backend/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── utils/
│   ├── config/
│   │   └── database.ts     # Database configuration
│   └── server.ts
├── prisma/
│   └── schema.prisma
├── .env.development
├── .env.production
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 2. Environment Variables Setup

### Frontend `.env.development`
```env
# Development Environment
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Roommates Finder
VITE_ENVIRONMENT=development
```

### Frontend `.env.production`
```env
# Production Environment
VITE_API_URL=https://your-backend-app.railway.app
VITE_APP_NAME=Roommates Finder
VITE_ENVIRONMENT=production
```

### Backend `.env.development`
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/roommates_dev

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Cloudinary (if using)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Backend `.env.production`
```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@host:5432/roommates_prod

# JWT Secret
JWT_SECRET=your-production-jwt-secret-very-long-and-random

# CORS Origins
CORS_ORIGINS=https://your-frontend-app.vercel.app

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Backend `.env.example` (for repository)
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/roommates

# JWT Secret
JWT_SECRET=your-jwt-secret-here

# CORS Origins
CORS_ORIGINS=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email Service
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
```

---

## 3. Frontend Configuration

### Create `src/config/constants.ts`
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Roommates Finder';
export const IS_PRODUCTION = import.meta.env.VITE_ENVIRONMENT === 'production';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  LISTINGS: {
    GET_ALL: '/api/listings',
    GET_BY_ID: (id: string) => `/api/listings/${id}`,
    CREATE: '/api/listings',
    UPDATE: (id: string) => `/api/listings/${id}`,
    DELETE: (id: string) => `/api/listings/${id}`,
  },
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE: '/api/users/profile',
  },
};
```

### Create `src/services/api.ts`
```typescript
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
          withCredentials: true,
        });
        
        const { token } = response.data;
        localStorage.setItem('token', token);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### Update `vite.config.ts`
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
```

### Update `package.json` scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 4. Backend Configuration

### Create `src/config/database.ts`
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
```

### Create `src/config/cors.ts`
```typescript
import cors from 'cors';

const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'];

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie'],
};
```

### Update `src/server.ts`
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { corsOptions } from './config/cors';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/users', userRoutes);
// ... other routes

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS Origins: ${process.env.CORS_ORIGINS}`);
});
```

### Update `package.json` scripts
```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "lint": "eslint . --ext .ts"
  }
}
```

---

## 5. CORS Configuration

### Why CORS is Important
CORS (Cross-Origin Resource Sharing) prevents unauthorized websites from accessing your API. When your frontend (on Vercel) tries to access your backend (on Railway), the browser blocks the request unless the backend explicitly allows it.

### Implementation Steps

1. **Install CORS package** (already done):
   ```bash
   npm install cors
   npm install --save-dev @types/cors
   ```

2. **Configure CORS in backend** (see `src/config/cors.ts` above)

3. **Set CORS_ORIGINS in environment variables**:
   - Development: `http://localhost:5173,http://localhost:3000`
   - Production: `https://your-app.vercel.app`

4. **Handle preflight requests**:
   The CORS configuration above automatically handles OPTIONS requests.

---

## 6. Database Connection

### PostgreSQL with Prisma

1. **Install Prisma**:
   ```bash
   npm install @prisma/client
   npm install --save-dev prisma
   ```

2. **Initialize Prisma**:
   ```bash
   npx prisma init
   ```

3. **Update `prisma/schema.prisma`**:
   ```prisma
   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }

   model User {
     id        String   @id @default(uuid())
     email     String   @unique
     password  String
     fullName  String
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     
     listings  Listing[]
   }

   model Listing {
     id          String   @id @default(uuid())
     title       String
     description String
     price       Int
     ownerId     String
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
     
     owner       User     @relation(fields: [ownerId], references: [id])
   }
   ```

4. **Run migrations**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Use Prisma in controllers**:
   ```typescript
   import prisma from '../config/database';

   export const getListings = async (req, res) => {
     try {
       const listings = await prisma.listing.findMany({
         include: { owner: true },
       });
       res.json(listings);
     } catch (error) {
       res.status(500).json({ error: 'Failed to fetch listings' });
     }
   };
   ```

---

## 7. Deployment Steps

### A. Frontend Deployment (Vercel)

1. **Prepare for deployment**:
   - Ensure `.env.production` is configured
   - Add `.env*` to `.gitignore`
   - Test build locally: `npm run build`

2. **Deploy to Vercel**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Login
   vercel login

   # Deploy
   vercel --prod
   ```

3. **Configure Environment Variables in Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `VITE_API_URL` = `https://your-backend.railway.app`
     - `VITE_ENVIRONMENT` = `production`

4. **Vercel Configuration** (`vercel.json`):
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

### B. Backend Deployment (Railway)

1. **Prepare for deployment**:
   - Ensure `.env.production` is configured
   - Add build script to `package.json`
   - Test build locally: `npm run build`

2. **Deploy to Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your backend repository
   - Railway will auto-detect Node.js

3. **Configure Environment Variables in Railway**:
   - Go to your project → Variables tab
   - Add all variables from `.env.production`:
     - `NODE_ENV` = `production`
     - `PORT` = `5000`
     - `DATABASE_URL` = (from Railway PostgreSQL plugin)
     - `JWT_SECRET` = (generate a strong secret)
     - `CORS_ORIGINS` = `https://your-frontend.vercel.app`
     - Add Cloudinary, email, etc.

4. **Add PostgreSQL Database**:
   - In Railway project → New → Database → PostgreSQL
   - Railway will automatically set `DATABASE_URL`

5. **Railway Configuration** (`railway.json`):
   ```json
   {
     "build": {
       "builder": "NIXPACKS",
       "buildCommand": "npm install && npm run build && npx prisma generate && npx prisma migrate deploy"
     },
     "deploy": {
       "startCommand": "npm start",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

6. **Custom Start Command** (in Railway settings):
   ```bash
   npx prisma migrate deploy && npm start
   ```

---

## 8. Testing the Connection

### Step 1: Test Backend Health
```bash
curl https://your-backend.railway.app/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Step 2: Test API Endpoint
```bash
curl https://your-backend.railway.app/api/listings
```

### Step 3: Test from Frontend
Create a test component:
```typescript
import { useEffect, useState } from 'react';
import api from '../services/api';

export const ConnectionTest = () => {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/health');
        setStatus(`✅ Connected! ${JSON.stringify(response.data)}`);
      } catch (error) {
        setStatus(`❌ Failed: ${error.message}`);
      }
    };
    testConnection();
  }, []);

  return <div>{status}</div>;
};
```

### Step 4: Test CORS
Open browser console on your deployed frontend and check for CORS errors. If you see:
```
Access to XMLHttpRequest at 'https://backend.railway.app' from origin 'https://frontend.vercel.app' has been blocked by CORS policy
```

Then update `CORS_ORIGINS` in Railway to include your Vercel URL.

### Step 5: Test Full Flow
1. Register a new user
2. Login
3. Create a listing
4. View listings
5. Update profile

---

## 9. Security Best Practices

### A. Environment Variables
- ✅ **Never commit `.env` files** to Git
- ✅ **Use `.env.example`** as a template
- ✅ **Use different secrets** for dev and production
- ✅ **Rotate secrets** regularly
- ✅ **Use strong, random JWT secrets** (at least 32 characters)

### B. API Security
```typescript
// Rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### C. Input Validation
```typescript
import { body, validationResult } from 'express-validator';

export const validateListing = [
  body('title').notEmpty().trim().escape(),
  body('price').isNumeric(),
  body('description').notEmpty().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
```

### D. Helmet for Security Headers
```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### E. Secure Cookies
```typescript
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

---

## 10. Troubleshooting Common Issues

### Issue 1: CORS Error
**Solution**: Ensure `CORS_ORIGINS` in backend includes your frontend URL (without trailing slash).

### Issue 2: 502 Bad Gateway
**Solution**: Check Railway logs. Usually means the server isn't starting. Verify `PORT` and start command.

### Issue 3: Database Connection Failed
**Solution**: Verify `DATABASE_URL` is set correctly in Railway. Run migrations: `npx prisma migrate deploy`.

### Issue 4: Environment Variables Not Working
**Solution**: 
- Frontend: Ensure variables start with `VITE_`
- Backend: Restart the Railway service after adding variables

### Issue 5: Build Fails on Vercel
**Solution**: Check build logs. Common issues:
- TypeScript errors
- Missing dependencies
- Incorrect build command

---

## 11. Monitoring and Logs

### Frontend (Vercel)
- View logs: Vercel Dashboard → Deployments → Click deployment → Logs
- Monitor performance: Vercel Analytics

### Backend (Railway)
- View logs: Railway Dashboard → Your service → Logs tab
- Monitor metrics: Railway Dashboard → Metrics

---

## 12. CI/CD Setup

### GitHub Actions for Backend
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Railway

on:
  push:
    branches: [main, master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
```

---

## Summary Checklist

### Before Deployment
- [ ] Environment variables configured for both repos
- [ ] CORS configured correctly
- [ ] Database migrations ready
- [ ] Build scripts tested locally
- [ ] `.gitignore` includes `.env` files
- [ ] API endpoints documented

### After Deployment
- [ ] Health check endpoint works
- [ ] CORS allows frontend to access backend
- [ ] Database connected and migrations applied
- [ ] Environment variables set in hosting platforms
- [ ] SSL/HTTPS enabled (automatic on Vercel/Railway)
- [ ] Monitoring and logging configured

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [React + Vite Documentation](https://vitejs.dev)

---

**Good luck with your graduation project! 🎓**
