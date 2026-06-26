@echo off
echo ========================================
echo   Africa Connect Logistic - Démarrage
echo ========================================
echo.

echo [1/4] Vérification de PostgreSQL...
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: PostgreSQL n'est pas installé!
    echo Veuillez l'installer depuis https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)
echo PostgreSQL trouvé!

echo.
echo [2/4] Installation de la base de données...
cd database
set /p pg_password="Entrez le mot de passe PostgreSQL: "
set PGPASSWORD=%pg_password%
psql -U postgres -f create_database.sql
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: La création de la base de données a échoué!
    pause
    exit /b 1
)
echo Base de données créée avec succès!
set PGPASSWORD=

echo.
echo [3/4] Configuration et démarrage du backend...
cd ..\backend
echo Création du fichier .env...
(
echo NODE_ENV=development
echo PORT=5000
echo DB_HOST=localhost
echo DB_PORT=5432
echo DB_NAME=africa_connect_logistic
echo DB_USER=postgres
echo DB_PASSWORD=%pg_password%
echo JWT_SECRET=votre_clé_secrète_jwt_très_longue_et_sécurisée_pour_africa_connect_logistic_2024
echo JWT_EXPIRE=7d
) > .env

echo Démarrage du backend...
start "Backend Server" cmd /k "npm run dev"

echo.
echo [4/4] Démarrage du frontend...
cd ..\frontend
echo Démarrage du frontend...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo   SERVEURS EN COURS D'EXÉCUTION
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Utilisateur par défaut:
echo Email: admin@africaconnect.com
echo Mot de passe: admin123
echo.
echo Appuyez sur Ctrl+C dans les fenêtres de serveur pour arrêter.
echo.

timeout /t 5 >nul
start http://localhost:3000
