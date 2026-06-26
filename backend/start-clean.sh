#!/bin/bash

echo "🔧 Arrêt de tous les processus Node.js..."
taskkill /F /IM node.exe 2>nul

echo "⏳ Attente de 3 secondes..."
timeout /t 3 /nobreak >nul

echo "🚀 Démarrage du backend..."
cd backend
npm run dev
