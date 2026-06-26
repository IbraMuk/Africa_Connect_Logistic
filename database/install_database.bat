@echo off
echo ========================================
echo Installation de la base de données
echo Africa Connect Logistic
echo ========================================
echo.

REM Vérifier si PostgreSQL est installé
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: PostgreSQL n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer PostgreSQL depuis https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

echo PostgreSQL trouvé!
echo.

REM Demander le mot de passe postgres
set /p pg_password="Entrez le mot de passe de l'utilisateur postgres: "

REM Définir la variable d'environnement pour le mot de passe
set PGPASSWORD=%pg_password%

echo.
echo Création de la base de données...
echo.

REM Exécuter le script SQL
psql -U postgres -f create_database.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCES: Base de données créée avec succès!
    echo ========================================
    echo.
    echo Utilisateur par défaut:
    echo Email: admin@africaconnect.com
    echo Mot de passe: admin123
    echo.
    echo N'oubliez pas de configurer votre fichier .env avec:
    echo DB_HOST=localhost
    echo DB_PORT=5432
    echo DB_NAME=africa_connect_logistic
    echo DB_USER=postgres
    echo DB_PASSWORD=votre_mot_de_passe_postgres
) else (
    echo.
    echo ========================================
    echo ERREUR: La création a échoué!
    echo ========================================
    echo Vérifiez le mot de passe et réessayez.
)

REM Nettoyer la variable d'environnement
set PGPASSWORD=

echo.
pause
