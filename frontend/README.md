# TwitchPlanner

Application web de gestion de planning de stream avec export PNG. Projet académique B3 Keyce.

## Prérequis

- Node.js 18+
- Docker Desktop
- Git

## Installation

### 1. Cloner le projet

```bash
git clone <URL_DU_REPO>
cd twitch_planner
```

### 2. Configuration

Créer un fichier `.env` à la racine :

```bash
cp .env.example .env
```

Modifier le `.env` avec vos valeurs :

```env
DB_PASSWORD=votre_mot_de_passe
DATABASE_URL="postgresql://postgres:votre_mot_de_passe@localhost:5433/twitchplanner"
JWT_SECRET=votre_cle_jwt
PORT=5000
NODE_ENV=development
```

**Générer une clé JWT sécurisée :**

```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### 3. Base de données

Démarrer PostgreSQL avec Docker :

```bash
docker-compose up -d
```

### 4. Backend

```bash
cd backend
cp ../.env .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Backend sur http://localhost:5000

### 5. Frontend

Dans un nouveau terminal :

```bash
cd frontend
npm install
npm run dev
```

Frontend sur http://localhost:5173

## Schéma de base de données 

La schéma de la base de données se trouve dans ``` backend/prisma/schema.prisma ```

Por générer un export SQL :
```bash
npx prisma db pull
npx prisma generate
```

## Stack technique

**Backend :**
- Node.js + Express
- PostgreSQL + Prisma
- JWT + bcrypt

**Frontend :**
- React + Vite
- Tailwind CSS
- React Router
- html2canvas

## Commandes utiles

```bash
# Backend
npx prisma studio        # Interface BDD
npx prisma db push       # Sync schéma

# Docker
docker-compose down      # Arrêter
docker-compose logs      # Logs
```

## Fonctionnalités

- Authentification JWT
- CRUD plannings et événements
- Upload d'images (base64)
- Export PNG
- Gestion profil utilisateur


## Auteur

Laura IRISKINIAN 