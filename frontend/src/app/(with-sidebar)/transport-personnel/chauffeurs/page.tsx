"use client";

import PageHeader from "@/components/PageHeader";
import {
    CheckCircleIcon,
    CurrencyDollarIcon,
    EnvelopeIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    PencilIcon,
    PhoneIcon,
    PlusIcon,
    TrashIcon,
    TruckIcon,
    UserIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ChauffeursPage() {
  const [chauffeurs, setChauffeurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedChauffeur, setSelectedChauffeur] = useState<any>(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    dateNaissance: "",
    adresse: "",
    permis: "",
    dateExpirationPermis: "",
    typePermis: "B",
    experience: "",
    statut: "disponible",
    vehiculeAssigné: "",
    salaire: 0,
    dateEmbauche: "",
  });

  // Données simulées
  const mockChauffeurs = [
    {
      id: 1,
      nom: "Mbuyi",
      prenom: "Pierre",
      email: "pierre.mbuyi@email.com",
      telephone: "+243812345678",
      dateNaissance: "1985-05-15",
      adresse: "Av. Kasa-Vubu, Kinshasa",
      permis: "CD-123456",
      dateExpirationPermis: "2025-12-31",
      typePermis: "D",
      experience: "10 ans",
      statut: "disponible",
      vehiculeAssigné: "Bus - CD-123-AB",
      salaire: 800,
      dateEmbauche: "2018-03-15",
      nombreMissions: 145,
      note: 4.5,
    },
    {
      id: 2,
      nom: "Tshimanga",
      prenom: "Antoine",
      email: "antoine.tshimanga@email.com",
      telephone: "+243823456789",
      dateNaissance: "1990-08-22",
      adresse: "Q. Limete, Kinshasa",
      permis: "CD-789012",
      dateExpirationPermis: "2024-06-30",
      typePermis: "B",
      experience: "5 ans",
      statut: "en_mission",
      vehiculeAssigné: "Voiture - CD-456-CD",
      salaire: 600,
      dateEmbauche: "2020-01-10",
      nombreMissions: 89,
      note: 4.2,
    },
    {
      id: 3,
      nom: "Kabongo",
      prenom: "Jean",
      email: "jean.kabongo@email.com",
      telephone: "+243834567890",
      dateNaissance: "1982-12-10",
      adresse: "Q. Bandalungwa, Kinshasa",
      permis: "CD-345678",
      dateExpirationPermis: "2026-03-15",
      typePermis: "D",
      experience: "15 ans",
      statut: "congé",
      vehiculeAssigné: "Camion - CD-789-EF",
      salaire: 900,
      dateEmbauche: "2015-06-01",
      nombreMissions: 234,
      note: 4.8,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setChauffeurs(mockChauffeurs);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredChauffeurs = chauffeurs.filter(
    (chauffeur) =>
      chauffeur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chauffeur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chauffeur.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chauffeur.telephone.includes(searchTerm) ||
      chauffeur.permis.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nom ||
      !formData.prenom ||
      !formData.telephone ||
      !formData.permis
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const newChauffeur = {
      id: chauffeurs.length + 1,
      ...formData,
      nombreMissions: 0,
      note: 0,
    };

    setChauffeurs([...chauffeurs, newChauffeur]);
    toast.success("Chauffeur ajouté avec succès");
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      dateNaissance: "",
      adresse: "",
      permis: "",
      dateExpirationPermis: "",
      typePermis: "B",
      experience: "",
      statut: "disponible",
      vehiculeAssigné: "",
      salaire: 0,
      dateEmbauche: "",
    });
  };

  const handleEdit = (chauffeur: any) => {
    setSelectedChauffeur(chauffeur);
    setFormData({
      nom: chauffeur.nom,
      prenom: chauffeur.prenom,
      email: chauffeur.email,
      telephone: chauffeur.telephone,
      dateNaissance: chauffeur.dateNaissance,
      adresse: chauffeur.adresse,
      permis: chauffeur.permis,
      dateExpirationPermis: chauffeur.dateExpirationPermis,
      typePermis: chauffeur.typePermis,
      experience: chauffeur.experience,
      statut: chauffeur.statut,
      vehiculeAssigné: chauffeur.vehiculeAssigné,
      salaire: chauffeur.salaire,
      dateEmbauche: chauffeur.dateEmbauche,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce chauffeur ?")) {
      setChauffeurs(chauffeurs.filter((c) => c.id !== id));
      toast.success("Chauffeur supprimé");
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "disponible":
        return "bg-green-100 text-green-800";
      case "en_mission":
        return "bg-blue-100 text-blue-800";
      case "congé":
        return "bg-yellow-100 text-yellow-800";
      case "indisponible":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPermisBadge = (type: string) => {
    switch (type) {
      case "A":
        return "bg-purple-100 text-purple-800";
      case "B":
        return "bg-blue-100 text-blue-800";
      case "C":
        return "bg-orange-100 text-orange-800";
      case "D":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      {/* En-tête moderne */}
      <PageHeader
        title="Chauffeurs"
        subtitle="Gérez les chauffeurs de la flotte"
        action={{
          label: "Nouveau Chauffeur",
          onClick: () => setShowModal(true),
          icon: <PlusIcon className="h-4 w-4" />,
        }}
      />

      {/* Statistiques modernes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Chauffeurs",
            value: chauffeurs.length,
            icon: UserIcon,
            color: "from-blue-500 to-indigo-600",
          },
          {
            title: "Disponibles",
            value: chauffeurs.filter((c) => c.statut === "disponible").length,
            icon: CheckCircleIcon,
            color: "from-emerald-500 to-teal-600",
          },
          {
            title: "En mission",
            value: chauffeurs.filter((c) => c.statut === "en_mission").length,
            icon: TruckIcon,
            color: "from-amber-500 to-orange-600",
          },
          {
            title: "Masse salariale",
            value: `$${chauffeurs.reduce((total, c) => total + (c.salaire || 0), 0)}`,
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
            placeholder="Rechercher un chauffeur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Tableau des chauffeurs */}
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
                  Chauffeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expérience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Véhicule
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
              {filteredChauffeurs.map((chauffeur) => (
                <tr key={chauffeur.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {chauffeur.prenom} {chauffeur.nom}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(chauffeur.dateNaissance).toLocaleDateString(
                          "fr-FR",
                        )}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-900">
                          {chauffeur.telephone}
                        </p>
                      </div>
                      <div className="flex items-center mt-1">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-500">
                          {chauffeur.email}
                        </p>
                      </div>
                      <div className="flex items-center mt-1">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {chauffeur.adresse}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {chauffeur.permis}
                      </p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPermisBadge(chauffeur.typePermis)}`}
                        >
                          Type {chauffeur.typePermis}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Exp:{" "}
                        {new Date(
                          chauffeur.dateExpirationPermis,
                        ).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">
                        {chauffeur.experience}
                      </p>
                      <p className="text-xs text-gray-500">
                        {chauffeur.nombreMissions} missions
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-400">
                          {"★".repeat(Math.floor(chauffeur.note))}
                        </span>
                        <span className="text-gray-300">
                          {"★".repeat(5 - Math.floor(chauffeur.note))}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          ({chauffeur.note})
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">
                      {chauffeur.vehiculeAssigné || "Non assigné"}
                    </p>
                    <p className="text-xs text-gray-500">
                      ${chauffeur.salaire}/mois
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutBadge(chauffeur.statut)}`}
                    >
                      {chauffeur.statut.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(chauffeur)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(chauffeur.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Nouveau/Édition Chauffeur */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowModal(false)}
            ></div>

            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    {selectedChauffeur
                      ? "Modifier le chauffeur"
                      : "Nouveau chauffeur"}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) =>
                        setFormData({ ...formData, nom: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) =>
                        setFormData({ ...formData, prenom: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@exemple.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) =>
                        setFormData({ ...formData, telephone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+243 XXX XXX XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      value={formData.dateNaissance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateNaissance: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date d'embauche
                    </label>
                    <input
                      type="date"
                      value={formData.dateEmbauche}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateEmbauche: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={formData.adresse}
                      onChange={(e) =>
                        setFormData({ ...formData, adresse: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Adresse complète"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Numéro permis *
                    </label>
                    <input
                      type="text"
                      value={formData.permis}
                      onChange={(e) =>
                        setFormData({ ...formData, permis: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Numéro du permis"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date expiration permis
                    </label>
                    <input
                      type="date"
                      value={formData.dateExpirationPermis}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateExpirationPermis: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de permis
                    </label>
                    <select
                      value={formData.typePermis}
                      onChange={(e) =>
                        setFormData({ ...formData, typePermis: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="A">Type A (Moto)</option>
                      <option value="B">Type B (Voiture)</option>
                      <option value="C">Type C (Poids lourd)</option>
                      <option value="D">Type D (Transport de personnes)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expérience
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: 5 ans"
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
                      <option value="congé">En congé</option>
                      <option value="indisponible">Indisponible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Véhicule assigné
                    </label>
                    <input
                      type="text"
                      value={formData.vehiculeAssigné}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehiculeAssigné: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type - Immatriculation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salaire mensuel ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.salaire}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          salaire: parseFloat(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    {selectedChauffeur ? "Mettre à jour" : "Ajouter"}
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
