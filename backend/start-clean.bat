@echo off
echo 🔧 Arrêt de tous les processus Node.js...
taskkill /F /IM node.exe >nul 2>&1

echo ⏳ Attente de 3 secondes...
timeout /t 3 /nobreak >nul

echo 🚀 Démarrage du backend...
cd backend
npm run dev
