'use client'

import { useState, useEffect } from 'react'
import { 
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  TruckIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import rapportService from '../../../../services/rapportService'

export default function RapportsActivitePage() {
  const [rapport, setRapport] = useState<any>(null)
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [loading, setLoading] = useState(false)

  const loadRapport = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (dateDebut) params.dateDebut = dateDebut
      if (dateFin) params.dateFin = dateFin
      
      const response = await rapportService.getRapportActivite(params)
      if (response.success) {
        setRapport(response.data)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRapport()
  }, [dateDebut, dateFin])

  const handleCeMois = () => {
    const now = new Date()
    const debut = new Date(now.getFullYear(), now.getMonth(), 1)
    const fin = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    setDateDebut(debut.toISOString().split('T')[0])
    setDateFin(fin.toISOString().split('T')[0])
  }

  const handleCetteAnnee = () => {
    const now = new Date()
    const debut = new Date(now.getFullYear(), 0, 1)
    const fin = new Date(now.getFullYear(), 11, 31)
    setDateDebut(debut.toISOString().split('T')[0])
    setDateFin(fin.toISOString().split('T')[0])
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rapports d'Activité</h1>
        <p className="text-gray-600">Vue d'ensemble de l'activité de l'entreprise</p>
      </div>

      {/* Filtres de date */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex space-x-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
              <input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleCeMois}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Ce mois
            </button>
            <button
              onClick={handleCetteAnnee}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cette année
            </button>
            <button
              onClick={() => { setDateDebut(''); setDateFin('') }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-500">Chargement...</p>
        </div>
      ) : rapport && (
        <>
          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Factures</p>
              <p className="text-2xl font-bold text-gray-900">{rapport.factures.total}</p>
              <p className="text-xs text-gray-400 mt-1">{rapport.factures.payees} payées</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                  <WrenchScrewdriverIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Maintenances</p>
              <p className="text-2xl font-bold text-gray-900">{rapport.maintenances.total}</p>
              <p className="text-xs text-gray-400 mt-1">{rapport.maintenances.terminees} terminées</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <BeakerIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Carburants</p>
              <p className="text-2xl font-bold text-gray-900">{rapport.carburants.total}</p>
              <p className="text-xs text-gray-400 mt-1">{rapport.carburants.quantite.toFixed(2)} L</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <TruckIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Approvis.</p>
              <p className="text-2xl font-bold text-gray-900">{rapport.approvisionnements.total}</p>
              <p className="text-xs text-gray-400 mt-1">{rapport.approvisionnements.livre} livrés</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Transports</p>
              <p className="text-2xl font-bold text-gray-900">{rapport.transports.total}</p>
              <p className="text-xs text-gray-400 mt-1">{rapport.transports.livres} livrés</p>
            </div>
          </div>

          {/* Détail par catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Facturation</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-600">Total factures</span>
                    </div>
                    <span className="font-semibold text-gray-900">{rapport.factures.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-600">Factures payées</span>
                    </div>
                    <span className="font-semibold text-green-600">{rapport.factures.payees}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${rapport.factures.total > 0 ? (rapport.factures.payees / rapport.factures.total) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {rapport.factures.total > 0 ? ((rapport.factures.payees / rapport.factures.total) * 100).toFixed(1) : 0}% de paiement
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Opérations</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <WrenchScrewdriverIcon className="h-5 w-5 text-orange-500 mr-2" />
                      <span className="text-gray-600">Maintenances terminées</span>
                    </div>
                    <span className="font-semibold text-gray-900">{rapport.maintenances.terminees} / {rapport.maintenances.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TruckIcon className="h-5 w-5 text-purple-500 mr-2" />
                      <span className="text-gray-600">Approvisionnements livrés</span>
                    </div>
                    <span className="font-semibold text-gray-900">{rapport.approvisionnements.livre} / {rapport.approvisionnements.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ChartBarIcon className="h-5 w-5 text-teal-500 mr-2" />
                      <span className="text-gray-600">Transports livrés</span>
                    </div>
                    <span className="font-semibold text-gray-900">{rapport.transports.livres} / {rapport.transports.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Résumé de la période</h2>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600">
                  {dateDebut && dateFin ? (
                    `Du ${new Date(dateDebut).toLocaleDateString('fr-FR')} au ${new Date(dateFin).toLocaleDateString('fr-FR')}`
                  ) : (
                    'Période complète'
                  )}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
