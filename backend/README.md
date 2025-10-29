# Mova Backend API

A comprehensive backend API built with NestJS for a job matching platform connecting candidates and recruiters through a swipe-based interface.

## 🏗️ Architecture Overview

The backend is built with modern technologies to provide a scalable, secure, and maintainable API:

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with PostGIS extension
- **ORM**: Prisma
- **Authentication**: JWT (Access & Refresh tokens)
- **File Storage**: Cloudflare R2 (S3-compatible)
- **Queue System**: BullMQ with Redis
- **Push Notifications**: Firebase Cloud Messaging
- **API Documentation**: Swagger/OpenAPI

## 📋 Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Candidate, Recruiter, Admin)
- Secure password hashing with bcrypt

### 👤 User Profiles
- Candidate profiles with resume upload, job preferences, location
- Recruiter profiles with company information, search criteria
- Photo upload and management
- Location-based services with PostGIS

### 💼 Job Management
- Job offer creation and management
- Geographic filtering and search
- Category-based job classification

### 🔄 Matching System
- Swipe-based user interaction (LEFT/RIGHT)
- Real-time match detection
- Undo last swipe functionality

### 📱 Notifications
- Push notifications via Firebase
- Queue-based notification processing
- Match and swipe notifications

### 🏢 Company Management
- Company onboarding for recruiters
- SIRET validation
- Company-recruiter associations

### 📊 Admin Panel
- User management (CRUD operations)
- Role assignment
- System monitoring

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL with PostGIS extension
- Redis
- Docker & Docker Compose (recommended)

### Environment Variables

Create a `.env` file in the backend directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mova_db"

# JWT Secrets
JWT_ACCESS_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"

# Redis
REDIS_HOST="localhost"
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
```

### Installation & Development

1. **Install dependencies**:
```bash
npm install
```

2. **Set up the database**:
```bash
# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed
```

3. **Start development server**:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger documentation at `http://localhost:3000/api`

### Docker Development

```bash
# Start all services (PostgreSQL, Redis, Backend)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Run migrations in Docker
npm run migrate:docker

# Seed database in Docker
npm run db:seed

# Access Prisma Studio
npm run studio:docker
```

## 📁 Project Structure

```
src/
├── admin/              # Admin panel functionality
├── auth/               # Authentication & authorization
├── companies/          # Company management
├── discovery/          # User discovery system
├── file-storage/       # File upload & storage
├── firebase/           # Push notifications
├── health/             # Health check endpoints
├── job-offer/          # Job management
├── matches/            # Match retrieval & display
├── meta/               # Metadata (roles, categories, etc.)
├── notifications/      # Notification processing
├── prisma/             # Database service
├── profile/            # User profile management
├── swipes/             # Swipe actions & logic
├── types/              # TypeScript type definitions
├── app.module.ts       # Root application module
└── main.ts             # Application entry point
```

## 🛠️ Available Scripts

```bash
# Development
npm run start:dev          # Start development server with hot reload
npm run start:debug        # Start with debugging enabled

# Building
npm run build              # Build for production
npm run start:prod         # Start production server

# Testing
npm test                   # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests

# Database
npm run prisma:studio      # Open Prisma Studio
npm run migrate:docker     # Run migrations in Docker
npm run db:seed            # Seed database

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

## 📡 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token

### Profiles
- `GET /profile/me` - Get current user profile
- `PUT /profile/me` - Update profile
- `PUT /profile/location` - Update location
- `PUT /profile/photo` - Upload profile photo
- `PUT /profile/resume` - Upload resume (candidates)
- `DELETE /profile/resume` - Delete resume

### Discovery
- `GET /discovery/recruiters` - Get nearby recruiters (candidates)
- `GET /discovery/candidates` - Get nearby candidates (recruiters)
- `GET /discovery/pending-candidates` - Get pending notifications

### Swipes & Matches
- `POST /swipes` - Create swipe action
- `POST /swipes/undo` - Undo last swipe
- `GET /matches` - Get user matches
- `GET /matches/:id` - Get match details

### Job Offers
- `POST /job-offers` - Create job offer
- `GET /job-offers` - Get all job offers
- `GET /job-offers/my-offers` - Get recruiter's offers
- `PUT /job-offers/:id` - Update job offer
- `DELETE /job-offers/:id` - Delete job offer

### Companies
- `POST /companies/onboarding` - Company registration

### Admin (Admin only)
- `GET /admin/users` - Get all users
- `POST /admin/users` - Create user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user

### Metadata
- `GET /meta/roles` - Get user roles
- `GET /meta/contract-types` - Get contract types
- `GET /meta/experience-levels` - Get experience levels
- `GET /meta/job-categories` - Get job categories

## 🗄️ Database Schema

The application uses PostgreSQL with PostGIS extension for geographic features:

### Key Models:
- **User**: Central authentication entity
- **CandidateProfile**: Job seeker profiles
- **RecruiterProfile**: Recruiter profiles with company associations
- **Company**: Company information
- **JobOffer**: Job postings
- **Swipe**: Swipe interactions between users
- **JobCategory**: Job classification system

### Geographic Features:
- Location storage using PostGIS POINT geometry
- Spatial queries for proximity-based matching
- Support for location names and coordinates

## 🔄 Queue System

The application uses BullMQ for background job processing:

### Notification Queues:
- **swipe-notification**: Handles swipe notifications
- **match-notification**: Processes match notifications

### Queue Processors:
- Send push notifications via Firebase
- Handle match creation logic
- Process background tasks

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permissions for candidates, recruiters, and admins
- **Input Validation**: Global validation pipes with class-validator
- **File Upload Security**: File type and size validation
- **Environment Variables**: Secure configuration management

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Unit Tests
npm test

# E2E Tests
npm run test:e2e

# Test Coverage
npm run test:cov
```

## 📱 Push Notifications

Firebase Cloud Messaging integration for real-time notifications:
- Match notifications
- Swipe alerts
- Job offer updates
- Background processing via queues

## 🗂️ File Storage

Cloudflare R2 (S3-compatible) for scalable file storage:
- Profile photos
- Resume uploads
- Automatic file cleanup
- CDN integration

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Docker Production
```bash
docker build -f Dockerfile.prod -t mova-backend .
docker run -p 3000:3000 mova-backend
```

## 📚 Additional Resources

- [NestJS Documentation](https://nestjs.com/)
- [Prisma Documentation](https://prisma.io/docs)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [BullMQ Documentation](https://docs.bullmq.io/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is private and proprietary.
