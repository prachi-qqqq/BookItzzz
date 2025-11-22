# Deployment Guide

This guide covers deploying BookItzzz to production using recommended providers.

## Quick Deploy: Vercel + Managed Services

### 1. Database: Supabase (PostgreSQL)

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings → Database
4. Copy the connection string (starts with `postgresql://`)
5. Set as `DATABASE_URL` environment variable

### 2. Redis: Upstash

1. Sign up at [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Copy the connection string (starts with `rediss://`)
4. Set as `REDIS_URL` environment variable

### 3. ImageKit

1. Sign up at [imagekit.io](https://imagekit.io)
2. Get your Public Key, Private Key, and URL Endpoint
3. Set as environment variables:
   - `IMAGEKIT_PUBLIC_KEY`
   - `IMAGEKIT_PRIVATE_KEY`
   - `IMAGEKIT_URL_ENDPOINT`

### 4. Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://yourdomain.com/api/auth/callback/google`
6. Copy Client ID and Secret
7. Set as environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

### 5. Deploy to Vercel

1. Push code to GitHub repository
2. Sign in to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Configure environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `REDIS_URL`
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (your production domain, e.g., `https://bookitzzz.vercel.app`)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `IMAGEKIT_PUBLIC_KEY`
   - `IMAGEKIT_PRIVATE_KEY`
   - `IMAGEKIT_URL_ENDPOINT`
   - `SMTP_HOST`, `SMTP_PORT` (optional, for emails)

5. Deploy! Vercel will build and deploy automatically

### 6. Run Database Migrations

After first deploy:

```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Run migrations
npx prisma migrate deploy
```

Or use Vercel's deployment hooks to run migrations automatically.

### 7. Seed Production Database (Optional)

```bash
# Connect to production database
DATABASE_URL="your-production-url" npm run seed
```

⚠️ Only seed once for initial demo data.

### 8. Background Worker

For production background jobs (overdue detection):

**Option A: Vercel Cron**
1. Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/worker",
    "schedule": "0 2 * * *"
  }]
}
```
2. Create API endpoint at `app/api/cron/worker/route.ts` that runs worker logic

**Option B: GitHub Actions Scheduled Workflow**
```yaml
name: Background Worker
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
jobs:
  worker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run worker
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      REDIS_URL: ${{ secrets.REDIS_URL }}
```

## Alternative Deployment: Self-Hosted Docker

### 1. Build Docker Image

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "start"]
```

### 2. Build and Push

```bash
docker build -t bookitzzz:latest .
docker tag bookitzzz:latest your-registry/bookitzzz:latest
docker push your-registry/bookitzzz:latest
```

### 3. Deploy with Docker Compose

```yaml
version: '3.9'
services:
  app:
    image: your-registry/bookitzzz:latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: bookitzzz
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  db_data:
```

## Post-Deployment Checklist

- [ ] HTTPS enabled (Vercel handles this automatically)
- [ ] Environment variables set correctly
- [ ] Database migrations ran successfully
- [ ] Google OAuth redirect URIs updated for production
- [ ] Rate limiting tested
- [ ] Error monitoring setup (Sentry, LogRocket)
- [ ] Analytics configured (Vercel Analytics, Google Analytics)
- [ ] Backup strategy for database
- [ ] Worker/cron jobs running

## Monitoring & Observability

### Vercel Analytics
Enable in Vercel dashboard for free performance insights.

### Error Tracking: Sentry
1. Sign up at [sentry.io](https://sentry.io)
2. Create Next.js project
3. Install `@sentry/nextjs`
4. Add DSN to environment variables

### Uptime Monitoring
Use services like:
- UptimeRobot
- Pingdom
- Better Uptime

## Scaling Considerations

- **Database**: Use connection pooling (PgBouncer) for managed Postgres
- **Redis**: Upstash scales automatically
- **Vercel**: Auto-scales, supports edge functions
- **Images**: ImageKit handles CDN and transformations
- **Background Jobs**: Scale horizontally with separate worker instances

## Troubleshooting

### Build Fails
- Check Node version matches `engines` in package.json
- Ensure all environment variables are set
- Run `npm run build` locally to reproduce

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database firewall allows Vercel IPs
- Test connection with `npx prisma db pull`

### OAuth Not Working
- Verify redirect URIs match exactly
- Check `NEXTAUTH_URL` is set to production domain
- Ensure `NEXTAUTH_SECRET` is set

## Cost Estimates (Monthly)

- **Vercel**: Free for hobby, Pro $20/month
- **Supabase**: Free tier available, Pro $25/month
- **Upstash Redis**: Free tier (10K commands/day), Pay as you go
- **ImageKit**: Free tier (20GB bandwidth), $49/month for more
- **Total**: Can start free or ~$50-100/month for production

## Security Hardening

- [ ] Enable rate limiting on all public endpoints
- [ ] Set secure cookie flags in NextAuth config
- [ ] Use strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Enable database SSL/TLS
- [ ] Rotate secrets regularly
- [ ] Implement content security policy (CSP)
- [ ] Enable CORS restrictions
- [ ] Set up Web Application Firewall (WAF)

---

For questions, check [README.md](./README.md) or open an issue.
