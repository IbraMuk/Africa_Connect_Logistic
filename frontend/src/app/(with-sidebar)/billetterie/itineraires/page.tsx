'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  TruckIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import itineraireService from '../../../../services/itineraireService'

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
  zonesTraversees?: any[]
  prixBase?: number
  dateCreation: string
  dateModification: string
}

export default function BilletterieItinerairesPage() {
  const [itineraires, setItineraires] = useState<Itineraire[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtreStatut, setFiltreStatut] = useState('Tous')
  const [filtreType, setFiltreType] = useState('Tous')
  const [selectedItineraire, setSelectedItineraire] = useState<Itineraire | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const loadItineraires = useCallback(async () => {
    try {
      setLoading(true)
      const response = await itineraireService.getAllItineraires({
        search: searchTerm,
        statut: filtreStatut === 'Tous' ? undefined : filtreStatut
      })

      if (response.success) {
        setItineraires(response.data.itineraires || [])
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des itinéraires')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filtreStatut])

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
    suspendus: itineraires.filter(i => i.statut === 'suspendu').length,
    inactifs: itineraires.filter(i => i.statut === 'inactif').length
  }

  const handleViewItineraire = (itineraire: Itineraire) => {
    setSelectedItineraire(itineraire)
    setShowDetailModal(true)
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800'
      case 'suspendu': return 'bg-yellow-100 text-yellow-800'
      case 'inactif': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeTransportColor = (type: string) => {
    switch (type) {
      case 'routier': return 'bg-blue-100 text-blue-800'
      case 'ferroviaire': return 'bg-purple-100 text-purple-800'
      case 'fluvial': return 'bg-teal-100 text-teal-800'
      case 'aérien': return 'bg-orange-100 text-orange-800'
      case 'mixte': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Itinéraires de Billetterie</h1>
        <p className="text-gray-600">Routes et destinations disponibles pour les réservations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total itinéraires', value: stats.total, icon: MapPinIcon, color: 'from-blue-500 to-indigo-600' },
          { title: 'Actifs', value: stats.actifs, icon: TruckIcon, color: 'from-green-500 to-teal-600' },
          { title: 'Suspendus', value: stats.suspendus, icon: ClockIcon, color: 'from-yellow-500 to-orange-600' },
          { title: 'Inactifs', value: stats.inactifs, icon: CurrencyDollarIcon, color: 'from-red-500 to-rose-600' }
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
                <option value="suspendu">Suspendu</option>
                <option value="inactif">Inactif</option>
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
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Départ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrivée</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
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
                      {itineraire.pointDepart}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {itineraire.pointArrivee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {itineraire.distance ? `${itineraire.distance} km` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeTransportColor(itineraire.typeTransport)}`}>
                        {itineraire.typeTransport}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(itineraire.statut)}`}>
                        {itineraire.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewItineraire(itineraire)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Voir détails
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détail Itinéraire */}
      {showDetailModal && selectedItineraire && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Détails de l'itinéraire</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <MapPinIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">{selectedItineraire.nom}</h4>
                  <p className="text-gray-600">{selectedItineraire.description || 'Aucune description'}</p>
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
                    <p className="font-medium">{selectedItineraire.dureeEstimee ? `${selectedItineraire.dureeEstimee} h` : '-'}</p>
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
                {selectedItineraire.zonesTraversees && selectedItineraire.zonesTraversees.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Zones traversées</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedItineraire.zonesTraversees.map((zone: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">{zone}</span>
                      ))}
                    </div>
                  </div>
                )}
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
