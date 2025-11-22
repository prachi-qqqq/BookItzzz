# ER Diagram

This file describes the entity-relationship model for BookItzzz.

## Entities

### User
- id (PK)
- email (unique)
- name
- avatar
- role (ADMIN, LIBRARIAN, MEMBER, GUEST)
- password (hashed, nullable)
- googleId (nullable, unique)
- createdAt, updatedAt

### Book
- id (PK)
- title, subtitle
- authors (array)
- description
- isbn (unique)
- publisher
- publishedAt
- genres (array)
- coverUrl
- copiesTotal, copiesAvailable
- isDeleted
- createdAt, updatedAt

### Borrow
- id (PK)
- userId (FK → User)
- bookId (FK → Book)
- startedAt, dueAt, returnedAt
- status (BORROWED, RETURNED, OVERDUE, CANCELLED)
- fineCents

### Review
- id (PK)
- userId (FK → User)
- bookId (FK → Book)
- rating (1–5)
- content
- createdAt, updatedAt

### Reservation
- id (PK)
- userId (FK → User)
- bookId (FK → Book)
- createdAt
- status (ACTIVE, FULFILLED, CANCELLED)
- position

### APIKey
- id (PK)
- key (unique)
- name
- ownerId (FK → User, nullable)
- quotaDaily
- createdAt

### AuditLog
- id (PK)
- actorId (FK → User, nullable)
- action
- entity
- entityId
- data (JSON)
- createdAt

### Session
- id (PK)
- sessionToken (unique)
- userId (FK → User)
- expires

## Relationships

- User → Borrow (1:N)
- User → Review (1:N)
- User → Reservation (1:N)
- User → Session (1:N)
- User → APIKey (1:N)
- Book → Borrow (1:N)
- Book → Review (1:N)
- Book → Reservation (1:N)

## Visualization

```
┌──────────┐         ┌──────────┐
│   User   │─────────│  Borrow  │
└──────────┘         └──────────┘
     │                     │
     │                ┌──────────┐
     ├────────────────│   Book   │
     │                └──────────┘
     │                     │
     │                ┌──────────┐
     ├────────────────│  Review  │
     │                └──────────┘
     │
     │                ┌────────────────┐
     ├────────────────│  Reservation   │
     │                └────────────────┘
     │
     │                ┌──────────┐
     └────────────────│ Session  │
                      └──────────┘
```

For a detailed visual diagram, use a tool like dbdiagram.io or ERD generator with the Prisma schema.
