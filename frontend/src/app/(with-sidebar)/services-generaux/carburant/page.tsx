'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  TrashIcon,
  BeakerIcon,
  TruckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import carburantService from '../../../../services/carburantService'

interface Carburant {
  id: number
  vehicule: string
  typeCarburant: string
  quantite: number
  prixUnitaire: number
  montantTotal?: number
  date: string
  station?: string
  kilometrage?: number
  chauffeur?: string
  typePaiement: string
  notes?: string
  dateCreation: string
  dateModification: string
}

export default function CarburantPage() {
  const [carburants, setCarburants] = useState<Carburant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedCarburant, setSelectedCarburant] = useState<Carburant | null>(null)
  const [filtreType, setFiltreType] = useState('Tous')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [newCarburant, setNewCarburant] = useState({
    vehicule: '',
    typeCarburant: 'diesel',
    quantite: '',
    prixUnitaire: '',
    montantTotal: '',
    date: '',
    station: '',
    kilometrage: '',
    chauffeur: '',
    typePaiement: 'credit',
    notes: ''
  })

  const loadCarburants = useCallback(async () => {
    try {
      setLoading(true)
      const response = await carburantService.getAllCarburants({
        search: searchTerm,
        typeCarburant: filtreType === 'Tous' ? undefined : filtreType
      })

      if (response.success) {
        setCarburants(response.data.carburants || [])
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des carburants')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filtreType])

  useEffect(() => {
    loadCarburants()
  }, [loadCarburants])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCarburants()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, loadCarburants])

  const stats = {
    total: carburants.length,
    totalMontant: carburants.reduce((acc, c) => acc + (c.montantTotal || 0), 0),
    totalQuantite: carburants.reduce((acc, c) => acc + c.quantite, 0)
  }

  const handleCreateCarburant = async () => {
    try {
      await carburantService.createCarburant({
        ...newCarburant,
        quantite: parseFloat(newCarburant.quantite),
        prixUnitaire: parseFloat(newCarburant.prixUnitaire),
        montantTotal: newCarburant.montantTotal ? parseFloat(newCarburant.montantTotal) : null,
        kilometrage: newCarburant.kilometrage ? parseInt(newCarburant.kilometrage) : null
      })
      setShowNewModal(false)
      setNewCarburant({
        vehicule: '',
        typeCarburant: 'diesel',
        quantite: '',
        prixUnitaire: '',
        montantTotal: '',
        date: '',
        station: '',
        kilometrage: '',
        chauffeur: '',
        typePaiement: 'credit',
        notes: ''
      })
      setSuccessMessage('Carburant ajouté avec succès')
      loadCarburants()
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la création du carburant')
    }
  }

  const handleDeleteCarburant = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce carburant ?')) return
    
    try {
      await carburantService.deleteCarburant(id)
      setSuccessMessage('Carburant supprimé avec succès')
      loadCarburants()
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la suppression')
    }
  }

  const handleViewCarburant = (carburant: Carburant) => {
    setSelectedCarburant(carburant)
    setShowDetailModal(true)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'essence': return 'bg-blue-100 text-blue-800'
      case 'diesel': return 'bg-green-100 text-green-800'
      case 'gpl': return 'bg-orange-100 text-orange-800'
      case 'electrique': return 'bg-purple-100 text-purple-800'
      case 'hybride': return 'bg-teal-100 text-teal-800'
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion du Carburant</h1>
        <p className="text-gray-600">Suivi des ravitaillements en carburant des véhicules</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total ravitaillements', value: stats.total, icon: DocumentTextIcon, color: 'from-blue-500 to-indigo-600' },
          { title: 'Montant total', value: `${stats.totalMontant.toFixed(2)} $`, icon: BeakerIcon, color: 'from-green-500 to-teal-600' },
          { title: 'Quantité totale', value: `${stats.totalQuantite.toFixed(2)} L`, icon: TruckIcon, color: 'from-purple-500 to-pink-600' },
          { title: 'Coût moyen', value: stats.total > 0 ? `${(stats.totalMontant / stats.totalQuantite).toFixed(2)} $/L` : '-', icon: CheckCircleIcon, color: 'from-yellow-500 to-orange-600' }
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
                  placeholder="Rechercher un ravitaillement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <select
                value={filtreType}
                onChange={(e) => setFiltreType(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500"
              >
                <option value="Tous">Tous les types</option>
                <option value="essence">Essence</option>
                <option value="diesel">Diesel</option>
                <option value="gpl">GPL</option>
                <option value="electrique">Électrique</option>
                <option value="hybride">Hybride</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Station</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">Chargement...</td></tr>
              ) : error ? (
                <tr><td colSpan={7} className="px-6 py-4 text-center text-red-500">{error}</td></tr>
              ) : carburants.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">Aucun ravitaillement trouvé</td></tr>
              ) : (
                carburants.map((carburant) => (
                  <tr key={carburant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <TruckIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{carburant.vehicule}</div>
                          <div className="text-xs text-gray-500">{carburant.chauffeur || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(carburant.typeCarburant)}`}>
                        {carburant.typeCarburant}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {carburant.quantite} L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {carburant.montantTotal ? `${carburant.montantTotal.toFixed(2)} $` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(carburant.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {carburant.station || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewCarburant(carburant)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => handleDeleteCarburant(carburant.id)}
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

      {/* Modal Nouveau Carburant */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Nouveau Ravitaillement</h3>
              <button onClick={() => setShowNewModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Véhicule</label>
                  <input
                    type="text"
                    value={newCarburant.vehicule}
                    onChange={(e) => setNewCarburant({ ...newCarburant, vehicule: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="Plaque ou nom"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de carburant</label>
                  <select
                    value={newCarburant.typeCarburant}
                    onChange={(e) => setNewCarburant({ ...newCarburant, typeCarburant: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="essence">Essence</option>
                    <option value="diesel">Diesel</option>
                    <option value="gpl">GPL</option>
                    <option value="electrique">Électrique</option>
                    <option value="hybride">Hybride</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantité (L)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCarburant.quantite}
                    onChange={(e) => setNewCarburant({ ...newCarburant, quantite: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire ($/L)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCarburant.prixUnitaire}
                    onChange={(e) => setNewCarburant({ ...newCarburant, prixUnitaire: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant total ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCarburant.montantTotal}
                    onChange={(e) => setNewCarburant({ ...newCarburant, montantTotal: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newCarburant.date}
                    onChange={(e) => setNewCarburant({ ...newCarburant, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Station</label>
                  <input
                    type="text"
                    value={newCarburant.station}
                    onChange={(e) => setNewCarburant({ ...newCarburant, station: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage</label>
                  <input
                    type="number"
                    value={newCarburant.kilometrage}
                    onChange={(e) => setNewCarburant({ ...newCarburant, kilometrage: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chauffeur</label>
                  <input
                    type="text"
                    value={newCarburant.chauffeur}
                    onChange={(e) => setNewCarburant({ ...newCarburant, chauffeur: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
                  <select
                    value={newCarburant.typePaiement}
                    onChange={(e) => setNewCarburant({ ...newCarburant, typePaiement: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="cash">Cash</option>
                    <option value="carte">Carte</option>
                    <option value="credit">Crédit</option>
                    <option value="prepaye">Prépayé</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newCarburant.notes}
                    onChange={(e) => setNewCarburant({ ...newCarburant, notes: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    rows={2}
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
                onClick={handleCreateCarburant}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détail Carburant */}
      {showDetailModal && selectedCarburant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Détails du ravitaillement</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Véhicule</p>
                    <p className="font-medium">{selectedCarburant.vehicule}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type de carburant</p>
                    <p className="font-medium capitalize">{selectedCarburant.typeCarburant}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantité</p>
                    <p className="font-medium">{selectedCarburant.quantite} L</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prix unitaire</p>
                    <p className="font-medium">{selectedCarburant.prixUnitaire} $/L</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Montant total</p>
                    <p className="font-medium">{selectedCarburant.montantTotal ? `${selectedCarburant.montantTotal.toFixed(2)} $` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{new Date(selectedCarburant.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Station</p>
                    <p className="font-medium">{selectedCarburant.station || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Kilométrage</p>
                    <p className="font-medium">{selectedCarburant.kilometrage ? `${selectedCarburant.kilometrage} km` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Chauffeur</p>
                    <p className="font-medium">{selectedCarburant.chauffeur || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mode de paiement</p>
                    <p className="font-medium capitalize">{selectedCarburant.typePaiement}</p>
                  </div>
                </div>
                {selectedCarburant.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="font-medium">{selectedCarburant.notes}</p>
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
