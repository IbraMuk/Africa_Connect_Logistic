"use client";

import MarchandiseForm from "@/components/forms/MarchandiseForm";
import PageHeader from "@/components/PageHeader";
import merchandiseService from "@/services/marchandiseService";
import {
    CheckCircleIcon,
    ClockIcon,
    CubeIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    TruckIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function MarchandisePage() {
  const [marchandises, setMarchandises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewMarchandiseModal, setShowNewMarchandiseModal] = useState(false);
  const [selectedMarchandise, setSelectedMarchandise] = useState<any | null>(
    null,
  );
  const [editingMarchandise, setEditingMarchandise] = useState<any | null>(
    null,
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    enAttente: 0,
    enTransit: 0,
    livre: 0,
    retarde: 0,
  });

  // Charger les marchandises
  const loadMarchandises = async () => {
    try {
      setLoading(true);
      const response = await merchandiseService.getAllMarchandises();
      setMarchandises(response.data.marchandises || []);
    } catch (error) {
      console.error("Erreur lors du chargement des marchandises:", error);
      toast.error("Erreur lors du chargement des marchandises");
    } finally {
      setLoading(false);
    }
  };

  // Charger les statistiques
  const loadStats = async () => {
    try {
      const response = await merchandiseService.getMarchandiseStats();
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  };

  useEffect(() => {
    loadMarchandises();
    loadStats();
  }, []);

  const handleDeleteMarchandise = async (id: number) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette marchandise ?")
    ) {
      try {
        await merchandiseService.deleteMarchandise(id);
        toast.success("Marchandise supprimée avec succès");
        loadMarchandises();
        loadStats();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const handleViewMarchandise = (marchandise: any) => {
    setSelectedMarchandise(marchandise);
    setShowDetailsModal(true);
  };

  const handleEditMarchandise = (marchandise: any) => {
    setEditingMarchandise(marchandise);
    setShowEditModal(true);
  };

  const handleCreateSuccess = () => {
    loadMarchandises();
    loadStats();
    setShowNewMarchandiseModal(false);
  };

  const handleEditSuccess = () => {
    loadMarchandises();
    loadStats();
    setShowEditModal(false);
    setEditingMarchandise(null);
  };

  const filteredMarchandises = marchandises.filter(
    (marchandise) =>
      marchandise.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marchandise.designation
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      marchandise.expediteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marchandise.destinataire.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6">
      {/* En-tête moderne */}
      <PageHeader
        title="Gestion des Marchandises"
        subtitle="Suivi et gestion de toutes les marchandises en transit"
        action={{
          label: "Nouvelle Marchandise",
          onClick: () => setShowNewMarchandiseModal(true),
          icon: <PlusIcon className="h-4 w-4" />,
        }}
      />

      {/* Statistiques modernes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Marchandises",
            value: stats.total,
            icon: CubeIcon,
            color: "from-blue-500 to-indigo-600",
          },
          {
            title: "En Transit",
            value: stats.enTransit,
            icon: TruckIcon,
            color: "from-amber-500 to-orange-600",
          },
          {
            title: "Livrées",
            value: stats.livre,
            icon: CheckCircleIcon,
            color: "from-emerald-500 to-teal-600",
          },
          {
            title: "En Attente",
            value: stats.enAttente,
            icon: ClockIcon,
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
            placeholder="Rechercher une marchandise par référence, désignation ou destinataire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Tableau des marchandises */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Référence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Désignation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poids
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expéditeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destinataire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Envoi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMarchandises.map((marchandise) => (
                  <tr key={marchandise.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {marchandise.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {marchandise.designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {marchandise.poids}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {marchandise.volume}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {marchandise.expediteur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {marchandise.destinataire}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          marchandise.statut === "Livré"
                            ? "bg-green-100 text-green-800"
                            : marchandise.statut === "En transit"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {marchandise.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {marchandise.dateEnvoi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewMarchandise(marchandise)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir les détails"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          title="Modifier"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteMarchandise(marchandise.id)
                          }
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Détails Marchandise */}
      {selectedMarchandise && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 rounded-t-2xl">
              <h3 className="text-2xl font-bold text-white">
                Détails de la Marchandise
              </h3>
              <p className="text-blue-100 mt-1">Informations complètes</p>
            </div>

            <div className="p-8">
              <div className="space-y-6">
                {/* Informations principales */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <CubeIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Informations Principales
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Référence</p>
                      <p className="font-medium text-gray-900">
                        {selectedMarchandise.reference}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Désignation</p>
                      <p className="font-medium text-gray-900">
                        {selectedMarchandise.designation}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Poids</p>
                      <p className="font-medium text-gray-900">
                        {selectedMarchandise.poids}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Volume</p>
                      <p className="font-medium text-gray-900">
                        {selectedMarchandise.volume}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informations de transport */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <TruckIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Informations de Transport
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Expéditeur</p>
                      <p className="font-medium text-gray-900">
                        {selectedMarchandise.expediteur}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Destinataire</p>
                      <p className="font-medium text-gray-900">
                        {selectedMarchandise.destinataire}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedMarchandise.statut === "Livré"
                            ? "bg-green-100 text-green-800"
                            : selectedMarchandise.statut === "En transit"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedMarchandise.statut}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date d'envoi</p>
                      <p className="font-medium text-gray-900">
                        {selectedMarchandise.dateEnvoi}
                      </p>
                    </div>
                    {selectedMarchandise.dateLivraison && (
                      <div>
                        <p className="text-sm text-gray-500">
                          Date de livraison
                        </p>
                        <p className="font-medium text-gray-900">
                          {selectedMarchandise.dateLivraison}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setSelectedMarchandise(null)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Fermer
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedMarchandise(null)}
              className="absolute top-4 right-4 text-white hover:text-blue-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Modal Nouvelle Marchandise */}
      {showNewMarchandiseModal && (
        <MarchandiseForm
          isOpen={showNewMarchandiseModal}
          onClose={() => setShowNewMarchandiseModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Modal Édition Marchandise */}
      {showEditModal && (
        <MarchandiseForm
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingMarchandise(null);
          }}
          onSuccess={handleEditSuccess}
          initialData={editingMarchandise}
        />
      )}

      {/* Modal Détails Marchandise */}
      {showDetailsModal && selectedMarchandise && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setSelectedMarchandise(null)}
            ></div>

            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    Détails de la marchandise
                  </h3>
                  <button
                    onClick={() => setSelectedMarchandise(null)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Référence</p>
                    <p className="font-medium text-gray-900">
                      {selectedMarchandise.reference}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Désignation</p>
                    <p className="font-medium text-gray-900">
                      {selectedMarchandise.designation}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Catégorie</p>
                    <p className="font-medium text-gray-900">
                      {selectedMarchandise.categorie_nom || "Non définie"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Poids / Volume</p>
                    <p className="font-medium text-gray-900">
                      {selectedMarchandise.poids} / {selectedMarchandise.volume}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expéditeur</p>
                    <p className="font-medium text-gray-900">
                      {selectedMarchandise.expediteur_nom}{" "}
                      {selectedMarchandise.expediteur_prenom}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Destinataire</p>
                    <p className="font-medium text-gray-900">
                      {selectedMarchandise.destinataireNom}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium text-gray-900">
                      {selectedMarchandise.destinataireTelephone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Villes</p>
                    <p className="font-medium text-gray-900">
                      {selectedMarchandise.villeDepart} →{" "}
                      {selectedMarchandise.villeArrivee}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedMarchandise.statut === "Livré"
                          ? "bg-green-100 text-green-800"
                          : selectedMarchandise.statut === "En transit"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedMarchandise.statut}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date d'envoi</p>
                    <p className="font-medium text-gray-900">
                      {selectedMarchandise.dateEnvoi}
                    </p>
                  </div>
                  {selectedMarchandise.dateLivraisonPrevue && (
                    <div>
                      <p className="text-sm text-gray-500">
                        Date de livraison prévue
                      </p>
                      <p className="font-medium text-gray-900">
                        {selectedMarchandise.dateLivraisonPrevue}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-8 space-x-3">
                  <button
                    onClick={() => handleEditMarchandise(selectedMarchandise)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Modifier
                  </button>
                  <button
                    onClick={() => setSelectedMarchandise(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
