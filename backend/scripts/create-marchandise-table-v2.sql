-- Script de création de la table marchandises (version 2)
-- Exécuter ce script dans PostgreSQL pour créer la table avec les catégories

-- Création de la table categories (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des catégories
INSERT INTO categories (nom, categorie) VALUES
('Référence générique', 'Produits agricoles & agroalimentaires'),
('Référence générique', 'Produits industriels & manufacturés'),
('Référence générique', 'Véhicules & pièces détachées'),
('Référence générique', 'Textile, mode & accessoires'),
('Référence générique', 'Produits pharmaceutiques & médicaux'),
('Référence générique', 'Cosmétiques & hygiène'),
('Référence générique', 'Matières premières'),
('Référence générique', 'Électronique & télécoms'),
('Référence générique', 'Mobilier & décoration'),
('Référence générique', 'Boissons & alcools')
ON CONFLICT (nom, categorie) DO NOTHING;

-- Création de la table marchandises
CREATE TABLE IF NOT EXISTS marchandises (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(50) NOT NULL UNIQUE,
    designation VARCHAR(255) NOT NULL,
    categorieId INTEGER,
    poids DECIMAL(10,2) NOT NULL CHECK (poids > 0),
    volume DECIMAL(10,3) NOT NULL CHECK (volume > 0),
    expediteurId INTEGER NOT NULL,
    destinataireNom VARCHAR(255) NOT NULL,
    destinataireTelephone VARCHAR(50) NOT NULL,
    destinataireEmail VARCHAR(255),
    destinataireAdresse TEXT,
    villeDepart VARCHAR(255) NOT NULL,
    villeArrivee VARCHAR(255) NOT NULL,
    adresseRamassage TEXT,
    adresseLivraison TEXT,
    dateEnvoi DATE NOT NULL DEFAULT CURRENT_DATE,
    dateLivraisonPrevue DATE,
    dateLivraisonReelle DATE,
    statut VARCHAR(20) NOT NULL DEFAULT 'En attente' 
        CHECK (statut IN ('En attente', 'En transit', 'Livré', 'Retardé', 'Perdu')),
    priorite VARCHAR(20) NOT NULL DEFAULT 'Normale'
        CHECK (priorite IN ('Basse', 'Normale', 'Haute', 'Urgente')),
    typeTransport VARCHAR(20) NOT NULL DEFAULT 'Routier'
        CHECK (typeTransport IN ('Routier', 'Aérien', 'Maritime', 'Ferroviaire')),
    instructionsSpeciales TEXT,
    valeurDeclaree DECIMAL(12,2),
    assurance BOOLEAN NOT NULL DEFAULT FALSE,
    numeroSuivi VARCHAR(100) UNIQUE,
    chauffeurId INTEGER,
    vehiculeId INTEGER,
    coutTransport DECIMAL(10,2),
    reglementStatut VARCHAR(20) NOT NULL DEFAULT 'Non payé'
        CHECK (reglementStatut IN ('Non payé', 'Partiellement payé', 'Payé')),
    createdById INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajout des contraintes de clé étrangère
ALTER TABLE marchandises 
    ADD CONSTRAINT fk_marchandise_expediteur 
    FOREIGN KEY (expediteurId) REFERENCES clients(id) ON DELETE RESTRICT;

ALTER TABLE marchandises 
    ADD CONSTRAINT fk_marchandise_categorie 
    FOREIGN KEY (categorieId) REFERENCES categories(id) ON DELETE SET NULL;

ALTER TABLE marchandises 
    ADD CONSTRAINT fk_marchandise_chauffeur 
    FOREIGN KEY (chauffeurId) REFERENCES personnel(id) ON DELETE SET NULL;

ALTER TABLE marchandises 
    ADD CONSTRAINT fk_marchandise_vehicule 
    FOREIGN KEY (vehiculeId) REFERENCES vehicules(id) ON DELETE SET NULL;

ALTER TABLE marchandises 
    ADD CONSTRAINT fk_marchandise_createur 
    FOREIGN KEY (createdById) REFERENCES users(id) ON DELETE SET NULL;

-- Création des index pour optimiser les performances
CREATE INDEX idx_marchandise_reference ON marchandises(reference);
CREATE INDEX idx_marchandise_expediteur ON marchandises(expediteurId);
CREATE INDEX idx_marchandise_categorieId ON marchandises(categorieId);
CREATE INDEX idx_marchandise_statut ON marchandises(statut);
CREATE INDEX idx_marchandise_dateEnvoi ON marchandises(dateEnvoi);
CREATE INDEX idx_marchandise_numeroSuivi ON marchandises(numeroSuivi);
CREATE INDEX idx_marchandise_villes ON marchandises(villeDepart, villeArrivee);

-- Création d'une fonction pour générer automatiquement les références
CREATE OR REPLACE FUNCTION generer_reference_marchandise()
RETURNS TRIGGER AS $$
DECLARE
    annee INTEGER;
    sequence INTEGER;
    reference VARCHAR(50);
BEGIN
    annee := EXTRACT(YEAR FROM NEW.dateEnvoi);
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(reference FROM 6 FOR 3) AS INTEGER)), 0) + 1
    INTO sequence
    FROM marchandises
    WHERE EXTRACT(YEAR FROM dateEnvoi) = annee;
    
    reference := 'MAR-' || annee || '-' || LPAD(sequence::text, 3, '0');
    NEW.reference := reference;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création du trigger pour générer automatiquement la référence
DROP TRIGGER IF EXISTS trigger_generer_reference_marchandise ON marchandises;
CREATE TRIGGER trigger_generer_reference_marchandise
    BEFORE INSERT ON marchandises
    FOR EACH ROW
    WHEN (NEW.reference IS NULL)
    EXECUTE FUNCTION generer_reference_marchandise();

-- Création d'une fonction pour générer automatiquement le numéro de suivi
CREATE OR REPLACE FUNCTION generer_numero_suivi()
RETURNS TRIGGER AS $$
BEGIN
    NEW.numeroSuivi := 'ACL' || EXTRACT(EPOCH FROM NOW())::bigint || FLOOR(RANDOM() * 1000)::bigint;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Création du trigger pour générer automatiquement le numéro de suivi
DROP TRIGGER IF EXISTS trigger_generer_numero_suivi ON marchandises;
CREATE TRIGGER trigger_generer_numero_suivi
    BEFORE INSERT ON marchandises
    FOR EACH ROW
    WHEN (NEW.numeroSuivi IS NULL)
    EXECUTE FUNCTION generer_numero_suivi();

-- Création d'un trigger pour mettre à jour le timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_marchandise_timestamp ON marchandises;
CREATE TRIGGER trigger_update_marchandise_timestamp
    BEFORE UPDATE ON marchandises
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertion de quelques données de test (optionnel)
INSERT INTO marchandises (designation, categorieId, poids, volume, expediteurId, destinataireNom, destinataireTelephone, 
                          villeDepart, villeArrivee, dateEnvoi, dateLivraisonPrevue, statut, typeTransport, coutTransport)
SELECT 
    'Équipements électroniques', c.id, 150.50, 0.5, 1, 'Société ABC', '+243812345678', 
    'Kinshasa', 'Lubumbashi', CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', 'En attente', 'Routier', 250.00
FROM categories c 
WHERE c.categorie = 'Électronique & télécoms'
LIMIT 1;

-- Affichage de confirmation
SELECT 'Table marchandises v2 créée avec succès!' AS message;
