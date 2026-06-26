"use client";

import clientService from "@/services/clientService";
import merchandiseService from "@/services/marchandiseService";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface MarchandiseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

export default function MarchandiseForm({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: MarchandiseFormProps) {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    designation: "",
    categorieId: "",
    poids: "",
    volume: "",
    expediteurId: "",
    destinataireNom: "",
    destinataireTelephone: "",
    destinataireEmail: "",
    destinataireAdresse: "",
    villeDepart: "",
    villeArrivee: "",
    adresseRamassage: "",
    adresseLivraison: "",
    dateEnvoi: new Date().toISOString().split("T")[0],
    dateLivraisonPrevue: "",
    priorite: "Normale",
    typeTransport: "Routier",
    instructionsSpeciales: "",
    valeurDeclaree: "",
    assurance: false,
    coutTransport: "",
  });
  const [errors, setErrors] = useState<{
    designation?: string;
    poids?: string;
    volume?: string;
    expediteurId?: string;
    destinataireNom?: string;
    destinataireTelephone?: string;
    destinataireEmail?: string;
    destinataireAdresse?: string;
    villeDepart?: string;
    villeArrivee?: string;
    adresseRamassage?: string;
    adresseLivraison?: string;
    dateEnvoi?: string;
    dateLivraisonPrevue?: string;
    priorite?: string;
    typeTransport?: string;
    instructionsSpeciales?: string;
    valeurDeclaree?: string;
    coutTransport?: string;
  }>({});

  useEffect(() => {
    if (isOpen) {
      loadClients();
      loadCategories();
      if (initialData) {
        setFormData({
          ...formData,
          ...initialData,
          dateEnvoi: initialData.dateEnvoi
            ? new Date(initialData.dateEnvoi).toISOString().split("T")[0]
            : formData.dateEnvoi,
          dateLivraisonPrevue: initialData.dateLivraisonPrevue
            ? new Date(initialData.dateLivraisonPrevue)
                .toISOString()
                .split("T")[0]
            : "",
        });
      }
    }
  }, [isOpen, initialData, formData]);

  const loadClients = async () => {
    try {
      const response = await clientService.getAllClients({ limit: 1000 });
      setClients(response.data.clients || []);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/categories`,
      );
      const data = await response.json();
      if (data.success && data.data) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.designation.trim()) {
      newErrors.designation = "La désignation est requise";
    }

    if (!formData.poids || parseFloat(formData.poids) <= 0) {
      newErrors.poids = "Le poids doit être supérieur à 0";
    }

    if (!formData.volume || parseFloat(formData.volume) <= 0) {
      newErrors.volume = "Le volume doit être supérieur à 0";
    }

    if (!formData.expediteurId) {
      newErrors.expediteurId = "Veuillez sélectionner un expéditeur";
    }

    if (!formData.destinataireNom.trim()) {
      newErrors.destinataireNom = "Le nom du destinataire est requis";
    }

    if (!formData.destinataireTelephone.trim()) {
      newErrors.destinataireTelephone =
        "Le téléphone du destinataire est requis";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.destinataireTelephone)) {
      newErrors.destinataireTelephone = "Numéro de téléphone invalide";
    }

    if (!formData.villeDepart.trim()) {
      newErrors.villeDepart = "La ville de départ est requise";
    }

    if (!formData.villeArrivee.trim()) {
      newErrors.villeArrivee = "La ville d'arrivée est requise";
    }

    if (!formData.dateEnvoi) {
      newErrors.dateEnvoi = "La date d'envoi est requise";
    }

    if (formData.valeurDeclaree && parseFloat(formData.valeurDeclaree) < 0) {
      newErrors.valeurDeclaree = "La valeur déclarée ne peut être négative";
    }

    if (formData.coutTransport && parseFloat(formData.coutTransport) < 0) {
      newErrors.coutTransport = "Le coût de transport ne peut être négatif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...formData,
        poids: parseFloat(formData.poids),
        volume: parseFloat(formData.volume),
        valeurDeclaree: formData.valeurDeclaree
          ? parseFloat(formData.valeurDeclaree)
          : null,
        coutTransport: formData.coutTransport
          ? parseFloat(formData.coutTransport)
          : null,
      };

      if (initialData?.id) {
        await merchandiseService.updateMarchandise(initialData.id, data);
        toast.success("Marchandise mise à jour avec succès");
      } else {
        await merchandiseService.createMarchandise(data);
        toast.success("Marchandise créée avec succès");
      }

      onSuccess?.();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error("Erreur lors de la soumission:", error);
      toast.error(error.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      designation: "",
      categorieId: "",
      poids: "",
      volume: "",
      expediteurId: "",
      destinataireNom: "",
      destinataireTelephone: "",
      destinataireEmail: "",
      destinataireAdresse: "",
      villeDepart: "",
      villeArrivee: "",
      adresseRamassage: "",
      adresseLivraison: "",
      dateEnvoi: new Date().toISOString().split("T")[0],
      dateLivraisonPrevue: "",
      priorite: "Normale",
      typeTransport: "Routier",
      instructionsSpeciales: "",
      valeurDeclaree: "",
      assurance: false,
      coutTransport: "",
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        ></div>

        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                {initialData
                  ? "Modifier la marchandise"
                  : "Ajouter une nouvelle marchandise"}
              </h3>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Informations principales */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Informations principales
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Désignation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.designation ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Ex: Équipements électroniques"
                  />
                  {errors.designation && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.designation}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.categorieId}
                    onChange={(e) =>
                      setFormData({ ...formData, categorieId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Sélectionner une catégorie --</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.categorie}
                      </option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Chargement des catégories...
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Poids (kg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.poids}
                    onChange={(e) =>
                      setFormData({ ...formData, poids: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.poids ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                  {errors.poids && (
                    <p className="text-red-500 text-sm mt-1">{errors.poids}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Volume (m³) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.volume}
                    onChange={(e) =>
                      setFormData({ ...formData, volume: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.volume ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0.000"
                  />
                  {errors.volume && (
                    <p className="text-red-500 text-sm mt-1">{errors.volume}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Expéditeur */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Expéditeur
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client expéditeur <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.expediteurId}
                    onChange={(e) =>
                      setFormData({ ...formData, expediteurId: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.expediteurId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map((client: any) => (
                      <option key={client.id} value={client.id}>
                        {client.nom} {client.prenom} - {client.email}
                      </option>
                    ))}
                  </select>
                  {errors.expediteurId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.expediteurId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Destinataire */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Destinataire
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.destinataireNom}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destinataireNom: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.destinataireNom
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Nom du destinataire"
                  />
                  {errors.destinataireNom && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.destinataireNom}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.destinataireTelephone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destinataireTelephone: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.destinataireTelephone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="+243 XXX XXX XXX"
                  />
                  {errors.destinataireTelephone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.destinataireTelephone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.destinataireEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destinataireEmail: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@exemple.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <textarea
                    value={formData.destinataireAdresse}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destinataireAdresse: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Adresse complète du destinataire"
                  />
                </div>
              </div>
            </div>

            {/* Transport */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Informations de transport
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville de départ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.villeDepart}
                    onChange={(e) =>
                      setFormData({ ...formData, villeDepart: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.villeDepart ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Ex: Kinshasa"
                  />
                  {errors.villeDepart && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.villeDepart}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville d'arrivée <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.villeArrivee}
                    onChange={(e) =>
                      setFormData({ ...formData, villeArrivee: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.villeArrivee ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Ex: Lubumbashi"
                  />
                  {errors.villeArrivee && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.villeArrivee}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date d'envoi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateEnvoi}
                    onChange={(e) =>
                      setFormData({ ...formData, dateEnvoi: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.dateEnvoi ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.dateEnvoi && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dateEnvoi}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de livraison prévue
                  </label>
                  <input
                    type="date"
                    value={formData.dateLivraisonPrevue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateLivraisonPrevue: e.target.value,
                      })
                    }
                    min={formData.dateEnvoi}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de transport
                  </label>
                  <select
                    value={formData.typeTransport}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        typeTransport: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Routier">Routier</option>
                    <option value="Aérien">Aérien</option>
                    <option value="Maritime">Maritime</option>
                    <option value="Ferroviaire">Ferroviaire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priorité
                  </label>
                  <select
                    value={formData.priorite}
                    onChange={(e) =>
                      setFormData({ ...formData, priorite: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Basse">Basse</option>
                    <option value="Normale">Normale</option>
                    <option value="Haute">Haute</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse de ramassage
                  </label>
                  <textarea
                    value={formData.adresseRamassage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        adresseRamassage: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Adresse précise de ramassage"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse de livraison
                  </label>
                  <textarea
                    value={formData.adresseLivraison}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        adresseLivraison: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Adresse précise de livraison"
                  />
                </div>
              </div>
            </div>

            {/* Options additionnelles */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Options additionnelles
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions spéciales
                  </label>
                  <textarea
                    value={formData.instructionsSpeciales}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        instructionsSpeciales: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Instructions particulières pour la manutention..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valeur déclarée (USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.valeurDeclaree}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          valeurDeclaree: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.valeurDeclaree
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0.00"
                    />
                    {errors.valeurDeclaree && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.valeurDeclaree}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coût de transport (USD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.coutTransport}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coutTransport: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.coutTransport
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="0.00"
                    />
                    {errors.coutTransport && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.coutTransport}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="assurance"
                      checked={formData.assurance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          assurance: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="assurance"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Assurance activée
                    </label>
                  </div>
                </div>

                {formData.assurance && (
                  <div className="flex items-start p-3 bg-yellow-100 rounded-md">
                    <InformationCircleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      L'assurance couvrira la marchandise en cas de perte ou de
                      dommage pendant le transport.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "En cours..."
                  : initialData
                    ? "Mettre à jour"
                    : "Créer la marchandise"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
