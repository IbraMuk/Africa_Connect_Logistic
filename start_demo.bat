@echo off
echo ========================================
echo Africa Connect Logistic - Mode Démonstration
echo ========================================
echo.
echo Ce mode permet de tester l'application sans base de données.
echo.

echo [1/2] Démarrage du backend (mode démo)...
cd backend
start "Backend Demo Server" cmd /k "node server-demo.js"

echo.
echo [2/2] Le frontend est déjà en cours d'exécution.
echo.

echo ========================================
echo   APPLICATION EN MODE DÉMONSTRATION
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000
echo.
echo Connexion démo:
echo Email: admin@africaconnect.com
echo Mot de passe: admin123
echo.
echo Note: Les données sont simulées et non persistées.
echo.

timeout /t 3 >nul
start http://localhost:3000
