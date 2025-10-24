# GitHub Pages Setup Instructions

## ✅ Automatische Einrichtung

GitHub Pages ist nun konfiguriert und wird **automatisch** bei jedem Push zu `main` deployed.

## 🔧 Manuelle Aktivierung (falls nötig)

Gehen Sie zu:
```
https://github.com/swisscomfort/gnitad/settings/pages
```

Und konfigurieren Sie:

1. **Source**: `GitHub Actions` (automatisch)
2. **Build & Deployment**: Wird durch `.github/workflows/deploy-pages.yml` verwaltet

## 🌐 Zugriff auf die Website

Nach dem nächsten Push wird die Dokumentation verfügbar unter:
```
https://swisscomfort.github.io/gnitad/
```

**Funktionen:**
- 📖 Vollständige Projektdokumentation
- 🔍 Suchfunktion
- 🌙 Dark Mode
- 📱 Mobile-optimiert
- 🚀 Auto-Deploy bei jedem Push

## 📝 Dokumentation hinzufügen

Um neue Seiten hinzuzufügen:

1. Erstellen Sie eine `.md` Datei in `docs/`
2. Fügen Sie sie in `mkdocs.yml` unter `nav:` hinzu
3. Pushen Sie zu `main`
4. GitHub Actions deployed automatisch ✨

## 🔄 Workflow

```
Git Push → GitHub Actions → MkDocs Build → GitHub Pages Deploy
                    ↓
       https://swisscomfort.github.io/gnitad/
```

## ✨ Features der Website

- **Material Theme**: Modernes, responsives Design
- **Search**: Volltextsuche über alle Seiten
- **Code Highlighting**: Syntax-Highlighting für alle Code-Blöcke
- **Dark Mode**: Automatischer Light/Dark Mode Toggle
- **Social Links**: GitHub, Email Integration

---

**Status**: ✅ Aktiv und bereit zum Deploy
