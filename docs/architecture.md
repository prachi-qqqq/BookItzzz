# BookItzzz Architecture

## Overview

BookItzzz is a full-stack Next.js monorepo using the app router for both frontend and backend.

## Components

### Frontend
- **Next.js app router** with React server components and client components
- **Tailwind CSS** for styling with shadcn/ui patterns
- **React Query / SWR** for data fetching, caching, and optimistic updates

### Backend
- **Next.js API routes** in `app/api/**` providing REST endpoints
- **Prisma ORM** connecting to PostgreSQL for all persistence
- **Redis** for rate limiting and caching
- **NextAuth** for session-based authentication with Google OAuth and credentials

### Database
- **PostgreSQL** as the single source of truth
- Schema managed via Prisma migrations
- Full-text search on books via tsvector column (custom migration)

### Caching & Rate Limiting
- **Redis** using sliding window counters
- Middleware checks rate limits before endpoint logic

### Background Worker
- Standalone Node script `scripts/worker.ts` runs periodically via cron or scheduler
- Detects overdue borrows, updates status, creates audit logs
- Optionally sends notifications via nodemailer

### Uploads
- **ImageKit** for book cover images
- Client-side direct upload using server-signed tokens from `/api/uploads/imagekit`
- CDN URL stored in `Book.coverUrl`

## Deployment Architecture

- **Vercel** hosts Next.js app (frontend + serverless API routes)
- **Managed Postgres** (Supabase / Render / ElephantSQL)
- **Redis Cloud** or Upstash for Redis
- Worker script runs on cron schedule (Vercel Cron or GitHub Actions schedule)

## Data Flow

1. User requests page → Next.js server components fetch data via Prisma
2. Client interactions → API routes → Prisma → DB
3. Rate limiter checks Redis before allowing request
4. Authentication: NextAuth middleware validates JWT/session
5. RBAC checks role from session before admin/librarian actions
6. Background worker polls for overdue borrows and sends email notifications

## Security

- Environment variables for secrets
- HTTPS in production
- Secure cookies for NextAuth
- bcrypt for password hashing
- Input validation with Zod
- Rate limiting per IP and per user
