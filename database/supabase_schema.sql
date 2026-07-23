-- Schéma Supabase pour Africa Connect Logistic
-- À exécuter dans l'éditeur SQL de Supabase (SQL Editor > New query)
-- Supabase fournit déjà une base de données, donc on ne fait pas CREATE DATABASE.

-- 1. Définir le schéma par défaut
SET search_path = public, extensions;

-- 2. Créer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 3. Créer les types énumérés (ignorer si déjà existants)
DO $$
BEGIN
    BEGIN CREATE TYPE user_role AS ENUM ('admin', 'client', 'chauffeur', 'gestionnaire'); EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN CREATE TYPE user_statut AS ENUM ('actif', 'inactif', 'suspendu'); EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN CREATE TYPE transport_type AS ENUM ('navette', 'vip', 'collectif', 'individuel'); EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN CREATE TYPE transport_statut AS ENUM ('en_attente', 'confirmé', 'en_cours', 'terminé', 'annulé'); EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN CREATE TYPE paiement_statut AS ENUM ('en_attente', 'payé', 'remboursé'); EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN CREATE TYPE marchandise_type AS ENUM ('standard', 'fragile', 'dangereux', 'perissable', 'lourde', 'volumineux'); EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN CREATE TYPE billet_type_voyage AS ENUM ('aller_simple', 'aller_retour'); EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN CREATE TYPE billet_type_transport AS ENUM ('bus', 'train', 'avion', 'bateau'); EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN CREATE TYPE billet_classe AS ENUM ('economique', 'business', 'premiere'); EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN CREATE TYPE billet_statut AS ENUM ('réservé', 'confirmé', 'checké', 'embarqué', 'annulé', 'remboursé'); EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN CREATE TYPE operation_type AS ENUM ('import', 'export', 'transit'); EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN CREATE TYPE operation_statut AS ENUM ('préparation', 'douane_sortie', 'en_transit', 'douane_arrivée', 'livraison', 'terminé', 'annulé'); EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN CREATE TYPE incoterms_type AS ENUM ('EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DPP', 'DDP'); EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN CREATE TYPE mode_transport AS ENUM ('maritime', 'aerien', 'routier', 'ferroviaire', 'multimodal'); EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN CREATE TYPE marchandise_general_type AS ENUM ('general', 'dangerux', 'perissable', 'electronique', 'vehicule', 'textile', 'agricole'); EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

-- 4. Créer la table des utilisateurs
CREATE TABLE IF NOT EXISTS Users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    role user_role DEFAULT 'client',
    statut user_statut DEFAULT 'actif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Créer la table des transports de personnel
CREATE TABLE IF NOT EXISTS TransportsPersonnel (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clientId UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    chauffeurId UUID REFERENCES Users(id) ON DELETE SET NULL,
    typeTransport transport_type NOT NULL,
    pointDepart VARCHAR(200) NOT NULL,
    pointArrivee VARCHAR(200) NOT NULL,
    dateHeureDepart TIMESTAMP WITH TIME ZONE NOT NULL,
    dateHeureArrivee TIMESTAMP WITH TIME ZONE,
    nombrePersonnes INTEGER NOT NULL CHECK (nombrePersonnes >= 1 AND nombrePersonnes <= 50),
    informationsPassagers JSONB DEFAULT '[]',
    vehicule VARCHAR(100),
    immatriculation VARCHAR(20),
    prix DECIMAL(10,2) NOT NULL CHECK (prix >= 0),
    statut transport_statut DEFAULT 'en_attente',
    paiementStatut paiement_statut DEFAULT 'en_attente',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Créer la table des transports de marchandise
CREATE TABLE IF NOT EXISTS TransportsMarchandise (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clientId UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    chauffeurId UUID REFERENCES Users(id) ON DELETE SET NULL,
    typeMarchandise marchandise_type NOT NULL,
    description TEXT NOT NULL,
    poids DECIMAL(10,2) NOT NULL CHECK (poids > 0),
    volume DECIMAL(10,2) CHECK (volume >= 0),
    pointEnlevement VARCHAR(200) NOT NULL,
    pointLivraison VARCHAR(200) NOT NULL,
    dateEnlevement TIMESTAMP WITH TIME ZONE NOT NULL,
    dateLivraisonPrevue TIMESTAMP WITH TIME ZONE NOT NULL,
    dateLivraisonReelle TIMESTAMP WITH TIME ZONE,
    vehicule VARCHAR(100),
    immatriculation VARCHAR(20),
    prix DECIMAL(10,2) NOT NULL CHECK (prix >= 0),
    statut transport_statut DEFAULT 'en_attente',
    paiementStatut paiement_statut DEFAULT 'en_attente',
    assurance BOOLEAN DEFAULT false,
    valeurAssurance DECIMAL(12,2) CHECK (valeurAssurance >= 0),
    instructionsSpeciales TEXT,
    photos JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Créer la table des billets
CREATE TABLE IF NOT EXISTS Billets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clientId UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    typeVoyage billet_type_voyage NOT NULL,
    typeTransport billet_type_transport NOT NULL,
    numeroVol VARCHAR(20),
    compagnie VARCHAR(100) NOT NULL,
    depart VARCHAR(100) NOT NULL,
    arrivee VARCHAR(100) NOT NULL,
    dateHeureDepart TIMESTAMP WITH TIME ZONE NOT NULL,
    dateHeureArrivee TIMESTAMP WITH TIME ZONE NOT NULL,
    dateHeureDepartRetour TIMESTAMP WITH TIME ZONE,
    dateHeureArriveeRetour TIMESTAMP WITH TIME ZONE,
    classe billet_classe DEFAULT 'economique',
    numeroSiege VARCHAR(10),
    passagers JSONB NOT NULL DEFAULT '[]',
    prix DECIMAL(10,2) NOT NULL CHECK (prix >= 0),
    taxes DECIMAL(10,2) DEFAULT 0 CHECK (taxes >= 0),
    fraisService DECIMAL(10,2) DEFAULT 0 CHECK (fraisService >= 0),
    prixTotal DECIMAL(10,2) NOT NULL CHECK (prixTotal >= 0),
    statut billet_statut DEFAULT 'réservé',
    paiementStatut paiement_statut DEFAULT 'en_attente',
    referenceReservation VARCHAR(20) NOT NULL UNIQUE,
    codeConfirmation VARCHAR(20),
    bagages JSONB DEFAULT '[]',
    servicesSupplementaires JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Créer la table des opérations d'import/export
CREATE TABLE IF NOT EXISTS ImportExports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clientId UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    typeOperation operation_type NOT NULL,
    numeroDeclaration VARCHAR(50) UNIQUE,
    paysOrigine VARCHAR(100) NOT NULL,
    paysDestination VARCHAR(100) NOT NULL,
    portDepart VARCHAR(100) NOT NULL,
    portArrivee VARCHAR(100) NOT NULL,
    typeMarchandise marchandise_general_type NOT NULL,
    descriptionDetaillee TEXT NOT NULL,
    poidsTotal DECIMAL(12,2) NOT NULL CHECK (poidsTotal > 0),
    volumeTotal DECIMAL(12,2) CHECK (volumeTotal >= 0),
    nombreConteneurs INTEGER DEFAULT 0 CHECK (nombreConteneurs >= 0),
    typeConteneurs JSONB DEFAULT '[]',
    incoterms incoterms_type NOT NULL,
    modeTransport mode_transport NOT NULL,
    dateExpedition TIMESTAMP WITH TIME ZONE NOT NULL,
    dateArriveePrevue TIMESTAMP WITH TIME ZONE NOT NULL,
    dateArriveeReelle TIMESTAMP WITH TIME ZONE,
    valeurMarchandise DECIMAL(15,2) NOT NULL CHECK (valeurMarchandise >= 0),
    devise VARCHAR(3) DEFAULT 'USD',
    coutTransport DECIMAL(12,2) NOT NULL CHECK (coutTransport >= 0),
    coutDouane DECIMAL(12,2) DEFAULT 0 CHECK (coutDouane >= 0),
    coutAssurance DECIMAL(12,2) DEFAULT 0 CHECK (coutAssurance >= 0),
    coutTotal DECIMAL(12,2) NOT NULL CHECK (coutTotal >= 0),
    statut operation_statut DEFAULT 'préparation',
    documents JSONB DEFAULT '[]',
    certificats JSONB DEFAULT '[]',
    numeroSuivi VARCHAR(30) UNIQUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON Users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON Users(role);
CREATE INDEX IF NOT EXISTS idx_users_statut ON Users(statut);
CREATE INDEX IF NOT EXISTS idx_transports_personnel_client ON TransportsPersonnel(clientId);
CREATE INDEX IF NOT EXISTS idx_transports_personnel_chauffeur ON TransportsPersonnel(chauffeurId);
CREATE INDEX IF NOT EXISTS idx_transports_personnel_statut ON TransportsPersonnel(statut);
CREATE INDEX IF NOT EXISTS idx_transports_personnel_date_depart ON TransportsPersonnel(dateHeureDepart);
CREATE INDEX IF NOT EXISTS idx_transports_marchandise_client ON TransportsMarchandise(clientId);
CREATE INDEX IF NOT EXISTS idx_transports_marchandise_chauffeur ON TransportsMarchandise(chauffeurId);
CREATE INDEX IF NOT EXISTS idx_transports_marchandise_statut ON TransportsMarchandise(statut);
CREATE INDEX IF NOT EXISTS idx_transports_marchandise_date_enlevement ON TransportsMarchandise(dateEnlevement);
CREATE INDEX IF NOT EXISTS idx_billets_client ON Billets(clientId);
CREATE INDEX IF NOT EXISTS idx_billets_reference ON Billets(referenceReservation);
CREATE INDEX IF NOT EXISTS idx_billets_statut ON Billets(statut);
CREATE INDEX IF NOT EXISTS idx_billets_date_depart ON Billets(dateHeureDepart);
CREATE INDEX IF NOT EXISTS idx_import_exports_client ON ImportExports(clientId);
CREATE INDEX IF NOT EXISTS idx_import_exports_type ON ImportExports(typeOperation);
CREATE INDEX IF NOT EXISTS idx_import_exports_statut ON ImportExports(statut);
CREATE INDEX IF NOT EXISTS idx_import_exports_numero_suivi ON ImportExports(numeroSuivi);
CREATE INDEX IF NOT EXISTS idx_import_exports_date_expedition ON ImportExports(dateExpedition);

-- 10. Créer les triggers pour mettre à jour les timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON Users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON Users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transports_personnel_updated_at ON TransportsPersonnel;
CREATE TRIGGER update_transports_personnel_updated_at
    BEFORE UPDATE ON TransportsPersonnel
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_transports_marchandise_updated_at ON TransportsMarchandise;
CREATE TRIGGER update_transports_marchandise_updated_at
    BEFORE UPDATE ON TransportsMarchandise
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_billets_updated_at ON Billets;
CREATE TRIGGER update_billets_updated_at
    BEFORE UPDATE ON Billets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_import_exports_updated_at ON ImportExports;
CREATE TRIGGER update_import_exports_updated_at
    BEFORE UPDATE ON ImportExports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Insérer un utilisateur admin par défaut (mot de passe: admin123)
INSERT INTO Users (nom, prenom, email, password, role, statut)
VALUES ('Admin', 'System', 'admin@africaconnect.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5e', 'admin', 'actif')
ON CONFLICT (email) DO NOTHING;

-- 12. Créer quelques données de test
INSERT INTO Users (nom, prenom, email, password, telephone, role, statut) VALUES
('Sow', 'Alassane', 'alassane.sow@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5e', '+221771234567', 'client', 'actif'),
('Diop', 'Fatou', 'fatou.diop@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5e', '+221762345678', 'client', 'actif'),
('Fall', 'Baba', 'baba.fall@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5e', '+221783456789', 'chauffeur', 'actif')
ON CONFLICT (email) DO NOTHING;
