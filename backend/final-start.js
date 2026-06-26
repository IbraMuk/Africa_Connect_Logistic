const { exec, spawn } = require('child_process');
const path = require('path');

console.log('\n🚀 DÉMARRAGE DÉFINITIF DU BACKEND\n');

// Fonction pour exécuter une commande
function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n📋 ${description}...`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Erreur: ${error.message}`);
        return reject(error);
      }
      console.log(`✅ ${description} terminé`);
      resolve(stdout);
    });
  });
}

// Démarrage propre
async function cleanStart() {
  try {
    // 1. Tuer tous les processus Node.js
    await runCommand('taskkill /F /IM node.exe /T 2>nul', 'Arrêt des processus Node.js');
    
    // 2. Attendre 3 secondes
    console.log('\n⏳ Attente de 3 secondes...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 3. Démarrer le backend avec node directement (pas nodemon)
    console.log('\n🔥 Démarrage du backend...');
    
    const backendProcess = spawn('node', ['server.js'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    });
    
    backendProcess.on('error', (error) => {
      console.error('\n❌ Erreur critique:', error.message);
    });
    
    backendProcess.on('close', (code) => {
      console.log(`\n📋 Backend arrêté (code: ${code})`);
    });
    
    console.log('\n✅ Backend démarré avec succès !');
    console.log('📍 API: http://localhost:5000');
    
  } catch (error) {
    console.error('\n💥 Erreur fatale:', error);
    process.exit(1);
  }
}

// Exécuter le démarrage
cleanStart();
