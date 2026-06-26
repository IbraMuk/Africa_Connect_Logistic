# Africa Connect Logistic

Plateforme complète de gestion logistique pour le transport du personnel, des marchandises, la réservation de billets et les opérations d'import/export.

## Technologies Utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de données
- **Sequelize** - ORM pour PostgreSQL
- **JWT** - Authentification
- **Bcrypt** - Hashage des mots de passe
- **Joi** - Validation des données

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Typage strict
- **Tailwind CSS** - Framework CSS
- **Axios** - Client HTTP
- **React Hook Form** - Gestion des formulaires
- **React Hot Toast** - Notifications

## Fonctionnalités

### 🚌 Transport du Personnel
- Navettes d'entreprise
- Transport VIP
- Transport collectif
- Transport individuel
- Gestion des chauffeurs
- Suivi en temps réel

### 📦 Transport de Marchandises
- Différents types de marchandises (standard, fragile, dangereux, périssable)
- Gestion du poids et volume
- Assurance optionnelle
- Photos des marchandises
- Instructions spéciales

### 🎫 Réservation de Billets
- Bus, train, avion, bateau
- Aller simple et aller-retour
- Plusieurs classes disponibles
- Gestion des passagers
- Bagages et services supplémentaires

### 🌍 Import & Export
- Gestion des déclarations douanières
- Différents modes de transport (maritime, aérien, routier, ferroviaire)
- Gestion des conteneurs
- Incoterms supportés
- Suivi des expéditions

## Installation

### Prérequis
- Node.js (v18 ou supérieur)
- PostgreSQL (v13 ou supérieur)
- npm ou yarn

### 1. Cloner le projet
```bash
git clone <url-du-repository>
cd "Africa Connect Logistic"
```

### 2. Configuration du Backend

```bash
cd backend
npm install
```

#### Configurer la base de données PostgreSQL
1. Créer une base de données :
```sql
CREATE DATABASE africa_connect_logistic;
```

2. Copier le fichier d'environnement :
```bash
cp .env.example .env
```

3. Modifier le fichier `.env` avec vos configurations :
```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=africa_connect_logistic
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe

JWT_SECRET=votre_clé_secrète_jwt_très_longue_et_sécurisée
JWT_EXPIRE=7d
```

#### Démarrer le backend
```bash
npm run dev
```

L'API sera disponible à `http://localhost:5000`

### 3. Configuration du Frontend

```bash
cd ../frontend
npm install
```

#### Configurer l'environnement
Créer un fichier `.env.local` :
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Démarrer le frontend
```bash
npm run dev
```

L'application sera disponible à `http://localhost:3000`

## Structure du Projet

```
Africa Connect Logistic/
├── backend/
│   ├── config/
│   │   └── database.js       # Configuration de la base de données
│   ├── controllers/          # Contrôleurs des routes API
│   │   ├── authController.js
│   │   ├── personnelController.js
│   │   ├── marchandiseController.js
│   │   ├── billetController.js
│   │   └── importExportController.js
│   ├── middleware/           # Middlewares
│   │   └── auth.js          # Middleware d'authentification
│   ├── models/              # Modèles de données Sequelize
│   │   ├── User.js
│   │   ├── TransportPersonnel.js
│   │   ├── TransportMarchandise.js
│   │   ├── Billet.js
│   │   ├── ImportExport.js
│   │   └── index.js
│   ├── routes/              # Routes API
│   │   ├── auth.js
│   │   ├── personnel.js
│   │   ├── marchandise.js
│   │   ├── billet.js
│   │   └── importExport.js
│   ├── .env.example
│   ├── package.json
│   └── server.js            # Point d'entrée du serveur
├── frontend/
│   ├── src/
│   │   ├── app/             # Pages Next.js
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── components/      # Composants React
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── lib/             # Utilitaires
│   │   ├── hooks/           # Hooks personnalisés
│   │   └── types/           # Types TypeScript
│   ├── public/
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
└── README.md
```

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur
- `PUT /api/auth/profile` - Mettre à jour le profil

### Transport Personnel
- `POST /api/personnel` - Créer une demande de transport
- `GET /api/personnel` - Lister les transports (utilisateur)
- `GET /api/personnel/:id` - Détails d'un transport
- `PUT /api/personnel/:id` - Mettre à jour un transport
- `PATCH /api/personnel/:id/cancel` - Annuler un transport

### Transport Marchandise
- `POST /api/marchandise` - Créer une demande de transport
- `GET /api/marchandise` - Lister les transports (utilisateur)
- `GET /api/marchandise/:id` - Détails d'un transport
- `PATCH /api/marchandise/:id/statut` - Mettre à jour le statut

### Billets
- `POST /api/billet` - Réserver un billet
- `GET /api/billet` - Lister les billets (utilisateur)
- `GET /api/billet/reference/:reference` - Rechercher par référence
- `PATCH /api/billet/:id/cancel` - Annuler un billet

### Import/Export
- `POST /api/import-export` - Créer une opération
- `GET /api/import-export` - Lister les opérations (utilisateur)
- `GET /api/import-export/track/:numeroSuivi` - Suivre une expédition
- `PATCH /api/import-export/:id/statut` - Mettre à jour le statut

## Déploiement

### Backend (Production)
1. Configurer les variables d'environnement de production
2. Utiliser PM2 pour la gestion des processus :
```bash
npm install -g pm2
pm2 start server.js --name "africa-connect-api"
```

### Frontend (Production)
1. Construire l'application :
```bash
npm run build
npm start
```

## Contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT.
