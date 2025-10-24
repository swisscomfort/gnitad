# Contributing to Fetisch-Dating-Platform

Vielen Dank, dass du zu unserem Projekt beitragen möchtest! Dieses Dokument enthält Richtlinien und Anweisungen für Mitwirkende.

## 🚀 Code of Conduct

Dieses Projekt befolgt einen Code of Conduct. Durch deine Teilnahme erkennst du an, dass du dich an die folgenden Grundsätze hältst:

- **Respekt**: Behandle alle Mitglieder mit Respekt und Würde
- **Inklusion**: Alle sind willkommen, unabhängig von Hintergrund oder Erfahrung
- **Konstruktiv**: Feedback sollte hilfreich und aufbauend sein
- **Diskret**: Respektiere die Privatsphäre aller Beteiligten

## 📋 Wie du beitragen kannst

### Bug-Reports
1. Überprüfe zuerst die [Issues](../../issues), ob der Bug bereits gemeldet wurde
2. Erstelle eine neue Issue mit:
   - Klarer Titel
   - Detaillierte Beschreibung
   - Schritte zum Reproduzieren
   - Erwartetes vs. aktuelles Verhalten
   - System-Informationen (OS, Node-Version, etc.)

### Feature-Requests
1. Diskutiere das Feature zuerst in den [Discussions](../../discussions)
2. Erstelle eine Feature-Request Issue mit:
   - Motivation (Warum ist das Feature nötig?)
   - Erwartetes Verhalten
   - Mögliche Implementierung

### Pull Requests

#### Vorbereitung
```bash
# 1. Forke das Repository
git clone https://github.com/dein-username/fetisch-dating-platform.git
cd fetisch-dating-platform

# 2. Erstelle einen Feature-Branch
git checkout -b feature/deine-feature

# 3. Installiere Dependencies
npm install

# 4. Starte Development-Server
npm run dev
```

#### Entwicklung
- Folge dem Code-Style des Projekts (ESLint + Prettier)
- Schreibe Tests für neue Features
- Aktualisiere die Dokumentation
- Committe mit aussagekräftigen Messages

```bash
# Format und Lint vor dem Commit
npm run format
npm run lint

# Tests ausführen
npm run test
```

#### PR-Submission
1. Pushe deinen Branch: `git push origin feature/deine-feature`
2. Erstelle einen Pull Request mit:
   - Klarer Titel und Beschreibung
   - Referenz zu verwandten Issues
   - Screenshot/Video für UI-Änderungen
   - Checkliste (siehe unten)

#### PR-Checkliste
- [ ] Tests hinzugefügt/aktualisiert
- [ ] Dokumentation aktualisiert
- [ ] Code formatiert (`npm run format`)
- [ ] Linting erfolgreich (`npm run lint`)
- [ ] Keine Breaking Changes (oder dokumentiert)
- [ ] Commit-Messages aussagekräftig

## 🏗️ Development Setup

```bash
# 1. Dependencies
npm install

# 2. Environment-Variables
cp .env.example .env
# .env bearbeiten mit deinen Werten

# 3. Docker-Services starten
docker-compose up -d postgres redis

# 4. Database migrieren
npm run db:migrate

# 5. Development Server
npm run dev
```

## 📚 Code-Konventionen

### Dateistruktur
```
apps/api/src/
├── controllers/      # Request-Handler
├── services/        # Business-Logic
├── middleware/      # Express-Middleware
├── utils/          # Hilfsfunktionen
├── validators/     # Input-Validation
└── types/          # TypeScript-Types
```

### Naming-Conventions
- **Dateien**: camelCase oder kebab-case
- **Funktionen**: camelCase
- **Klassen/Types**: PascalCase
- **Konstanten**: UPPER_SNAKE_CASE

### TypeScript-Regeln
- Verwende `strict: true` in tsconfig.json
- Keine impliziten `any`-Types
- Nutze Zod für Runtime-Validation

### Dokumentation
```typescript
/**
 * Beschreibung der Funktion
 * @param param1 Beschreibung
 * @returns Was wird zurückgegeben
 * @throws Mögliche Fehler
 */
function myFunction(param1: string): Promise<void> {
  // Implementation
}
```

## 🔒 Security Guidelines

- **Keine Secrets**: Committe niemals `.env` oder Secrets
- **Validierung**: Validiere IMMER User-Input
- **Dependencies**: Verwende `npm audit` regelmäßig
- **Encryption**: Sensible Daten verschlüsseln
- **HTTPS**: Verwende HTTPS in Production

## 📊 Commit-Messages

Verwende das Conventional-Commits-Format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: Neue Feature
- **fix**: Bug-Fix
- **docs**: Dokumentation
- **style**: Code-Style (kein functional change)
- **refactor**: Code-Umstrukturierung
- **test**: Tests hinzufügen
- **chore**: Dependencies, Config, etc.

### Beispiele
```
feat(auth): add JWT token refresh mechanism
fix(matching): correct algorithm scoring calculation
docs(api): add authentication endpoints documentation
```

## 🧪 Testing

```bash
# Unit-Tests
npm run test

# Integration-Tests
npm run test:integration

# E2E-Tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📖 Dokumentation

- API-Docs: `docs/api/`
- Architecture: `docs/architecture/`
- Development: `docs/development/`

Bei neuen Features bitte entsprechende Dokumentation hinzufügen!

## 🎯 Release-Prozess

1. Version-Bump (npm version)
2. CHANGELOG aktualisieren
3. Git-Tag erstellen
4. GitHub Release erstellen

## ❓ Questions?

- Erstelle eine [Discussion](../../discussions)
- Kontaktiere die Maintainer
- Siehe [FAQ](docs/development/FAQ.md)

---

**Vielen Dank für deinen Beitrag!** 🙏

