# Fetisch Dating Plattform - Web Frontend

Next.js 14-basierte Web-Anwendung für die Fetisch-Dating-Plattform.

## 🚀 Features

- Login/Registration mit JWT
- Benutzer-Profilverwaltung
- Swipe-Interface für Matches
- Real-time Chat
- Responsive Design mit Tailwind CSS
- State Management mit Zustand

## 🛠️ Setup

```bash
# Dependencies
npm install

# Environment
cp .env.example .env.local
# .env.local bearbeiten

# Development
npm run dev
# http://localhost:3001
```

## 📁 Struktur

```
app/                  # Next.js App Router
  layout.tsx         # Root layout
  page.tsx           # Home page
  login/             # Login page
  register/          # Registration page
  dashboard/         # Dashboard (protected)
  matches/           # Matches page
  chat/              # Chat page

store/              # Zustand stores
  authStore.ts      # Auth state

lib/
  api.ts            # API client
  
components/         # React components
```

## 🔗 API Integration

API-Client ist in `lib/api.ts` konfiguriert. Lädt Token aus localStorage automatisch.

```typescript
import { authApi, matchApi, chatApi } from '@/lib/api';

// Login
const res = await authApi.login({ email, password });

// Matches holen
const matches = await matchApi.getMatches();

// Nachricht senden
await chatApi.sendMessage(userId, 'Hallo!');
```

## 🎨 Styling

Tailwind CSS ist konfiguriert. Nutze `@/` für Imports.

```typescript
import classNames from 'classnames';

const buttonClass = classNames(
  'px-4 py-2 rounded',
  { 'bg-purple-600': isActive }
);
```

## 🔒 Authentication

JWT Token wird automatisch in Headers injiziert. Bei 401 Fehler wird User zum Login redirected.

## 📝 TODO

- [ ] Dashboard implementieren
- [ ] Swipe-Interface (Framer Motion)
- [ ] Chat UI
- [ ] Photo Upload
- [ ] Persönlichkeits-Quiz
- [ ] E2E Tests (Playwright)

---

**Status**: MVP Development  
**Version**: 1.0.0
