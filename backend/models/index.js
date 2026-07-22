const { sequelize } = require("../config/database");
const User = require("./User");
const Client = require("./Client");
const Facture = require("./Facture");
const FactureMarchandise = require("./FactureMarchandise");
const FactureStandard = require("./FactureStandard");
const Category = require("./Category");
const TransportPersonnel = require("./TransportPersonnel");
const TransportMarchandise = require("./TransportMarchandise");
const Marchandise = require("./Marchandise");
const Billet = require("./Billet");
const ImportExport = require("./ImportExport");

// Définir les associations
User.hasMany(TransportPersonnel, {
  foreignKey: "clientId",
  as: "transportsPersonnel",
});
User.hasMany(TransportPersonnel, {
  foreignKey: "chauffeurId",
  as: "transportsConduits",
});
TransportPersonnel.belongsTo(User, { foreignKey: "clientId", as: "client" });
TransportPersonnel.belongsTo(User, {
  foreignKey: "chauffeurId",
  as: "chauffeur",
});

User.hasMany(TransportMarchandise, {
  foreignKey: "clientId",
  as: "transportsMarchandise",
});
User.hasMany(TransportMarchandise, {
  foreignKey: "chauffeurId",
  as: "marchandisesConduites",
});
TransportMarchandise.belongsTo(User, { foreignKey: "clientId", as: "client" });
TransportMarchandise.belongsTo(User, {
  foreignKey: "chauffeurId",
  as: "chauffeur",
});

// Associations pour la nouvelle table Marchandise
Client.hasMany(Marchandise, {
  foreignKey: "expediteurId",
  as: "marchandisesExpédiees",
});
Marchandise.belongsTo(Client, { foreignKey: "expediteurId", as: "expediteur" });

// Associations pour la table Category
Category.hasMany(Marchandise, {
  foreignKey: "categorieId",
  as: "marchandises",
});
Marchandise.belongsTo(Category, { foreignKey: "categorieId", as: "categorie" });

// Associations avec TransportPersonnel (chauffeur)
TransportPersonnel.hasMany(Marchandise, {
  foreignKey: "chauffeurId",
  as: "marchandisesConduites",
});
Marchandise.belongsTo(TransportPersonnel, {
  foreignKey: "chauffeurId",
  as: "chauffeur",
});

User.hasMany(Marchandise, {
  foreignKey: "createdById",
  as: "marchandisesCréées",
});
Marchandise.belongsTo(User, { foreignKey: "createdById", as: "createur" });

User.hasMany(Billet, { foreignKey: "clientId", as: "billets" });
Billet.belongsTo(User, { foreignKey: "clientId", as: "client" });

User.hasMany(ImportExport, { foreignKey: "clientId", as: "importExports" });
ImportExport.belongsTo(User, { foreignKey: "clientId", as: "client" });

// Associations Facture <-> FactureMarchandise (factures import/export)
Facture.hasMany(FactureMarchandise, { foreignKey: "factureId", as: "marchandises" });
FactureMarchandise.belongsTo(Facture, { foreignKey: "factureId", as: "facture" });

// Associations FactureStandard <-> Client (factures classiques par client)
Client.hasMany(FactureStandard, { foreignKey: "clientId", as: "facturesStandard" });
FactureStandard.belongsTo(Client, { foreignKey: "clientId", as: "client" });

module.exports = {
  sequelize,
  User,
  Client,
  Facture,
  FactureMarchandise,
  FactureStandard,
  Category,
  TransportPersonnel,
  TransportMarchandise,
  Marchandise,
  Billet,
  ImportExport,
};
