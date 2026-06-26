'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  TrashIcon,
  WrenchScrewdriverIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import maintenanceService from '../../../../services/maintenanceService'

interface Maintenance {
  id: number
  equipement: string
  typeMaintenance: string
  description: string
  dateDebut: string
  dateFin?: string
  cout?: number
  technicien?: string
  statut: string
  priorite: string
  observations?: string
  piecesRemplacees?: any[]
  dateCreation: string
  dateModification: string
}

export default function MaintenancePage() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null)
  const [filtreStatut, setFiltreStatut] = useState('Tous')
  const [filtrePriorite, setFiltrePriorite] = useState('Tous')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [newMaintenance, setNewMaintenance] = useState({
    equipement: '',
    typeMaintenance: 'corrective',
    description: '',
    dateDebut: '',
    dateFin: '',
    cout: '',
    technicien: '',
    statut: 'en_attente',
    priorite: 'moyenne',
    observations: ''
  })

  const loadMaintenances = useCallback(async () => {
    try {
      setLoading(true)
      const response = await maintenanceService.getAllMaintenances({
        search: searchTerm,
        statut: filtreStatut === 'Tous' ? undefined : filtreStatut,
        priorite: filtrePriorite === 'Tous' ? undefined : filtrePriorite
      })

      if (response.success) {
        setMaintenances(response.data.maintenances || [])
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des maintenances')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filtreStatut, filtrePriorite])

  useEffect(() => {
    loadMaintenances()
  }, [loadMaintenances])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMaintenances()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, loadMaintenances])

  const stats = {
    total: maintenances.length,
    enAttente: maintenances.filter(m => m.statut === 'en_attente').length,
    enCours: maintenances.filter(m => m.statut === 'en_cours').length,
    terminees: maintenances.filter(m => m.statut === 'terminee').length
  }

  const handleCreateMaintenance = async () => {
    try {
      await maintenanceService.createMaintenance({
        ...newMaintenance,
        cout: newMaintenance.cout ? parseFloat(newMaintenance.cout) : null,
        dateFin: newMaintenance.dateFin || null
      })
      setShowNewModal(false)
      setNewMaintenance({
        equipement: '',
        typeMaintenance: 'corrective',
        description: '',
        dateDebut: '',
        dateFin: '',
        cout: '',
        technicien: '',
        statut: 'en_attente',
        priorite: 'moyenne',
        observations: ''
      })
      setSuccessMessage('Maintenance créée avec succès')
      loadMaintenances()
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la création de la maintenance')
    }
  }

  const handleDeleteMaintenance = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette maintenance ?')) return
    
    try {
      await maintenanceService.deleteMaintenance(id)
      setSuccessMessage('Maintenance supprimée avec succès')
      loadMaintenances()
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la suppression')
    }
  }

  const handleViewMaintenance = (maintenance: Maintenance) => {
    setSelectedMaintenance(maintenance)
    setShowDetailModal(true)
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800'
      case 'en_cours': return 'bg-blue-100 text-blue-800'
      case 'terminee': return 'bg-green-100 text-green-800'
      case 'annulee': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'critique': return 'bg-red-100 text-red-800'
      case 'haute': return 'bg-orange-100 text-orange-800'
      case 'moyenne': return 'bg-yellow-100 text-yellow-800'
      case 'basse': return 'bg-green-100 text-green-800'
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion de la Maintenance</h1>
        <p className="text-gray-600">Suivi des maintenances d'équipements et véhicules</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total maintenances', value: stats.total, icon: DocumentTextIcon, color: 'from-blue-500 to-indigo-600' },
          { title: 'En attente', value: stats.enAttente, icon: ClockIcon, color: 'from-yellow-500 to-orange-600' },
          { title: 'En cours', value: stats.enCours, icon: WrenchScrewdriverIcon, color: 'from-blue-500 to-cyan-600' },
          { title: 'Terminées', value: stats.terminees, icon: CheckCircleIcon, color: 'from-green-500 to-teal-600' }
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
                  placeholder="Rechercher une maintenance..."
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
                <option value="en_attente">En attente</option>
                <option value="en_cours">En cours</option>
                <option value="terminee">Terminée</option>
                <option value="annulee">Annulée</option>
              </select>
              <select
                value={filtrePriorite}
                onChange={(e) => setFiltrePriorite(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-primary-500"
              >
                <option value="Tous">Toutes les priorités</option>
                <option value="critique">Critique</option>
                <option value="haute">Haute</option>
                <option value="moyenne">Moyenne</option>
                <option value="basse">Basse</option>
              </select>
              <button
                onClick={() => setShowNewModal(true)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nouvelle Maintenance
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Équipement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date début</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technicien</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priorité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">Chargement...</td></tr>
              ) : error ? (
                <tr><td colSpan={7} className="px-6 py-4 text-center text-red-500">{error}</td></tr>
              ) : maintenances.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">Aucune maintenance trouvée</td></tr>
              ) : (
                maintenances.map((maintenance) => (
                  <tr key={maintenance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <WrenchScrewdriverIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{maintenance.equipement}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {maintenance.typeMaintenance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(maintenance.dateDebut).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {maintenance.technicien || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPrioriteColor(maintenance.priorite)}`}>
                        {maintenance.priorite}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(maintenance.statut)}`}>
                        {maintenance.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewMaintenance(maintenance)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => handleDeleteMaintenance(maintenance.id)}
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

      {/* Modal Nouvelle Maintenance */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Nouvelle Maintenance</h3>
              <button onClick={() => setShowNewModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Équipement</label>
                  <input
                    type="text"
                    value={newMaintenance.equipement}
                    onChange={(e) => setNewMaintenance({ ...newMaintenance, equipement: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de maintenance</label>
                  <select
                    value={newMaintenance.typeMaintenance}
                    onChange={(e) => setNewMaintenance({ ...newMaintenance, typeMaintenance: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="preventive">Préventive</option>
                    <option value="corrective">Corrective</option>
                    <option value="curative">Curative</option>
                    <option value="urgence">Urgence</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                  <select
                    value={newMaintenance.priorite}
                    onChange={(e) => setNewMaintenance({ ...newMaintenance, priorite: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="basse">Basse</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="haute">Haute</option>
                    <option value="critique">Critique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                  <input
                    type="date"
                    value={newMaintenance.dateDebut}
                    onChange={(e) => setNewMaintenance({ ...newMaintenance, dateDebut: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                  <input
                    type="date"
                    value={newMaintenance.dateFin}
                    onChange={(e) => setNewMaintenance({ ...newMaintenance, dateFin: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technicien</label>
                  <input
                    type="text"
                    value={newMaintenance.technicien}
                    onChange={(e) => setNewMaintenance({ ...newMaintenance, technicien: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coût ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newMaintenance.cout}
                    onChange={(e) => setNewMaintenance({ ...newMaintenance, cout: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newMaintenance.description}
                    onChange={(e) => setNewMaintenance({ ...newMaintenance, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    rows={3}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observations</label>
                  <textarea
                    value={newMaintenance.observations}
                    onChange={(e) => setNewMaintenance({ ...newMaintenance, observations: e.target.value })}
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
                onClick={handleCreateMaintenance}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détail Maintenance */}
      {showDetailModal && selectedMaintenance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Détails de la maintenance</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">{selectedMaintenance.equipement}</h4>
                  <p className="text-gray-600">{selectedMaintenance.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Type de maintenance</p>
                    <p className="font-medium capitalize">{selectedMaintenance.typeMaintenance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Priorité</p>
                    <p className="font-medium">{selectedMaintenance.priorite}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de début</p>
                    <p className="font-medium">{new Date(selectedMaintenance.dateDebut).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de fin</p>
                    <p className="font-medium">{selectedMaintenance.dateFin ? new Date(selectedMaintenance.dateFin).toLocaleDateString('fr-FR') : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Technicien</p>
                    <p className="font-medium">{selectedMaintenance.technicien || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Coût</p>
                    <p className="font-medium">{selectedMaintenance.cout ? `${selectedMaintenance.cout} $` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <p className="font-medium">{selectedMaintenance.statut}</p>
                  </div>
                </div>
                {selectedMaintenance.observations && (
                  <div>
                    <p className="text-sm text-gray-500">Observations</p>
                    <p className="font-medium">{selectedMaintenance.observations}</p>
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
