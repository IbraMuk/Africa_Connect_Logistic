'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  DocumentTextIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import PageHeader from '@/components/PageHeader'
import merchandiseService from '@/services/marchandiseService'
import clientService from '@/services/clientService'

export default function TransportMarchandisePage() {
  const [transports, setTransports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedTransport, setSelectedTransport] = useState<any>(null)
  const [formData, setFormData] = useState({
    reference: '',
    expediteurId: '',
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
    typeVehicule: 'Routier',
    statut: 'En attente',
    priorite: 'Normale'
  })

  const [clients, setClients] = useState<any[]>([])
  const [loadingClients, setLoadingClients] = useState(false)
  const [showClientDropdown, setShowClientDropdown] = useState(false)
  const [clientSearchTerm, setClientSearchTerm] = useState('')
  const [filteredClients, setFilteredClients] = useState<any[]>([])
  const clientSearchRef = useRef<HTMLDivElement>(null)

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientSearchRef.current && !clientSearchRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Charger les transports depuis l'API
  const loadTransports = useCallback(async () => {
    try {
      setLoading(true)
      const response = await merchandiseService.getAllMarchandises({
        limit: 1000
      })
      if (response.success) {
        const marchandises = response.data.marchandises || []
        setTransports(marchandises.map((m: any) => ({
          id: m.id,
          reference: m.reference,
          expediteur: m.expediteur_nom ? `${m.expediteur_nom} ${m.expediteur_prenom || ''}`.trim() : (m.expediteur || 'Inconnu'),
          expediteurId: m.expediteurId,
          destinataire: m.destinataireNom,
          telephone: m.destinataireTelephone,
          email: m.destinataireEmail,
          depart: m.villeDepart,
          arrivee: m.villeArrivee,
          date: m.dateEnvoi,
          heure: m.heure || '',
          typeMarchandise: m.designation,
          poids: m.poids,
          volume: m.volume,
          description: m.instructionsSpeciales,
          typeVehicule: m.typeTransport,
          statut: m.statut,
          priorite: m.priorite,
          coutTransport: m.coutTransport
        })))
      } else {
        toast.error(response.message || 'Erreur lors du chargement')
      }
    } catch (error: any) {
      console.error('Erreur chargement transports:', error)
      toast.error(error.response?.data?.message || 'Erreur lors du chargement des transports')
    } finally {
      setLoading(false)
    }
  }, [])

  // Charger les clients pour le sélecteur d'expéditeur
  const loadClients = useCallback(async () => {
    try {
      setLoadingClients(true)
      const response = await clientService.getAllClients({ limit: 1000 })
      setClients(response.data.clients || [])
    } catch (error) {
      console.error('Erreur chargement clients:', error)
    } finally {
      setLoadingClients(false)
    }
  }, [])

  useEffect(() => {
    loadTransports()
  }, [loadTransports])

  useEffect(() => {
    if (showModal) {
      loadClients()
    }
  }, [showModal, loadClients])

  useEffect(() => {
    const term = clientSearchTerm.toLowerCase()
    if (!term) {
      setFilteredClients(clients)
    } else {
      setFilteredClients(clients.filter((c: any) => 
        (c.nom || '').toLowerCase().includes(term) ||
        (c.prenom || '').toLowerCase().includes(term) ||
        (c.email || '').toLowerCase().includes(term) ||
        (c.telephone || '').includes(term)
      ))
    }
  }, [clientSearchTerm, clients])

  const filteredTransports = transports.filter(transport =>
    (transport.expediteur || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transport.destinataire || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transport.depart || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transport.arrivee || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transport.reference || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transport.typeMarchandise || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const mapFormToApiPayload = (data: any) => {
    const dateLivraison = data.date ? new Date(data.date) : new Date()
    dateLivraison.setDate(dateLivraison.getDate() + 7)

    return {
      designation: data.typeMarchandise || data.description || 'Transport marchandise',
      categoriePrincipale: 'Fini',
      categorieId: null,
      codeHS: null,
      poids: parseFloat(data.poids) || 0,
      volume: parseFloat(data.volume) || 0,
      quantite: null,
      unite: 'kg',
      valeurMarchande: null,
      devise: 'USD',
      expediteurId: parseInt(data.expediteurId) || 0,
      destinataireNom: data.destinataire,
      destinataireTelephone: data.telephone,
      destinataireEmail: data.email || null,
      destinataireAdresse: data.arrivee || null,
      paysOrigine: data.depart || null,
      paysDestination: data.arrivee || null,
      villeDepart: data.depart,
      villeArrivee: data.arrivee,
      adresseRamassage: data.depart || null,
      adresseLivraison: data.arrivee || null,
      dateEnvoi: data.date,
      dateLivraisonPrevue: dateLivraison.toISOString().split('T')[0],
      priorite: data.priorite || 'Normale',
      typeTransport: data.typeVehicule || 'Routier',
      exigencesReglementaires: null,
      conditionsStockage: null,
      documentsAssocies: null,
      instructionsSpeciales: data.description || null,
      observations: null,
      valeurDeclaree: null,
      assurance: false,
      coutTransport: null,
      statut: data.statut || 'En attente'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.expediteurId || !formData.destinataire || !formData.depart || !formData.arrivee || !formData.date || !formData.poids || !formData.volume) {
      toast.error('Veuillez remplir tous les champs obligatoires (expéditeur, destinataire, départ, arrivée, date, poids, volume)')
      return
    }

    try {
      const payload = mapFormToApiPayload(formData)

      if (selectedTransport) {
        await merchandiseService.updateMarchandise(selectedTransport.id, payload)
        toast.success('Transport mis à jour avec succès')
      } else {
        await merchandiseService.createMarchandise(payload)
        toast.success('Transport créé avec succès')
      }

      await loadTransports()
      setShowModal(false)
      resetForm()
    } catch (error: any) {
      console.error('Erreur soumission transport:', error)
      toast.error(error.response?.data?.message || error.message || 'Erreur lors de l\'enregistrement')
    }
  }

  const resetForm = () => {
    setSelectedTransport(null)
    setFormData({
      reference: '',
      expediteurId: '',
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
      typeVehicule: 'Routier',
      statut: 'En attente',
      priorite: 'Normale'
    })
    setClientSearchTerm('')
    setShowClientDropdown(false)
  }

  const handleEdit = (transport: any) => {
    setSelectedTransport(transport)
    setFormData({
      reference: transport.reference || '',
      expediteurId: transport.expediteurId ? String(transport.expediteurId) : '',
      expediteur: transport.expediteur || '',
      destinataire: transport.destinataire || '',
      telephone: transport.telephone || '',
      email: transport.email || '',
      depart: transport.depart || '',
      arrivee: transport.arrivee || '',
      date: transport.date || '',
      heure: transport.heure || '',
      typeMarchandise: transport.typeMarchandise || '',
      poids: transport.poids ? String(transport.poids) : '',
      volume: transport.volume ? String(transport.volume) : '',
      description: transport.description || '',
      typeVehicule: transport.typeVehicule || 'Routier',
      statut: transport.statut || 'En attente',
      priorite: transport.priorite || 'Normale'
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce transport ?')) {
      try {
        await merchandiseService.deleteMarchandise(id)
        await loadTransports()
        toast.success('Transport supprimé')
      } catch (error: any) {
        console.error('Erreur suppression transport:', error)
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression')
      }
    }
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800'
      case 'En transit':
        return 'bg-blue-100 text-blue-800'
      case 'Livré':
        return 'bg-green-100 text-green-800'
      case 'Retardé':
        return 'bg-orange-100 text-orange-800'
      case 'Perdu':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPrioriteBadge = (priorite: string) => {
    switch (priorite) {
      case 'Urgente':
        return 'bg-red-100 text-red-800'
      case 'Haute':
        return 'bg-orange-100 text-orange-800'
      case 'Normale':
        return 'bg-gray-100 text-gray-800'
      case 'Basse':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getVehiculeIcon = (type: string) => {
    switch (type) {
      case 'Routier':
        return '🚚'
      case 'Aérien':
        return '✈️'
      case 'Maritime':
        return '�'
      case 'Ferroviaire':
        return '�'
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
          onClick: () => {
            resetForm()
            setShowModal(true)
          },
          icon: <PlusIcon className="h-4 w-4" />
        }}
      />

      {/* Statistiques modernes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Transports', value: transports.length, icon: TruckIcon, color: 'from-blue-500 to-indigo-600' },
          { title: 'En attente', value: transports.filter(t => t.statut === 'En attente').length, icon: CheckCircleIcon, color: 'from-yellow-500 to-amber-600' },
          { title: 'En transit', value: transports.filter(t => t.statut === 'En transit').length, icon: CubeIcon, color: 'from-amber-500 to-orange-600' },
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
              {filteredTransports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    {loading ? 'Chargement...' : 'Aucun transport trouvé'}
                  </td>
                </tr>
              ) : (
                filteredTransports.map((transport) => (
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
                      <p className="text-sm text-gray-900">{transport.date ? new Date(transport.date).toLocaleDateString('fr-FR') : '-'}</p>
                      <p className="text-sm text-gray-500">{transport.heure}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{getVehiculeIcon(transport.typeVehicule)}</span>
                      <div>
                        <p className="text-sm text-gray-900 capitalize">{transport.typeVehicule}</p>
                        {transport.coutTransport && <p className="text-xs text-gray-500">{transport.coutTransport} USD</p>}
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
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Nouveau/Édition Transport */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                 onClick={() => { resetForm(); setShowModal(false) }}></div>
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    {selectedTransport ? 'Modifier le transport' : 'Nouveau transport'}
                  </h3>
                  <button
                    onClick={() => { resetForm(); setShowModal(false) }}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative" ref={clientSearchRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expéditeur (client) *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.expediteur}
                        onChange={(e) => {
                          setFormData({ ...formData, expediteur: e.target.value, expediteurId: '' })
                          setClientSearchTerm(e.target.value)
                          setShowClientDropdown(true)
                        }}
                        onFocus={() => setShowClientDropdown(true)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Rechercher un client..."
                      />
                      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    {showClientDropdown && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {loadingClients ? (
                          <div className="p-3 text-sm text-gray-500">Chargement...</div>
                        ) : filteredClients.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500">Aucun client trouvé</div>
                        ) : (
                          filteredClients.map((client: any) => (
                            <div
                              key={client.id}
                              className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  expediteurId: String(client.id),
                                  expediteur: `${client.nom} ${client.prenom || ''}`.trim()
                                })
                                setClientSearchTerm('')
                                setShowClientDropdown(false)
                              }}
                            >
                              <p className="font-medium text-gray-900">{client.nom} {client.prenom}</p>
                              <p className="text-xs text-gray-500">{client.telephone} {client.email && `• ${client.email}`}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg) *</label>
                    <input
                      type="number"
                      value={formData.poids}
                      onChange={(e) => setFormData({ ...formData, poids: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Poids en kg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Volume (m³) *</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de transport</label>
                    <select
                      value={formData.typeVehicule}
                      onChange={(e) => setFormData({ ...formData, typeVehicule: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Routier">Routier</option>
                      <option value="Aérien">Aérien</option>
                      <option value="Maritime">Maritime</option>
                      <option value="Ferroviaire">Ferroviaire</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      value={formData.statut}
                      onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="En attente">En attente</option>
                      <option value="En transit">En transit</option>
                      <option value="Livré">Livré</option>
                      <option value="Retardé">Retardé</option>
                      <option value="Perdu">Perdu</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                    <select
                      value={formData.priorite}
                      onChange={(e) => setFormData({ ...formData, priorite: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Basse">Basse</option>
                      <option value="Normale">Normale</option>
                      <option value="Haute">Haute</option>
                      <option value="Urgente">Urgente</option>
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
                    onClick={() => { resetForm(); setShowModal(false) }}
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
