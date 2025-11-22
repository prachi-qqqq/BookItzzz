# Acceptance Criteria

This document defines the completion and functional requirements for BookItzzz.

## Core Functional Requirements

1. **Database & Migrations**
   - [ ] Prisma schema complete with all required models (User, Book, Borrow, Review, Reservation, APIKey, AuditLog, Session)
   - [ ] Migrations run successfully without errors
   - [ ] Seed script populates demo data (admin, librarian, members, 200 books)

2. **Authentication & Authorization**
   - [ ] User can sign up with email/password (credentials)
   - [ ] User can sign in with Google OAuth
   - [ ] Sessions are stored in database and can be invalidated
   - [ ] Role-based access control enforced (ADMIN, LIBRARIAN, MEMBER, GUEST)
   - [ ] Admin can invite librarians and manage users
   - [ ] Passwords are hashed with bcrypt

3. **Book Management**
   - [ ] Admin/librarian can create a new book with metadata and cover image
   - [ ] Cover image uploaded via ImageKit direct upload with signed token
   - [ ] User can search books by title, author, ISBN, description with filters (genre, availability, publisher, year)
   - [ ] Pagination and sorting supported on book lists
   - [ ] Soft delete for books (isDeleted flag)
   - [ ] Books display aggregated ratings and review count

4. **Borrowing System**
   - [ ] Member can borrow an available book (copiesAvailable > 0)
   - [ ] Borrowing decreases copiesAvailable by 1
   - [ ] Due date is calculated (e.g., 14 days from borrow)
   - [ ] Member can return a borrowed book
   - [ ] Returning increases copiesAvailable by 1
   - [ ] Overdue borrows are detected by background worker and status updated to OVERDUE
   - [ ] Fine calculation logic implemented

5. **Reservation Queue**
   - [ ] If copiesAvailable == 0, user can create a reservation
   - [ ] Reservations are queued with position
   - [ ] When a copy is returned, next reservation in queue can be fulfilled

6. **Reviews & Ratings**
   - [ ] User can add a rating (1–5) and text review to a book
   - [ ] Reviews are visible on book detail page
   - [ ] Admin moderation capability (optional, can be basic)

7. **Admin Dashboard**
   - [ ] Shows accurate metrics: total books, active borrows, overdue count, user count
   - [ ] Book management interface (create, edit, delete, bulk import CSV)
   - [ ] User management interface (view, change roles, invite)

8. **API Endpoints**
   - [ ] All REST endpoints respond with correct status codes (200, 201, 400, 401, 403, 404, 429, 500)
   - [ ] List endpoints include pagination metadata (total, page, limit)
   - [ ] OpenAPI spec file documents all endpoints with request/response schemas

9. **Rate Limiting & Security**
   - [ ] Redis-backed rate limiter blocks excessive requests with 429
   - [ ] Retry-After header provided on rate limit responses
   - [ ] API keys enforced for partner APIs with quotas
   - [ ] Input validation on all endpoints (Zod)
   - [ ] Secrets stored in environment variables

10. **Background Worker**
    - [ ] Worker script detects overdue borrows and updates status
    - [ ] Worker creates audit logs for actions
    - [ ] Worker can send email notifications (dev: SMTP via maildev)

11. **Testing**
    - [ ] Unit tests for core business logic (borrow lifecycle, due date, fines)
    - [ ] Integration tests for API endpoints using test database
    - [ ] End-to-end tests (Playwright) for auth, borrow, book creation

12. **CI/CD**
    - [ ] GitHub Actions workflow runs lint, typecheck, unit tests, build
    - [ ] Migration checks pass in CI
    - [ ] Deployment instructions for Vercel, managed Postgres, Redis

13. **Local Development**
    - [ ] Clone repo, copy .env.example to .env, run docker-compose up
    - [ ] Run `npm install` (or pnpm)
    - [ ] Run `npm run prisma:migrate` and `npm run seed`
    - [ ] Run `npm run dev` starts local server
    - [ ] All commands documented in README

## Non-Functional Requirements

- **Performance**: List endpoints respond in < 500ms with pagination
- **Accessibility**: Keyboard navigable, semantic HTML, alt text on images
- **Responsive**: UI works on mobile and desktop
- **Type Safety**: All code in TypeScript with strict mode
- **Code Quality**: ESLint and Prettier configured and passing

## Completion Checklist

- [ ] All acceptance criteria met
- [ ] README with clear setup instructions
- [ ] OpenAPI spec complete
- [ ] ER diagram or schema visualization
- [ ] Architecture docs
- [ ] CONTRIBUTING.md with code style and PR process
- [ ] All tests passing
- [ ] Deployment guides for recommended providers
