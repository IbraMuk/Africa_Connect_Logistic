'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MapPinIcon,
  ClockIcon,
  TruckIcon
} from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import itineraireService from '../../services/itineraireService'

interface Itineraire {
  id: number
  nom: string
  pointDepart: string
  pointArrivee: string
  distance?: number
  dureeEstimee?: number
  description?: string
  statut: string
  typeTransport: string
  zonesTraversees?: string[]
  prixBase?: number
  dateCreation: string
  dateModification: string
}

export default function ItinerairesPage() {
  const [itineraires, setItineraires] = useState<Itineraire[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedItineraire, setSelectedItineraire] = useState<Itineraire | null>(null)
  const [filtreStatut, setFiltreStatut] = useState('Tous')
  const [filtreType, setFiltreType] = useState('Tous')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [newItineraire, setNewItineraire] = useState({
    nom: '',
    pointDepart: '',
    pointArrivee: '',
    distance: '',
    dureeEstimee: '',
    description: '',
    statut: 'actif',
    typeTransport: 'routier',
    prixBase: ''
  })

  const loadItineraires = useCallback(async () => {
    try {
      setLoading(true)
      const response = await itineraireService.getAllItineraires({
        search: searchTerm,
        statut: filtreStatut === 'Tous' ? undefined : filtreStatut,
        typeTransport: filtreType === 'Tous' ? undefined : filtreType
      })

      if (response.success) {
        setItineraires(response.data.itineraires || [])
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des itinéraires')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filtreStatut, filtreType])

  useEffect(() => {
    loadItineraires()
  }, [loadItineraires])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadItineraires()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, loadItineraires])

  const stats = {
    total: itineraires.length,
    actifs: itineraires.filter(i => i.statut === 'actif').length,
    inactifs: itineraires.filter(i => i.statut === 'inactif').length,
    suspendus: itineraires.filter(i => i.statut === 'suspendu').length
  }

  const handleCreateItineraire = async () => {
    try {
      await itineraireService.createItineraire({
        ...newItineraire,
        distance: newItineraire.distance ? parseFloat(newItineraire.distance) : null,
        dureeEstimee: newItineraire.dureeEstimee ? parseFloat(newItineraire.dureeEstimee) : null,
        prixBase: newItineraire.prixBase ? parseFloat(newItineraire.prixBase) : null
      })
      setShowNewModal(false)
      setNewItineraire({
        nom: '',
        pointDepart: '',
        pointArrivee: '',
        distance: '',
        dureeEstimee: '',
        description: '',
        statut: 'actif',
        typeTransport: 'routier',
        prixBase: ''
      })
      setSuccessMessage('Itinéraire créé avec succès')
      loadItineraires()
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la création de l\'itinéraire')
    }
  }

  const handleDeleteItineraire = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet itinéraire ?')) return
    
    try {
      await itineraireService.deleteItineraire(id)
      setSuccessMessage('Itinéraire supprimé avec succès')
      loadItineraires()
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la suppression')
    }
  }

  const handleViewItineraire = (itineraire: Itineraire) => {
    setSelectedItineraire(itineraire)
    setShowDetailModal(true)
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800'
      case 'inactif': return 'bg-gray-100 text-gray-800'
      case 'suspendu': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    return <TruckIcon className="h-5 w-5" />
  }

  return (
    <div className="p-6">
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-green-600 hover:text-green-800">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Itinéraires</h1>
        <p className="text-gray-600">Création et suivi des itinéraires de transport</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total itinéraires', value: stats.total, icon: DocumentTextIcon, color: 'from-blue-500 to-indigo-600' },
          { title: 'Itinéraires actifs', value: stats.actifs, icon: CheckIcon, color: 'from-emerald-500 to-teal-600' },
          { title: 'Inactifs', value: stats.inactifs, icon: ClockIcon, color: 'from-gray-500 to-gray-600' },
          { title: 'Suspendus', value: stats.suspendus, icon: XMarkIcon, color: 'from-yellow-500 to-orange-600' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </div>
        ))}
      </div>

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
                  placeholder="Rechercher un itinéraire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <select
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500"
              >
                <option value="Tous">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="suspendu">Suspendu</option>
              </select>
              <select
                value={filtreType}
                onChange={(e) => setFiltreType(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500"
              >
                <option value="Tous">Tous les types</option>
                <option value="routier">Routier</option>
                <option value="ferroviaire">Ferroviaire</option>
                <option value="fluvial">Fluvial</option>
                <option value="aérien">Aérien</option>
                <option value="mixte">Mixte</option>
              </select>
              <button
                onClick={() => setShowNewModal(true)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nouvel Itinéraire
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trajet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">Chargement...</td></tr>
              ) : error ? (
                <tr><td colSpan={7} className="px-6 py-4 text-center text-red-500">{error}</td></tr>
              ) : itineraires.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">Aucun itinéraire trouvé</td></tr>
              ) : (
                itineraires.map((itineraire) => (
                  <tr key={itineraire.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <MapPinIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{itineraire.nom}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {itineraire.pointDepart} → {itineraire.pointArrivee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {itineraire.distance ? `${itineraire.distance} km` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {itineraire.dureeEstimee ? `${itineraire.dureeEstimee}h` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {itineraire.typeTransport}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(itineraire.statut)}`}>
                        {itineraire.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewItineraire(itineraire)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => handleDeleteItineraire(itineraire.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouvel Itinéraire */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Nouvel Itinéraire</h3>
              <button onClick={() => setShowNewModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={newItineraire.nom}
                    onChange={(e) => setNewItineraire({ ...newItineraire, nom: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Point de départ</label>
                  <input
                    type="text"
                    value={newItineraire.pointDepart}
                    onChange={(e) => setNewItineraire({ ...newItineraire, pointDepart: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Point d'arrivée</label>
                  <input
                    type="text"
                    value={newItineraire.pointArrivee}
                    onChange={(e) => setNewItineraire({ ...newItineraire, pointArrivee: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItineraire.distance}
                    onChange={(e) => setNewItineraire({ ...newItineraire, distance: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durée estimée (h)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newItineraire.dureeEstimee}
                    onChange={(e) => setNewItineraire({ ...newItineraire, dureeEstimee: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de transport</label>
                  <select
                    value={newItineraire.typeTransport}
                    onChange={(e) => setNewItineraire({ ...newItineraire, typeTransport: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="routier">Routier</option>
                    <option value="ferroviaire">Ferroviaire</option>
                    <option value="fluvial">Fluvial</option>
                    <option value="aérien">Aérien</option>
                    <option value="mixte">Mixte</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={newItineraire.statut}
                    onChange={(e) => setNewItineraire({ ...newItineraire, statut: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                    <option value="suspendu">Suspendu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix de base ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItineraire.prixBase}
                    onChange={(e) => setNewItineraire({ ...newItineraire, prixBase: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newItineraire.description}
                    onChange={(e) => setNewItineraire({ ...newItineraire, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateItineraire}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détail Itinéraire */}
      {showDetailModal && selectedItineraire && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Détails de l'itinéraire</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">{selectedItineraire.nom}</h4>
                  <p className="text-gray-600">{selectedItineraire.description || 'Pas de description'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Point de départ</p>
                    <p className="font-medium">{selectedItineraire.pointDepart}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Point d'arrivée</p>
                    <p className="font-medium">{selectedItineraire.pointArrivee}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Distance</p>
                    <p className="font-medium">{selectedItineraire.distance ? `${selectedItineraire.distance} km` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Durée estimée</p>
                    <p className="font-medium">{selectedItineraire.dureeEstimee ? `${selectedItineraire.dureeEstimee}h` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type de transport</p>
                    <p className="font-medium capitalize">{selectedItineraire.typeTransport}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <p className="font-medium">{selectedItineraire.statut}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prix de base</p>
                    <p className="font-medium">{selectedItineraire.prixBase ? `${selectedItineraire.prixBase} $` : '-'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
