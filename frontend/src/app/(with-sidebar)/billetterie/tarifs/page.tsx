'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  TrashIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/outline'
import tarifService from '../../../../services/tarifService'

interface Tarif {
  id: number
  itineraireId: number
  classe: string
  prix: number
  devise: string
  description?: string
  servicesInclus?: any[]
  statut: string
  dateCreation: string
  dateModification: string
  itineraire?: {
    id: number
    nom: string
    pointDepart: string
    pointArrivee: string
  }
}

export default function BilletterieTarifsPage() {
  const [tarifs, setTarifs] = useState<Tarif[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtreClasse, setFiltreClasse] = useState('Tous')
  const [filtreStatut, setFiltreStatut] = useState('Tous')
  const [showNewModal, setShowNewModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedTarif, setSelectedTarif] = useState<Tarif | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [newTarif, setNewTarif] = useState({
    itineraireId: '',
    classe: 'economique',
    prix: '',
    devise: 'USD',
    description: '',
    servicesInclus: '',
    statut: 'actif'
  })

  const loadTarifs = useCallback(async () => {
    try {
      setLoading(true)
      const response = await tarifService.getAllTarifs({
        search: searchTerm,
        classe: filtreClasse === 'Tous' ? undefined : filtreClasse,
        statut: filtreStatut === 'Tous' ? undefined : filtreStatut
      })

      if (response.success) {
        setTarifs(response.data.tarifs || [])
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des tarifs')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filtreClasse, filtreStatut])

  useEffect(() => {
    loadTarifs()
  }, [loadTarifs])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTarifs()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, loadTarifs])

  const stats = {
    total: tarifs.length,
    actifs: tarifs.filter(t => t.statut === 'actif').length,
    inactifs: tarifs.filter(t => t.statut === 'inactif').length,
    prixMoyen: tarifs.reduce((acc, t) => acc + t.prix, 0) / (tarifs.length || 1)
  }

  const handleCreateTarif = async () => {
    try {
      await tarifService.createTarif({
        ...newTarif,
        itineraireId: parseInt(newTarif.itineraireId),
        prix: parseFloat(newTarif.prix),
        servicesInclus: newTarif.servicesInclus ? newTarif.servicesInclus.split(',').map((s: string) => s.trim()) : []
      })
      setShowNewModal(false)
      setNewTarif({
        itineraireId: '',
        classe: 'economique',
        prix: '',
        devise: 'USD',
        description: '',
        servicesInclus: '',
        statut: 'actif'
      })
      setSuccessMessage('Tarif ajouté avec succès')
      loadTarifs()
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la création du tarif')
    }
  }

  const handleDeleteTarif = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce tarif ?')) return
    
    try {
      await tarifService.deleteTarif(id)
      setSuccessMessage('Tarif supprimé avec succès')
      loadTarifs()
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la suppression')
    }
  }

  const handleViewTarif = (tarif: Tarif) => {
    setSelectedTarif(tarif)
    setShowDetailModal(true)
  }

  const getClasseColor = (classe: string) => {
    switch (classe) {
      case 'economique': return 'bg-green-100 text-green-800'
      case 'standard': return 'bg-blue-100 text-blue-800'
      case 'business': return 'bg-purple-100 text-purple-800'
      case 'vip': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800">{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-green-600 hover:text-green-800">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Tarifs</h1>
        <p className="text-gray-600">Tarifs par classe et itinéraire</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total tarifs', value: stats.total, icon: CurrencyDollarIcon, color: 'from-blue-500 to-indigo-600' },
          { title: 'Tarifs actifs', value: stats.actifs, icon: CheckCircleIcon, color: 'from-green-500 to-teal-600' },
          { title: 'Tarifs inactifs', value: stats.inactifs, icon: StarIcon, color: 'from-yellow-500 to-orange-600' },
          { title: 'Prix moyen', value: `${stats.prixMoyen.toFixed(2)} $`, icon: MapPinIcon, color: 'from-purple-500 to-pink-600' }
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
                  placeholder="Rechercher un tarif..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <select
                value={filtreClasse}
                onChange={(e) => setFiltreClasse(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500"
              >
                <option value="Tous">Toutes les classes</option>
                <option value="economique">Économique</option>
                <option value="standard">Standard</option>
                <option value="business">Business</option>
                <option value="vip">VIP</option>
              </select>
              <select
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500"
              >
                <option value="Tous">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
              <button
                onClick={() => setShowNewModal(true)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nouveau
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itinéraire</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devise</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">Chargement...</td></tr>
              ) : error ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center text-red-500">{error}</td></tr>
              ) : tarifs.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">Aucun tarif trouvé</td></tr>
              ) : (
                tarifs.map((tarif) => (
                  <tr key={tarif.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <MapPinIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {tarif.itineraire?.nom || `Itinéraire #${tarif.itineraireId}`}
                          </div>
                          <div className="text-xs text-gray-500">
                            {tarif.itineraire ? `${tarif.itineraire.pointDepart} → ${tarif.itineraire.pointArrivee}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getClasseColor(tarif.classe)}`}>
                        {tarif.classe}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tarif.prix.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tarif.devise}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${tarif.statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {tarif.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewTarif(tarif)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => handleDeleteTarif(tarif.id)}
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

      {/* Modal Nouveau Tarif */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Nouveau Tarif</h3>
              <button onClick={() => setShowNewModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Itinéraire</label>
                  <input
                    type="number"
                    value={newTarif.itineraireId}
                    onChange={(e) => setNewTarif({ ...newTarif, itineraireId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                  <select
                    value={newTarif.classe}
                    onChange={(e) => setNewTarif({ ...newTarif, classe: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="economique">Économique</option>
                    <option value="standard">Standard</option>
                    <option value="business">Business</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTarif.prix}
                    onChange={(e) => setNewTarif({ ...newTarif, prix: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                  <input
                    type="text"
                    value={newTarif.devise}
                    onChange={(e) => setNewTarif({ ...newTarif, devise: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newTarif.description}
                    onChange={(e) => setNewTarif({ ...newTarif, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    rows={2}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Services inclus (séparés par virgule)</label>
                  <input
                    type="text"
                    value={newTarif.servicesInclus}
                    onChange={(e) => setNewTarif({ ...newTarif, servicesInclus: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="Ex: WiFi, Repas, Bagages"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={newTarif.statut}
                    onChange={(e) => setNewTarif({ ...newTarif, statut: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </select>
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
                onClick={handleCreateTarif}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détail Tarif */}
      {showDetailModal && selectedTarif && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Détails du tarif</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Itinéraire</p>
                    <p className="font-medium">{selectedTarif.itineraire?.nom || `Itinéraire #${selectedTarif.itineraireId}`}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Classe</p>
                    <p className="font-medium capitalize">{selectedTarif.classe}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prix</p>
                    <p className="font-medium">{selectedTarif.prix.toFixed(2)} {selectedTarif.devise}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <p className="font-medium">{selectedTarif.statut}</p>
                  </div>
                </div>
                {selectedTarif.description && (
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium">{selectedTarif.description}</p>
                  </div>
                )}
                {selectedTarif.servicesInclus && selectedTarif.servicesInclus.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Services inclus</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedTarif.servicesInclus.map((service: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 rounded text-sm">{service}</span>
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
