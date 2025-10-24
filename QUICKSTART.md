# 🚀 Quick Start Guide

## Option 1: Automatisches Setup (Empfohlen)

```bash
# 1. Setup-Script ausführen
chmod +x setup.sh
./setup.sh

# 2. Development Server starten
npm run dev
```

Das war's! Die App läuft jetzt auf:
- API: http://localhost:3000
- Web: http://localhost:3001

---

## Option 2: Manuelles Setup

### 1. Prerequisites installieren

**Benötigt:**
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15+ (oder via Docker)
- Redis 7+ (oder via Docker)

### 2. Dependencies installieren

```bash
npm install
```

### 3. Environment Variables

```bash
# .env.example kopieren
cp .env.example .env

# .env bearbeiten und Werte eintragen
nano .env  # oder mit deinem Editor
```

**Wichtige Variablen:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fetisch_dating"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="dein-super-geheimer-key"
```

### 4. Docker Services starten

```bash
# Nur Datenbank-Services (empfohlen für Development)
docker-compose up -d postgres redis

# ODER alles (API + Web + ML + Datenbanken)
docker-compose up -d
```

### 5. Database Setup

```bash
# Migrations ausführen
npm run db:migrate

# Beispieldaten einfügen (optional)
npm run db:seed
```

### 6. Development Server starten

```bash
# Alles zusammen
npm run dev

# ODER einzeln:
npm run dev:api    # nur API
npm run dev:web    # nur Web
npm run dev:ml     # nur ML Services
```

---

## Verfügbare Services

Nach dem Start erreichst du:

| Service | URL | Beschreibung |
|---------|-----|--------------|
| **API** | http://localhost:3000 | Backend REST API |
| **Web** | http://localhost:3001 | Web Frontend |
| **ML Services** | http://localhost:8000 | Python ML Microservices |
| **Database UI** | http://localhost:8080 | Adminer (PostgreSQL GUI) |
| **Redis UI** | http://localhost:8081 | Redis Commander |

### Health Check
```bash
curl http://localhost:3000/health
```

---

## Nützliche Commands

### Development
```bash
npm run dev              # Alle Services
npm run dev:api          # Nur API
npm run dev:web          # Nur Web
npm run dev:mobile       # Mobile App (React Native)
```

### Database
```bash
npm run db:migrate       # Migrations ausführen
npm run db:rollback      # Letzte Migration rückgängig
npm run db:seed          # Daten einfügen
npm run db:reset         # Alles zurücksetzen + neu aufbauen
```

### Testing
```bash
npm run test             # Alle Tests
npm run test:unit        # Unit Tests
npm run test:integration # Integration Tests
npm run test:e2e         # End-to-End Tests
```

### Docker
```bash
npm run docker:up        # Docker starten
npm run docker:down      # Docker stoppen
npm run docker:logs      # Logs anzeigen
npm run docker:build     # Images neu bauen
```

### Code Quality
```bash
npm run lint             # ESLint
npm run format           # Prettier
npm run typecheck        # TypeScript Check
```

---

## VSCode Setup

### 1. Workspace öffnen

```bash
# Option A: Workspace-File öffnen (Empfohlen)
code fetisch-dating-platform.code-workspace

# Option B: Ordner öffnen
code .
```

### 2. Extensions installieren

VSCode fragt automatisch, ob du die empfohlenen Extensions installieren willst.

**Wichtige Extensions:**
- ESLint
- Prettier
- TypeScript
- Docker
- Python

### 3. Debug Configurations

Im Workspace sind bereits Debug-Configs enthalten:
- `🔌 Debug API` - API Server debuggen
- `🌐 Debug Web` - Web App debuggen
- `🤖 Debug ML Service` - ML Service debuggen
- `🚀 Full Stack` - Alles zusammen

**Debuggen:**
1. Drücke `F5`
2. Wähle Configuration
3. Setze Breakpoints
4. Debug!

---

## Troubleshooting

### Port bereits belegt
```bash
# Ports finden und freigeben
lsof -i :3000  # API Port
lsof -i :3001  # Web Port
lsof -i :5432  # PostgreSQL Port
lsof -i :6379  # Redis Port

# Process killen
kill -9 <PID>
```

### Docker-Probleme
```bash
# Services neu starten
docker-compose down
docker-compose up -d

# Volumes löschen (VORSICHT: Alle Daten weg!)
docker-compose down -v

# Logs ansehen
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Database Connection Fehler
```bash
# 1. Prüfen ob PostgreSQL läuft
docker-compose ps

# 2. Connection testen
docker-compose exec postgres psql -U postgres -d fetisch_dating

# 3. DATABASE_URL in .env prüfen
cat .env | grep DATABASE_URL
```

### Dependencies-Probleme
```bash
# Node modules neu installieren
rm -rf node_modules package-lock.json
npm install

# Cache leeren
npm cache clean --force
```

---

## Projekt-Struktur

```
fetisch-dating-platform/
├── apps/
│   ├── api/              # Backend API (Express/Node.js)
│   ├── web/              # Web Frontend (Next.js)
│   └── mobile/           # Mobile App (React Native)
├── packages/
│   ├── shared/           # Shared Code
│   ├── database/         # Database Schema
│   └── config/           # Shared Config
├── services/
│   └── ml/               # ML Services (Python)
├── data/
│   ├── taxonomy/         # Fetisch-Taxonomie
│   ├── archetypes/       # Character Archetypes
│   └── migrations/       # SQL Migrations
├── docker/
│   ├── api/              # API Dockerfile
│   ├── web/              # Web Dockerfile
│   └── ml/               # ML Dockerfile
├── scripts/
│   ├── seed/             # Database Seeding
│   └── setup/            # Setup Scripts
└── docs/                 # Dokumentation
```

---

## Next Steps

1. **Backend weiterentwickeln:**
   - Controllers implementieren (User, Photo, Match, Chat)
   - Services erstellen (Matching-Algorithmus, File-Upload)
   - Database-Queries schreiben

2. **Frontend erstellen:**
   - Web-App (Next.js) aufsetzen
   - Mobile-App (React Native) starten
   - UI-Components bauen

3. **ML-Services:**
   - Character Generator trainieren
   - Object Recognition implementieren
   - Matching-Engine optimieren

4. **Testing:**
   - Unit Tests schreiben
   - Integration Tests
   - E2E Tests

5. **Deployment:**
   - Docker Images bauen
   - CI/CD Pipeline (GitHub Actions)
   - Production Deployment (AWS/Hetzner)

---

## Support & Documentation

- 📚 **Full Documentation:** `./docs/`
- 🔌 **API Docs:** `./docs/api/`
- 🏗️ **Architecture:** `./docs/architecture/`
- 💡 **Development Guide:** `./docs/development/`

---

**Happy Coding! 🚀**
