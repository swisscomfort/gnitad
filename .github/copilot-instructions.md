# GitHub Copilot & AI Agent Instructions

## 📋 Projektübersicht

**Fetisch-Dating-Plattform** ist eine diskrete, KI-gestützte Dating-Anwendung mit:
- **Objekt-Fotos** statt Gesichter (Windel, Seil, Latex-Handschuh, etc.)
- **KI-Charakter-Generator** aus 200+ Micro-Decisions
- **5.000+ Fetisch-Tags** für ultra-genaues Matching
- **Multi-dimensionales Matching** (Fetische, Persönlichkeit, Lifestyle, Werte)
- **Privacy-First** mit gestufter Offenlegung

Tech-Stack: Node.js/Express (Backend), Next.js (Web), React Native (Mobile), Python (ML), PostgreSQL, Redis, Turborepo (Monorepo).

---

## 🏗️ Architektur-Essentials

### Monorepo-Struktur (Turborepo)
```
apps/
  ├── api/              # Express Backend (Node.js/TypeScript)
  ├── web/              # Next.js 14 Frontend
  └── mobile/           # React Native App

packages/
  ├── shared/           # Shared types, utilities
  ├── database/         # Prisma ORM client
  └── ui/              # Shared UI components

services/
  └── ml/              # Python ML services

data/
  └── taxonomy/        # 5000+ Fetisch-Tags (JSON)
```

### Key Data Models (Prisma Schema)
- **User**: Pseudonym, AgeRange, Location, Privacy-Level, Verification-Status
- **UserPhoto**: Objekt-Fotos, AI Object-Recognition, User-Confirmed-Tags
- **UserTag**: User-Preferences für 5000+ Tags
- **UserPersonality**: KI-generierte Character-Archetypen (RPG-Style)
- **Match**: Compatibility-Scores (Multi-dimensional)
- **Message**: Encrypted WebSocket-Chat

**Critical Relations**: User → Photos (1:many), User → Tags (1:many), User → Personality (1:1)

---

## 🔑 Kritische Patterns & Conventions

### 1. **Request Validation**
**Pattern**: Zod Validators + Express-Middleware
```typescript
// apps/api/src/validators/auth.validator.ts
import { z } from 'zod';

export const registerSchema = z.object({
  pseudonym: z.string().min(3).max(20),
  emailHash: z.string().email(),
  passwordHash: z.string().min(12),
  ageRange: z.enum(['18-25', '25-30', '30-35', ...]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
```
**Apply in routes**: `validateRequest(registerSchema)` middleware before handler.

### 2. **Error Handling**
**Pattern**: Custom AppError class + Global error handler
```typescript
// apps/api/src/middleware/errorHandler.ts
export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

// Usage in controllers
throw new AppError(400, 'Invalid pseudonym format');
```
All errors caught by global handler → JSON response with status code.

### 3. **Database Access**
**Pattern**: Service layer (Business logic) ↔ Database (Prisma)
```typescript
// apps/api/src/services/userService.ts
export class UserService {
  async createUser(input: RegisterInput) {
    return await prisma.user.create({ data: { ... } });
  }
}

// Use in controller
const user = await userService.createUser(input);
```
**Never access database directly in controllers** - always use services.

### 4. **Authentication**
**Pattern**: JWT + bcrypt
- Bearer token in Authorization header
- Middleware: `authMiddleware` checks token validity
- Token contains: `{ userId, pseudonym, iat, exp }`
- Refresh-mechanism: Client requests new token before expiry

### 5. **Matching Algorithm**
**Multi-dimensional Scoring**:
1. **Tag-Compatibility**: Common tags / Total tags (0-1)
2. **Personality-Compatibility**: Archetype distance
3. **Lifestyle-Compatibility**: Values alignment
4. **Diversity-Scoring**: Prevent filter-bubble
5. **Final Score** = weighted combination

Location-based filtering: PostGIS for geo-proximity.

### 6. **File Upload & Object Recognition**
**Pattern**: 
1. Upload photo → S3/MinIO
2. Extract dimensions, detect NSFW
3. **ML Pipeline**: YOLOv8/Custom CNN → Detect objects
4. **Suggested Tags**: Object confidence + User confirmation
5. Store in DB: `detectedObjects`, `suggestedTags`, `userConfirmedTags`

### 7. **Real-time Chat**
**Pattern**: WebSocket (Socket.io) + Encrypted messages
```typescript
// Connection: /socket
// Events: message.send, message.received, typing, read-receipt
// Encryption: libsodium or similar for message bodies
```

### 8. **Taxonomy/Tags System**
**Pattern**: JSON-based, hierarchical tagging
```json
{
  "bdsm": {
    "dominance": {
      "strict_mistress": { "confidence": 0.98, "children": [...] },
      "soft_domme": { ... }
    },
    "submission": { ... }
  }
}
```
API endpoints for tag-search: `/api/taxonomy/search?q=dominance`

---

## 🛠️ Developer Workflows

### Starting Development
```bash
# 1. Dependencies
npm install

# 2. Environment
cp .env.example .env
# Edit .env with database URL, JWT secret, S3 credentials

# 3. Docker services (PostgreSQL, Redis)
docker-compose up -d postgres redis

# 4. Migrations & Seed
npm run db:migrate
npm run db:seed

# 5. Start dev server (watches all changes)
npm run dev
```

### Testing
```bash
# Unit & Integration tests (Jest)
npm run test

# Watch mode for TDD
npm run test:watch

# Coverage
npm run test:coverage
```

### Building for Production
```bash
# Build all apps
npm run build

# Or specific app
npm run build:api
npm run build:web

# Docker build
docker build -f docker/api/Dockerfile -t fdp-api:latest .
```

### Database Migrations
```bash
# Create new migration (Prisma)
npx prisma migrate dev --name add_feature

# Generate Prisma client
npx prisma generate

# View database
npx prisma studio
```

---

## ✨ Implementation Checklist for New Features

When adding a new feature (e.g., Photo Upload, Chat, Matching):

1. **Schema Update**
   - [ ] Add models to `schema.prisma`
   - [ ] Create migration: `npx prisma migrate dev --name feature_name`

2. **Backend**
   - [ ] Create service class in `apps/api/src/services/`
   - [ ] Create controller in `apps/api/src/controllers/`
   - [ ] Create route in `apps/api/src/routes/`
   - [ ] Add Zod validator in `apps/api/src/validators/`
   - [ ] Write unit tests in `apps/api/src/__tests__/`

3. **API Documentation**
   - [ ] Document endpoint in `docs/api/endpoints.md`
   - [ ] Include request/response examples

4. **Frontend (Next.js)**
   - [ ] Create hook/context in `apps/web/hooks/`
   - [ ] Create component(s) in `apps/web/components/`
   - [ ] Add state management in Zustand store

5. **Testing**
   - [ ] Unit tests (services)
   - [ ] Integration tests (routes)
   - [ ] E2E tests (if UI-critical)

---

## 📂 Key Files to Know

| File | Purpose |
|------|---------|
| `apps/api/src/index.ts` | Express server entry point |
| `schema.prisma` | Database schema definition |
| `apps/api/src/middleware/auth.ts` | JWT authentication |
| `.env.example` | Environment variables template |
| `docker-compose.yml` | Development services (Postgres, Redis) |
| `package.json` | Root workspace config + scripts |
| `turbo.json` | Monorepo build pipeline |

---

## 🚨 Common Pitfalls to Avoid

1. **Database queries in controllers** → Use service layer instead
2. **Unvalidated user input** → Always use Zod validators
3. **Hardcoded secrets** → Use .env variables
4. **Missing error handling** → Use AppError + error middleware
5. **No TypeScript types** → Use strict: true, no implicit any
6. **Direct JWT tokens** → Never log or expose tokens
7. **Inefficient queries** → Use Prisma `select` to only fetch needed fields
8. **CORS misconfiguration** → Whitelist specific origins in production

---

## 🔒 Security Checklist

- [ ] Input validation (Zod + Express-validator)
- [ ] SQL injection prevention (Prisma ORM handles this)
- [ ] XSS prevention (Sanitize output, use CSP headers)
- [ ] CSRF protection (SameSite cookies)
- [ ] Rate limiting (express-rate-limit)
- [ ] Password hashing (bcrypt, never plaintext)
- [ ] JWT expiration (short-lived tokens)
- [ ] HTTPS in production (redirect HTTP)
- [ ] Helmet.js security headers
- [ ] Secret rotation for JWT/API keys

---

## 📚 External Integration Points

| Service | Purpose | Config |
|---------|---------|--------|
| PostgreSQL | Primary database | `DATABASE_URL` env var |
| Redis | Caching & sessions | `REDIS_URL` env var |
| S3/MinIO | Photo storage | `AWS_*` env vars |
| SendGrid/NodeMailer | Email notifications | `SENDGRID_API_KEY` env var |
| Socket.io | Real-time chat | Handled in `index.ts` |
| YOLOv8/Custom CNN | Object recognition | Python service in `services/ml` |

---

## 🎯 Quick Links

- **Full Technical Spec**: `fetisch-dating-platform-technical-spec.md`
- **Quick Start**: `QUICKSTART.md`
- **API Docs**: `docs/api/`
- **Architecture Diagrams**: `docs/architecture/`
- **Development Guides**: `docs/development/`

---

## 🤝 Getting Help

- Check `docs/development/FAQ.md` for common questions
- Review `PROJECT-STATUS.md` for implementation progress
- Examine test files for usage examples: `apps/api/src/__tests__/`

---

**Last Updated**: 2025-10-24  
**Version**: 1.0.0
