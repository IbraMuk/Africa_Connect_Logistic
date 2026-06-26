@echo off
echo ========================================
echo   Africa Connect Logistic - Démarrage
echo ========================================
echo.

echo [1/4] PostgreSQL trouvé...
set PSQL_PATH="C:\Program Files\PostgreSQL\18\bin\psql.exe"
echo Utilisation de: %PSQL_PATH%

echo.
echo [2/4] Installation de la base de données...
cd database
set /p pg_password="Entrez le mot de passe PostgreSQL (appuyez sur Entrée si vide pour 'postgres'): "
if "%pg_password%"=="" set pg_password=postgres
set PGPASSWORD=%pg_password%

%PSQL_PATH% -U postgres -f create_database.sql
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================
    echo ERREUR: La création de la base de données a échoué!
    echo ========================================
    echo Vérifiez que:
    echo 1. PostgreSQL est en cours d'exécution
    echo 2. Le mot de passe est correct
    echo.
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

echo Installation des dépendances si nécessaire...
call npm install

echo Démarrage du backend...
start "Backend Server" cmd /k "npm run dev"

echo.
echo [4/4] Démarrage du frontend...
cd ..\frontend
echo Installation des dépendances si nécessaire...
call npm install

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
echo Les serveurs s'exécutent dans des fenêtres séparées.
echo Fermez cette fenêtre pour garder les serveurs actifs.
echo.

timeout /t 5 >nul
start http://localhost:3000
