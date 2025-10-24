# Fetisch Dating Plattform - Mobile App

React Native Expo-basierte Mobile-Anwendung für iOS und Android.

## 🚀 Features

- Cross-platform (iOS/Android)
- Login/Registration
- Swipe-Interface für Matches
- Real-time Chat
- Photo Upload
- Native-Module für Notifications

## 🛠️ Setup

```bash
# Dependencies
npm install

# iOS
npm run ios

# Android  
npm run android

# Web (für Entwicklung)
npm run web
```

## 📱 Devices

Läuft auf:
- iOS 13+
- Android 9+
- Expo Go App

## 📁 Struktur

```
App.tsx              # Root component
store/              # Zustand stores
  authStore.ts
lib/
  api.ts           # API client
screens/           # Screen components
components/        # Reusable components
```

## 🔗 API Integration

Nutzt den gleichen API-Client wie Web-App. Token wird in AsyncStorage gespeichert.

## 📝 TODO

- [ ] Navigation Stack implementieren
- [ ] Swipe-Interface (React Native Gesture Handler)
- [ ] Photo Upload
- [ ] Chat Screen
- [ ] Push Notifications
- [ ] Deep Linking

---

**Status**: MVP Development  
**Version**: 1.0.0
