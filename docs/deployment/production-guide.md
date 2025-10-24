# Deployment Guide

## Übersicht

Diese Anleitung erklärt, wie man die Fetisch-Dating-Plattform in **Staging** und **Production** deployt.

---

## Tabelle der Inhalte

1. [Voraussetzungen](#voraussetzungen)
2. [Production Deployment](#production-deployment)
3. [Environment Setup](#environment-setup)
4. [Docker Build & Push](#docker-build--push)
5. [Database Migrations](#database-migrations)
6. [Health Checks](#health-checks)
7. [Monitoring & Logging](#monitoring--logging)
8. [Rollback Procedure](#rollback-procedure)

---

## Voraussetzungen

### Externe Services
- **PostgreSQL 15+** (AWS RDS, Heroku Postgres, selbst-gehostet)
- **Redis 7+** (AWS ElastiCache, Heroku Redis, selbst-gehostet)
- **AWS S3** oder **MinIO** für Foto-Speicherung
- **SMTP-Server** (SendGrid, Mailgun) für E-Mail-Benachrichtigungen
- **Docker Registry** (Docker Hub, GitHub Container Registry, AWS ECR)

### Lokales Setup
```bash
# Docker & Docker Compose
docker --version  # >= 24.0
docker-compose --version  # >= 2.20

# Node.js & npm
node --version  # >= 20.0
npm --version  # >= 10.0

# Python
python --version  # >= 3.11
pip --version

# CLI Tools
aws --version  # Für AWS-Deployments
gcloud --version  # Für GCP-Deployments
heroku --version  # Für Heroku-Deployments
```

---

## Production Deployment

### Option 1: Docker (Empfohlen)

#### 1.1 Docker Images bauen

```bash
# Backend
docker build -f docker/api/Dockerfile -t fetisch-dating-api:latest .
docker build -f docker/api/Dockerfile -t fetisch-dating-api:v1.0.0 .

# Frontend
docker build -f docker/web/Dockerfile -t fetisch-dating-web:latest .
docker build -f docker/web/Dockerfile -t fetisch-dating-web:v1.0.0 .

# ML Services
docker build -f docker/ml/Dockerfile -t fetisch-dating-ml:latest .
docker build -f docker/ml/Dockerfile -t fetisch-dating-ml:v1.0.0 .
```

#### 1.2 Images in Registry pushen

```bash
# Docker Hub
docker tag fetisch-dating-api:latest username/fetisch-dating-api:latest
docker push username/fetisch-dating-api:latest

# GitHub Container Registry
docker tag fetisch-dating-api:latest ghcr.io/username/fetisch-dating-api:latest
docker push ghcr.io/username/fetisch-dating-api:latest

# AWS ECR
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.eu-central-1.amazonaws.com
docker tag fetisch-dating-api:latest <account-id>.dkr.ecr.eu-central-1.amazonaws.com/fetisch-dating-api:latest
docker push <account-id>.dkr.ecr.eu-central-1.amazonaws.com/fetisch-dating-api:latest
```

### Option 2: Heroku

```bash
# Login
heroku login

# Remote hinzufügen
heroku git:remote -a fetisch-dating-api

# Deploy
git push heroku main

# Logs prüfen
heroku logs --tail
```

### Option 3: AWS (ECS + Fargate)

```bash
# Cluster erstellen (einmalig)
aws ecs create-cluster --cluster-name fetisch-dating

# Task Definition registrieren
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# Service deployen
aws ecs create-service \
  --cluster fetisch-dating \
  --service-name api \
  --task-definition fetisch-dating-api:1 \
  --desired-count 3
```

### Option 4: Kubernetes (für Scale)

```bash
# Cluster erstellen (GKE example)
gcloud container clusters create fetisch-dating \
  --zone europe-west1-b \
  --num-nodes 3

# Helm Chart deployen
helm install fetisch-dating ./helm-chart \
  --namespace production \
  --values values-production.yaml
```

---

## Environment Setup

### Production `.env` Datei

```bash
# Core
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:password@db.example.com:5432/fetisch_prod
REDIS_URL=redis://:password@cache.example.com:6379

# JWT
JWT_SECRET=your-super-secure-random-string-min-32-chars
JWT_EXPIRY=7d
JWT_REFRESH_EXPIRY=30d

# AWS S3
AWS_ACCESS_KEY_ID=xxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxx
AWS_REGION=eu-central-1
AWS_S3_BUCKET=fetisch-dating-photos

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxx
EMAIL_FROM=noreply@fetisch-dating.com

# Frontend
NEXT_PUBLIC_API_URL=https://api.fetisch-dating.com
NEXT_PUBLIC_DOMAIN=fetisch-dating.com

# Security
CORS_ORIGIN=https://fetisch-dating.com,https://app.fetisch-dating.com
ALLOWED_ORIGINS=https://fetisch-dating.com

# ML Service
ML_SERVICE_URL=http://ml-service:5000
ML_API_KEY=your-ml-api-key

# Sentry (Error Tracking)
SENTRY_DSN=https://xxxx@xxxx.ingest.sentry.io/xxxxx
```

### Secrets Management

```bash
# AWS Secrets Manager
aws secretsmanager create-secret \
  --name fetisch-dating/production \
  --secret-string file://secrets.json

# GitHub Secrets (für CI/CD)
# Settings → Secrets and variables → Actions
# Secrets hinzufügen:
# - DATABASE_URL
# - REDIS_URL
# - JWT_SECRET
# - AWS credentials
# - DOCKER_USERNAME, DOCKER_PASSWORD
# - etc.
```

---

## Database Migrations

### Vor dem Deploy

```bash
# Migration erstellen
npx prisma migrate dev --name feature_name

# Migration testen
npm run test

# Review generated SQL
cat prisma/migrations/<timestamp>_feature_name/migration.sql
```

### Production Deployment

```bash
# Dry-run (safer!)
npx prisma migrate deploy --dry-run

# Tatsächliche Migration
npx prisma migrate deploy

# Rollback (falls nötig)
npx prisma migrate resolve --rolled-back "<migration_name>"
```

### Backup vor Migration

```bash
# PostgreSQL
pg_dump -h db.example.com -U user fetisch_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore bei Problem
psql -h db.example.com -U user fetisch_prod < backup_20251024_120000.sql
```

---

## Health Checks

### API Health Endpoint

```bash
# Live Check
curl https://api.fetisch-dating.com/health

# Response
{
  "status": "ok",
  "timestamp": "2025-10-24T12:00:00Z",
  "uptime": 3600,
  "database": "connected",
  "cache": "connected",
  "version": "1.0.0"
}
```

### Liveness & Readiness (Kubernetes)

```yaml
# Kubernetes Probe Definition
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Docker Health Check

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

---

## Monitoring & Logging

### Sentry (Error Tracking)

```typescript
// Bereits in errorHandler integriert
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

### Datadog / NewRelic

```bash
# Datadog Agent
DD_AGENT_HOST=datadog.example.com npm run start

# NewRelic
NEW_RELIC_APP_NAME=fetisch-dating npm run start
```

### Log Aggregation

```bash
# ELK Stack
# Logs automatic gesendet zu Elasticsearch

# CloudWatch (AWS)
# Logs automatic zu CloudWatch geschrieben

# Papertrail / Loggly
# STDOUT → automatisch aggregiert
```

---

## Rollback Procedure

### Container Rollback

```bash
# Alte Image-Version deployen
docker pull fetisch-dating-api:v1.0.0
docker run -d fetisch-dating-api:v1.0.0

# Oder Kubernetes
kubectl rollout undo deployment/fetisch-dating-api
```

### Database Rollback

```bash
# Letzten Snapshot aus Backup wiederherstellen
psql -h db.example.com -U user fetisch_prod < backup_20251024_110000.sql

# Oder mit Prisma
npx prisma migrate resolve --rolled-back "migration_name"
```

---

## Checklist vor Production Deploy

- [ ] Alle Tests bestanden (`npm run test`)
- [ ] Code Quality Check bestanden (`npm run lint`)
- [ ] Migrations reviewed & tested
- [ ] Environment Variables gesetzt
- [ ] Database Backup erstellt
- [ ] SSL Zertifikat gültig
- [ ] API Rate Limiting konfiguriert
- [ ] CORS Origins gültig
- [ ] Error Tracking (Sentry) aktiviert
- [ ] Monitoring/Logging aktiviert
- [ ] Load Testing durchgeführt
- [ ] Security Scan durchgeführt
- [ ] Documentation aktualisiert
- [ ] Team notifiziert

---

## Monitoring nach Deploy

```bash
# Error Monitoring
curl https://api.fetisch-dating.com/health

# Performance Monitoring
# → Datadog / NewRelic Dashboard

# Log Monitoring
# → Papertrail / CloudWatch

# Uptime Monitoring
# → Pingdom / UptimeRobot
```

---

**Status**: Production Ready  
**Last Updated**: 2025-10-24
