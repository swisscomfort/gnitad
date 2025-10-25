# Infomaniak Deployment Guide

## 🇨🇭 Voraussetzungen

### Bei Infomaniak bestellen:
1. **Domain** (z.B. fetisch-dating.ch)
2. **Infomaniak Cloud Server** (Jelastic Cloud Hosting)
   - Min. 1 vCore, 2 GB RAM
   - ~7-15 CHF/Monat
   - **WICHTIG**: Muss Node.js und PostgreSQL unterstützen

---

## 📋 Setup Schritte

### Schritt 1: Infomaniak Cloud Server erstellen

1. Gehe zu https://manager.infomaniak.com/
2. Bestelle **Jelastic Cloud Hosting**
3. Wähle Environment:
   - **Node.js** (Version 20+)
   - **PostgreSQL** (Version 15+)
   - **NGINX** Load Balancer

### Schritt 2: SSH Zugang einrichten

```bash
# SSH Key generieren (falls noch nicht vorhanden)
ssh-keygen -t ed25519 -C "deine@email.com"

# Public Key kopieren
cat ~/.ssh/id_ed25519.pub

# Im Infomaniak Manager unter "SSH Keys" hinzufügen
```

### Schritt 3: Projekt deployen

#### Option A: Via Git (Empfohlen)

```bash
# SSH in deinen Infomaniak Server
ssh root@node123456-env-jelastic.infomaniak.com

# Repository klonen
cd /var/www
git clone https://github.com/swisscomfort/gnitad.git
cd gnitad

# Dependencies installieren
npm install

# Environment Variables setzen
cp .env.example .env
nano .env
# Fülle aus: DATABASE_URL, JWT_SECRET, etc.

# Database migrieren
npm run db:migrate
npm run db:seed

# PM2 Process Manager installieren
npm install -g pm2

# Backend starten
cd apps/api
pm2 start src/index.ts --name api --interpreter ts-node

# Frontend bauen und starten
cd ../web
npm run build
pm2 start npm --name web -- start

# PM2 bei Reboot starten
pm2 startup
pm2 save
```

#### Option B: Via Docker (Einfacher)

```bash
# SSH in Server
ssh root@node123456-env-jelastic.infomaniak.com

# Docker & Docker Compose prüfen
docker --version
docker-compose --version

# Repository klonen
cd /var/www
git clone https://github.com/swisscomfort/gnitad.git
cd gnitad

# Environment Variables
cp .env.example .env
nano .env

# Docker Services starten
docker-compose up -d

# Logs prüfen
docker-compose logs -f
```

### Schritt 4: NGINX Konfiguration

Erstelle `/etc/nginx/conf.d/fetisch-dating.conf`:

```nginx
upstream api_backend {
    server localhost:3001;
}

upstream web_frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name fetisch-dating.ch www.fetisch-dating.ch;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name fetisch-dating.ch www.fetisch-dating.ch;

    # SSL Certificate (Infomaniak bietet Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/fetisch-dating.ch/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/fetisch-dating.ch/privkey.pem;

    # Frontend (Next.js)
    location / {
        proxy_pass http://web_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API Backend
    location /api {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket für Chat
    location /socket {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

NGINX neu laden:
```bash
nginx -t
systemctl reload nginx
```

### Schritt 5: SSL Zertifikat (Let's Encrypt)

```bash
# Certbot installieren (meist schon auf Infomaniak Servern)
apt-get install certbot python3-certbot-nginx

# SSL Zertifikat erstellen
certbot --nginx -d fetisch-dating.ch -d www.fetisch-dating.ch

# Auto-Renewal prüfen
certbot renew --dry-run
```

### Schritt 6: Domain DNS konfigurieren

Im Infomaniak DNS Manager:

```
Type    Host    Value
A       @       [Deine Server IP]
A       www     [Deine Server IP]
CNAME   api     fetisch-dating.ch
```

**DNS Propagation dauert 1-24 Stunden.**

---

## 🗄️ PostgreSQL Setup

```bash
# Auf Server einloggen
ssh root@node123456-env-jelastic.infomaniak.com

# PostgreSQL User & Database erstellen
sudo -u postgres psql

postgres=# CREATE DATABASE fetisch_dating;
postgres=# CREATE USER fetisch_user WITH ENCRYPTED PASSWORD 'dein_sicheres_passwort';
postgres=# GRANT ALL PRIVILEGES ON DATABASE fetisch_dating TO fetisch_user;
postgres=# \q

# Connection String in .env:
DATABASE_URL="postgresql://fetisch_user:dein_sicheres_passwort@localhost:5432/fetisch_dating"
```

---

## 📦 Environment Variables (.env)

```bash
# Core
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://fetisch_user:passwort@localhost:5432/fetisch_dating

# JWT
JWT_SECRET=dein-super-sicheres-64-zeichen-secret-hier
JWT_EXPIRY=7d

# Frontend
NEXT_PUBLIC_API_URL=https://fetisch-dating.ch/api

# Optional: Email, S3, etc.
SMTP_HOST=mail.infomaniak.com
SMTP_PORT=587
SMTP_USER=noreply@fetisch-dating.ch
SMTP_PASSWORD=dein_email_passwort
```

---

## 🔄 Updates deployen

```bash
# SSH in Server
ssh root@node123456-env-jelastic.infomaniak.com

cd /var/www/gnitad

# Neueste Version pullen
git pull origin main

# Dependencies aktualisieren
npm install

# Database migrieren
npm run db:migrate

# Services neu starten
pm2 restart all

# Oder mit Docker:
docker-compose down
docker-compose pull
docker-compose up -d
```

---

## 📊 Monitoring

```bash
# PM2 Status prüfen
pm2 status
pm2 logs

# Docker Status
docker-compose ps
docker-compose logs -f

# System Resources
htop
df -h
```

---

## 🔒 Security Checklist

- [ ] Firewall aktiviert (nur Port 80, 443, 22)
- [ ] SSH Key-basiertes Login (kein Password)
- [ ] SSL Zertifikat installiert
- [ ] Environment Variables nicht in Git
- [ ] PostgreSQL nur localhost Zugriff
- [ ] Rate Limiting aktiviert
- [ ] Backups eingerichtet

---

## 💰 Kosten Übersicht (Infomaniak)

| Service | Preis/Monat |
|---------|-------------|
| Domain (.ch) | ~15 CHF/Jahr |
| Jelastic Cloud (2GB RAM) | ~10-15 CHF |
| PostgreSQL | Inkludiert |
| SSL Zertifikat | Gratis (Let's Encrypt) |
| **Total** | **~10-15 CHF/Monat** |

---

## 🆘 Support

**Infomaniak Support:**
- Tel: +41 22 820 35 44
- Web: https://www.infomaniak.com/de/support

**Technische Probleme:**
- GitHub Issues: https://github.com/swisscomfort/gnitad/issues

---

**Status**: Production Ready  
**Last Updated**: 2025-10-25
