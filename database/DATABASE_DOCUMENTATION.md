# Documentation de la Base de Données - Africa Connect Logistic

## Vue d'ensemble

Cette base de données PostgreSQL est conçue pour gérer toutes les opérations de la plateforme Africa Connect Logistic, incluant le transport de personnel, de marchandises, la réservation de billets et les opérations d'import/export.

## Liste des Tables

### 1. **Users** (Utilisateurs)
Table principale contenant tous les utilisateurs du système.
- **Champs clés** : id, nom, prenom, email, password, role, statut
- **Rôles** : admin, client, chauffeur, gestionnaire
- **Utilisations** : Authentification, gestion des comptes

### 2. **Chauffeurs** (Profils des Chauffeurs)
Informations spécifiques aux chauffeurs.
- **Champs clés** : user_id, numero_permis, annee_experience, note_moyenne
- **Relations** : Lié à la table Users
- **Utilisations** : Gestion des chauffeurs, évaluations

### 3. **Vehicules** (Véhicules)
Catalogue des véhicules disponibles.
- **Champs clés** : chauffeur_id, marque, modele, immatriculation, capacite
- **Relations** : Lié à Chauffeurs
- **Utilisations** : Gestion de la flotte de véhicules

### 4. **TransportsPersonnel** (Transports de Personnel)
Gestion des transports pour le personnel.
- **Champs clés** : client_id, chauffeur_id, type_transport, prix, statut
- **Types** : navette, vip, collectif, individuel
- **Utilisations** : Réservations de transports de personnel

### 5. **TransportsMarchandise** (Transports de Marchandise)
Gestion des transports de marchandises.
- **Champs clés** : client_id, type_marchandise, poids, volume, valeur_marchandise
- **Types** : standard, fragile, dangereux, perissable, lourd, volumineux
- **Utilisations** : Expéditions de marchandises

### 6. **Billets** (Billets de Transport)
Réservations de billets pour différents modes de transport.
- **Champs clés** : client_id, type_voyage, type_transport, prix, statut
- **Types de transport** : bus, train, avion, bateau
- **Classes** : economique, business, premiere
- **Utilisations** : Réservations de billets

### 7. **ImportExports** (Opérations Import/Export)
Gestion des opérations commerciales internationales.
- **Champs clés** : client_id, type_operation, mode_transport, pays_origine, pays_destination
- **Modes** : maritime, aerien, routier, ferroviaire, multimodal
- **Utilisations** : suivi des expéditions internationales

### 8. **Factures** (Facturation)
Gestion des factures pour tous les services.
- **Champs clés** : client_id, numero_facture, montant_ttc, statut
- **Statuts** : brouillon, envoyée, payée, en_retard, annulée
- **Utilisations** : Facturation et suivi des paiements

### 9. **Paiements** (Paiements)
Historique des paiements effectués.
- **Champs clés** : facture_id, montant, mode_paiement, statut
- **Modes** : carte, virement, espèces, mobile_money
- **Utilisations** : Suivi des règlements

### 10. **Notifications** (Système de Notifications)
Gestion des notifications utilisateurs.
- **Champs clés** : user_id, titre, message, type, lue
- **Types** : info, success, warning, error
- **Utilisations** : Notifications en temps réel

### 11. **Avis** (Évaluations)
Évaluations des services par les clients.
- **Champs clés** : client_id, chauffeur_id, note, commentaire
- **Notes** : 1 à 5 étoiles
- **Utilisations** : Feedback et amélioration des services

### 12. **Tickets** (Support Client)
Tickets de support technique.
- **Champs clés** : client_id, sujet, categorie, priorite, statut
- **Priorités** : basse, normale, haute, urgente
- **Utilisations** : Support client

### 13. **TicketMessages** (Messages des Tickets)
Messages associés aux tickets de support.
- **Champs clés** : ticket_id, auteur_id, message, piece_jointe_url
- **Utilisations** : Communication support

### 14. **Documents** (Gestion Documentaire)
Stockage des documents utilisateurs.
- **Champs clés** : user_id, type_document, url_fichier, date_expiration
- **Types** : piece_identite, permis, passport, etc.
- **Utilisations** : KYC et vérifications

### 15. **Parametres** (Configuration Système)
Paramètres configurables du système.
- **Champs clés** : cle, valeur, description, type_valeur
- **Utilisations** : Configuration dynamique

### 16. **JournauxAudit** (Logs d'Audit)
Journalisation de toutes les actions importantes.
- **Champs clés** : user_id, action, table_concernee, nouvelles_valeurs
- **Utilisations** : Sécurité et conformité

### 17. **Promotions** (Codes Promotionnels)
Gestion des promotions et réductions.
- **Champs clés** : code, type_reduction, valeur_reduction, date_fin
- **Types** : pourcentage, montant_fixe
- **Utilisations** : Marketing et fidélisation

### 18. **PromotionUtilisations** (Utilisation des Promotions)
Suivi de l'utilisation des codes promotionnels.
- **Champs clés** : promotion_id, client_id, montant_reduction
- **Utilisations** : Analytics des promotions

## Types Énumérés (ENUMs)

### Types Utilisateur
- `user_role` : admin, client, chauffeur, gestionnaire
- `user_statut` : actif, inactif, suspendu

### Types Transport
- `transport_type` : navette, vip, collectif, individuel
- `transport_statut` : en_attente, confirmé, en_cours, terminé, annulé

### Types Marchandise
- `marchandise_type` : standard, fragile, dangereux, perissable, lourd, volumineux

### Types Billets
- `billet_type_voyage` : aller_simple, aller_retour
- `billet_type_transport` : bus, train, avion, bateau
- `billet_classe` : economique, business, premiere
- `billet_statut` : réservé, confirmé, checké, embarqué, annulé, remboursé

### Types Import/Export
- `operation_type` : import, export, transit
- `operation_statut` : préparation, douane_sortie, en_transit, douane_arrivée, livraison, terminé, annulé
- `mode_transport` : maritime, aerien, routier, ferroviaire, multimodal
- `incoterms_type` : EXW, FCA, FAS, FOB, CFR, CIF, CPT, CIP, DAP, DPU, DPP, DDP

### Types Financiers
- `paiement_statut` : en_attente, payé, remboursé
- `facture_statut` : brouillon, envoyée, payée, en_retard, annulée
- `devise_type` : USD, EUR, XOF, GBP, CNY

### Types Support
- `notification_type` : info, success, warning, error
- `ticket_statut` : ouvert, en_cours, résolu, fermé
- `ticket_priorite` : basse, normale, haute, urgente

## Index et Performance

Des index ont été créés sur les champs fréquemment utilisés dans les requêtes :
- Emails des utilisateurs
- Statuts des transports
- Dates de création
- Clés étrangères

## Triggers

Un trigger automatique met à jour le champ `updated_at` lors de chaque modification d'enregistrement.

## Sécurité

- Les mots de passe sont hashés (bcrypt recommandé)
- Les données sensibles sont journalisées
- Les accès sont contrôlés par rôles

## Installation

Utilisez le script `install_complete_database.bat` pour installer automatiquement la base de données.

## Sauvegarde

Il est recommandé d'effectuer des sauvegardes régulières :
```bash
pg_dump -U postgres africa_connect_logistic > backup.sql
```

## Restauration

Pour restaurer la base de données :
```bash
psql -U postgres africa_connect_logistic < backup.sql
```
