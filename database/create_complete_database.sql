-- Création complète de la base de données Africa Connect Logistic
-- Version complète avec toutes les tables nécessaires

-- 1. Créer la base de données
CREATE DATABASE africa_connect_logistic
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Se connecter à la nouvelle base de données
\c africa_connect_logistic;

-- 2. Créer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 3. Créer les types énumérés
CREATE TYPE user_role AS ENUM ('admin', 'client', 'chauffeur', 'gestionnaire');
CREATE TYPE user_statut AS ENUM ('actif', 'inactif', 'suspendu');
CREATE TYPE transport_type AS ENUM ('navette', 'vip', 'collectif', 'individuel');
CREATE TYPE transport_statut AS ENUM ('en_attente', 'confirmé', 'en_cours', 'terminé', 'annulé');
CREATE TYPE paiement_statut AS ENUM ('en_attente', 'payé', 'remboursé');
CREATE TYPE marchandise_type AS ENUM ('standard', 'fragile', 'dangereux', 'perissable', 'lourde', 'volumineux');
CREATE TYPE billet_type_voyage AS ENUM ('aller_simple', 'aller_retour');
CREATE TYPE billet_type_transport AS ENUM ('bus', 'train', 'avion', 'bateau');
CREATE TYPE billet_classe AS ENUM ('economique', 'business', 'premiere');
CREATE TYPE billet_statut AS ENUM ('réservé', 'confirmé', 'checké', 'embarqué', 'annulé', 'remboursé');
CREATE TYPE operation_type AS ENUM ('import', 'export', 'transit');
CREATE TYPE operation_statut AS ENUM ('préparation', 'douane_sortie', 'en_transit', 'douane_arrivée', 'livraison', 'terminé', 'annulé');
CREATE TYPE incoterms_type AS ENUM ('EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DPP', 'DDP');
CREATE TYPE mode_transport AS ENUM ('maritime', 'aerien', 'routier', 'ferroviaire', 'multimodal');
CREATE TYPE devise_type AS ENUM ('USD', 'EUR', 'XOF', 'GBP', 'CNY');
CREATE TYPE facture_statut AS ENUM ('brouillon', 'envoyée', 'payée', 'en_retard', 'annulée');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');
CREATE TYPE ticket_statut AS ENUM ('ouvert', 'en_cours', 'résolu', 'fermé');
CREATE TYPE ticket_priorite AS ENUM ('basse', 'normale', 'haute', 'urgente');

-- 4. Table des utilisateurs
CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    adresse TEXT,
    photo_url VARCHAR(500),
    date_naissance DATE,
    lieu_naissance VARCHAR(100),
    numero_piece_identite VARCHAR(50),
    type_piece_identite VARCHAR(20),
    date_expiration_piece DATE,
    role user_role DEFAULT 'client',
    statut user_statut DEFAULT 'actif',
    last_login TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table des profils de chauffeurs
CREATE TABLE Chauffeurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    numero_permis VARCHAR(50) NOT NULL UNIQUE,
    date_expiration_permis DATE,
    categorie_permis VARCHAR(20),
    annee_experience INTEGER,
    vehicule_personnel BOOLEAN DEFAULT FALSE,
    disponibilites TEXT[], -- Tableau des jours disponibles
    note_moyenne DECIMAL(3,2) DEFAULT 0,
    nombre_avis INTEGER DEFAULT 0,
    statut user_statut DEFAULT 'actif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Table des véhicules
CREATE TABLE Vehicules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chauffeur_id UUID REFERENCES Chauffeurs(id) ON DELETE SET NULL,
    marque VARCHAR(50) NOT NULL,
    modele VARCHAR(50) NOT NULL,
    annee INTEGER NOT NULL,
    immatriculation VARCHAR(20) NOT NULL UNIQUE,
    type_vehicule VARCHAR(30) NOT NULL, -- voiture, camion, bus, van, etc.
    capacite INTEGER, -- nombre de passagers ou poids en kg
    couleur VARCHAR(30),
    numero_chassis VARCHAR(50),
    date_mise_circulation DATE,
    date_expiration_assurance DATE,
    date_expiration_controle_technique DATE,
    statut user_statut DEFAULT 'actif',
    photo_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Table des transports de personnel
CREATE TABLE TransportsPersonnel (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES Users(id),
    chauffeur_id UUID REFERENCES Chauffeurs(id),
    vehicule_id UUID REFERENCES Vehicules(id),
    type_transport transport_type NOT NULL,
    point_depart TEXT NOT NULL,
    point_arrivee TEXT NOT NULL,
    date_heure_depart TIMESTAMP WITH TIME ZONE NOT NULL,
    date_heure_arrivee_estimee TIMESTAMP WITH TIME ZONE,
    nombre_passagers INTEGER NOT NULL DEFAULT 1,
    informations_supplementaires TEXT,
    prix NUMERIC(10,2) NOT NULL,
    devise devise_type DEFAULT 'USD',
    statut transport_statut DEFAULT 'en_attente',
    paiement_statut paiement_statut DEFAULT 'en_attente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Table des transports de marchandise
CREATE TABLE TransportsMarchandise (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES Users(id),
    chauffeur_id UUID REFERENCES Chauffeurs(id),
    vehicule_id UUID REFERENCES Vehicules(id),
    type_marchandise marchandise_type NOT NULL,
    point_enlevement TEXT NOT NULL,
    point_livraison TEXT NOT NULL,
    date_heure_enlevement TIMESTAMP WITH TIME ZONE NOT NULL,
    date_heure_livraison_estimee TIMESTAMP WITH TIME ZONE,
    poids NUMERIC(10,2), -- en kg
    volume NUMERIC(10,2), -- en m3
    description_marchandise TEXT,
    instructions_manipulation TEXT,
    valeur_marchandise NUMERIC(15,2),
    devise devise_type DEFAULT 'USD',
    assurance BOOLEAN DEFAULT FALSE,
    prix NUMERIC(10,2) NOT NULL,
    statut transport_statut DEFAULT 'en_attente',
    paiement_statut paiement_statut DEFAULT 'en_attente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Table des billets
CREATE TABLE Billets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES Users(id),
    type_voyage billet_type_voyage NOT NULL,
    type_transport billet_type_transport NOT NULL,
    classe billet_classe DEFAULT 'economique',
    compagnie VARCHAR(100),
    numero_vol VARCHAR(20),
    numero_train VARCHAR(20),
    numero_bus VARCHAR(20),
    numero_bateau VARCHAR(20),
    depart VARCHAR(100) NOT NULL,
    arrivee VARCHAR(100) NOT NULL,
    date_heure_depart TIMESTAMP WITH TIME ZONE NOT NULL,
    date_heure_arrivee TIMESTAMP WITH TIME ZONE,
    date_heure_depart_retour TIMESTAMP WITH TIME ZONE,
    date_heure_arrivee_retour TIMESTAMP WITH TIME ZONE,
    numero_siege VARCHAR(10),
    numero_wagon VARCHAR(10),
    numero_cabine VARCHAR(10),
    nom_passager VARCHAR(100) NOT NULL,
    prix NUMERIC(10,2) NOT NULL,
    devise devise_type DEFAULT 'USD',
    taxes NUMERIC(10,2) DEFAULT 0,
    frais_service NUMERIC(10,2) DEFAULT 0,
    statut billet_statut DEFAULT 'réservé',
    paiement_statut paiement_statut DEFAULT 'en_attente',
    code_reservation VARCHAR(20) UNIQUE,
    code_e_ticket VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Table des opérations d'import/export
CREATE TABLE ImportExports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES Users(id),
    type_operation operation_type NOT NULL,
    mode_transport mode_transport NOT NULL,
    pays_origine VARCHAR(100),
    pays_destination VARCHAR(100),
    port_depart VARCHAR(100),
    port_arrivee VARCHAR(100),
    aeroport_depart VARCHAR(100),
    aeroport_arrivee VARCHAR(100),
    adresse_enlevement TEXT,
    adresse_livraison TEXT,
    date_enlevement TIMESTAMP WITH TIME ZONE,
    date_livraison_estimee TIMESTAMP WITH TIME ZONE,
    incoterms incoterms_type,
    description_marchandise TEXT,
    type_marchandise marchandise_general_type,
    poids NUMERIC(10,2), -- en tonnes
    volume NUMERIC(10,2), -- en m3
    nombre_conteneurs INTEGER DEFAULT 0,
    type_conteneurs VARCHAR(50), -- 20p, 40p, 40p HC, etc.
    valeur_marchandise NUMERIC(15,2),
    devise devise_type DEFAULT 'USD',
    numero_declaration_douane VARCHAR(50),
    documents_requis TEXT[],
    statut operation_statut DEFAULT 'préparation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Table des factures
CREATE TABLE Factures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES Users(id),
    numero_facture VARCHAR(50) UNIQUE NOT NULL,
    type_facture VARCHAR(50), -- transport_personnel, transport_marchandise, billet, import_export
    reference_id UUID, -- Référence à l'élément facturé
    date_emission DATE NOT NULL DEFAULT CURRENT_DATE,
    date_echeance DATE NOT NULL,
    montant_ht NUMERIC(15,2) NOT NULL,
    montant_tva NUMERIC(15,2) DEFAULT 0,
    montant_ttc NUMERIC(15,2) NOT NULL,
    devise devise_type DEFAULT 'USD',
    statut facture_statut DEFAULT 'brouillon',
    conditions_paiement TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Table des paiements
CREATE TABLE Paiements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facture_id UUID REFERENCES Factures(id),
    client_id UUID NOT NULL REFERENCES Users(id),
    montant NUMERIC(15,2) NOT NULL,
    devise devise_type DEFAULT 'USD',
    mode_paiement VARCHAR(50), -- carte, virement, espèces, mobile_money, etc.
    reference_paiement VARCHAR(100),
    date_paiement TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    statut paiement_statut DEFAULT 'en_attente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Table des notifications
CREATE TABLE Notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES Users(id),
    titre VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'info',
    lue BOOLEAN DEFAULT FALSE,
    date_lecture TIMESTAMP WITH TIME ZONE,
    reference_id UUID, -- Référence à l'élément concerné
    reference_type VARCHAR(50), -- Type de l'élément référencé
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Table des avis et évaluations
CREATE TABLE Avis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES Users(id),
    chauffeur_id UUID REFERENCES Chauffeurs(id),
    transport_id UUID, -- Peut référencer n'importe quel type de transport
    type_transport VARCHAR(50), -- transport_personnel, transport_marchandise
    note INTEGER NOT NULL CHECK (note >= 1 AND note <= 5),
    commentaire TEXT,
    date_avis TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Table des tickets de support
CREATE TABLE Tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES Users(id),
    sujet VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    categorie VARCHAR(50), -- technique, facturation, réservation, etc.
    priorite ticket_priorite DEFAULT 'normale',
    statut ticket_statut DEFAULT 'ouvert',
    assigne_a UUID REFERENCES Users(id), -- Assigné à un employé
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Table des messages de tickets
CREATE TABLE TicketMessages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES Tickets(id) ON DELETE CASCADE,
    auteur_id UUID NOT NULL REFERENCES Users(id),
    message TEXT NOT NULL,
    piece_jointe_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Table des documents
CREATE TABLE Documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES Users(id),
    type_document VARCHAR(50), -- piece_identite, permis, passport, etc.
    nom_fichier VARCHAR(255) NOT NULL,
    url_fichier VARCHAR(500) NOT NULL,
    taille_fichier INTEGER,
    type_fichier VARCHAR(50),
    date_expiration DATE,
    statut user_statut DEFAULT 'actif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. Table des paramètres système
CREATE TABLE Parametres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cle VARCHAR(100) UNIQUE NOT NULL,
    valeur TEXT,
    description TEXT,
    type_valeur VARCHAR(20), -- string, number, boolean, json
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. Table des journaux d'audit
CREATE TABLE JournauxAudit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES Users(id),
    action VARCHAR(100) NOT NULL,
    table_concernee VARCHAR(100),
    id_enregistrement_concerne UUID,
    anciennes_valeurs JSONB,
    nouvelles_valeurs JSONB,
    adresse_ip VARCHAR(45),
    user_agent TEXT,
    date_action TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 20. Table des promotions et réductions
CREATE TABLE Promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    nom VARCHAR(200) NOT NULL,
    description TEXT,
    type_reduction VARCHAR(20), -- pourcentage, montant_fixe
    valeur_reduction NUMERIC(10,2) NOT NULL,
    montant_minimum NUMERIC(10,2),
    devise devise_type DEFAULT 'USD',
    date_debut DATE,
    date_fin DATE,
    nombre_utilisations_max INTEGER,
    nombre_utilisations INTEGER DEFAULT 0,
    type_service VARCHAR(50), -- tous, transport_personnel, etc.
    statut user_statut DEFAULT 'actif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 21. Table des utilisations de promotions
CREATE TABLE PromotionUtilisations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promotion_id UUID NOT NULL REFERENCES Promotions(id),
    client_id UUID NOT NULL REFERENCES Users(id),
    facture_id UUID REFERENCES Factures(id),
    montant_reduction NUMERIC(10,2) NOT NULL,
    devise devise_type DEFAULT 'USD',
    date_utilisation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les performances
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_role ON Users(role);
CREATE INDEX idx_users_statut ON Users(statut);
CREATE INDEX idx_transports_personnel_client ON TransportsPersonnel(client_id);
CREATE INDEX idx_transports_personnel_statut ON TransportsPersonnel(statut);
CREATE INDEX idx_transports_marchandise_client ON TransportsMarchandise(client_id);
CREATE INDEX idx_transports_marchandise_statut ON TransportsMarchandise(statut);
CREATE INDEX idx_billets_client ON Billets(client_id);
CREATE INDEX idx_billets_statut ON Billets(statut);
CREATE INDEX idx_import_exports_client ON ImportExports(client_id);
CREATE INDEX idx_import_exports_statut ON ImportExports(statut);
CREATE INDEX idx_factures_client ON Factures(client_id);
CREATE INDEX idx_factures_statut ON Factures(statut);
CREATE INDEX idx_notifications_user ON Notifications(user_id);
CREATE INDEX idx_notifications_lue ON Notifications(lue);
CREATE INDEX idx_tickets_client ON Tickets(client_id);
CREATE INDEX idx_tickets_statut ON Tickets(statut);
CREATE INDEX idx_avis_chauffeur ON Avis(chauffeur_id);
CREATE INDEX idx_documents_user ON Documents(user_id);
CREATE INDEX idx_journaux_audit_user ON JournauxAudit(user_id);
CREATE INDEX idx_journaux_audit_date ON JournauxAudit(date_action);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger aux tables qui ont updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON Users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chauffeurs_updated_at BEFORE UPDATE ON Chauffeurs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicules_updated_at BEFORE UPDATE ON Vehicules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transports_personnel_updated_at BEFORE UPDATE ON TransportsPersonnel FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transports_marchandise_updated_at BEFORE UPDATE ON TransportsMarchandise FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_billets_updated_at BEFORE UPDATE ON Billets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_import_exports_updated_at BEFORE UPDATE ON ImportExports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_factures_updated_at BEFORE UPDATE ON Factures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_paiements_updated_at BEFORE UPDATE ON Paiements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON Tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON Documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parametres_updated_at BEFORE UPDATE ON Parametres FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON Promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insérer les données initiales
INSERT INTO Users (id, nom, prenom, email, password, role, statut) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Admin', 'System', 'admin@africaconnect.com', '$2b$10$YourHashedPasswordHere', 'admin', 'actif');

-- Insérer les paramètres système initiaux
INSERT INTO Parametres (cle, valeur, description, type_valeur) VALUES
('nom_entreprise', 'Africa Connect Logistic', 'Nom de l''entreprise', 'string'),
('adresse_entreprise', 'Dakar, Sénégal', 'Adresse de l''entreprise', 'string'),
('telephone_entreprise', '+221 33 123 45 67', 'Téléphone de l''entreprise', 'string'),
('email_entreprise', 'info@africaconnect.com', 'Email de l''entreprise', 'string'),
('devise_defaut', 'USD', 'Devise par défaut', 'string'),
('tva_defaut', '18', 'TVA par défaut en pourcentage', 'number'),
('delai_paiement_facture', '30', 'Délai de paiement des factures en jours', 'number');

COMMIT;
