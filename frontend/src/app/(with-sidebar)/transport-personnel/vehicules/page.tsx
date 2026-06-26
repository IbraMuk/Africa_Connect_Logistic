"use client";

import PageHeader from "@/components/PageHeader";
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    TruckIcon,
    WrenchScrewdriverIcon,
    XMarkIcon,
    MapPinIcon,
    CurrencyDollarIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function VehiculesPage() {
  const [vehicules, setVehicules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicule, setSelectedVehicule] = useState<any>(null);
  const [formData, setFormData] = useState({
    marque: "",
    modele: "",
    type: "bus",
    immatriculation: "",
    annee: "",
    couleur: "",
    nombrePlaces: 0,
    capaciteBagages: 0,
    kilometrage: 0,
    dateDerniereMaintenance: "",
    dateProchaineMaintenance: "",
    statut: "disponible",
    chauffeurAssigné: "",
    assurance: "",
    dateExpirationAssurance: "",
    coutAcquisition: 0,
    consommation: 0,
    caracteristiques: "",
  });

  // Données simulées
  const mockVehicules = [
    {
      id: 1,
      marque: "Mercedes-Benz",
      modele: "Tourismo",
      type: "bus",
      immatriculation: "CD-123-AB",
      annee: "2019",
      couleur: "Blanc",
      nombrePlaces: 50,
      capaciteBagages: 500,
      kilometrage: 125000,
      dateDerniereMaintenance: "2024-01-10",
      dateProchaineMaintenance: "2024-04-10",
      statut: "disponible",
      chauffeurAssigné: "Pierre Mbuyi",
      assurance: "AXA Assurance",
      dateExpirationAssurance: "2024-12-31",
      coutAcquisition: 150000,
      consommation: 25,
      caracteristiques: "Climatisation, WiFi, Toilettes, Sièges confortables",
    },
    {
      id: 2,
      marque: "Toyota",
      modele: "Hiace",
      type: "minibus",
      immatriculation: "CD-456-CD",
      annee: "2021",
      couleur: "Bleu",
      nombrePlaces: 16,
      capaciteBagages: 200,
      kilometrage: 45000,
      dateDerniereMaintenance: "2024-01-05",
      dateProchaineMaintenance: "2024-04-05",
      statut: "en_mission",
      chauffeurAssigné: "Antoine Tshimanga",
      assurance: "Sonas",
      dateExpirationAssurance: "2024-09-30",
      coutAcquisition: 45000,
      consommation: 12,
      caracteristiques: "Climatisation, Bluetooth, Caméra de recul",
    },
    {
      id: 3,
      marque: "Scania",
      modele: "P420",
      type: "camion",
      immatriculation: "CD-789-EF",
      annee: "2018",
      couleur: "Rouge",
      nombrePlaces: 3,
      capaciteBagages: 2000,
      kilometrage: 180000,
      dateDerniereMaintenance: "2023-12-20",
      dateProchaineMaintenance: "2024-03-20",
      statut: "maintenance",
      chauffeurAssigné: "Jean Kabongo",
      assurance: "Rawbank",
      dateExpirationAssurance: "2024-06-30",
      coutAcquisition: 85000,
      consommation: 35,
      caracteristiques: "Grue hydraulique, Remorque, GPS",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setVehicules(mockVehicules);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredVehicules = vehicules.filter(
    (vehicule) =>
      vehicule.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicule.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicule.immatriculation
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      vehicule.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.marque || !formData.modele || !formData.immatriculation) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const newVehicule = {
      id: vehicules.length + 1,
      ...formData,
    };

    setVehicules([...vehicules, newVehicule]);
    toast.success("Véhicule ajouté avec succès");
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      marque: "",
      modele: "",
      type: "bus",
      immatriculation: "",
      annee: "",
      couleur: "",
      nombrePlaces: 0,
      capaciteBagages: 0,
      kilometrage: 0,
      dateDerniereMaintenance: "",
      dateProchaineMaintenance: "",
      statut: "disponible",
      chauffeurAssigné: "",
      assurance: "",
      dateExpirationAssurance: "",
      coutAcquisition: 0,
      consommation: 0,
      caracteristiques: "",
    });
  };

  const handleEdit = (vehicule: any) => {
    setSelectedVehicule(vehicule);
    setFormData({
      marque: vehicule.marque,
      modele: vehicule.modele,
      type: vehicule.type,
      immatriculation: vehicule.immatriculation,
      annee: vehicule.annee,
      couleur: vehicule.couleur,
      nombrePlaces: vehicule.nombrePlaces,
      capaciteBagages: vehicule.capaciteBagages,
      kilometrage: vehicule.kilometrage,
      dateDerniereMaintenance: vehicule.dateDerniereMaintenance,
      dateProchaineMaintenance: vehicule.dateProchaineMaintenance,
      statut: vehicule.statut,
      chauffeurAssigné: vehicule.chauffeurAssigné,
      assurance: vehicule.assurance,
      dateExpirationAssurance: vehicule.dateExpirationAssurance,
      coutAcquisition: vehicule.coutAcquisition,
      consommation: vehicule.consommation,
      caracteristiques: vehicule.caracteristiques,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      setVehicules(vehicules.filter((v) => v.id !== id));
      toast.success("Véhicule supprimé");
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "disponible":
        return "bg-green-100 text-green-800";
      case "en_mission":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "indisponible":
        return "bg-red-100 text-red-800";
      case "retire":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVehiculeIcon = (type: string) => {
    switch (type) {
      case "bus":
        return "🚌";
      case "minibus":
        return "🚐";
      case "voiture":
        return "🚗";
      case "camion":
        return "🚚";
      case "van":
        return "🚦";
      default:
        return "🚗";
    }
  };

  const getMaintenanceStatus = (dateProchaine: string) => {
    const aujourd = new Date();
    const dateProch = new Date(dateProchaine);
    const joursRestants = Math.ceil(
      (dateProch.getTime() - aujourd.getTime()) / (1000 * 3600 * 24),
    );

    if (joursRestants < 0)
      return {
        color: "text-red-600",
        icon: ExclamationTriangleIcon,
        text: "En retard",
      };
    if (joursRestants <= 7)
      return {
        color: "text-yellow-600",
        icon: InformationCircleIcon,
        text: `${joursRestants} jours`,
      };
    return {
      color: "text-green-600",
      icon: CheckCircleIcon,
      text: `${joursRestants} jours`,
    };
  };

  return (
    <div className="p-6">
      {/* En-tête moderne */}
      <PageHeader
        title="Véhicules"
        subtitle="Gérez la flotte de véhicules"
        action={{
          label: "Nouveau Véhicule",
          onClick: () => setShowModal(true),
          icon: <PlusIcon className="h-4 w-4" />,
        }}
      />

      {/* Statistiques modernes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[
          {
            title: "Total Véhicules",
            value: vehicules.length,
            icon: TruckIcon,
            color: "from-blue-500 to-indigo-600",
          },
          {
            title: "Disponibles",
            value: vehicules.filter((v) => v.statut === "disponible").length,
            icon: CheckCircleIcon,
            color: "from-emerald-500 to-teal-600",
          },
          {
            title: "En mission",
            value: vehicules.filter((v) => v.statut === "en_mission").length,
            icon: MapPinIcon,
            color: "from-amber-500 to-orange-600",
          },
          {
            title: "En maintenance",
            value: vehicules.filter((v) => v.statut === "maintenance").length,
            icon: WrenchScrewdriverIcon,
            color: "from-yellow-500 to-amber-600",
          },
          {
            title: "Valeur totale",
            value: `$${vehicules.reduce((total, v) => total + (v.coutAcquisition || 0), 0).toLocaleString()}`,
            icon: CurrencyDollarIcon,
            color: "from-violet-500 to-purple-600",
          },
        ].map((stat, index) => (
          <div key={index} className="group">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Barre de recherche moderne */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un véhicule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Tableau des véhicules */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Véhicule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Caractéristiques
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kilométrage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maintenance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chauffeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicules.map((vehicule) => {
                const maintenanceStatus = getMaintenanceStatus(
                  vehicule.dateProchaineMaintenance,
                );
                const MaintenanceIcon = maintenanceStatus.icon;

                return (
                  <tr key={vehicule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-3xl mr-3">
                          {getVehiculeIcon(vehicule.type)}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {vehicule.marque} {vehicule.modele}
                          </p>
                          <p className="text-sm text-gray-500">
                            {vehicule.immatriculation}
                          </p>
                          <p className="text-xs text-gray-400">
                            {vehicule.annee} - {vehicule.couleur}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 capitalize">
                          {vehicule.type}
                        </p>
                        <p className="text-xs text-gray-500">
                          {vehicule.nombrePlaces} places
                        </p>
                        <p className="text-xs text-gray-500">
                          {vehicule.capaciteBagages} kg bagages
                        </p>
                        <p className="text-xs text-gray-500">
                          {vehicule.consommation}L/100km
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {vehicule.kilometrage.toLocaleString()} km
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <MaintenanceIcon
                          className={`h-4 w-4 mr-2 ${maintenanceStatus.color}`}
                        />
                        <div>
                          <p className="text-sm text-gray-900">
                            {new Date(
                              vehicule.dateDerniereMaintenance,
                            ).toLocaleDateString("fr-FR")}
                          </p>
                          <p className={`text-xs ${maintenanceStatus.color}`}>
                            Prochaine: {maintenanceStatus.text}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {vehicule.chauffeurAssigné || "Non assigné"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {vehicule.assurance}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutBadge(vehicule.statut)}`}
                      >
                        {vehicule.statut.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(vehicule)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicule.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Nouveau/Édition Véhicule */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowModal(false)}
            ></div>

            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    {selectedVehicule
                      ? "Modifier le véhicule"
                      : "Nouveau véhicule"}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marque *
                    </label>
                    <input
                      type="text"
                      value={formData.marque}
                      onChange={(e) =>
                        setFormData({ ...formData, marque: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Mercedes-Benz"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modèle *
                    </label>
                    <input
                      type="text"
                      value={formData.modele}
                      onChange={(e) =>
                        setFormData({ ...formData, modele: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Tourismo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="bus">Bus</option>
                      <option value="minibus">Minibus</option>
                      <option value="voiture">Voiture</option>
                      <option value="camion">Camion</option>
                      <option value="van">Van</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Immatriculation *
                    </label>
                    <input
                      type="text"
                      value={formData.immatriculation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          immatriculation: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: CD-123-AB"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Année
                    </label>
                    <input
                      type="text"
                      value={formData.annee}
                      onChange={(e) =>
                        setFormData({ ...formData, annee: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 2020"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Couleur
                    </label>
                    <input
                      type="text"
                      value={formData.couleur}
                      onChange={(e) =>
                        setFormData({ ...formData, couleur: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Blanc"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de places
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.nombrePlaces}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombrePlaces: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacité bagages (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.capaciteBagages}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          capaciteBagages: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kilométrage
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.kilometrage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kilometrage: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dernière maintenance
                    </label>
                    <input
                      type="date"
                      value={formData.dateDerniereMaintenance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateDerniereMaintenance: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prochaine maintenance
                    </label>
                    <input
                      type="date"
                      value={formData.dateProchaineMaintenance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateProchaineMaintenance: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <select
                      value={formData.statut}
                      onChange={(e) =>
                        setFormData({ ...formData, statut: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="disponible">Disponible</option>
                      <option value="en_mission">En mission</option>
                      <option value="maintenance">En maintenance</option>
                      <option value="indisponible">Indisponible</option>
                      <option value="retire">Retiré</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chauffeur assigné
                    </label>
                    <input
                      type="text"
                      value={formData.chauffeurAssigné}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          chauffeurAssigné: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom du chauffeur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assurance
                    </label>
                    <input
                      type="text"
                      value={formData.assurance}
                      onChange={(e) =>
                        setFormData({ ...formData, assurance: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Compagnie d'assurance"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiration assurance
                    </label>
                    <input
                      type="date"
                      value={formData.dateExpirationAssurance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateExpirationAssurance: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coût d'acquisition ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.coutAcquisition}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coutAcquisition: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consommation (L/100km)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.consommation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          consommation: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Caractéristiques
                    </label>
                    <textarea
                      value={formData.caracteristiques}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          caracteristiques: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Options et équipements spéciaux..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {selectedVehicule ? "Mettre à jour" : "Ajouter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
