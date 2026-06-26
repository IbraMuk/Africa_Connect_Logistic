# Configuration de PostgreSQL pour Africa Connect Logistic

## Prérequis

1. **PostgreSQL installé** sur votre machine
   - Windows : Télécharger depuis https://www.postgresql.org/download/windows/
   - macOS : `brew install postgresql`
   - Linux (Ubuntu) : `sudo apt-get install postgresql postgresql-contrib`

## Étapes de configuration

### 1. Créer la base de données

Ouvrez PostgreSQL (pgAdmin ou ligne de commande) et exécutez :

```sql
CREATE DATABASE africa_connect_logistic;
```

### 2. Créer un utilisateur (optionnel)

Si vous voulez un utilisateur dédié :

```sql
CREATE USER africa_connect_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE africa_connect_logistic TO africa_connect_user;
```

### 3. Configurer le fichier .env

Modifiez le fichier `.env` dans le dossier backend :

```env
# Configuration de la base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=africa_connect_logistic
DB_USER=postgres  # ou africa_connect_user si vous en avez créé un
DB_PASSWORD=votre_mot_de_passe_postgres
```

### 4. Installer les dépendances

```bash
cd backend
npm install
```

### 5. Initialiser la base de données

```bash
npm run init-db
```

Cette commande va :
- Se connecter à PostgreSQL
- Créer toutes les tables nécessaires
- Afficher la liste des tables créées

### 6. Démarrer le serveur

```bash
npm start
# ou en mode développement
npm run dev
```

## Dépannage

### Erreur de connexion

- Vérifiez que PostgreSQL est en cours d'exécution
- Vérifiez que le port 5432 est disponible
- Vérifiez les identifiants dans le fichier .env

### Erreur "database does not exist"

- Assurez-vous d'avoir créé la base de données `africa_connect_logistic`
- Vérifiez l'orthographe du nom de la base de données

### Erreur "password authentication failed"

- Vérifiez le mot de passe PostgreSQL
- Sur Windows, le mot de passe par défaut peut être celui défini lors de l'installation

## Commandes utiles PostgreSQL

### Ligne de commande

```bash
# Se connecter à PostgreSQL
psql -U postgres -h localhost

# Lister les bases de données
\l

# Se connecter à la base de données
\c africa_connect_logistic

# Lister les tables
\dt

# Quitter
\q
```

### Redémarrer PostgreSQL (Windows)

```bash
# Ouvrir Services Windows
# Chercher "postgresql-x64-15" (ou version similaire)
# Clic droit -> Redémarrer
```

## Structure des tables

Après initialisation, vous aurez les tables suivantes :
- `users` - Utilisateurs du système
- `clients` - Clients de l'entreprise
- `personnel` - Personnel de transport
- `marchandises` - Marchandises à transporter
- `billets` - Billets de réservation
- `import_exports` - Opérations d'import/export
