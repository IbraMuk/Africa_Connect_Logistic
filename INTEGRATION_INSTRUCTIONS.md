# Instructions pour intégrer le logo Africa Connect Logistic

## 📋 Résumé des modifications

J'ai créé un système unifié pour gérer le logo de votre entreprise Africa Connect Logistic dans toute l'application :

### ✅ Modifications apportées :

1. **Composant Logo réutilisable** (`frontend/src/components/Logo.tsx`)
   - Affiche automatiquement votre image si présente
   - Fallback vers SVG stylisé si l'image n'existe pas
   - Options flexibles : taille, texte personnalisé, etc.

2. **Intégration dans toute l'application** :
   - Page d'accueil (navbar + footer)
   - Page d'authentification
   - Sidebar principale (SharedLayout)
   - Sidebar DashboardDrawer
   - Layout de facturation
   - Page Dashboard

3. **Support PDF** :
   - Le logo sera automatiquement intégré dans les factures générées
   - Recherche automatique du fichier image

## 🖼️ Comment ajouter votre logo

### Étape 1 : Préparez votre fichier
- **Format** : PNG (recommandé), JPG ou JPEG
- **Taille** : 500x500px minimum pour une bonne qualité
- **Fond** : Transparent (PNG) ou blanc
- **Nom** : `logo.png` (recommandé)

### Étape 2 : Placez le fichier
Copiez votre fichier image dans :
```
frontend/public/images/logo.png
```

### Étape 3 : Redémarrez le serveur
```bash
npm run dev
```

## 🎯 Emplacements du logo dans l'application

| Page/Composant | Taille | Contexte |
|----------------|---------|----------|
| Navbar (page d'accueil) | 40px | Avec localisation |
| Footer | 40px | Avec localisation |
| Authentification | 64px | Logo seul |
| Sidebar SharedLayout | 32px | Avec texte dynamique |
| DashboardDrawer | 40px | Avec sous-titre |
| Facturation layout | 32px | Avec texte dynamique |
| Dashboard page | 64px | Avec icône spéciale |
| PDF (factures) | 50px | En-tête de document |

## 🔧 Personnalisation avancée

### Modifier le composant Logo
Si vous voulez ajuster le comportement :

```typescript
// Dans frontend/src/components/Logo.tsx
<Logo 
  size={40}           // Taille en pixels
  showText={true}      // Afficher le texte
  textClassName="custom-style"  // Classe CSS personnalisée
  subTitle="Custom subtitle"     // Sous-titre personnalisé
  className="wrapper-class"      // Classe du conteneur
/>
```

### Changer le nom du fichier
Si votre logo a un autre nom :

1. Modifiez `frontend/src/components/Logo.tsx`
2. Changez la ligne :
   ```typescript
   src="/images/logo.png"
   ```
3. Mettez votre nouveau nom de fichier

## 📱 Support des formats

Le composant supporte automatiquement :
- **PNG** (recommandé pour la transparence)
- **JPG/JPEG** (pour les photos)
- **SVG** (pour les graphiques vectoriels)

## 🚀 Vérification

Après avoir ajouté votre logo :

1. **Vérifiez les pages** :
   - Page d'accueil
   - Page d'authentification
   - Tableau de bord
   - Sidebar

2. **Testez les PDFs** :
   - Générez une facture
   - Vérifiez que le logo apparaît

3. **Responsive** :
   - Testez sur mobile et desktop

## 🎨 Fallback automatique

Si votre logo n'est pas trouvé, l'application affichera automatiquement :
- Un SVG stylisé avec icône de transport
- Les couleurs de votre marque (bleu/indigo)
- Le texte "Africa Connect Logistic"

## 📞 Support

Pour toute question sur l'intégration du logo :
- Vérifiez d'abord que le fichier est bien dans `frontend/public/images/`
- Assurez-vous que le nom du fichier correspond
- Redémarrez le serveur de développement

---

**Africa Connect Logistic - Système de gestion unifié**  
*Version 1.1 - Intégration logo complète*
