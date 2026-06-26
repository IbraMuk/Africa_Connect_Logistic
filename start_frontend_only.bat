@echo off
echo ========================================
echo Africa Connect Logistic - Frontend Only
echo ========================================
echo.
echo Démarrage du frontend uniquement pour les tests...
echo.

cd frontend

echo Installation des dépendances...
call npm install

echo.
echo Démarrage du frontend...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Frontend: http://localhost:3000
echo.
echo Note: L'application fonctionnera en mode démo sans connexion à la base de données.
echo.

timeout /t 3 >nul
start http://localhost:3000
