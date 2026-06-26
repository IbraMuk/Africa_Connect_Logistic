'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  TicketIcon,
  TruckIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  StarIcon,
  ShieldCheckIcon,
  WifiIcon,
  CogIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import ReservationForm from '@/components/forms/ReservationForm'
import PageHeader from '@/components/PageHeader'

export default function BilletteriePage() {
  const [activeTab, setActiveTab] = useState('maritime')
  const [searchData, setSearchData] = useState({
    depart: '',
    arrivee: '',
    date: '',
    passagers: 1,
    classe: 'economique'
  })
  const [trajets, setTrajets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [selectedTrajet, setSelectedTrajet] = useState<any>(null)
  const [passagerData, setPassagerData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    passeport: '',
    siege: ''
  })

  // Données simulées pour les trajets
  const mockTrajets = {
    maritime: [
      {
        id: 1,
        compagnie: 'Congo Marine Line',
        logo: '🚢',
        navire: 'MV Africa Queen',
        depart: 'Port de Boma',
        arrivee: 'Port de Matadi',
        dateDepart: '2024-01-20',
        dateArrivee: '2024-01-21',
        heureDepart: '08:00',
        heureArrivee: '16:00',
        prix: { economique: 150, affaire: 250, premiere: 400 },
        classe: 'economique',
        equipements: ['WiFi', 'Restaurant', 'Cabine', 'Sécurité 24/7'],
        rating: 4.5,
        placesDisponibles: 45
      },
      {
        id: 2,
        compagnie: 'Atlantic Shipping',
        logo: '🚢',
        navire: 'MV Ocean Dream',
        depart: 'Port de Matadi',
        arrivee: 'Port de Luanda',
        dateDepart: '2024-01-22',
        dateArrivee: '2024-01-24',
        heureDepart: '10:00',
        heureArrivee: '14:00',
        prix: { economique: 200, affaire: 350, premiere: 600 },
        classe: 'economique',
        equipements: ['WiFi', 'Spa', 'Restaurant Premium', 'Sécurité'],
        rating: 4.8,
        placesDisponibles: 20
      }
    ],
    bus: [
      {
        id: 3,
        compagnie: 'Express Bus Congo',
        logo: '🚌',
        navire: 'Mercedes-Benz Tourismo',
        depart: 'Kinshasa',
        arrivee: 'Lubumbashi',
        dateDepart: '2024-01-20',
        dateArrivee: '2024-01-22',
        heureDepart: '06:00',
        heureArrivee: '18:00',
        prix: { economique: 80, vip: 120, premium: 180 },
        classe: 'economique',
        equipements: ['Climatisation', 'WiFi', 'Toilettes', 'Prises USB'],
        rating: 4.2,
        placesDisponibles: 35
      },
      {
        id: 4,
        compagnie: 'Royal Travel',
        logo: '🚌',
        navire: 'Scania Irizar',
        depart: 'Kinshasa',
        arrivee: 'Bukavu',
        dateDepart: '2024-01-21',
        dateArrivee: '2024-01-22',
        heureDepart: '07:30',
        heureArrivee: '16:30',
        prix: { economique: 60, vip: 90, premium: 140 },
        classe: 'economique',
        equipements: ['Climatisation', 'WiFi', 'Snacks', 'Ecrans'],
        rating: 4.6,
        placesDisponibles: 28
      }
    ],
    aviation: [
      {
        id: 5,
        compagnie: 'Congo Airways',
        logo: '✈️',
        navire: 'Boeing 737-800',
        depart: 'Kinshasa (FIH)',
        arrivee: 'Lubumbashi (FBM)',
        dateDepart: '2024-01-20',
        dateArrivee: '2024-01-20',
        heureDepart: '08:30',
        heureArrivee: '10:45',
        prix: { economique: 250, affaire: 450, premiere: 800 },
        classe: 'economique',
        equipements: ['Repas', 'Divertissement', 'WiFi', 'Lounge'],
        rating: 4.7,
        placesDisponibles: 120
      },
      {
        id: 6,
        compagnie: 'CAA - Congo Airlines',
        logo: '✈️',
        navire: 'Airbus A330-200',
        depart: 'Kinshasa (FIH)',
        arrivee: 'Bruxelles (BRU)',
        dateDepart: '2024-01-21',
        dateArrivee: '2024-01-22',
        heureDepart: '23:00',
        heureArrivee: '06:30',
        prix: { economique: 650, affaire: 1200, premiere: 2500 },
        classe: 'economique',
        equipements: ['Suite privée', 'Chef cuisinier', 'Spa', 'Lounge VIP'],
        rating: 4.9,
        placesDisponibles: 15
      }
    ]
  }

  const handleSearch = () => {
    if (!searchData.depart || !searchData.arrivee || !searchData.date) {
      toast.error('Veuillez remplir tous les champs de recherche')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setTrajets(mockTrajets[activeTab as keyof typeof mockTrajets] || [])
      setLoading(false)
    }, 1000)
  }

  const handleReservation = (trajet: any) => {
    setSelectedTrajet(trajet)
    setShowReservationModal(true)
  }

  const handleConfirmReservation = () => {
    if (!passagerData.nom || !passagerData.prenom || !passagerData.email) {
      toast.error('Veuillez remplir les informations obligatoires')
      return
    }

    // Simulation de réservation
    toast.success('Réservation confirmée !')
    setShowReservationModal(false)
    setPassagerData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      dateNaissance: '',
      passeport: '',
      siege: ''
    })
  }

  const handleReservationSuccess = (reservation: any) => {
    // Optionnel: rafraîchir la liste des trajets ou afficher un message
    console.log('Réservation réussie:', reservation)
  }

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'maritime':
        return <TruckIcon className="h-6 w-6" />
      case 'bus':
        return <TruckIcon className="h-6 w-6" />
      case 'aviation':
        return <TicketIcon className="h-6 w-6" />
      default:
        return <TicketIcon className="h-6 w-6" />
    }
  }

  const getClasseOptions = (type: string) => {
    switch (type) {
      case 'maritime':
        return [
          { value: 'economique', label: 'Classe Économique' },
          { value: 'affaire', label: 'Classe Affaire' },
          { value: 'premiere', label: 'Première Classe' }
        ]
      case 'bus':
        return [
          { value: 'economique', label: 'Standard' },
          { value: 'vip', label: 'VIP' },
          { value: 'premium', label: 'Premium' }
        ]
      case 'aviation':
        return [
          { value: 'economique', label: 'Économique' },
          { value: 'affaire', label: 'Affaire' },
          { value: 'premiere', label: 'Première' }
        ]
      default:
        return []
    }
  }

  return (
    <div className="p-6">
      {/* En-tête moderne */}
      <PageHeader
        title="Billetterie"
        subtitle="Réservez vos billets pour maritime, bus et aviation"
      />

      {/* Tabs de sélection du type de transport */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'maritime', label: 'Transport Maritime', icon: TruckIcon },
              { id: 'bus', label: 'Transport par Bus', icon: TruckIcon },
              { id: 'aviation', label: 'Aviation', icon: TicketIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Formulaire de recherche */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Départ</label>
            <input
              type="text"
              placeholder="Ville de départ"
              value={searchData.depart}
              onChange={(e) => setSearchData({ ...searchData, depart: e.target.value })}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Arrivée</label>
            <input
              type="text"
              placeholder="Ville d'arrivée"
              value={searchData.arrivee}
              onChange={(e) => setSearchData({ ...searchData, arrivee: e.target.value })}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={searchData.date}
              onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Passagers</label>
            <select
              value={searchData.passagers}
              onChange={(e) => setSearchData({ ...searchData, passagers: parseInt(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'passager' : 'passagers'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-2">Classe</label>
            <select
              value={searchData.classe}
              onChange={(e) => setSearchData({ ...searchData, classe: e.target.value })}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {getClasseOptions(activeTab).map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center disabled:opacity-50"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>
      </div>

      {/* Résultats de recherche */}
      {trajets.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">Trajets disponibles</h3>
          {trajets.map((trajet) => (
            <div key={trajet.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">{trajet.logo}</span>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{trajet.compagnie}</h4>
                      <p className="text-sm text-gray-600">{trajet.navire}</p>
                      <div className="flex items-center mt-1">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-600 ml-1">{trajet.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{trajet.heureDepart}</p>
                        <p className="text-sm text-gray-600">{trajet.depart}</p>
                        <p className="text-xs text-gray-500">{new Date(trajet.dateDepart).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="flex items-center text-gray-500">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {activeTab === 'aviation' ? '2h 15min' : activeTab === 'bus' ? '12h' : '8h'}
                          </span>
                        </div>
                        <div className="w-32 h-0.5 bg-gray-300 my-2 relative">
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                            {getTransportIcon(activeTab)}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">Direct</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{trajet.heureArrivee}</p>
                        <p className="text-sm text-gray-600">{trajet.arrivee}</p>
                        <p className="text-xs text-gray-500">{new Date(trajet.dateArrivee).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {trajet.equipements.map((equipement: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {equipement}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      <span>{trajet.placesDisponibles} places disponibles</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          ${trajet.prix[searchData.classe as keyof typeof trajet.prix] * searchData.passagers}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${trajet.prix[searchData.classe as keyof typeof trajet.prix]} par personne
                        </p>
                      </div>
                      <button
                        onClick={() => handleReservation(trajet)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de réservation */}
      {showReservationModal && selectedTrajet && (
        <ReservationForm
          isOpen={showReservationModal}
          onClose={() => setShowReservationModal(false)}
          trajet={selectedTrajet}
          onSuccess={handleReservationSuccess}
        />
      )}
    </div>
  )
}
