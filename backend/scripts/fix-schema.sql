-- Script pour corriger le schéma de la base de données

-- 1. Supprimer les contraintes par défaut problématiques
ALTER TABLE factures ALTER COLUMN statut DROP DEFAULT;

-- 2. Mettre à jour les valeurs NULL si existent
UPDATE factures SET statut = 'En attente' WHERE statut IS NULL;

-- 3. Recréer le type enum correct
DROP TYPE IF EXISTS enum_factures_statut;
CREATE TYPE enum_factures_statut AS ENUM ('En attente', 'Payée', 'En retard', 'Annulée');

-- 4. Modifier la colonne pour utiliser le nouveau type
ALTER TABLE factures ALTER COLUMN statut TYPE enum_factures_statut USING statut::enum_factures_statut;

-- 5. Ajouter une contrainte par défaut
ALTER TABLE factures ALTER COLUMN statut SET DEFAULT 'En attente';

-- 6. S'assurer que la colonne n'est pas nulle
ALTER TABLE factures ALTER COLUMN statut SET NOT NULL;

-- 7. Vérifier les tables clients
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'clients' AND table_schema = 'public';

-- 8. Vérifier les tables factures
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'factures' AND table_schema = 'public';
