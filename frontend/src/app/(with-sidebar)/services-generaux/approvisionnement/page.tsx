'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  TrashIcon,
  TruckIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import approvisionnementService from '../../../../services/approvisionnementService'

interface Approvisionnement {
  id: number
  reference: string
  fournisseur: string
  article: string
  categorie?: string
  quantite: number
  unite?: string
  prixUnitaire: number
  montantTotal?: number
  dateCommande: string
  dateLivraisonPrevue?: string
  dateLivraisonReelle?: string
  statut: string
  modePaiement: string
  statutPaiement: string
  notes?: string
  dateCreation: string
  dateModification: string
}

export default function ApprovisionnementPage() {
  const [approvisionnements, setApprovisionnements] = useState<Approvisionnement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedApprovisionnement, setSelectedApprovisionnement] = useState<Approvisionnement | null>(null)
  const [filtreStatut, setFiltreStatut] = useState('Tous')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const [newApprovisionnement, setNewApprovisionnement] = useState({
    reference: '',
    fournisseur: '',
    article: '',
    categorie: '',
    quantite: '',
    unite: '',
    prixUnitaire: '',
    montantTotal: '',
    dateCommande: '',
    dateLivraisonPrevue: '',
    dateLivraisonReelle: '',
    statut: 'en_attente',
    modePaiement: 'credit',
    statutPaiement: 'en_attente',
    notes: ''
  })

  const loadApprovisionnements = useCallback(async () => {
    try {
      setLoading(true)
      const response = await approvisionnementService.getAllApprovisionnements({
        search: searchTerm,
        statut: filtreStatut === 'Tous' ? undefined : filtreStatut
      })

      if (response.success) {
        setApprovisionnements(response.data.approvisionnements || [])
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des approvisionnements')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, filtreStatut])

  useEffect(() => {
    loadApprovisionnements()
  }, [loadApprovisionnements])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadApprovisionnements()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, loadApprovisionnements])

  const stats = {
    total: approvisionnements.length,
    enAttente: approvisionnements.filter(a => a.statut === 'en_attente').length,
    enTransit: approvisionnements.filter(a => a.statut === 'en_transit').length,
    livrees: approvisionnements.filter(a => a.statut === 'livree').length
  }

  const handleCreateApprovisionnement = async () => {
    try {
      await approvisionnementService.createApprovisionnement({
        ...newApprovisionnement,
        quantite: parseFloat(newApprovisionnement.quantite),
        prixUnitaire: parseFloat(newApprovisionnement.prixUnitaire),
        montantTotal: newApprovisionnement.montantTotal ? parseFloat(newApprovisionnement.montantTotal) : null,
        dateLivraisonPrevue: newApprovisionnement.dateLivraisonPrevue || null,
        dateLivraisonReelle: newApprovisionnement.dateLivraisonReelle || null
      })
      setShowNewModal(false)
      setNewApprovisionnement({
        reference: '',
        fournisseur: '',
        article: '',
        categorie: '',
        quantite: '',
        unite: '',
        prixUnitaire: '',
        montantTotal: '',
        dateCommande: '',
        dateLivraisonPrevue: '',
        dateLivraisonReelle: '',
        statut: 'en_attente',
        modePaiement: 'credit',
        statutPaiement: 'en_attente',
        notes: ''
      })
      setSuccessMessage('Approvisionnement créé avec succès')
      loadApprovisionnements()
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la création de l\'approvisionnement')
    }
  }

  const handleDeleteApprovisionnement = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet approvisionnement ?')) return
    
    try {
      await approvisionnementService.deleteApprovisionnement(id)
      setSuccessMessage('Approvisionnement supprimé avec succès')
      loadApprovisionnements()
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la suppression')
    }
  }

  const handleViewApprovisionnement = (approvisionnement: Approvisionnement) => {
    setSelectedApprovisionnement(approvisionnement)
    setShowDetailModal(true)
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800'
      case 'commandee': return 'bg-blue-100 text-blue-800'
      case 'en_transit': return 'bg-purple-100 text-purple-800'
      case 'livree': return 'bg-green-100 text-green-800'
      case 'annulee': return 'bg-red-100 text-red-800'
      case 'partielle': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaiementColor = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800'
      case 'partielle': return 'bg-orange-100 text-orange-800'
      case 'payee': return 'bg-green-100 text-green-800'
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Approvisionnements</h1>
        <p className="text-gray-600">Suivi des commandes et livraisons de fournitures</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total commandes', value: stats.total, icon: DocumentTextIcon, color: 'from-blue-500 to-indigo-600' },
          { title: 'En attente', value: stats.enAttente, icon: ClockIcon, color: 'from-yellow-500 to-orange-600' },
          { title: 'En transit', value: stats.enTransit, icon: TruckIcon, color: 'from-purple-500 to-pink-600' },
          { title: 'Livrées', value: stats.livrees, icon: CheckCircleIcon, color: 'from-green-500 to-teal-600' }
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
                  placeholder="Rechercher un approvisionnement..."
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
                <option value="commandee">Commandée</option>
                <option value="en_transit">En transit</option>
                <option value="livree">Livrée</option>
                <option value="annulee">Annulée</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fournisseur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-4 text-center text-gray-500">Chargement...</td></tr>
              ) : error ? (
                <tr><td colSpan={8} className="px-6 py-4 text-center text-red-500">{error}</td></tr>
              ) : approvisionnements.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-4 text-center text-gray-500">Aucun approvisionnement trouvé</td></tr>
              ) : (
                approvisionnements.map((appro) => (
                  <tr key={appro.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <ShoppingBagIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{appro.reference}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appro.fournisseur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appro.article}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appro.quantite} {appro.unite || ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appro.montantTotal ? `${appro.montantTotal} $` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(appro.statut)}`}>
                        {appro.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaiementColor(appro.statutPaiement)}`}>
                        {appro.statutPaiement}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewApprovisionnement(appro)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => handleDeleteApprovisionnement(appro.id)}
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

      {/* Modal Nouvel Approvisionnement */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Nouvel Approvisionnement</h3>
              <button onClick={() => setShowNewModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Référence</label>
                  <input
                    type="text"
                    value={newApprovisionnement.reference}
                    onChange={(e) => setNewApprovisionnement({ ...newApprovisionnement, reference: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
                  <input
                    type="text"
                    value={newApprovisionnement.fournisseur}
                    onChange={(e) => setNewApprovisionnement({ ...newApprovisionnement, fournisseur: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Article</label>
                  <input
                    type="text"
                    value={newApprovisionnement.article}
                    onChange={(e) => setNewApprovisionnement({ ...newApprovisionnement, article: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <input
                    type="text"
                    value={newApprovisionnement.categorie}
                    onChange={(e) => setNewApprovisionnement({ ...newApprovisionnement, categorie: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newApprovisionnement.quantite}
                    onChange={(e) => setNewApprovisionnement({ ...newApprovisionnement, quantite: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
                  <input
                    type="text"
                    value={newApprovisionnement.unite}
                    onChange={(e) => setNewApprovisionnement({ ...newApprovisionnement, unite: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="kg, litre, pièce..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newApprovisionnement.prixUnitaire}
                    onChange={(e) => setNewApprovisionnement({ ...newApprovisionnement, prixUnitaire: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant total ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newApprovisionnement.montantTotal}
                    onChange={(e) => setNewApprovisionnement({ ...newApprovisionnement, montantTotal: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date commande</label>
                  <input
                    type="date"
                    value={newApprovisionnement.dateCommande}
                    onChange={(e) => setNewApprovisionnement({ ...newApprovisionnement, dateCommande: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date livraison prévue</label>
                  <input
                    type="date"
                    value={newApprovisionnement.dateLivraisonPrevue}
                    onChange={(e) => setNewApprovisionnement({ ...newApprovisionnement, dateLivraisonPrevue: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode de paiement</label>
                  <select
                    value={newApprovisionnement.modePaiement}
                    onChange={(e) => setNewApprovisionnement({ ...newApprovisionnement, modePaiement: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="cash">Cash</option>
                    <option value="credit">Crédit</option>
                    <option value="virement">Virement</option>
                    <option value="cheque">Chèque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={newApprovisionnement.statut}
                    onChange={(e) => setNewApprovisionnement({ ...newApprovisionnement, statut: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="en_attente">En attente</option>
                    <option value="commandee">Commandée</option>
                    <option value="en_transit">En transit</option>
                    <option value="livree">Livrée</option>
                    <option value="annulee">Annulée</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newApprovisionnement.notes}
                    onChange={(e) => setNewApprovisionnement({ ...newApprovisionnement, notes: e.target.value })}
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
                onClick={handleCreateApprovisionnement}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détail Approvisionnement */}
      {showDetailModal && selectedApprovisionnement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Détails de l'approvisionnement</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Référence</p>
                    <p className="font-medium">{selectedApprovisionnement.reference}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fournisseur</p>
                    <p className="font-medium">{selectedApprovisionnement.fournisseur}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Article</p>
                    <p className="font-medium">{selectedApprovisionnement.article}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Catégorie</p>
                    <p className="font-medium">{selectedApprovisionnement.categorie || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantité</p>
                    <p className="font-medium">{selectedApprovisionnement.quantite} {selectedApprovisionnement.unite || ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prix unitaire</p>
                    <p className="font-medium">{selectedApprovisionnement.prixUnitaire} $</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Montant total</p>
                    <p className="font-medium">{selectedApprovisionnement.montantTotal ? `${selectedApprovisionnement.montantTotal} $` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mode de paiement</p>
                    <p className="font-medium capitalize">{selectedApprovisionnement.modePaiement}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date commande</p>
                    <p className="font-medium">{new Date(selectedApprovisionnement.dateCommande).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date livraison prévue</p>
                    <p className="font-medium">{selectedApprovisionnement.dateLivraisonPrevue ? new Date(selectedApprovisionnement.dateLivraisonPrevue).toLocaleDateString('fr-FR') : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <p className="font-medium">{selectedApprovisionnement.statut}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut paiement</p>
                    <p className="font-medium">{selectedApprovisionnement.statutPaiement}</p>
                  </div>
                </div>
                {selectedApprovisionnement.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="font-medium">{selectedApprovisionnement.notes}</p>
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
