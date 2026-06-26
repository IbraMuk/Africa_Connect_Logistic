"use client";

import PageHeader from "@/components/PageHeader";
import merchandiseService from "@/services/marchandiseService";
import {
    CheckCircleIcon,
    CurrencyDollarIcon,
    DocumentArrowDownIcon,
    GlobeAltIcon,
    MagnifyingGlassIcon,
    PrinterIcon,
    ScaleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ImportExportPage() {
  const [marchandises, setMarchandises] = useState<any[]>([]);
  const [selectedMarchandises, setSelectedMarchandises] = useState<number[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFactureModal, setShowFactureModal] = useState(false);
  const [factureData, setFactureData] = useState({
    typeOperation: "import",
    clientNom: "",
    clientEmail: "",
    clientTelephone: "",
    clientAdresse: "",
    numeroFacture: "",
    dateFacture: new Date().toISOString().split("T")[0],
    dateEcheance: "",
    instructions: "",
    marchandises: [] as any[],
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

  useEffect(() => {
    loadMarchandises();
    // Générer numéro de facture
    const num = `FAC-IMP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
    setFactureData((prev) => ({ ...prev, numeroFacture: num }));
  }, []);

  const filteredMarchandises = marchandises.filter(
    (marchandise) =>
      !selectedMarchandises.includes(marchandise.id) &&
      (marchandise.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        marchandise.designation
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (marchandise.categorie_nom &&
          marchandise.categorie_nom
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))),
  );

  const handleAddMarchandise = (marchandise: any) => {
    setSelectedMarchandises([...selectedMarchandises, marchandise.id]);
    setFactureData((prev) => ({
      ...prev,
      marchandises: [
        ...prev.marchandises,
        {
          ...marchandise,
          quantite: 1,
          prixUnitaire: 0,
          montantTotal: 0,
        },
      ],
    }));
  };

  const handleRemoveMarchandise = (id: number) => {
    setSelectedMarchandises(selectedMarchandises.filter((m) => m !== id));
    setFactureData((prev) => ({
      ...prev,
      marchandises: prev.marchandises.filter((m) => m.id !== id),
    }));
  };

  const updateMarchandiseQuantite = (id: number, quantite: number) => {
    setFactureData((prev) => ({
      ...prev,
      marchandises: prev.marchandises.map((m) =>
        m.id === id
          ? { ...m, quantite, montantTotal: quantite * m.prixUnitaire }
          : m,
      ),
    }));
  };

  const updateMarchandisePrix = (id: number, prixUnitaire: number) => {
    setFactureData((prev) => ({
      ...prev,
      marchandises: prev.marchandises.map((m) =>
        m.id === id
          ? { ...m, prixUnitaire, montantTotal: m.quantite * prixUnitaire }
          : m,
      ),
    }));
  };

  const calculerTotal = () => {
    return factureData.marchandises.reduce(
      (total, m) => total + m.montantTotal,
      0,
    );
  };

  const calculerTotalPoids = () => {
    return factureData.marchandises.reduce(
      (total, m) => total + m.poids * m.quantite,
      0,
    );
  };

  const calculerTotalVolume = () => {
    return factureData.marchandises.reduce(
      (total, m) => total + m.volume * m.quantite,
      0,
    );
  };

  const genererPDF = async () => {
    try {
      // Validation
      if (!factureData.clientNom.trim()) {
        toast.error("Veuillez renseigner le nom du client");
        return;
      }
      if (factureData.marchandises.length === 0) {
        toast.error("Veuillez ajouter au moins une marchandise");
        return;
      }

      // Préparation des données pour le PDF
      const pdfData = {
        ...factureData,
        totalHT: calculerTotal(),
        totalTVA: calculerTotal() * 0.18, // TVA 18%
        totalTTC: calculerTotal() * 1.18,
        totalPoids: calculerTotalPoids(),
        totalVolume: calculerTotalVolume(),
        dateGeneration: new Date().toLocaleString("fr-FR"),
      };

      // Appel à l'API pour générer le PDF
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/factures/generate-pdf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pdfData),
        },
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Facture-${factureData.numeroFacture}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.success("PDF généré avec succès");
        setShowFactureModal(false);
        // Réinitialiser
        setSelectedMarchandises([]);
        setFactureData({
          ...factureData,
          clientNom: "",
          clientEmail: "",
          clientTelephone: "",
          clientAdresse: "",
          marchandises: [],
        });
      } else {
        toast.error("Erreur lors de la génération du PDF");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="p-6">
      {/* En-tête moderne */}
      <PageHeader
        title="Facturation Import/Export"
        subtitle="Créez des factures pour les opérations d'import/export"
        action={{
          label: "Nouvelle Facture",
          onClick: () => setShowFactureModal(true),
          icon: <DocumentArrowDownIcon className="h-4 w-4" />,
        }}
      />

      {/* Statistiques modernes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Marchandises",
            value: marchandises.length,
            icon: GlobeAltIcon,
            color: "from-blue-500 to-indigo-600",
          },
          {
            title: "Sélectionnées",
            value: selectedMarchandises.length,
            icon: CheckCircleIcon,
            color: "from-amber-500 to-orange-600",
          },
          {
            title: "Poids Total",
            value: `${calculerTotalPoids().toFixed(2)} kg`,
            icon: ScaleIcon,
            color: "from-emerald-500 to-teal-600",
          },
          {
            title: "Montant Total",
            value: `${calculerTotal().toFixed(2)} $`,
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
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Facture */}
      {showFactureModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowFactureModal(false)}
            ></div>

            <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    Création Facture{" "}
                    {factureData.typeOperation === "import"
                      ? "d'Import"
                      : "d'Export"}
                  </h3>
                  <button
                    onClick={() => setShowFactureModal(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Informations facture */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Informations Facture
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <label className="text-sm font-medium text-gray-700 w-32">
                          Type:
                        </label>
                        <select
                          value={factureData.typeOperation}
                          onChange={(e) =>
                            setFactureData({
                              ...factureData,
                              typeOperation: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="import">Import</option>
                          <option value="export">Export</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <label className="text-sm font-medium text-gray-700 w-32">
                          N° Facture:
                        </label>
                        <input
                          type="text"
                          value={factureData.numeroFacture}
                          onChange={(e) =>
                            setFactureData({
                              ...factureData,
                              numeroFacture: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="text-sm font-medium text-gray-700 w-32">
                          Date:
                        </label>
                        <input
                          type="date"
                          value={factureData.dateFacture}
                          onChange={(e) =>
                            setFactureData({
                              ...factureData,
                              dateFacture: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="text-sm font-medium text-gray-700 w-32">
                          Échéance:
                        </label>
                        <input
                          type="date"
                          value={factureData.dateEcheance}
                          onChange={(e) =>
                            setFactureData({
                              ...factureData,
                              dateEcheance: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Informations Client
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Nom du client *"
                          value={factureData.clientNom}
                          onChange={(e) =>
                            setFactureData({
                              ...factureData,
                              clientNom: e.target.value,
                            })
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          placeholder="Email"
                          value={factureData.clientEmail}
                          onChange={(e) =>
                            setFactureData({
                              ...factureData,
                              clientEmail: e.target.value,
                            })
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          placeholder="Téléphone"
                          value={factureData.clientTelephone}
                          onChange={(e) =>
                            setFactureData({
                              ...factureData,
                              clientTelephone: e.target.value,
                            })
                          }
                          className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder="Adresse"
                          value={factureData.clientAdresse}
                          onChange={(e) =>
                            setFactureData({
                              ...factureData,
                              clientAdresse: e.target.value,
                            })
                          }
                          rows={2}
                          className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions spéciales
                  </label>
                  <textarea
                    placeholder="Instructions pour l'import/export..."
                    value={factureData.instructions}
                    onChange={(e) =>
                      setFactureData({
                        ...factureData,
                        instructions: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Marchandises */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Marchandises
                  </h4>

                  {/* Barre de recherche */}
                  <div className="relative mb-4">
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher une marchandise..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  {/* Liste des marchandises disponibles */}
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg mb-4">
                    {filteredMarchandises.length > 0 ? (
                      filteredMarchandises.map((marchandise) => (
                        <div
                          key={marchandise.id}
                          className="p-3 hover:bg-gray-50 border-b last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {marchandise.designation}
                              </p>
                              <p className="text-xs text-gray-500">
                                {marchandise.categorie_nom || "Non catégorisée"}{" "}
                                - {marchandise.poids}kg - {marchandise.volume}m³
                              </p>
                            </div>
                            <button
                              onClick={() => handleAddMarchandise(marchandise)}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                            >
                              Ajouter
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">
                        Aucune marchandise disponible
                      </p>
                    )}
                  </div>

                  {/* Tableau des marchandises sélectionnées */}
                  {factureData.marchandises.length > 0 && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Désignation
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                              Quantité
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                              Prix Unit.
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                              Total
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {factureData.marchandises.map((marchandise) => (
                            <tr key={marchandise.id}>
                              <td className="px-4 py-2 text-sm">
                                <div>
                                  <p className="font-medium">
                                    {marchandise.designation}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {marchandise.categorie_nom}
                                  </p>
                                </div>
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  min="1"
                                  value={marchandise.quantite}
                                  onChange={(e) =>
                                    updateMarchandiseQuantite(
                                      marchandise.id,
                                      parseInt(e.target.value) || 1,
                                    )
                                  }
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                                />
                              </td>
                              <td className="px-4 py-2">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={marchandise.prixUnitaire}
                                  onChange={(e) =>
                                    updateMarchandisePrix(
                                      marchandise.id,
                                      parseFloat(e.target.value) || 0,
                                    )
                                  }
                                  className="w-24 px-2 py-1 border border-gray-300 rounded text-right text-sm"
                                />
                              </td>
                              <td className="px-4 py-2 text-right text-sm font-medium">
                                ${marchandise.montantTotal.toFixed(2)}
                              </td>
                              <td className="px-4 py-2 text-center">
                                <button
                                  onClick={() =>
                                    handleRemoveMarchandise(marchandise.id)
                                  }
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td
                              colSpan={3}
                              className="px-4 py-2 text-right font-medium text-sm"
                            >
                              Total:
                            </td>
                            <td className="px-4 py-2 text-right font-bold text-lg">
                              ${calculerTotal().toFixed(2)}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowFactureModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={genererPDF}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 flex items-center"
                  >
                    <PrinterIcon className="h-4 w-4 mr-2" />
                    Générer PDF
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
