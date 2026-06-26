"use client";

import PageHeader from "@/components/PageHeader";
import clientService from "@/services/clientService";
import {
    ArrowTrendingUpIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EnvelopeIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    PencilIcon,
    PhoneIcon,
    PlusIcon,
    TrashIcon,
    UserGroupIcon,
    UserIcon,
    UsersIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    actifs: 0,
    inactifs: 0,
    entreprises: 0,
    particuliers: 0,
    nouveauxCeMois: 0,
  });
  const [totalPages, setTotalPages] = useState(1);

  const clientsPerPage = 10;

  // Charger les clients
  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: clientsPerPage,
        search: searchTerm,
      };
      const response = await clientService.getAllClients(params);

      if (response.success) {
        setClients(response.data.clients);
        setTotalPages(response.data.totalPages);
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des clients");
    } finally {
      setLoading(false);
    }
  }, [currentPage, clientsPerPage, searchTerm]);

  // Charger les statistiques
  const loadStats = useCallback(async () => {
    try {
      const response = await clientService.getClientStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques:", err);
    }
  }, []);

  // Effet pour charger les données au montage
  useEffect(() => {
    loadClients();
    loadStats();
  }, [currentPage, loadClients, loadStats]);

  // Effet pour la recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadClients();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, currentPage, loadClients]);

  const handleDeleteClient = async (clientId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      try {
        await clientService.deleteClient(clientId);
        await loadClients();
        await loadStats();
      } catch (err: any) {
        alert(err.message || "Erreur lors de la suppression du client");
      }
    }
  };

  const handleViewClient = (client: any) => {
    setSelectedClient(client);
  };

  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setShowEditClientModal(true);
  };

  const handleUpdateClient = async (formData: any) => {
    try {
      await clientService.updateClient(editingClient.id, formData);
      setShowEditClientModal(false);
      setEditingClient(null);
      await loadClients();
      await loadStats();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la modification du client");
    }
  };

  const handleCreateClient = async (formData: any) => {
    try {
      await clientService.createClient(formData);
      setShowNewClientModal(false);
      await loadClients();
      await loadStats();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la création du client");
    }
  };

  return (
    <div className="p-6">
      {/* En-tête moderne */}
      <PageHeader
        title="Gestion des Clients"
        subtitle="Liste et suivi de tous vos clients"
        action={{
          label: "Nouveau Client",
          onClick: () => setShowNewClientModal(true),
          icon: <PlusIcon className="h-4 w-4" />,
        }}
      />

      {/* Statistiques modernes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Clients",
            value: stats.total,
            icon: UsersIcon,
            color: "from-blue-500 to-indigo-600",
            change: "+12%",
          },
          {
            title: "Clients Actifs",
            value: stats.actifs,
            icon: UserGroupIcon,
            color: "from-emerald-500 to-teal-600",
            change: "+5%",
          },
          {
            title: "Entreprises",
            value: stats.entreprises,
            icon: BuildingOfficeIcon,
            color: "from-violet-500 to-purple-600",
            change: "+8%",
          },
          {
            title: "Nouveaux ce mois",
            value: stats.nouveauxCeMois,
            icon: ArrowTrendingUpIcon,
            color: "from-amber-500 to-orange-600",
            change: "+3%",
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
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
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
            placeholder="Rechercher un client par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Tableau des clients */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrashIcon className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={loadClients}
              className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'inscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {client.prenom} {client.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {client.adresse || "Non spécifiée"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {client.email}
                          </div>
                          <div className="flex items-center mt-1">
                            <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                            {client.telephone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            client.type === "Entreprise"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {client.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            client.statut === "Actif"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {client.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(client.dateInscription).toLocaleDateString(
                          "fr-FR",
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewClient(client)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Voir les détails"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEditClient(client)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Modifier"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client.id)}
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

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Précédent
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Suivant
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Affichage de{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * clientsPerPage + 1}
                    </span>{" "}
                    à{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * clientsPerPage, clients.length)}
                    </span>{" "}
                    sur <span className="font-medium">{clients.length}</span>{" "}
                    résultats
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Nouveau Client */}
      {showNewClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white">
                Ajouter un nouveau client
              </h3>
              <p className="text-primary-100 mt-1 text-sm">
                Remplissez les informations ci-dessous
              </p>
            </div>

            <div className="p-6">
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as HTMLFormElement;
                  const formData = {
                    nom: (target.elements.namedItem("nom") as HTMLInputElement)
                      .value,
                    prenom: (
                      target.elements.namedItem("prenom") as HTMLInputElement
                    ).value,
                    email: (
                      target.elements.namedItem("email") as HTMLInputElement
                    ).value,
                    telephone: (
                      target.elements.namedItem("telephone") as HTMLInputElement
                    ).value,
                    adresse: (
                      target.elements.namedItem("adresse") as HTMLInputElement
                    ).value,
                    type: (
                      target.elements.namedItem("type") as HTMLSelectElement
                    ).value,
                  };
                  handleCreateClient(formData);
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Colonne de gauche */}
                  <div className="space-y-4">
                    {/* Section Informations Personnelles */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                        <UserIcon className="h-4 w-4 mr-2 text-primary-600" />
                        Informations Personnelles
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Prénom
                          </label>
                          <input
                            type="text"
                            name="prenom"
                            required
                            className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-sm"
                            placeholder="Entrez le prénom"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Nom
                          </label>
                          <input
                            type="text"
                            name="nom"
                            required
                            className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-sm"
                            placeholder="Entrez le nom"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section Contact */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-blue-600" />
                        Informations de Contact
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Email
                          </label>
                          <div className="relative">
                            <EnvelopeIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                              type="email"
                              name="email"
                              required
                              className="block w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-sm"
                              placeholder="exemple@email.com"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Téléphone
                          </label>
                          <div className="relative">
                            <PhoneIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                              type="tel"
                              name="telephone"
                              required
                              className="block w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white text-sm"
                              placeholder="+243 XXX XXX XXX"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Colonne de droite */}
                  <div className="space-y-4">
                    {/* Section Adresse */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2 text-green-600" />
                        Adresse
                      </h4>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Adresse complète
                        </label>
                        <div className="relative">
                          <MapPinIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                          <textarea
                            name="adresse"
                            rows={4}
                            className="block w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white resize-none text-sm"
                            placeholder="Entrez l'adresse complète..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section Type */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                        <div className="h-4 w-4 mr-2 text-purple-600">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                        </div>
                        Type de Client
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="relative cursor-pointer">
                          <input
                            type="radio"
                            name="type"
                            value="Particulier"
                            defaultChecked
                            className="peer sr-only"
                          />
                          <div className="p-3 border border-gray-200 rounded-lg transition-all peer-checked:border-purple-500 peer-checked:bg-purple-100 hover:bg-gray-50">
                            <div className="text-center">
                              <UserIcon className="h-6 w-6 mx-auto mb-1 text-gray-600 peer-checked:text-purple-600" />
                              <span className="text-sm font-medium text-gray-900">
                                Particulier
                              </span>
                            </div>
                          </div>
                        </label>
                        <label className="relative cursor-pointer">
                          <input
                            type="radio"
                            name="type"
                            value="Entreprise"
                            className="peer sr-only"
                          />
                          <div className="p-3 border border-gray-200 rounded-lg transition-all peer-checked:border-purple-500 peer-checked:bg-purple-100 hover:bg-gray-50">
                            <div className="text-center">
                              <div className="h-6 w-6 mx-auto mb-1 flex items-center justify-center">
                                <svg
                                  className="h-6 w-6 text-gray-600 peer-checked:text-purple-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                </svg>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                Entreprise
                              </span>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowNewClientModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
                  >
                    Ajouter le client
                  </button>
                </div>
              </form>
            </div>

            <button
              onClick={() => setShowNewClientModal(false)}
              className="absolute top-4 right-4 text-white hover:text-primary-200 transition-colors"
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

      {/* Modal Détails Client */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white">
                Détails du Client
              </h3>
              <p className="text-blue-100 mt-1 text-sm">
                Informations complètes
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Informations Personnelles */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-blue-600" />
                    Informations Personnelles
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Prénom</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedClient.prenom}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Nom</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedClient.nom}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-2 text-blue-600" />
                    Contact
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedClient.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Téléphone</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedClient.telephone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Adresse */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2 text-green-600" />
                    Adresse
                  </h4>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedClient.adresse || "Non spécifiée"}
                  </p>
                </div>

                {/* Informations Système */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-purple-600" />
                    Informations Système
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">Type</p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedClient.type === "Entreprise"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedClient.type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">Statut</p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedClient.statut === "Actif"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedClient.statut}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">
                        Date d'inscription
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(
                          selectedClient.dateInscription,
                        ).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedClient(null)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl text-sm"
                >
                  Fermer
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedClient(null)}
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

      {/* Modal Modifier Client */}
      {showEditClientModal && editingClient && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white">
                Modifier le Client
              </h3>
              <p className="text-orange-100 mt-1 text-sm">
                Mettez à jour les informations
              </p>
            </div>

            <div className="p-6">
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as HTMLFormElement;
                  const formData = {
                    nom: (target.elements.namedItem("nom") as HTMLInputElement)
                      .value,
                    prenom: (
                      target.elements.namedItem("prenom") as HTMLInputElement
                    ).value,
                    email: (
                      target.elements.namedItem("email") as HTMLInputElement
                    ).value,
                    telephone: (
                      target.elements.namedItem("telephone") as HTMLInputElement
                    ).value,
                    adresse: (
                      target.elements.namedItem("adresse") as HTMLInputElement
                    ).value,
                    type: (
                      target.elements.namedItem("type") as HTMLSelectElement
                    ).value,
                    statut: (
                      target.elements.namedItem("statut") as HTMLSelectElement
                    ).value,
                  };
                  handleUpdateClient(formData);
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Colonne de gauche */}
                  <div className="space-y-4">
                    {/* Section Informations Personnelles */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                        <UserIcon className="h-4 w-4 mr-2 text-orange-600" />
                        Informations Personnelles
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Prénom
                          </label>
                          <input
                            type="text"
                            name="prenom"
                            required
                            defaultValue={editingClient.prenom}
                            className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Nom
                          </label>
                          <input
                            type="text"
                            name="nom"
                            required
                            defaultValue={editingClient.nom}
                            className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section Contact */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-2 text-blue-600" />
                        Informations de Contact
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Email
                          </label>
                          <div className="relative">
                            <EnvelopeIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                              type="email"
                              name="email"
                              required
                              defaultValue={editingClient.email}
                              className="block w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Téléphone
                          </label>
                          <div className="relative">
                            <PhoneIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                              type="tel"
                              name="telephone"
                              required
                              defaultValue={editingClient.telephone}
                              className="block w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Colonne de droite */}
                  <div className="space-y-4">
                    {/* Section Adresse */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-2 text-green-600" />
                        Adresse
                      </h4>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Adresse complète
                        </label>
                        <div className="relative">
                          <MapPinIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                          <textarea
                            name="adresse"
                            rows={4}
                            defaultValue={editingClient.adresse}
                            className="block w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white resize-none text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section Type et Statut */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                        <div className="h-4 w-4 mr-2 text-purple-600">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                        </div>
                        Type et Statut
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Type de Client
                          </label>
                          <select
                            name="type"
                            defaultValue={editingClient.type}
                            className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-sm"
                          >
                            <option value="Particulier">Particulier</option>
                            <option value="Entreprise">Entreprise</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Statut
                          </label>
                          <select
                            name="statut"
                            defaultValue={editingClient.statut}
                            className="block w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white text-sm"
                          >
                            <option value="Actif">Actif</option>
                            <option value="Inactif">Inactif</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditClientModal(false);
                      setEditingClient(null);
                    }}
                    className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Mettre à jour
                  </button>
                </div>
              </form>
            </div>

            <button
              onClick={() => {
                setShowEditClientModal(false);
                setEditingClient(null);
              }}
              className="absolute top-4 right-4 text-white hover:text-orange-200 transition-colors"
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
    </div>
  );
}
