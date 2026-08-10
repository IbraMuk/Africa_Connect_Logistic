"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  DocumentArrowDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface FacturesListProps {
  onEdit: (facture: any) => void;
  refreshKey?: number;
}

export default function ImportExportFacturesList({ onEdit, refreshKey = 0 }: FacturesListProps) {
  const [factures, setFactures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewFacture, setViewFacture] = useState<any | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const loadFactures = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/factures/import-export/all`);
      const result = await response.json();
      if (result.success) {
        setFactures(result.data || []);
      } else {
        toast.error("Erreur lors du chargement des factures");
      }
    } catch (error) {
      console.error("Erreur loadFactures:", error);
      toast.error("Erreur lors du chargement des factures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFactures();
  }, [refreshKey]);

  const handleDownload = (id: number, numeroFacture: string) => {
    const url = `${API_URL}/factures/import-export/${id}/pdf`;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.download = `Facture-${numeroFacture}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette facture ?")) return;
    try {
      const response = await fetch(`${API_URL}/factures/import-export/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Facture supprimée");
        loadFactures();
      } else {
        const err = await response.json();
        toast.error(err.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur suppression facture:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const handleEditClick = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/factures/import-export/${id}`);
      const result = await response.json();
      if (result.success) {
        onEdit(result.data);
      } else {
        toast.error("Impossible de charger la facture");
      }
    } catch (error) {
      console.error("Erreur chargement facture:", error);
      toast.error("Erreur lors du chargement de la facture");
    }
  };

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("fr-FR");
  };

  const formatMontant = (v: number) => `${parseFloat(v as any).toFixed(2)} $`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Factures Import/Export</h3>
      </div>
      {loading ? (
        <div className="p-6 text-center text-gray-500">Chargement...</div>
      ) : factures.length === 0 ? (
        <div className="p-6 text-center text-gray-500">Aucune facture enregistrée</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Facture</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {factures.map((facture) => (
                <tr key={facture.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{facture.numeroFacture}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(facture.dateFacture)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{facture.clientNom}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{facture.typeOperation}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">{formatMontant(facture.totalTTC)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setViewFacture(facture)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Visualiser"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(facture.id)}
                        className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                        title="Modifier"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(facture.id, facture.numeroFacture)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                        title="Télécharger"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(facture.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Supprimer"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewFacture && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75"
              onClick={() => setViewFacture(null)}
            ></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Détails de la facture</h3>
                <button
                  onClick={() => setViewFacture(null)}
                  className="text-white hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p>
                  <strong>N° :</strong> {viewFacture.numeroFacture}
                </p>
                <p>
                  <strong>Date :</strong> {formatDate(viewFacture.dateFacture)}
                </p>
                <p>
                  <strong>Échéance :</strong> {formatDate(viewFacture.dateEcheance)}
                </p>
                <p>
                  <strong>Client :</strong> {viewFacture.clientNom}
                </p>
                {viewFacture.clientEmail && (
                  <p>
                    <strong>Email :</strong> {viewFacture.clientEmail}
                  </p>
                )}
                {viewFacture.clientTelephone && (
                  <p>
                    <strong>Tél :</strong> {viewFacture.clientTelephone}
                  </p>
                )}
                {viewFacture.clientAdresse && (
                  <p>
                    <strong>Adresse :</strong> {viewFacture.clientAdresse}
                  </p>
                )}
                <p>
                  <strong>Type :</strong> {viewFacture.typeOperation}
                </p>
                <p>
                  <strong>Total HT :</strong> {formatMontant(viewFacture.totalHT)}
                </p>
                <p>
                  <strong>TVA :</strong> {formatMontant(viewFacture.totalTVA)}
                </p>
                <p>
                  <strong>Total TTC :</strong> {formatMontant(viewFacture.totalTTC)}
                </p>
                <p>
                  <strong>Poids total :</strong> {parseFloat(viewFacture.totalPoids || 0).toFixed(2)} kg
                </p>
                <p>
                  <strong>Volume total :</strong> {parseFloat(viewFacture.totalVolume || 0).toFixed(2)} m³
                </p>
                {viewFacture.instructions && (
                  <p>
                    <strong>Instructions :</strong> {viewFacture.instructions}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
