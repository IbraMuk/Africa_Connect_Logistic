"use client";

import PageHeader from "@/components/PageHeader";
import {
    CheckCircleIcon,
    ClockIcon,
    CurrencyDollarIcon,
    EnvelopeIcon,
    EyeIcon,
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

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    depart: "",
    arrivee: "",
    date: "",
    heure: "",
    typeVehicule: "bus",
    nombrePlaces: 1,
    statut: "en_attente",
    prix: 0,
    notes: "",
  });

  // Données simulées
  const mockReservations = [
    {
      id: 1,
      nom: "Mukendi",
      prenom: "Jean",
      email: "jean.mukendi@email.com",
      telephone: "+243812345678",
      depart: "Kinshasa",
      arrivee: "Lubumbashi",
      date: "2024-01-20",
      heure: "08:00",
      typeVehicule: "bus",
      nombrePlaces: 2,
      statut: "confirmée",
      reference: "TP-2024-001",
      chauffeur: "Pierre Mbuyi",
      immatriculation: "CD-123-AB",
      prix: 150,
      notes: "Bagages supplémentaires inclus",
      dateReservation: "2024-01-15",
      heureReservation: "10:30",
    },
    {
      id: 2,
      nom: "Kabeya",
      prenom: "Marie",
      email: "marie.kabeya@email.com",
      telephone: "+243823456789",
      depart: "Kinshasa",
      arrivee: "Kikwit",
      date: "2024-01-21",
      heure: "06:30",
      typeVehicule: "minibus",
      nombrePlaces: 1,
      statut: "en_attente",
      reference: "TP-2024-002",
      chauffeur: "Non assigné",
      immatriculation: "Non assigné",
      prix: 80,
      notes: "Client régulier",
      dateReservation: "2024-01-16",
      heureReservation: "14:20",
    },
    {
      id: 3,
      nom: "Luboya",
      prenom: "Thomas",
      email: "thomas.luboya@email.com",
      telephone: "+243834567890",
      depart: "Lubumbashi",
      arrivee: "Kolwezi",
      date: "2024-01-22",
      heure: "09:00",
      typeVehicule: "voiture",
      nombrePlaces: 4,
      statut: "en_cours",
      reference: "TP-2024-003",
      chauffeur: "Antoine Tshimanga",
      immatriculation: "CD-456-CD",
      prix: 200,
      notes: "Famille avec enfants",
      dateReservation: "2024-01-17",
      heureReservation: "09:15",
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setReservations(mockReservations);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.depart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.arrivee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.reference.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nom ||
      !formData.prenom ||
      !formData.depart ||
      !formData.arrivee ||
      !formData.date
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const newReservation = {
      id: reservations.length + 1,
      ...formData,
      reference: `TP-2024-${String(reservations.length + 1).padStart(3, "0")}`,
      chauffeur: "Non assigné",
      immatriculation: "Non assigné",
      dateReservation: new Date().toISOString().split("T")[0],
      heureReservation: new Date().toTimeString().split(" ")[0].substring(0, 5),
    };

    setReservations([...reservations, newReservation]);
    toast.success("Réservation créée avec succès");
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      depart: "",
      arrivee: "",
      date: "",
      heure: "",
      typeVehicule: "bus",
      nombrePlaces: 1,
      statut: "en_attente",
      prix: 0,
      notes: "",
    });
  };

  const handleEdit = (reservation: any) => {
    setSelectedReservation(reservation);
    setFormData({
      nom: reservation.nom,
      prenom: reservation.prenom,
      email: reservation.email,
      telephone: reservation.telephone,
      depart: reservation.depart,
      arrivee: reservation.arrivee,
      date: reservation.date,
      heure: reservation.heure,
      typeVehicule: reservation.typeVehicule,
      nombrePlaces: reservation.nombrePlaces,
      statut: reservation.statut,
      prix: reservation.prix,
      notes: reservation.notes,
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")
    ) {
      setReservations(reservations.filter((r) => r.id !== id));
      toast.success("Réservation supprimée");
    }
  };

  const handleViewDetails = (reservation: any) => {
    setSelectedReservation(reservation);
    setShowDetailsModal(true);
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case "confirmée":
        return "bg-green-100 text-green-800";
      case "en_attente":
        return "bg-yellow-100 text-yellow-800";
      case "en_cours":
        return "bg-blue-100 text-blue-800";
      case "terminée":
        return "bg-gray-100 text-gray-800";
      case "annulée":
        return "bg-red-100 text-red-800";
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
      default:
        return "🚗";
    }
  };

  return (
    <div className="p-6">
      {/* En-tête moderne */}
      <PageHeader
        title="Réservations du Personnel"
        subtitle="Gérez toutes les réservations de transport"
        action={{
          label: "Nouvelle Réservation",
          onClick: () => setShowModal(true),
          icon: <PlusIcon className="h-4 w-4" />,
        }}
      />

      {/* Statistiques modernes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[
          {
            title: "Total",
            value: reservations.length,
            icon: UserIcon,
            color: "from-blue-500 to-indigo-600",
          },
          {
            title: "Confirmées",
            value: reservations.filter((r) => r.statut === "confirmée").length,
            icon: CheckCircleIcon,
            color: "from-emerald-500 to-teal-600",
          },
          {
            title: "En attente",
            value: reservations.filter((r) => r.statut === "en_attente").length,
            icon: ClockIcon,
            color: "from-amber-500 to-orange-600",
          },
          {
            title: "En cours",
            value: reservations.filter((r) => r.statut === "en_cours").length,
            icon: TruckIcon,
            color: "from-sky-500 to-cyan-600",
          },
          {
            title: "Revenu total",
            value: `$${reservations.reduce((total, r) => total + (r.prix || 0), 0)}`,
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
            placeholder="Rechercher une réservation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Tableau des réservations */}
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
                  Référence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personnel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trajet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Véhicule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
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
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {reservation.reference}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {reservation.prenom} {reservation.nom}
                      </p>
                      <div className="flex items-center mt-1">
                        <PhoneIcon className="h-3 w-3 text-gray-400 mr-1" />
                        <p className="text-xs text-gray-500">
                          {reservation.telephone}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-3 w-3 text-gray-400 mr-1" />
                        <p className="text-xs text-gray-500">
                          {reservation.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-900">
                          {reservation.depart}
                        </p>
                        <p className="text-xs text-gray-500">
                          → {reservation.arrivee}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">
                        {new Date(reservation.date).toLocaleDateString("fr-FR")}
                      </p>
                      <p className="text-sm text-gray-500">
                        {reservation.heure}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">
                        {getVehiculeIcon(reservation.typeVehicule)}
                      </span>
                      <div>
                        <p className="text-sm text-gray-900 capitalize">
                          {reservation.typeVehicule}
                        </p>
                        <p className="text-xs text-gray-500">
                          {reservation.nombrePlaces} place(s)
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      ${reservation.prix}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutBadge(reservation.statut)}`}
                    >
                      {reservation.statut.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewDetails(reservation)}
                      className="text-gray-600 hover:text-gray-900 mr-3"
                      title="Voir détails"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(reservation)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Modifier"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(reservation.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Supprimer"
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

      {/* Modal Nouvelle/Édition Réservation */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowModal(false)}
            ></div>

            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    {selectedReservation
                      ? "Modifier la réservation"
                      : "Nouvelle réservation"}
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
                      Téléphone
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
                      Départ *
                    </label>
                    <input
                      type="text"
                      value={formData.depart}
                      onChange={(e) =>
                        setFormData({ ...formData, depart: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ville de départ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arrivée *
                    </label>
                    <input
                      type="text"
                      value={formData.arrivee}
                      onChange={(e) =>
                        setFormData({ ...formData, arrivee: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ville d'arrivée"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heure
                    </label>
                    <input
                      type="time"
                      value={formData.heure}
                      onChange={(e) =>
                        setFormData({ ...formData, heure: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de véhicule
                    </label>
                    <select
                      value={formData.typeVehicule}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          typeVehicule: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="bus">Bus</option>
                      <option value="minibus">Minibus</option>
                      <option value="voiture">Voiture</option>
                      <option value="camion">Camion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de places
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
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
                      Prix ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.prix}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          prix: parseFloat(e.target.value),
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
                      <option value="en_attente">En attente</option>
                      <option value="confirmée">Confirmée</option>
                      <option value="en_cours">En cours</option>
                      <option value="terminée">Terminée</option>
                      <option value="annulée">Annulée</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Notes additionnelles..."
                  />
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
                    {selectedReservation ? "Mettre à jour" : "Créer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails */}
      {showDetailsModal && selectedReservation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowDetailsModal(false)}
            ></div>

            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    Détails de la réservation
                  </h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Informations personnel
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Nom:</span>{" "}
                        {selectedReservation.prenom} {selectedReservation.nom}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedReservation.email}
                      </p>
                      <p>
                        <span className="font-medium">Téléphone:</span>{" "}
                        {selectedReservation.telephone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Informations de voyage
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Référence:</span>{" "}
                        {selectedReservation.reference}
                      </p>
                      <p>
                        <span className="font-medium">Trajet:</span>{" "}
                        {selectedReservation.depart} →{" "}
                        {selectedReservation.arrivee}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(selectedReservation.date).toLocaleDateString(
                          "fr-FR",
                        )}{" "}
                        à {selectedReservation.heure}
                      </p>
                      <p>
                        <span className="font-medium">Véhicule:</span>{" "}
                        {selectedReservation.typeVehicule} (
                        {selectedReservation.nombrePlaces} places)
                      </p>
                      <p>
                        <span className="font-medium">Prix:</span> $
                        {selectedReservation.prix}
                      </p>
                      <p>
                        <span className="font-medium">Statut:</span>{" "}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutBadge(selectedReservation.statut)}`}
                        >
                          {selectedReservation.statut}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {selectedReservation.notes && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">
                      {selectedReservation.notes}
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-gray-500">
                    Réservé le{" "}
                    {new Date(
                      selectedReservation.dateReservation,
                    ).toLocaleDateString("fr-FR")}{" "}
                    à {selectedReservation.heureReservation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
