# Fetisch-Dating-Platform

> Eine diskrete, KI-gestützte Dating-Plattform für die Fetisch-Community

[![CI/CD](https://github.com/swisscomfort/gnitad/actions/workflows/test-and-build.yml/badge.svg)](https://github.com/swisscomfort/gnitad/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Documentation](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://swisscomfort.github.io/gnitad/)

## ✨ Features

- 🔒 **Diskrete Profile** - Objekt-Fotos statt Gesichter (Windel, Seil, Latex-Handschuh, etc.)
- 🤖 **KI-Powered Matching** - Character Generator aus 200+ Micro-Decisions
- 🏷️ **5000+ Fetisch-Tags** - Ultra-genaues Matching basierend auf Präferenzen
- 💬 **Encrypted Messaging** - End-to-end verschlüsselte Real-time Chat
- 📱 **Multi-Plattform** - Web (Next.js), Mobile (React Native), ML Services (Flask)
- 🔐 **Privacy-First** - Gestaffelte Offenlegung, Email-Hashing, GDPR-konform

---

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
├── .github/
│   ├── workflows/        # GitHub Actions CI/CD
│   ├── ISSUE_TEMPLATE/
│   └── copilot-instructions.md
├── apps/
│   ├── api/              # Backend API (Node.js/Express)
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   └── services/
│   ├── web/              # Web App (Next.js)
│   │   ├── app/
│   │   ├── store/
│   │   └── lib/
│   └── mobile/           # Mobile App (React Native)
│       ├── store/
│       └── lib/
├── services/
│   └── ml/               # ML Services (Python)
│       ├── character_generator.py
│       ├── object_recognition.py
│       └── main.py
├── data/
│   └── taxonomy/         # Fetisch-Taxonomie (50+ Tags)
│       └── taxonomy.json
├── docs/
│   ├── api/              # API Dokumentation
│   │   └── endpoints.md
│   ├── deployment/       # Deployment Guides
│   │   └── production-guide.md
│   └── index.md          # GitHub Pages Homepage
├── scripts/
│   ├── seed/             # Database Seeding
│   └── setup/            # Setup Scripts
├── docker-compose.yml
├── schema.prisma
├── package.json
├── turbo.json
└── README.md
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

- [API Dokumentation](./docs/api/endpoints.md)
- [Quick Start Guide](./QUICKSTART.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Deployment Guide](./docs/deployment/production-guide.md)
- [GitHub Pages Dokumentation](https://swisscomfort.github.io/gnitad/)

## 🔒 Security

- Alle Passwörter werden mit bcrypt gehasht
- Messages sind end-to-end verschlüsselt
- Fotos sind at-rest verschlüsselt (AES-256)
- GDPR-compliant
- JWT Authentication mit 7-Tage Tokens
- Rate Limiting & CSRF Protection

## 🤝 Contributing

Contributions sind willkommen! Siehe [CONTRIBUTING.md](./CONTRIBUTING.md) für Guidelines.

## � License

MIT License - siehe [LICENSE](./LICENSE) für Details

## 🔗 Links

- **Repository**: https://github.com/swisscomfort/gnitad
- **Dokumentation**: https://swisscomfort.github.io/gnitad/
- **Issues**: https://github.com/swisscomfort/gnitad/issues
- **Discussions**: https://github.com/swisscomfort/gnitad/discussions
