'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  CalendarIcon,
  MapPinIcon,
  CubeIcon,
  TruckIcon,
  CheckCircleIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ScaleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import PageHeader from '@/components/PageHeader'

export default function TransportMarchandisePage() {
  const [transports, setTransports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedTransport, setSelectedTransport] = useState<any>(null)
  const [formData, setFormData] = useState({
    reference: '',
    expediteur: '',
    destinataire: '',
    telephone: '',
    email: '',
    depart: '',
    arrivee: '',
    date: '',
    heure: '',
    typeMarchandise: '',
    poids: '',
    volume: '',
    description: '',
    typeVehicule: 'camion',
    statut: 'en_attente',
    priorite: 'normale'
  })

  // Données simulées
  const mockTransports = [
    {
      id: 1,
      reference: 'TM-2024-001',
      expediteur: 'Société ABC',
      destinataire: 'Entreprise XYZ',
      telephone: '+243812345678',
      email: 'contact@societeabc.com',
      depart: 'Kinshasa',
      arrivee: 'Lubumbashi',
      date: '2024-01-20',
      heure: '08:00',
      typeMarchandise: 'Équipements électroniques',
      poids: '1500',
      volume: '5.5',
      description: 'Ordinateurs et matériel informatique',
      typeVehicule: 'camion',
      statut: 'en_cours',
      priorite: 'normale',
      chauffeur: 'Jean Kabongo',
      immatriculation: 'CD-789-AB',
      coutTransport: 2500
    },
    {
      id: 2,
      reference: 'TM-2024-002',
      expediteur: 'Agro RDC',
      destinataire: 'Market Plus',
      telephone: '+243823456789',
      email: 'info@agro-rdc.com',
      depart: 'Kisangani',
      arrivee: 'Kinshasa',
      date: '2024-01-21',
      heure: '06:00',
      typeMarchandise: 'Produits agricoles',
      poids: '3000',
      volume: '8.2',
      description: 'Café et cacao en sacs',
      typeVehicule: 'remorque',
      statut: 'confirmé',
      priorite: 'haute',
      chauffeur: 'Pierre Mbuyi',
      immatriculation: 'CD-456-CD',
      coutTransport: 3500
    },
    {
      id: 3,
      reference: 'TM-2024-003',
      expediteur: 'Textile Congo',
      destinataire: 'Fashion Store',
      telephone: '+243834567890',
      email: 'contact@textile-congo.cd',
      depart: 'Bukavu',
      arrivee: 'Goma',
      date: '2024-01-22',
      heure: '09:30',
      typeMarchandise: 'Vêtements',
      poids: '800',
      volume: '3.8',
      description: 'Vêtements divers en cartons',
      typeVehicule: 'fourgon',
      statut: 'en_attente',
      priorite: 'normale',
      chauffeur: 'Non assigné',
      immatriculation: 'Non assigné',
      coutTransport: 1200
    }
  ]

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setTransports(mockTransports)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredTransports = transports.filter(transport =>
    transport.expediteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transport.destinataire.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transport.depart.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transport.arrivee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transport.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transport.typeMarchandise.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.expediteur || !formData.destinataire || !formData.depart || !formData.arrivee || !formData.date) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    const newTransport = {
      id: transports.length + 1,
      ...formData,
      reference: `TM-2024-${String(transports.length + 1).padStart(3, '0')}`,
      chauffeur: 'Non assigné',
      immatriculation: 'Non assigné',
      coutTransport: Math.floor(Math.random() * 5000) + 1000
    }

    setTransports([...transports, newTransport])
    toast.success('Transport créé avec succès')
    setShowModal(false)
    setFormData({
      reference: '',
      expediteur: '',
      destinataire: '',
      telephone: '',
      email: '',
      depart: '',
      arrivee: '',
      date: '',
      heure: '',
      typeMarchandise: '',
      poids: '',
      volume: '',
      description: '',
      typeVehicule: 'camion',
      statut: 'en_attente',
      priorite: 'normale'
    })
  }

  const handleEdit = (transport: any) => {
    setSelectedTransport(transport)
    setFormData({
      reference: transport.reference,
      expediteur: transport.expediteur,
      destinataire: transport.destinataire,
      telephone: transport.telephone,
      email: transport.email,
      depart: transport.depart,
      arrivee: transport.arrivee,
      date: transport.date,
      heure: transport.heure,
      typeMarchandise: transport.typeMarchandise,
      poids: transport.poids,
      volume: transport.volume,
      description: transport.description,
      typeVehicule: transport.typeVehicule,
      statut: transport.statut,
      priorite: transport.priorite
    })
    setShowModal(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce transport ?')) {
      setTransports(transports.filter(t => t.id !== id))
      toast.success('Transport supprimé')
    }
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'confirmé':
        return 'bg-green-100 text-green-800'
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800'
      case 'en_cours':
        return 'bg-blue-100 text-blue-800'
      case 'livré':
        return 'bg-purple-100 text-purple-800'
      case 'annulé':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPrioriteBadge = (priorite: string) => {
    switch (priorite) {
      case 'urgente':
        return 'bg-red-100 text-red-800'
      case 'haute':
        return 'bg-orange-100 text-orange-800'
      case 'normale':
        return 'bg-gray-100 text-gray-800'
      case 'basse':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getVehiculeIcon = (type: string) => {
    switch (type) {
      case 'camion':
        return '🚚'
      case 'remorque':
        return '🚛'
      case 'fourgon':
        return '🚐'
      case 'van':
        return '🚦'
      default:
        return '🚚'
    }
  }

  return (
    <div className="p-6">
      {/* En-tête moderne */}
      <PageHeader
        title="Transport de Marchandises"
        subtitle="Gérez les transports de marchandises"
        action={{
          label: 'Nouveau Transport',
          onClick: () => setShowModal(true),
          icon: <PlusIcon className="h-4 w-4" />
        }}
      />

      {/* Statistiques modernes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Transports', value: transports.length, icon: TruckIcon, color: 'from-blue-500 to-indigo-600' },
          { title: 'Confirmés', value: transports.filter(t => t.statut === 'confirmé').length, icon: CheckCircleIcon, color: 'from-emerald-500 to-teal-600' },
          { title: 'En cours', value: transports.filter(t => t.statut === 'en_cours').length, icon: CubeIcon, color: 'from-amber-500 to-orange-600' },
          { title: 'Poids Total (kg)', value: transports.reduce((total, t) => total + parseFloat(t.poids || 0), 0).toLocaleString(), icon: ScaleIcon, color: 'from-violet-500 to-purple-600' },
        ].map((stat, index) => (
          <div key={index} className="group">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
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
            placeholder="Rechercher un transport par référence, expéditeur ou destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Tableau des transports */}
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
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trajet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marchandise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Heure
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
              {filteredTransports.map((transport) => (
                <tr key={transport.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{transport.reference}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Expéditeur: {transport.expediteur}
                      </p>
                      <p className="text-sm text-gray-500">
                        Destinataire: {transport.destinataire}
                      </p>
                      <p className="text-sm text-gray-500">{transport.telephone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-900">{transport.depart}</p>
                        <p className="text-xs text-gray-500">→ {transport.arrivee}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transport.typeMarchandise}</p>
                      <p className="text-xs text-gray-500">Poids: {transport.poids} kg</p>
                      <p className="text-xs text-gray-500">Volume: {transport.volume} m³</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{new Date(transport.date).toLocaleDateString('fr-FR')}</p>
                      <p className="text-sm text-gray-500">{transport.heure}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{getVehiculeIcon(transport.typeVehicule)}</span>
                      <div>
                        <p className="text-sm text-gray-900 capitalize">{transport.typeVehicule}</p>
                        <p className="text-xs text-gray-500">{transport.chauffeur}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutBadge(transport.statut)}`}>
                        {transport.statut}
                      </span>
                      <br />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrioriteBadge(transport.priorite)}`}>
                        {transport.priorite}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(transport)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(transport.id)}
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

      {/* Modal Nouveau/Édition Transport */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                 onClick={() => setShowModal(false)}></div>
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    {selectedTransport ? 'Modifier le transport' : 'Nouveau transport'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expéditeur *</label>
                    <input
                      type="text"
                      value={formData.expediteur}
                      onChange={(e) => setFormData({ ...formData, expediteur: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom de l'expéditeur"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destinataire *</label>
                    <input
                      type="text"
                      value={formData.destinataire}
                      onChange={(e) => setFormData({ ...formData, destinataire: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nom du destinataire"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+243 XXX XXX XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@exemple.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Départ *</label>
                    <input
                      type="text"
                      value={formData.depart}
                      onChange={(e) => setFormData({ ...formData, depart: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ville de départ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Arrivée *</label>
                    <input
                      type="text"
                      value={formData.arrivee}
                      onChange={(e) => setFormData({ ...formData, arrivee: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ville d'arrivée"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                    <input
                      type="time"
                      value={formData.heure}
                      onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de marchandise</label>
                    <input
                      type="text"
                      value={formData.typeMarchandise}
                      onChange={(e) => setFormData({ ...formData, typeMarchandise: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type de marchandise"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
                    <input
                      type="number"
                      value={formData.poids}
                      onChange={(e) => setFormData({ ...formData, poids: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Poids en kg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Volume (m³)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Volume en m³"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de véhicule</label>
                    <select
                      value={formData.typeVehicule}
                      onChange={(e) => setFormData({ ...formData, typeVehicule: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="camion">Camion</option>
                      <option value="remorque">Remorque</option>
                      <option value="fourgon">Fourgon</option>
                      <option value="van">Van</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      value={formData.statut}
                      onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en_attente">En attente</option>
                      <option value="confirmé">Confirmé</option>
                      <option value="en_cours">En cours</option>
                      <option value="livré">Livré</option>
                      <option value="annulé">Annulé</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                    <select
                      value={formData.priorite}
                      onChange={(e) => setFormData({ ...formData, priorite: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="basse">Basse</option>
                      <option value="normale">Normale</option>
                      <option value="haute">Haute</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description détaillée de la marchandise..."
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
                    {selectedTransport ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
