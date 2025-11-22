# BookItzzz

A modern, production-ready library management platform built with Next.js, TypeScript, Prisma, PostgreSQL, and Redis.

## Features

- **Book Catalog Management**: Create, read, update, delete books with metadata and cover images
- **User Management**: Registration, Google OAuth sign-in, role-based access control (ADMIN, LIBRARIAN, MEMBER, GUEST)
- **Borrowing System**: Borrow, renew, return with due date tracking and overdue detection
- **Reviews & Ratings**: Users can rate and review books
- **Reservation Queue**: Reserve books when unavailable
- **Admin Dashboard**: Metrics, book/user management, bulk import
- **Search & Filters**: Full-text search, genre/author/availability filters, pagination
- **Image Uploads**: ImageKit integration for book covers with CDN delivery
- **Rate Limiting**: Redis-backed rate limiter for API protection
- **Background Worker**: Scheduled tasks for overdue detection and notifications
- **REST API**: Fully documented OpenAPI spec with typed endpoints

## Tech Stack

- **Frontend**: Next.js 14 (app router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **Cache & Rate Limiting**: Redis
- **Auth**: NextAuth with Google OAuth + credentials
- **Image CDN**: ImageKit
- **Testing**: Jest (unit), Playwright (e2e)
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (frontend), managed Postgres & Redis providers

## Prerequisites

- Node.js >= 18
- Docker & Docker Compose (for local dev)
- PostgreSQL (or use docker-compose)
- Redis (or use docker-compose)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/bookitzzz.git
cd bookitzzz
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `NEXTAUTH_SECRET`: Random secret for NextAuth
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for local)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`: ImageKit credentials

### 4. Start local services with Docker Compose

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- MailDev on ports 1080 (web UI) and 1025 (SMTP)

### 5. Run database migrations

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 6. Seed the database with sample data

```bash
npm run seed
```

This creates:
- 1 ADMIN user (admin@example.com)
- 1 LIBRARIAN user (librarian@example.com)
- 10 MEMBER users (member0@example.com - member9@example.com)
- ~200 sample books with realistic data

Default password for all seeded users: `password123`

### 7. Start the development server

```bash
npm run dev
```

Visit http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run prisma:migrate` - Run Prisma migrations
- `npm run prisma:generate` - Generate Prisma client
- `npm run seed` - Seed database with sample data
- `npm run worker` - Run background worker once
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests only
- `npm run e2e` - Run end-to-end tests with Playwright

## Project Structure

```
bookitzzz/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── books/             # Book pages
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Auth pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── lib/                   # Shared utilities
│   ├── prisma.ts          # Prisma client
│   ├── rateLimiter.ts     # Redis rate limiter
│   └── auth.ts            # Auth helpers
├── prisma/
│   └── schema.prisma      # Database schema
├── scripts/
│   ├── seed.ts            # Database seed script
│   └── worker.ts          # Background worker
├── tests/
│   ├── unit/              # Unit tests
│   └── e2e/               # End-to-end tests
├── docs/
│   ├── openapi.yaml       # OpenAPI spec
│   ├── architecture.md    # Architecture docs
│   ├── ER-diagram.md      # Database schema
│   └── acceptance-criteria.md
├── .github/
│   └── workflows/         # GitHub Actions CI/CD
├── docker-compose.yml     # Local dev environment
├── package.json
├── tsconfig.json
└── README.md
```

## Authentication

### Sign Up (Credentials)

Users can register with email and password. Passwords are hashed with bcrypt.

### Google OAuth

Configure Google OAuth in the Google Cloud Console:
1. Create OAuth 2.0 credentials
2. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
3. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`

### Roles

- **GUEST**: Unauthenticated users (read-only)
- **MEMBER**: Can borrow books, write reviews, manage own profile
- **LIBRARIAN**: Can create/update books, manage borrows
- **ADMIN**: Full access to all features, user management

## API Documentation

Full OpenAPI specification available at `docs/openapi.yaml`.

Key endpoints:

- `GET /api/health` - Health check
- `GET /api/books` - List books (with search, filters, pagination)
- `POST /api/books` - Create book (ADMIN/LIBRARIAN)
- `GET /api/books/:id` - Get book detail
- `POST /api/borrows` - Borrow a book
- `POST /api/borrows/:id/return` - Return a book
- `POST /api/reservations` - Create reservation
- `POST /api/books/:id/reviews` - Add review
- `GET /api/admin/stats` - Admin dashboard stats
- `POST /api/uploads/imagekit` - Get ImageKit upload token

## Background Worker

The worker script (`scripts/worker.ts`) runs scheduled tasks:

- Detect overdue borrows and update status
- Send email notifications (due soon, overdue)
- Create audit logs

Run manually:
```bash
npm run worker
```

For production, schedule via:
- Vercel Cron Jobs
- GitHub Actions workflow (scheduled)
- External cron service

## Testing

### Unit Tests

```bash
npm run test:unit
```

Tests for business logic (borrow calculations, due dates, fines).

### End-to-End Tests

```bash
npm run e2e
```

Playwright tests covering:
- Home page load
- Book listing and search
- Borrow flow
- Admin dashboard
- API endpoints

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Database & Redis

Use managed providers:

**PostgreSQL**:
- Supabase
- Render PostgreSQL
- ElephantSQL
- Neon

**Redis**:
- Upstash Redis
- Redis Cloud

Update `DATABASE_URL` and `REDIS_URL` environment variables with production connection strings.

### Migrations

Run migrations in production:

```bash
npx prisma migrate deploy
```

### Environment Variables

Ensure all production environment variables are set:
- Use secure `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- Set `NEXTAUTH_URL` to your production domain
- Use HTTPS for secure cookies
- Configure Google OAuth redirect URIs for production domain

## Security Considerations

- All secrets in environment variables (never commit `.env`)
- Passwords hashed with bcrypt
- Rate limiting on all public endpoints
- Input validation with Zod
- RBAC enforced on sensitive endpoints
- HTTPS in production
- Secure cookie settings
- CSRF protection via NextAuth

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for code style, PR process, and development guidelines.

## License

MIT

## Support

For issues and questions, please open a GitHub issue.

---

Built with ❤️ using Next.js, Prisma, and TypeScript
