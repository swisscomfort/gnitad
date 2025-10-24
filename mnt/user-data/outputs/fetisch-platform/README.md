# Fetisch Dating Platform

Eine diskrete Dating-Plattform mit KI-gestütztem Charakter-Generator, objekt-basiertem Matching und 5.000+ spezifischen Fetisch-Tags.

## 📋 Inhaltsverzeichnis

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Projektstruktur](#projektstruktur)
- [Voraussetzungen](#voraussetzungen)
- [Installation](#installation)
- [Development Setup](#development-setup)
- [Verfügbare Scripts](#verfügbare-scripts)
- [API Dokumentation](#api-dokumentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🚀 Features

- **Objekt-basierte Profile**: Nutzer laden Fotos von Objekten statt Gesichtern
- **KI-Charakter-Generator**: Automatische Persönlichkeits-Profile aus 200+ Mikro-Entscheidungen
- **5.000+ Fetisch-Tags**: Hyper-granulare Taxonomie für präzises Matching
- **Multi-dimensionales Matching**: Berücksichtigt Fetische, Persönlichkeit, Lifestyle, Werte
- **Progressiver Filter-Funnel**: Smart-Filter-Vorschläge reduzieren Trefferliste intelligent
- **Privacy-First**: Gestufte Offenlegung mit benutzergesteuertem Reveal
- **Real-time Chat**: WebSocket-basierte Messaging-Funktion
- **DSGVO-konform**: Volle Kontrolle über persönliche Daten

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL 15 (mit PostGIS Extensions)
- **ORM**: Prisma
- **Cache**: Redis 7
- **Storage**: MinIO (dev) / AWS S3 (prod)
- **Real-time**: Socket.io
- **Authentication**: JWT + bcrypt

### Frontend (geplant)
- **Mobile**: React Native
- **Web**: Next.js 14
- **State**: Zustand
- **UI**: Tailwind CSS

### AI/ML (geplant)
- **Framework**: PyTorch
- **Object Recognition**: YOLOv8 / Custom CNN
- **Character Generation**: Scikit-learn + Custom Logic

### DevOps
- **Container**: Docker + Docker Compose
- **CI/CD**: GitHub Actions (geplant)
- **Monitoring**: Winston Logger

## 📁 Projektstruktur

```
fetisch-dating-platform/
├── apps/
│   ├── api/                    # Backend API (Express + Prisma)
│   │   ├── src/
│   │   │   ├── controllers/    # Route Controller
│   │   │   ├── routes/         # API Routes
│   │   │   ├── middleware/     # Custom Middleware
│   │   │   ├── services/       # Business Logic
│   │   │   ├── utils/          # Helper Functions
│   │   │   ├── validators/     # Request Validation
│   │   │   ├── data/           # Seed Data (Taxonomy)
│   │   │   └── index.ts        # Entry Point
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Database Schema
│   │   │   ├── init.sql        # PostgreSQL Extensions
│   │   │   └── seed.ts         # Database Seeding
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── web/                    # Next.js Web App (TO DO)
│   └── mobile/                 # React Native App (TO DO)
├── packages/
│   ├── shared/                 # Shared Types & Utils (TO DO)
│   └── ui/                     # Shared UI Components (TO DO)
├── services/
│   ├── ml/                     # ML Services (Python) (TO DO)
│   └── matching/               # Matching Algorithm (TO DO)
├── data/
│   └── taxonomy/               # Full Taxonomy Data (TO DO)
├── docker-compose.yml          # Local Development Services
├── .env.example                # Environment Variables Template
├── turbo.json                  # Monorepo Build Config
├── package.json                # Root Package (Workspaces)
└── README.md                   # This file
```

## ✅ Voraussetzungen

Stelle sicher, dass du folgendes installiert hast:

- **Node.js**: 20.x oder höher ([Download](https://nodejs.org/))
- **npm**: 10.x oder höher (kommt mit Node.js)
- **Docker**: 24.x oder höher ([Download](https://www.docker.com/))
- **Docker Compose**: 2.x oder höher (kommt mit Docker Desktop)
- **Git**: Für Version Control

### Prüfen der Installation:

```bash
node --version    # sollte v20.x.x oder höher sein
npm --version     # sollte 10.x.x oder höher sein
docker --version  # sollte 24.x.x oder höher sein
docker compose version  # sollte 2.x.x oder höher sein
```

## 📦 Installation

### 1. Repository Clonen oder Projektordner erstellen

```bash
# Option A: Falls du ein Git Repo hast
git clone https://github.com/your-username/fetisch-dating-platform.git
cd fetisch-dating-platform

# Option B: Lokalen Ordner verwenden
# Kopiere alle Dateien in deinen Projektordner
cd /path/to/fetisch-dating-platform
```

### 2. Dependencies Installieren

```bash
# Im Root-Verzeichnis (installiert alle Workspaces)
npm install

# Falls Fehler auftreten, versuche:
npm install --legacy-peer-deps
```

### 3. Environment Variables Setup

```bash
# Kopiere .env.example zu .env
cp .env.example .env

# Optional: Passe Werte in .env an (für Development meist nicht nötig)
# Die Standard-Werte funktionieren mit Docker Compose
```

### 4. Docker Services Starten

```bash
# Startet PostgreSQL, Redis, MinIO und Mailhog
docker compose up -d

# Prüfe, ob alle Services laufen:
docker compose ps

# Expected Output:
# NAME                          STATUS
# fetisch-platform-db           Up (healthy)
# fetisch-platform-redis        Up (healthy)
# fetisch-platform-storage      Up (healthy)
# fetisch-platform-mail         Up
```

### 5. Datenbank Setup

```bash
# Warte 5-10 Sekunden, bis PostgreSQL bereit ist, dann:

# Prisma Client generieren
cd apps/api
npm run db:generate

# Datenbank migrieren (erstellt Tabellen)
npm run db:migrate

# Datenbank mit Beispieldaten befüllen (optional)
npm run db:seed

# Zurück zum Root
cd ../..
```

## 🏃 Development Setup

### Alle Services Starten

```bash
# Im Root-Verzeichnis
npm run dev
```

Dies startet:
- **API Server**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### Einzelne Services Starten

```bash
# Nur API
cd apps/api
npm run dev

# Nur Web (noch nicht implementiert)
cd apps/web
npm run dev

# Nur Mobile (noch nicht implementiert)
cd apps/mobile
npm start
```

### Development Tools & UIs

- **API**: http://localhost:3001
- **Prisma Studio** (Datenbank-GUI): 
  ```bash
  cd apps/api
  npm run db:studio
  # Öffnet automatisch: http://localhost:5555
  ```
- **MinIO Console** (File Storage UI): http://localhost:9001
  - Username: `minio_dev`
  - Password: `minio_dev_password`
- **Mailhog** (Email Testing UI): http://localhost:8025
- **PostgreSQL**: localhost:5432
  - DB: `fetisch_platform`
  - User: `fetisch_dev`
  - Password: `dev_password_change_in_production`
- **Redis**: localhost:6379

## 📝 Verfügbare Scripts

### Root-Level Scripts

```bash
# Development
npm run dev          # Startet alle Apps im Dev-Modus
npm run build        # Baut alle Apps für Production
npm run test         # Führt alle Tests aus
npm run lint         # Linted alle Packages
npm run format       # Formatiert Code mit Prettier

# Docker
npm run docker:up    # Startet Docker Services
npm run docker:down  # Stoppt Docker Services
npm run docker:logs  # Zeigt Docker Logs

# Database (Shortcuts)
npm run db:setup     # Komplett-Setup (Docker + Migrate + Seed)
npm run db:migrate   # Nur Migrationen ausführen
npm run db:seed      # Nur Seed-Daten einfügen
```

### API-spezifische Scripts

```bash
cd apps/api

# Development
npm run dev          # Startet API mit Hot-Reload

# Build
npm run build        # Kompiliert TypeScript
npm start            # Startet gebaute Version

# Database
npm run db:migrate       # Prisma Migrate (Dev)
npm run db:migrate:prod  # Prisma Migrate (Production)
npm run db:seed          # Seed Datenbank
npm run db:studio        # Öffnet Prisma Studio
npm run db:generate      # Generiert Prisma Client

# Testing & Linting
npm test             # Jest Tests
npm run lint         # ESLint
```

## 🔌 API Dokumentation

### Base URL (Development)
```
http://localhost:3001/api/v1
```

### Endpoints (Aktuell verfügbar)

#### Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-24T10:00:00.000Z",
  "uptime": 123.456
}
```

#### Authentication

```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/verify
```

#### Users (Placeholder)
```
GET /api/v1/users
```

#### Matches (Placeholder)
```
GET /api/v1/matches
```

#### Photos (Placeholder)
```
GET /api/v1/photos
```

#### Chat (Placeholder)
```
GET /api/v1/chat
```

### Vollständige API-Dokumentation

Siehe `fetisch-dating-platform-technical-spec.md` für:
- Alle geplanten Endpoints
- Request/Response-Schemas
- Authentication Flow
- Error Handling

## 🚀 Deployment

### Production Build

```bash
# Build All
npm run build

# Build nur API
cd apps/api
npm run build

# Gebaut Version starten
npm start
```

### Environment Variables (Production)

Für Production musst du folgende ENV-Variablen setzen:

```bash
# Database (verwende echte PostgreSQL-Instanz)
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Storage (AWS S3)
STORAGE_ENDPOINT="https://s3.amazonaws.com"
STORAGE_ACCESS_KEY="your-aws-access-key"
STORAGE_SECRET_KEY="your-aws-secret-key"
STORAGE_BUCKET="your-bucket-name"
STORAGE_REGION="eu-central-1"

# JWT
JWT_SECRET="your-super-secure-secret-min-32-chars"

# Email (echter SMTP)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
EMAIL_FROM="noreply@yourdomain.com"

# API
NODE_ENV="production"
API_PORT=3001
```

### Docker Production Build (Noch nicht implementiert)

```bash
# Build Production Image
docker build -t fetisch-platform-api:latest -f apps/api/Dockerfile .

# Run
docker run -p 3001:3001 \
  -e DATABASE_URL="..." \
  -e JWT_SECRET="..." \
  fetisch-platform-api:latest
```

## 🐛 Troubleshooting

### Problem: `docker compose up` schlägt fehl

**Lösung:**
```bash
# Alte Container entfernen
docker compose down -v

# Neu starten
docker compose up -d

# Logs prüfen
docker compose logs
```

### Problem: Port 5432 bereits belegt (PostgreSQL)

**Lösung A** (PostgreSQL stoppen):
```bash
# macOS
brew services stop postgresql

# Linux
sudo systemctl stop postgresql

# Windows
net stop postgresql-x64-14
```

**Lösung B** (Port in docker-compose.yml ändern):
```yaml
services:
  postgres:
    ports:
      - "5433:5432"  # Ändere 5432 → 5433
```
Dann in `.env`: `DATABASE_URL` Port auf 5433 ändern.

### Problem: `npm install` schlägt fehl

**Lösung:**
```bash
# Node Modules löschen
rm -rf node_modules apps/*/node_modules

# Cache leeren
npm cache clean --force

# Neu installieren
npm install --legacy-peer-deps
```

### Problem: Prisma Migrate schlägt fehl

**Lösung:**
```bash
# Datenbank zurücksetzen (ACHTUNG: Löscht alle Daten!)
cd apps/api
npx prisma migrate reset

# Oder manuell in Docker:
docker compose down postgres
docker volume rm fetisch-platform_postgres_data
docker compose up -d postgres

# Warte 10 Sekunden, dann:
npm run db:migrate
```

### Problem: TypeScript-Fehler "Cannot find module"

**Lösung:**
```bash
# Prisma Client neu generieren
cd apps/api
npm run db:generate

# TypeScript neu kompilieren
npm run build
```

### Problem: API startet nicht (EADDRINUSE)

**Lösung:**
```bash
# Port 3001 freigeben (macOS/Linux)
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Problem: MinIO "Access Denied"

**Lösung:**
```bash
# Erstelle Bucket manuell in MinIO Console
# 1. Öffne http://localhost:9001
# 2. Login: minio_dev / minio_dev_password
# 3. Erstelle Bucket: "fetisch-platform"
# 4. Setze Policy: "public" (für Dev)
```

## 📚 Weitere Ressourcen

- **Technical Spec**: Siehe `fetisch-dating-platform-technical-spec.md`
- **Prisma Docs**: https://www.prisma.io/docs
- **Express Docs**: https://expressjs.com
- **Socket.io Docs**: https://socket.io/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs

## 🤝 Development Workflow

### 1. Feature Branch erstellen
```bash
git checkout -b feature/your-feature-name
```

### 2. Code schreiben & testen
```bash
npm run dev     # Development Server
npm run lint    # Linting
npm test        # Tests
```

### 3. Commit & Push
```bash
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

### 4. Pull Request erstellen (GitHub)

## 📋 Nächste Schritte

### Sofort implementierbar:

1. **Authentication vollständig implementieren**
   - User Registration mit bcrypt
   - JWT Token Generation
   - Login/Logout Logic
   - Auth Middleware

2. **User Profile CRUD**
   - GET /users/:id
   - PUT /users/:id
   - Photo Upload (mit MinIO)
   - Tag Selection

3. **Matching Basic**
   - Einfacher Matching-Algorithmus
   - Swipe-Interface Backend
   - Match Creation

4. **Chat Basic**
   - WebSocket Integration
   - Message Storage (verschlüsselt)
   - Real-time Updates

### Mittelfristig:

5. **Frontend Web-App** (Next.js)
6. **Frontend Mobile-App** (React Native)
7. **ML Object Recognition**
8. **Character Generator AI**
9. **Advanced Matching Algorithm**
10. **Smart Filter System**

## 📄 License

MIT License (oder deine gewünschte Lizenz)

## 👥 Contributors

- Dein Name

---

**Status**: 🟡 In Development - MVP Phase

**Version**: 1.0.0 (Setup complete, core features in progress)

---

## 🎯 Quick Start Zusammenfassung

```bash
# 1. Dependencies installieren
npm install

# 2. Docker Services starten
docker compose up -d

# 3. Datenbank einrichten
cd apps/api
npm run db:generate
npm run db:migrate
cd ../..

# 4. API starten
npm run dev

# 5. Testen
curl http://localhost:3001/health
```

**Fertig! 🎉** Die API läuft auf http://localhost:3001

Bei Fragen oder Problemen, siehe [Troubleshooting](#troubleshooting) oder erstelle ein Issue.
