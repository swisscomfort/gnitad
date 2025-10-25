# 🚀 Quick Deploy zu Infomaniak

## Schritt 1: Bei Infomaniak bestellen

1. Gehe zu https://manager.infomaniak.com/
2. Bestelle:
   - ✅ **Domain** (z.B. fetisch-dating.ch) - ~15 CHF/Jahr
   - ✅ **Jelastic Cloud Hosting** - ab 10 CHF/Monat
     - Min: 1 vCore, 2 GB RAM
     - Mit Node.js 20+ und PostgreSQL 15+

## Schritt 2: Server einrichten (5 Minuten)

```bash
# 1. SSH in deinen neuen Server
ssh root@node123456-env-jelastic.infomaniak.com

# 2. System aktualisieren
apt update && apt upgrade -y

# 3. Git, Node.js, PM2 installieren
apt install git nodejs npm -y
npm install -g pm2 ts-node

# 4. Repository klonen
cd /var/www
git clone https://github.com/swisscomfort/gnitad.git
cd gnitad

# 5. Dependencies installieren
npm install
cd apps/web && npm install && cd ../..
cd apps/api && npm install && cd ../..
cd services/ml && pip3 install -r requirements.txt && cd ../..
```

## Schritt 3: Datenbank einrichten (2 Minuten)

```bash
# PostgreSQL User & Database erstellen
sudo -u postgres psql << EOF
CREATE DATABASE fetisch_dating;
CREATE USER fetisch_user WITH ENCRYPTED PASSWORD 'dein_sicheres_passwort';
GRANT ALL PRIVILEGES ON DATABASE fetisch_dating TO fetisch_user;
\q
EOF
```

## Schritt 4: Environment Variables (3 Minuten)

```bash
# .env Datei erstellen
cp .env.example .env
nano .env

# WICHTIG: Ändere diese Werte:
# - DATABASE_URL (mit deinem Passwort)
# - JWT_SECRET (64 Zeichen random string)
# - NEXT_PUBLIC_API_URL (deine Domain)
# - SMTP Settings (falls Email gewünscht)

# Random JWT Secret generieren:
openssl rand -base64 64
```

## Schritt 5: App starten (1 Minute)

```bash
# Database migrieren
npx prisma migrate deploy
npx prisma db seed

# Web Frontend bauen
cd apps/web
npm run build
cd ../..

# Alle Services mit PM2 starten
pm2 start ecosystem.config.js

# PM2 bei Server-Reboot automatisch starten
pm2 startup
pm2 save

# Status prüfen
pm2 status
pm2 logs
```

## Schritt 6: NGINX konfigurieren (5 Minuten)

```bash
# NGINX Konfiguration erstellen
nano /etc/nginx/sites-available/fetisch-dating

# Inhalt (siehe docs/deployment/infomaniak-guide.md)
# Dann aktivieren:
ln -s /etc/nginx/sites-available/fetisch-dating /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## Schritt 7: SSL Zertifikat (2 Minuten)

```bash
# Let's Encrypt installieren
apt install certbot python3-certbot-nginx -y

# SSL Zertifikat erstellen
certbot --nginx -d deine-domain.ch -d www.deine-domain.ch

# Auto-Renewal aktivieren
certbot renew --dry-run
```

## Schritt 8: DNS konfigurieren

Im Infomaniak Manager → DNS:
```
Type    Host    Wert
A       @       [Deine Server IP]
A       www     [Deine Server IP]
```

**Warten**: 1-24 Stunden für DNS Propagation

---

## ✅ Fertig!

Deine App läuft jetzt auf:
```
https://deine-domain.ch
```

---

## 🔄 Updates deployen

```bash
ssh root@node123456-env-jelastic.infomaniak.com
cd /var/www/gnitad
git pull origin main
npm install
cd apps/web && npm run build && cd ../..
pm2 restart all
```

---

## 📊 Monitoring

```bash
# App Status
pm2 status
pm2 logs api
pm2 logs web

# System Resources
htop
df -h
free -m

# NGINX Logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 🆘 Probleme?

### App startet nicht
```bash
pm2 logs api --lines 100
pm2 logs web --lines 100
```

### Database Connection Error
```bash
# Prüfe .env DATABASE_URL
cat .env | grep DATABASE_URL

# Teste Verbindung
psql -U fetisch_user -d fetisch_dating -h localhost
```

### Port 3000/3001 belegt
```bash
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001
# Kill Process falls nötig
```

---

**Gesamtdauer**: ~20 Minuten  
**Kosten**: ~10-15 CHF/Monat  
**Support**: support@infomaniak.com
