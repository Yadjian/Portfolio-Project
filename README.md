# Mova - Job Matching Platform

A comprehensive job matching platform that connects candidates and recruiters through an innovative swipe-based interface. Built with modern technologies to provide a seamless experience across web, mobile, and admin platforms.

## 🌟 Overview

Mova is a full-stack application consisting of three main components:

- **📱 Mobile App**: React Native/Expo app for candidates and recruiters
- **🖥️ Admin Panel**: Next.js web application for system administration
- **⚡ Backend API**: NestJS REST API with real-time features

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Admin Panel   │    │   Backend API   │
│                 │    │                 │    │                 │
│ React Native    │◄──►│    Next.js      │◄──►│    NestJS       │
│ Expo Router     │    │  TypeScript     │    │  TypeScript     │
│ TypeScript      │    │  TailwindCSS    │    │  Prisma ORM     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                       │
         │                        │                       │
         └────────────────────────┼───────────────────────┘
                                  │
                ┌─────────────────────────────────┐
                │         Infrastructure          │
                │                                 │
                │ PostgreSQL + PostGIS           │
                │ Redis (Queue System)           │
                │ Cloudflare R2 (File Storage)   │
                │ Firebase (Push Notifications)  │
                └─────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL with PostGIS (or use Docker)
- Redis (or use Docker)

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://mova_user:mova_password@localhost:5432/mova_db"
POSTGRES_USER=mova_user
POSTGRES_PASSWORD=mova_password
POSTGRES_DB=mova_db

# JWT Authentication
JWT_ACCESS_SECRET="your-super-secret-access-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL="redis://localhost:6379"

# Cloudflare R2 Storage
R2_ENDPOINT="your-r2-endpoint"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="your-bucket-name"
R2_PUBLIC_URL="https://your-public-domain.r2.dev"

# Server
PORT=3000

# Firebase (for push notifications)
FIREBASE_PROJECT_ID="your-firebase-project-id"
```

### 2. Docker Development (Recommended)

```bash
# Start all services (PostgreSQL, Redis, Backend, Admin Panel)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Manual Setup

```bash
# Install dependencies for all projects
npm install
cd backend && npm install
cd ../mova-admin && npm install
cd ../mova-mobile && npm install

# Setup database
cd backend
npx prisma migrate dev
npx prisma db seed

# Start backend
npm run start:dev

# Start admin panel (in another terminal)
cd mova-admin
npm run dev

# Start mobile app (in another terminal)
cd mova-mobile
npm start
```

## 📱 Mobile Application

### Technologies
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: React Context
- **Authentication**: JWT + Auth0
- **Maps & Location**: Expo Location + Google Places
- **Push Notifications**: Expo Notifications + Firebase

### Key Features
- 🔐 Secure authentication (candidates & recruiters)
- 👤 Profile management with photo/resume upload
- 🗺️ Location-based matching
- 💫 Swipe interface for job/candidate discovery
- 🔔 Real-time push notifications
- 💼 Job offer management (recruiters)
- 🎯 Match visualization and interaction

### Development

```bash
cd mova-mobile

# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

### Mobile App Structure
```
app/
├── (tabs)/                 # Tab navigation
├── navigation/             # Navigation configuration
├── screens/               # All app screens
│   ├── ProfileScreens/    # Profile-related screens
│   └── RegisterScreens/   # Registration flow
components/
├── ui/                    # Reusable UI components
contexts/                  # React contexts (Auth, Notifications)
services/                  # API services
constants/                 # App constants and configuration
```

## 🖥️ Admin Panel

### Technologies
- **Framework**: Next.js 15 with App Router
- **Styling**: TailwindCSS v4
- **Authentication**: Auth0
- **Language**: TypeScript

### Key Features
- 👥 User management (CRUD operations)
- 💼 Job offer oversight
- 📊 System analytics
- 🏢 Company management
- 🔧 System configuration

### Development

```bash
cd mova-admin

# Install dependencies
npm install

# Start development server
npm run dev
```

### Admin Panel Structure
```
src/
├── app/
│   ├── api/              # API routes (proxy to backend)
│   ├── components/       # Reusable components
│   ├── homepage/         # Dashboard
│   └── services/         # Service management pages
├── assets/               # Static assets
└── lib/                  # Configuration and utilities
```

## ⚡ Backend API

### Technologies
- **Framework**: NestJS
- **Database**: PostgreSQL + PostGIS
- **ORM**: Prisma
- **Authentication**: JWT (Access + Refresh tokens)
- **Queue System**: BullMQ + Redis
- **File Storage**: Cloudflare R2 (S3-compatible)
- **Push Notifications**: Firebase Cloud Messaging

### Key Features
- 🔐 JWT-based authentication with refresh tokens
- 👤 User profiles (candidates & recruiters)
- 🏢 Company management system
- 💼 Job offer CRUD operations
- 🗺️ Geographic matching with PostGIS
- 💫 Swipe system with real-time matching
- 🔔 Background notification processing
- 📁 File upload (photos, resumes)
- 👨‍💼 Admin panel API

### Development

```bash
cd backend

# Install dependencies
npm install

# Database setup
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run start:dev

# Open Prisma Studio
npm run prisma:studio
```

### Backend Structure
```
src/
├── admin/              # Admin panel functionality
├── auth/               # Authentication & authorization
├── companies/          # Company management
├── discovery/          # User discovery system
├── file-storage/       # File upload & storage
├── firebase/           # Push notifications
├── job-offer/          # Job management
├── matches/            # Match retrieval & display
├── meta/               # Metadata (roles, categories)
├── notifications/      # Notification processing
├── profile/            # User profile management
├── swipes/             # Swipe actions & logic
└── prisma/             # Database service
```

## 🗄️ Database Schema

### Core Models
- **User**: Authentication and basic user info
- **CandidateProfile**: Job seeker profiles
- **RecruiterProfile**: Recruiter profiles
- **Company**: Company information
- **JobOffer**: Job postings
- **Swipe**: User interactions (like/dislike)
- **JobCategory**: Job classification

### Geographic Features
- PostGIS extension for location storage
- Spatial queries for proximity matching
- Support for radius-based search

## 🔔 Notification System

### Architecture
- **Firebase Cloud Messaging** for push notifications
- **BullMQ** for background job processing
- **Redis** as message broker

### Notification Types
- 📩 New match notifications
- 👍 Swipe notifications
- 💼 Job offer updates
- 🎯 Match updates

## 📁 File Storage

### Cloudflare R2 Integration
- Profile photo storage
- Resume upload and management
- Automatic file cleanup
- CDN integration for fast delivery

## 🔒 Security Features

- JWT access and refresh tokens
- Role-based access control
- Input validation with class-validator
- File upload security
- CORS configuration
- Environment variable management

## 🚀 Deployment

### Production Environment Variables

```bash
# Production Database
DATABASE_URL="postgresql://user:pass@prod-db:5432/mova_prod"

# JWT (Use strong, unique keys)
JWT_ACCESS_SECRET="prod-access-secret-256-bits"
JWT_REFRESH_SECRET="prod-refresh-secret-256-bits"

# Redis Production
REDIS_URL="redis://prod-redis:6379"

# Cloudflare R2 Production
R2_ENDPOINT="prod-endpoint"
R2_BUCKET_NAME="mova-prod-storage"
R2_PUBLIC_URL="https://files.mova.app"

# Firebase Production
FIREBASE_PROJECT_ID="mova-prod"
```

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Production

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Admin Panel
cd mova-admin
npm run build
npm start

# Mobile App (Build for stores)
cd mova-mobile
eas build --platform android
eas build --platform ios
```

## 📊 API Documentation

The backend provides comprehensive API documentation:

- **Swagger UI**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/health`

### Main Endpoints

| Service | Endpoint | Description |
|---------|----------|-------------|
| Auth | `POST /auth/signup` | User registration |
| Auth | `POST /auth/login` | User login |
| Profile | `GET /profile/me` | Get user profile |
| Discovery | `GET /discovery/recruiters` | Find nearby recruiters |
| Swipes | `POST /swipes` | Create swipe action |
| Matches | `GET /matches` | Get user matches |
| Jobs | `POST /job-offers` | Create job offer |

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test                # Unit tests
npm run test:e2e        # E2E tests
npm run test:cov        # Coverage report
```

### Frontend Testing
```bash
cd mova-mobile
# Add testing setup as needed

cd mova-admin
# Add testing setup as needed
```

## 📱 Platform Support

### Mobile Application
- ✅ iOS (React Native)
- ✅ Android (React Native)
- ✅ Web (Expo Web)

### Admin Panel
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Responsive design

### Backend API
- ✅ REST API with JSON responses
- ✅ Real-time features via push notifications
- ✅ Cross-platform compatibility

## 🛠️ Development Tools

### Recommended IDE Extensions
- TypeScript
- Prettier
- ESLint
- Prisma
- Docker

### Database Management
- Prisma Studio: `npm run prisma:studio`
- Database migrations: `npx prisma migrate dev`
- Database seeding: `npx prisma db seed`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use Prettier for code formatting
- Follow conventional commit messages
- Write tests for new features

## 📚 Additional Resources

- [NestJS Documentation](https://nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [Prisma Documentation](https://prisma.io/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Reset database
   docker-compose down -v
   docker-compose up -d db
   cd backend && npx prisma migrate reset
   ```

2. **Redis Connection Issues**
   ```bash
   # Restart Redis
   docker-compose restart redis
   ```

3. **Mobile App Build Issues**
   ```bash
   # Clear Expo cache
   cd mova-mobile
   expo start -c
   ```

## 📄 License

This project is private and proprietary.

## 👨‍💻 Development Team

- Backend API: NestJS, TypeScript
- Mobile App: React Native, Expo
- Admin Panel: Next.js, React
- DevOps: Docker, PostgreSQL, Redis