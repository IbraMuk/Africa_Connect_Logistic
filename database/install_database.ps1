# Script d'installation de la base de données Africa Connect Logistic
# Pour PowerShell sur Windows

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation de la base de données" -ForegroundColor Cyan
Write-Host "Africa Connect Logistic" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si PostgreSQL est installé
try {
    $psqlVersion = & psql --version 2>$null
    Write-Host "PostgreSQL trouvé: $psqlVersion" -ForegroundColor Green
} catch {
    Write-Host "ERREUR: PostgreSQL n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    Write-Host "Veuillez installer PostgreSQL depuis https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

Write-Host ""

# Demander le mot de passe postgres
$pgPassword = Read-Host "Entrez le mot de passe de l'utilisateur postgres" -AsSecureString
$pgPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pgPassword))

# Définir la variable d'environnement pour le mot de passe
$env:PGPASSWORD = $pgPasswordPlain

Write-Host ""
Write-Host "Création de la base de données..." -ForegroundColor Yellow
Write-Host ""

# Exécuter le script SQL
try {
    & psql -U postgres -f create_database.sql
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "SUCCES: Base de données créée avec succès!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Utilisateur par défaut:" -ForegroundColor Cyan
        Write-Host "Email: admin@africaconnect.com" -ForegroundColor White
        Write-Host "Mot de passe: admin123" -ForegroundColor White
        Write-Host ""
        Write-Host "N'oubliez pas de configurer votre fichier .env avec:" -ForegroundColor Yellow
        Write-Host "DB_HOST=localhost" -ForegroundColor White
        Write-Host "DB_PORT=5432" -ForegroundColor White
        Write-Host "DB_NAME=africa_connect_logistic" -ForegroundColor White
        Write-Host "DB_USER=postgres" -ForegroundColor White
        Write-Host "DB_PASSWORD=votre_mot_de_passe_postgres" -ForegroundColor White
    }
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "ERREUR: La création a échoué!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Message d'erreur: $_" -ForegroundColor Red
    Write-Host "Vérifiez le mot de passe et réessayez." -ForegroundColor Yellow
}

# Nettoyer la variable d'environnement
Remove-Item Env:PGPASSWORD

Write-Host ""
Read-Host "Appuyez sur Entrée pour quitter"
