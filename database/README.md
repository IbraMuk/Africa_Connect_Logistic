# Installation de la Base de Données - Africa Connect Logistic

Ce guide vous aide à installer et configurer la base de données PostgreSQL pour l'application Africa Connect Logistic.

## Prérequis

1. **PostgreSQL** (version 13 ou supérieure) doit être installé
   - Téléchargez-le depuis: https://www.postgresql.org/download/windows/
   - Pendant l'installation, notez le mot de passe de l'utilisateur `postgres`

## Méthodes d'Installation

### Méthode 1: Script Automatique (Recommandé)

#### Option A: Avec PowerShell
1. Ouvrez PowerShell en tant qu'administrateur
2. Naviguez vers le dossier database:
   ```powershell
   cd "c:\Users\andwa\Desktop\Africa Connect Logistic\database"
   ```
3. Exécutez le script:
   ```powershell
   .\install_database.ps1
   ```
4. Entrez le mot de passe postgres lorsque demandé

#### Option B: Avec Batch (.bat)
1. Ouvrez l'invite de commande (cmd) en tant qu'administrateur
2. Naviguez vers le dossier database:
   ```cmd
   cd "c:\Users\andwa\Desktop\Africa Connect Logistic\database"
   ```
3. Exécutez le script:
   ```cmd
   install_database.bat
   ```
4. Entrez le mot de passe postgres lorsque demandé

### Méthode 2: Manuellement via psql

1. Ouvrez psql en ligne de commande:
   ```bash
   psql -U postgres
   ```

2. Copiez et collez le contenu du fichier `create_database.sql` dans psql

3. Ou exécutez directement le fichier:
   ```bash
   psql -U postgres -f create_database.sql
   ```

### Méthode 3: Avec pgAdmin

1. Ouvrez pgAdmin
2. Connectez-vous avec l'utilisateur postgres
3. Cliquez sur "Query Tool"
4. Ouvrez le fichier `create_database.sql`
5. Exécutez tout le script (F5)

## Structure de la Base de Données

### Tables Créées

1. **Users** - Utilisateurs du système
   - Rôles: admin, client, chauffeur, gestionnaire
   - Authentification avec mots de passe hashés

2. **TransportsPersonnel** - Transports du personnel
   - Types: navette, vip, collectif, individuel
   - Gestion des passagers et itinéraires

3. **TransportsMarchandise** - Transports de marchandises
   - Types: standard, fragile, dangereux, périssable, lourde, volumineux
   - Gestion du poids, volume et assurance

4. **Billets** - Réservations de billets
   - Transport: bus, train, avion, bateau
   - Classes: économique, business, première

5. **ImportExports** - Opérations d'import/export
   - Gestion des déclarations douanières
   - Suivi des expéditions

### Utilisateur par Défaut

- **Email**: admin@africaconnect.com
- **Mot de passe**: admin123
- **Rôle**: administrateur

## Configuration de l'Application

Après avoir créé la base de données, mettez à jour le fichier `.env` dans le dossier backend:

```env
# Configuration de la base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=africa_connect_logistic
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_postgres
```

## Vérification de l'Installation

Pour vérifier que tout est correct:

1. Connectez-vous à la base de données:
   ```bash
   psql -U postgres -d africa_connect_logistic
   ```

2. Listez les tables:
   ```sql
   \dt
   ```

3. Vous devriez voir les tables suivantes:
   - users
   - transportspersonnel
   - transportsmarchandise
   - billets
   - importexports

## Dépannage

### Erreur: "PostgreSQL n'est pas installé"
- Assurez-vous que PostgreSQL est bien installé
- Ajoutez le chemin de PostgreSQL au PATH Windows
- Redémarrez votre terminal

### Erreur: "mot de passe incorrect"
- Vérifiez le mot de passe de l'utilisateur postgres
- Réinitialisez le mot de passe si nécessaire

### Erreur: "la base de données existe déjà"
- Connectez-vous à PostgreSQL et supprimez la base:
  ```sql
  DROP DATABASE IF EXISTS africa_connect_logistic;
  ```
- Relancez le script d'installation

## Sauvegarde et Restauration

### Sauvegarder la base de données:
```bash
pg_dump -U postgres africa_connect_logistic > backup.sql
```

### Restaurer la base de données:
```bash
psql -U postgres -d africa_connect_logistic < backup.sql
```

## Support

Pour toute question ou problème, contactez l'équipe de support technique.
