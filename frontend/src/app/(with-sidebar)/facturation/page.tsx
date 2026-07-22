"use client";

import PageHeader from "@/components/PageHeader";
import clientService from "../../../services/clientService";
import factureService from "../../../services/factureService";
import {
    CheckIcon,
    ChevronDownIcon,
    ClockIcon,
    DocumentArrowDownIcon,
    DocumentTextIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    UserIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";

// Données exemple
interface Facture {
  id: string;
  clientId: number;
  clientNom?: string;
  clientPrenom?: string;
  dateFacture: string;
  dateEcheance: string;
  montant: number;
  statut: "Payée" | "En attente" | "En retard";
  services: {
    description: string;
    quantite: number;
    prix: number;
  }[];
}

interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse?: string;
}

export default function FacturationPage() {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewFactureModal, setShowNewFactureModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [pdfFacture, setPdfFacture] = useState<Facture | null>(null);

  // États pour la recherche de client
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);

  // Formulaire de nouvelle facture
  const getDefaultDateEcheance = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  };

  const [newFacture, setNewFacture] = useState({
    clientId: 0,
    dateEcheance: getDefaultDateEcheance(),
    services: [{ description: "", quantite: 1, prix: 0 }],
    notes: "",
  });

  // Charger les factures depuis l'API
  const loadFactures = useCallback(async () => {
    try {
      setLoading(true);
      const response = await factureService.getAllFactures({
        search: searchTerm,
        statut: filtreStatut === "Tous" ? undefined : filtreStatut,
      });

      if (response.success) {
        setFactures(response.data.factures || []);
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des factures");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filtreStatut]);

  // Effet pour charger les factures (initial + recherche avec debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadFactures();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filtreStatut, loadFactures]);

  const stats = {
    total: factures.reduce((acc, f) => acc + f.montant, 0),
    payees: factures
      .filter((f) => f.statut === "Payée")
      .reduce((acc, f) => acc + f.montant, 0),
    enAttente: factures
      .filter((f) => f.statut === "En attente")
      .reduce((acc, f) => acc + f.montant, 0),
    enRetard: factures
      .filter((f) => f.statut === "En retard")
      .reduce((acc, f) => acc + f.montant, 0),
  };

  const filteredFactures = factures.filter((facture) => {
    const matchSearch =
      (facture.clientNom || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      facture.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut =
      filtreStatut === "Tous" || facture.statut === filtreStatut;
    return matchSearch && matchStatut;
  });

  const handleDeleteFacture = (factureId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
      setFactures(factures.filter((f) => f.id !== factureId));
    }
  };

  const handleViewFacture = (facture: Facture) => {
    setSelectedFacture(facture);
    setShowDetailModal(true);
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "Payée":
        return "bg-green-100 text-green-800";
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      case "En retard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "Payée":
        return <CheckIcon className="h-4 w-4" />;
      case "En attente":
        return <ClockIcon className="h-4 w-4" />;
      case "En retard":
        return <XMarkIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Fonctions pour la gestion des clients
  const searchClients = async (term: string) => {
    if (!term) {
      setClients([]);
      return;
    }

    setLoadingClients(true);
    try {
      const response = await clientService.getAllClients({
        search: term,
        limit: 10,
      });
      if (response.success) {
        setClients(response.data.clients || []);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de clients:", error);
      setClients([]);
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchClients(clientSearchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [clientSearchTerm]);

  // Fermer la recherche de client quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showClientSearch) {
        const target = event.target as Element;
        if (!target.closest(".client-search-container")) {
          setShowClientSearch(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showClientSearch]);

  const selectClient = (client: Client) => {
    setSelectedClient(client);
    setNewFacture({ ...newFacture, clientId: client.id });
    setClientSearchTerm("");
    setClients([]);
    setShowClientSearch(false);
  };

  const handleCreateFacture = async () => {
    if (!selectedClient) {
      alert("Veuillez sélectionner un client");
      return;
    }

    if (!newFacture.dateEcheance) {
      alert("Veuillez sélectionner une date d'échéance");
      return;
    }

    // Calculer le montant total
    const total = newFacture.services.reduce(
      (sum, service) => sum + service.quantite * service.prix,
      0,
    );

    if (total === 0) {
      alert("Veuillez ajouter au moins un service avec un prix");
      return;
    }

    try {
      const factureData = {
        clientId: selectedClient.id,
        dateEcheance: newFacture.dateEcheance,
        montant: total,
        services: newFacture.services.filter(
          (s) => s.description && s.prix > 0,
        ),
        notes: newFacture.notes,
        statut: "En attente",
      };

      const response = await factureService.createFacture(factureData);

      if (response.success) {
        // Recharger les factures et fermer le modal avant le PDF
        await loadFactures();
        setShowNewFactureModal(false);
        setSelectedClient(null);
        setNewFacture({
          clientId: 0,
          dateEcheance: getDefaultDateEcheance(),
          services: [{ description: "", quantite: 1, prix: 0 }],
          notes: "",
        });

        setSuccessMessage(
          "Facture créée avec succès !",
        );
        setTimeout(() => setSuccessMessage(null), 5000);

        // Générer et télécharger le PDF en arrière-plan (non bloquant)
        try {
          await factureService.downloadPDF(response.data.id, response.data.id);
        } catch (pdfError: any) {
          console.error("Erreur lors du téléchargement du PDF:", pdfError);
          setSuccessMessage(
            "Facture créée avec succès, mais le téléchargement du PDF a échoué.",
          );
          setTimeout(() => setSuccessMessage(null), 5000);
        }
      } else {
        alert(response.message || "Erreur lors de la création de la facture");
      }
    } catch (error: any) {
      console.error("Erreur lors de la création de la facture:", error);
      alert(error.message || "Erreur lors de la création de la facture");
    }
  };

  // Fonction pour voir/générer le PDF d'une facture
  const handleViewPDF = async (facture: Facture) => {
    setLoadingPDF(true);
    setPdfFacture(facture);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/factures/${facture.id}/pdf`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erreur ${response.status}: ${text}`);
      }
      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setShowPDFModal(true);
    } catch (error: any) {
      console.error('Erreur PDF:', error);
      alert(`Erreur lors du chargement du PDF: ${error.message}`);
    } finally {
      setLoadingPDF(false);
    }
  };

  // Nettoyer l'URL quand on ferme le modal
  const closePDFModal = () => {
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
    }
    setPdfFacture(null);
    setShowPDFModal(false);
  };

  // Fonction pour télécharger le PDF
  const handleDownloadPDF = async (
    factureId: string,
    factureNumber: string,
  ) => {
    try {
      await factureService.downloadPDF(factureId, factureNumber);
    } catch (error) {
      console.error("Erreur lors du téléchargement du PDF:", error);
      alert("Erreur lors du téléchargement du PDF");
    }
  };

  return (
    <div className="p-6">
      {/* Message de succès */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-600 hover:text-green-800"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* En-tête moderne */}
      <PageHeader
        title="Gestion des Factures"
        subtitle="Création et suivi des factures clients"
        action={{
          label: 'Nouvelle Facture',
          onClick: () => {
            setSelectedClient(null);
            setClientSearchTerm("");
            setNewFacture({
              clientId: 0,
              dateEcheance: getDefaultDateEcheance(),
              services: [{ description: "", quantite: 1, prix: 0 }],
              notes: "",
            });
            setShowNewFactureModal(true);
          },
          icon: <PlusIcon className="h-4 w-4" />
        }}
      />

      {/* Statistiques modernes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total facturé', value: `${stats.total.toFixed(2)} USD`, icon: DocumentTextIcon, color: 'from-blue-500 to-indigo-600' },
          { title: 'Factures payées', value: `${stats.payees.toFixed(2)} USD`, icon: CheckIcon, color: 'from-emerald-500 to-teal-600' },
          { title: 'En attente', value: `${stats.enAttente.toFixed(2)} USD`, icon: ClockIcon, color: 'from-amber-500 to-orange-600' },
          { title: 'En retard', value: `${stats.enRetard.toFixed(2)} USD`, icon: XMarkIcon, color: 'from-red-500 to-rose-600' },
        ].map((stat, index) => (
          <div key={index} className="group">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 md:max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher une facture..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="relative">
              <select
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Tous">Tous les statuts</option>
                <option value="Payée">Payées</option>
                <option value="En attente">En attente</option>
                <option value="En retard">En retard</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des factures */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Liste des Factures
          </h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-500">Chargement des factures...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Erreur: {error}</p>
            <button
              onClick={loadFactures}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Réessayer
            </button>
          </div>
        ) : filteredFactures.length === 0 ? (
          <div className="p-8 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="mt-2 text-gray-500">Aucune facture trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Facture
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Échéance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
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
                {filteredFactures.map((facture) => (
                  <tr key={facture.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {facture.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {facture.clientNom
                            ? facture.clientNom
                            : "Client inconnu"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {facture.dateFacture}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {facture.dateEcheance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {facture.montant.toFixed(2)} USD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(facture.statut)}`}
                      >
                        {getStatutIcon(facture.statut)}
                        <span className="ml-1">{facture.statut}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewFacture(facture)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir les détails"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleViewPDF(facture)}
                          className="text-green-600 hover:text-green-900"
                          title="Voir le PDF"
                        >
                          <DocumentArrowDownIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDownloadPDF(facture.id, facture.id)
                          }
                          className="text-purple-600 hover:text-purple-900"
                          title="Télécharger le PDF"
                        >
                          <DocumentArrowDownIcon className="h-5 w-5 transform rotate-180" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          title="Modifier"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFacture(facture.id)}
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

      {/* Modal Nouvelle Facture */}
      {showNewFactureModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Nouvelle Facture
              </h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Numéro Facture
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                      placeholder="FAC-2024-XXX"
                      defaultValue={`FAC-${new Date().getFullYear()}-${String(factures.length + 1).padStart(3, "0")}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Client
                    </label>
                    {selectedClient ? (
                      <div className="mt-1 p-4 border border-gray-300 rounded-md bg-gradient-to-r from-primary-50 to-blue-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-white" />
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-lg">
                                {selectedClient.prenom} {selectedClient.nom}
                              </p>
                              <div className="mt-1 space-y-1">
                                <p className="text-sm text-gray-600 flex items-center">
                                  <span className="font-medium mr-2">
                                    Email:
                                  </span>
                                  {selectedClient.email}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center">
                                  <span className="font-medium mr-2">
                                    Téléphone:
                                  </span>
                                  {selectedClient.telephone}
                                </p>
                                {selectedClient.adresse && (
                                  <p className="text-sm text-gray-600 flex items-center">
                                    <span className="font-medium mr-2">
                                      Adresse:
                                    </span>
                                    {selectedClient.adresse}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedClient(null);
                              setClientSearchTerm("");
                            }}
                            className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Changer de client"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="mt-3 pt-3 border-t border-primary-200">
                          <p className="text-xs text-primary-700 font-medium">
                            ✅ Client sélectionné pour la facturation
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 relative client-search-container">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Rechercher un client par nom, email ou téléphone..."
                            value={clientSearchTerm}
                            onChange={(e) =>
                              setClientSearchTerm(e.target.value)
                            }
                            onFocus={() => setShowClientSearch(true)}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-gray-900"
                          />
                          <MagnifyingGlassIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>

                        {/* Résultats de recherche */}
                        {showClientSearch && clientSearchTerm && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {loadingClients ? (
                              <div className="p-4 text-center text-gray-500">
                                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                                <p className="mt-1 text-sm">
                                  Recherche en cours...
                                </p>
                              </div>
                            ) : clients.length > 0 ? (
                              <>
                                <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                                  <p className="text-xs font-medium text-gray-600">
                                    {clients.length} client
                                    {clients.length > 1 ? "s" : ""} trouvé
                                    {clients.length > 1 ? "s" : ""}
                                  </p>
                                </div>
                                {clients.map((client) => (
                                  <button
                                    key={client.id}
                                    type="button"
                                    onClick={() => selectClient(client)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                  >
                                    <div className="flex items-start space-x-3">
                                      <div className="flex-shrink-0 mt-0.5">
                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                          <UserIcon className="h-4 w-4 text-primary-600" />
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">
                                          {client.prenom} {client.nom}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                          {client.email}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          {client.telephone}
                                        </p>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </>
                            ) : (
                              <div className="p-4 text-center text-gray-500">
                                <UserIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm">Aucun client trouvé</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Essayez avec d'autres termes de recherche
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date Facture
                    </label>
                    <input
                      type="date"
                      value={new Date().toISOString().split("T")[0]}
                      readOnly
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date Échéance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={newFacture.dateEcheance}
                      onChange={(e) =>
                        setNewFacture({
                          ...newFacture,
                          dateEcheance: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Services
                  </label>
                  <div className="space-y-2">
                    {newFacture.services.map((service, index) => (
                      <div key={index} className="grid grid-cols-4 gap-2">
                        <input
                          type="text"
                          placeholder="Description"
                          value={service.description}
                          onChange={(e) => {
                            const updatedServices = [...newFacture.services];
                            updatedServices[index].description = e.target.value;
                            setNewFacture({
                              ...newFacture,
                              services: updatedServices,
                            });
                          }}
                          className="border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                        />
                        <input
                          type="number"
                          placeholder="Quantité"
                          value={service.quantite}
                          onChange={(e) => {
                            const updatedServices = [...newFacture.services];
                            updatedServices[index].quantite =
                              parseInt(e.target.value) || 0;
                            setNewFacture({
                              ...newFacture,
                              services: updatedServices,
                            });
                          }}
                          className="border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                        />
                        <input
                          type="number"
                          placeholder="Prix unitaire"
                          value={service.prix}
                          onChange={(e) => {
                            const updatedServices = [...newFacture.services];
                            updatedServices[index].prix =
                              parseFloat(e.target.value) || 0;
                            setNewFacture({
                              ...newFacture,
                              services: updatedServices,
                            });
                          }}
                          className="border border-gray-300 rounded-md px-3 py-2 text-gray-900"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newFacture.services.length > 1) {
                              const updatedServices =
                                newFacture.services.filter(
                                  (_, i) => i !== index,
                                );
                              setNewFacture({
                                ...newFacture,
                                services: updatedServices,
                              });
                            }
                          }}
                          className="bg-red-200 text-red-700 px-3 py-2 rounded-md hover:bg-red-300"
                        >
                          -
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setNewFacture({
                          ...newFacture,
                          services: [
                            ...newFacture.services,
                            { description: "", quantite: 1, prix: 0 },
                          ],
                        })
                      }
                      className="mt-2 text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      + Ajouter un service
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    placeholder="Notes supplémentaires..."
                    value={newFacture.notes}
                    onChange={(e) =>
                      setNewFacture({ ...newFacture, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Total */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {newFacture.services
                        .reduce(
                          (total, service) =>
                            total + service.quantite * service.prix,
                          0,
                        )
                        .toFixed(2)}{" "}
                      USD
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewFactureModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateFacture}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Créer la facture
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails Facture */}
      {showDetailModal && selectedFacture && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-medium text-gray-900">
                Détails de la Facture
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-500">Numéro</p>
                  <p className="text-lg font-semibold">{selectedFacture.id}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(selectedFacture.statut)}`}
                  >
                    {getStatutIcon(selectedFacture.statut)}
                    <span className="ml-1">{selectedFacture.statut}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="font-medium">
                    {selectedFacture.clientNom || "Client inconnu"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{selectedFacture.dateFacture}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Échéance</p>
                  <p className="font-medium">{selectedFacture.dateEcheance}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Montant</p>
                  <p className="font-medium">
                    {selectedFacture.montant.toFixed(2)} USD
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Services
                </p>
                <div className="space-y-2">
                  {selectedFacture.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b"
                    >
                      <span>{service.description}</span>
                      <span className="font-medium">
                        {service.quantite} × {service.prix.toFixed(2)} USD ={" "}
                        {(service.quantite * service.prix).toFixed(2)} USD
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() =>
                  handleDownloadPDF(selectedFacture.id, selectedFacture.id)
                }
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Télécharger PDF
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal PDF Viewer */}
      {showPDFModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-lg shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Visualisation de la Facture</h3>
              <button
                onClick={closePDFModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {/* PDF iframe or loading */}
            <div className="flex-1 overflow-hidden">
              {loadingPDF ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <p className="mt-2 text-gray-500">Chargement du PDF...</p>
                  </div>
                </div>
              ) : pdfUrl ? (
                <object
                  data={pdfUrl}
                  type="application/pdf"
                  className="w-full h-full"
                  title="Facture PDF"
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-8">
                    <p className="text-gray-600 mb-4">Le navigateur ne peut pas afficher le PDF directement.</p>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Ouvrir dans un nouvel onglet
                    </a>
                  </div>
                </object>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-red-600">Erreur: URL du PDF non disponible</p>
                </div>
              )}
            </div>
            {/* Footer */}
            <div className="flex justify-end px-6 py-4 border-t gap-3">
              <a
                href={pdfUrl}
                download={`facture-${pdfFacture?.id || "document"}.pdf`}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Télécharger
              </a>
              <button
                onClick={closePDFModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
