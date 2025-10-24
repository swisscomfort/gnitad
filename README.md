# Fetisch-Dating-Platform

Eine diskrete Fetisch-Dating-Plattform mit KI-gestütztem Charakter-Generator und Objekt-basiertem Matching.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Python 3.11+ (für ML-Services)

### Installation

```bash
# 1. Dependencies installieren
npm install

# 2. Environment Variables kopieren
cp .env.example .env
# Dann .env bearbeiten und deine Werte eintragen

# 3. Database Setup
npm run db:setup
npm run db:migrate
npm run db:seed

# 4. Development Server starten
npm run dev

# 5. ML Services starten (separates Terminal)
cd services/ml
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Mit Docker (einfacher)

```bash
# Alles auf einmal starten
docker-compose up -d

# Logs ansehen
docker-compose logs -f

# Stoppen
docker-compose down
```

## 📁 Projekt-Struktur

```
fetisch-dating-platform/
├── apps/
│   ├── api/              # Backend API (Node.js/Express)
│   ├── web/              # Web App (Next.js)
│   └── mobile/           # Mobile App (React Native)
├── packages/
│   ├── shared/           # Shared types & utils
│   ├── database/         # Database schema & migrations
│   └── config/           # Shared configuration
├── services/
│   ├── ml/               # ML Services (Python)
│   │   ├── character_generator/
│   │   ├── object_recognition/
│   │   └── matching_engine/
│   └── moderation/       # Content moderation
├── data/
│   ├── taxonomy/         # Fetisch-Taxonomie (5000+ Tags)
│   ├── archetypes/       # Character Archetypes
│   └── migrations/       # SQL Migrations
├── docs/
│   ├── api/              # API Dokumentation
│   ├── architecture/     # Architektur-Diagramme
│   └── development/      # Development Guides
├── scripts/
│   ├── seed/             # Database Seeding
│   └── setup/            # Setup Scripts
└── docker/
    ├── api/
    ├── web/
    └── ml/
```

## 🛠️ Development

### API Server
```bash
cd apps/api
npm run dev
# Läuft auf http://localhost:3000
```

### Web App
```bash
cd apps/web
npm run dev
# Läuft auf http://localhost:3001
```

### Mobile App
```bash
cd apps/mobile
npm start
# Für iOS: npm run ios
# Für Android: npm run android
```

### ML Services
```bash
cd services/ml
source venv/bin/activate
python main.py
# Läuft auf http://localhost:8000
```

## 🗄️ Database

### Migrations
```bash
npm run db:migrate        # Alle pending migrations
npm run db:rollback       # Letzte migration rückgängig
npm run db:reset          # Alles zurücksetzen und neu aufbauen
```

### Seeding
```bash
npm run db:seed           # Alle seeds
npm run db:seed:taxonomy  # Nur Taxonomie
npm run db:seed:users     # Test-User
```

## 🧪 Testing

```bash
npm run test              # Alle Tests
npm run test:unit         # Unit Tests
npm run test:integration  # Integration Tests
npm run test:e2e          # End-to-End Tests
```

## 📚 Dokumentation

- [API Dokumentation](./docs/api/README.md)
- [Architektur](./docs/architecture/README.md)
- [Development Guide](./docs/development/README.md)
- [Deployment Guide](./docs/deployment/README.md)

## 🔒 Security

- Alle Passwörter werden mit bcrypt gehasht
- Messages sind end-to-end verschlüsselt
- Fotos sind at-rest verschlüsselt (AES-256)
- GDPR-compliant

## 📝 License

Proprietary - All rights reserved

## 👥 Team

- Backend: [Name]
- Frontend: [Name]
- ML: [Name]
- Product: [Name]
