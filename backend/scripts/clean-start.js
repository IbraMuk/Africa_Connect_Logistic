const { exec } = require('child_process');
const path = require('path');

console.log('🔹 Nettoyage complet du backend...\n');

// 1. Tuer tous les processus Node.js
console.log('1️⃣ Arrêt de tous les processus Node.js...');
exec('taskkill /F /IM node.exe /T', (error) => {
  if (error) {
    console.log('✅ Processus Node.js arrêtés');
  }
  
  // Attendre 2 secondes
  setTimeout(() => {
    // 2. Démarrer le backend
    console.log('\n2️⃣ Démarrage du backend...');
    const backend = exec('cd backend && node server.js', {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit'
    });
    
    backend.on('error', (error) => {
      console.error('❌ Erreur de démarrage:', error);
    });
    
    backend.on('close', (code) => {
      console.log(`\n📋 Backend arrêté avec le code: ${code}`);
    });
  }, 2000);
});
