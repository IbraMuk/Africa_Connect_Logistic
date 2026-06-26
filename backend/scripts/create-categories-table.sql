-- Script de création de la table categories
-- Exécuter ce script dans PostgreSQL pour créer la table des catégories

-- Création de la table categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
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
('Référence générique', 'Boissons & alcools');

-- Création d'un index sur le nom de catégorie
CREATE INDEX idx_categories_categorie ON categories(categorie);

-- Affichage de confirmation
SELECT 'Table categories créée avec succès!' AS message;
