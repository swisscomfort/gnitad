# 🚀 VS Code Quick Start Guide

## Schritt-für-Schritt Anleitung zum Starten des Projekts

### 1. VS Code öffnen

**Option A: Via Terminal**
```bash
cd /pfad/zu/fetisch-platform
code .
```

**Option B: Via VS Code**
- VS Code öffnen
- `File` → `Open Folder`
- Ordner `fetisch-platform` auswählen

**Option C: Workspace öffnen (empfohlen)**
- VS Code öffnen
- `File` → `Open Workspace from File`
- Datei `fetisch-platform.code-workspace` auswählen

---

### 2. Empfohlene VS Code Extensions installieren

VS Code sollte automatisch fragen, ob du die empfohlenen Extensions installieren möchtest.

**Falls nicht, manuell installieren:**

1. Öffne Extensions-Panel (`Cmd/Ctrl + Shift + X`)
2. Installiere:
   - **ESLint** (dbaeumer.vscode-eslint)
   - **Prettier** (esbenp.prettier-vscode)
   - **Prisma** (Prisma.prisma)
   - **Code Spell Checker** (streetsidesoftware.code-spell-checker)

**Schnell-Install via Terminal:**
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension Prisma.prisma
code --install-extension streetsidesoftware.code-spell-checker
```

---

### 3. Integriertes Terminal öffnen

- **Tastenkürzel**: `` Ctrl + ` `` (Backtick)
- **Oder**: `View` → `Terminal`

---

### 4. Projekt Setup (Im Terminal)

```bash
# Dependencies installieren
npm install

# .env Datei erstellen
cp .env.example .env

# Docker Services starten
docker compose up -d

# Warte 10 Sekunden, dann:
cd apps/api
npm run db:generate
npm run db:migrate
cd ../..

# API starten
npm run dev
```

---

### 5. Projekt läuft! ✅

**Prüfe folgende URLs:**

- ✅ **API Health Check**: http://localhost:3001/health
- ✅ **Prisma Studio**: 
  ```bash
  cd apps/api
  npm run db:studio
  ```
  → Öffnet: http://localhost:5555
- ✅ **MinIO Console**: http://localhost:9001
- ✅ **Mailhog**: http://localhost:8025

---

## 📂 Wichtige Dateien in VS Code

### Haupt-Dateien zum Starten:

1. **`README.md`** ← **START HIER!** Vollständige Dokumentation
2. **`apps/api/src/index.ts`** ← API Entry Point
3. **`apps/api/prisma/schema.prisma`** ← Datenbank-Schema
4. **`.env`** ← Environment Variables (erstellt aus .env.example)
5. **`docker-compose.yml`** ← Docker Services Config

### Ordner-Struktur verstehen:

```
📁 fetisch-platform/
│
├── 📁 apps/api/              ← Backend API (hier arbeiten!)
│   ├── 📁 src/
│   │   ├── 📄 index.ts       ← Server Entry Point
│   │   ├── 📁 routes/        ← API Endpoints
│   │   ├── 📁 controllers/   ← Business Logic
│   │   ├── 📁 middleware/    ← Custom Middleware
│   │   └── 📁 data/          ← Seed Data (Taxonomie)
│   ├── 📁 prisma/
│   │   └── 📄 schema.prisma  ← Datenbank-Schema
│   └── 📄 package.json
│
├── 📄 docker-compose.yml     ← Docker Services (Postgres, Redis, MinIO)
├── 📄 .env                   ← Deine ENV-Variablen (nicht committen!)
├── 📄 README.md              ← Vollständige Doku
└── 📄 package.json           ← Root Package (Monorepo)
```

---

## 🔧 Nützliche VS Code Features

### 1. Multi-Root Workspace

Das Projekt nutzt VS Code Workspaces. Öffne `fetisch-platform.code-workspace` für optimales Setup.

### 2. Debugging Setup

**Erstelle `.vscode/launch.json`:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug API",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/apps/api/src/index.ts",
      "runtimeArgs": ["--loader", "tsx"],
      "cwd": "${workspaceFolder}/apps/api",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

**Dann**: `F5` drücken zum Debuggen!

### 3. Tasks Setup

**Erstelle `.vscode/tasks.json`:**
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Docker",
      "type": "shell",
      "command": "docker compose up -d",
      "problemMatcher": []
    },
    {
      "label": "Stop Docker",
      "type": "shell",
      "command": "docker compose down",
      "problemMatcher": []
    },
    {
      "label": "Start API",
      "type": "npm",
      "script": "dev",
      "path": "apps/api/",
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "Prisma Studio",
      "type": "npm",
      "script": "db:studio",
      "path": "apps/api/",
      "problemMatcher": []
    }
  ]
}
```

**Nutzen**: `Cmd/Ctrl + Shift + B` → Task auswählen

---

## 💡 Tipps & Tricks

### Quick Commands (Command Palette: `Cmd/Ctrl + Shift + P`)

- **"Prettier: Format Document"** → Code formatieren
- **"ESLint: Fix all auto-fixable Problems"** → Auto-fix
- **"TypeScript: Restart TS Server"** → Bei TypeScript-Problemen
- **"Reload Window"** → VS Code neu laden

### Terminal-Shortcuts

- **Neues Terminal**: `` Ctrl + Shift + ` ``
- **Terminal splitten**: `Cmd/Ctrl + \`
- **Zwischen Terminals wechseln**: `Alt + ←/→`

### Code-Navigation

- **Gehe zu Datei**: `Cmd/Ctrl + P`
- **Gehe zu Symbol**: `Cmd/Ctrl + T`
- **Gehe zu Definition**: `F12`
- **Peek Definition**: `Alt + F12`
- **Alle Referenzen**: `Shift + F12`

### Multi-Cursor Editing

- **Multi-Cursor hinzufügen**: `Alt + Click`
- **Nächstes Vorkommen**: `Cmd/Ctrl + D`
- **Alle Vorkommen**: `Cmd/Ctrl + Shift + L`

---

## 🐛 Troubleshooting in VS Code

### Problem: TypeScript findet Module nicht

**Lösung:**
1. `Cmd/Ctrl + Shift + P`
2. "TypeScript: Restart TS Server"
3. Oder:
```bash
cd apps/api
npm run db:generate  # Prisma Client regenerieren
```

### Problem: ESLint funktioniert nicht

**Lösung:**
1. Prüfe, ob ESLint Extension installiert ist
2. Output Panel öffnen: `View` → `Output`
3. Dropdown: "ESLint" auswählen
4. Fehler lesen

### Problem: Format on Save funktioniert nicht

**Lösung:**
1. Settings öffnen: `Cmd/Ctrl + ,`
2. Suche: "format on save"
3. ✅ Aktiviere "Editor: Format On Save"
4. Setze Default Formatter:
   - Suche: "default formatter"
   - Wähle: "Prettier - Code formatter"

---

## 📚 Weitere Ressourcen

- **VS Code Docs**: https://code.visualstudio.com/docs
- **Prisma Extension**: https://marketplace.visualstudio.com/items?itemName=Prisma.prisma
- **ESLint Extension**: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

---

## ✅ Checkliste: Projekt ist bereit

- [ ] VS Code geöffnet
- [ ] Extensions installiert (ESLint, Prettier, Prisma)
- [ ] `npm install` erfolgreich
- [ ] Docker Services laufen (`docker compose ps`)
- [ ] API startet (`npm run dev`)
- [ ] Health Check erreichbar (http://localhost:3001/health)
- [ ] Prisma Studio funktioniert (`npm run db:studio`)

**Wenn alles ✅ ist: BEREIT ZUM ENTWICKELN! 🎉**

---

## 🎯 Nächste Schritte

1. **Lies `README.md`** für vollständige Dokumentation
2. **Schaue in `apps/api/src/routes/`** um API-Endpoints zu implementieren
3. **Öffne Prisma Studio** um Datenbank-Daten zu sehen
4. **Teste API** mit http://localhost:3001/health

**Happy Coding! 🚀**
