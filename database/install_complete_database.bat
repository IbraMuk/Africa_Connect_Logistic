@echo off
echo ========================================
echo Installation de la base de donnees
echo Africa Connect Logistic - Version Complète
echo ========================================
echo.

REM Vérifier si PostgreSQL est installé
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: PostgreSQL n'est pas installe ou n'est pas dans le PATH
    echo.
    echo Veuillez installer PostgreSQL ou ajouter son repertoire bin au PATH
    echo Le chemin habituel est: C:\Program Files\PostgreSQL\18\bin
    echo.
    pause
    exit /b 1
)

REM Demander le mot de passe PostgreSQL
echo Veuillez entrer le mot de passe PostgreSQL:
set /p PGPASSWORD="Mot de passe: "

echo.
echo Connexion a PostgreSQL et creation de la base de donnees...
echo.

REM Exécuter le script SQL
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -f create_complete_database.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCES: Base de donnees creee avec succes!
    echo ========================================
    echo.
    echo Tables creees:
    echo - Users (Utilisateurs)
    echo - Chauffeurs
    echo - Vehicules
    echo - TransportsPersonnel
    echo - TransportsMarchandise
    echo - Billets
    echo - ImportExports
    echo - Factures
    echo - Paiements
    echo - Notifications
    echo - Avis
    echo - Tickets (Support)
    echo - TicketMessages
    echo - Documents
    echo - Parametres
    echo - JournauxAudit
    echo - Promotions
    echo - PromotionUtilisations
    echo.
    echo Utilisateur admin par defaut:
    echo Email: admin@africaconnect.com
    echo Mot de passe: admin123
    echo.
    echo N'oubliez pas de mettre a jour le mot de passe dans le fichier .env!
) else (
    echo.
    echo ========================================
    echo ERREUR: La creation de la base de donnees a echoue
    echo ========================================
    echo.
    echo Verifiez:
    echo 1. Que PostgreSQL est en cours d'execution
    echo 2. Que le mot de passe est correct
    echo 3. Que vous avez les droits d'administrateur
)

echo.
pause
