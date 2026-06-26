'use client'

import { useState, useEffect } from 'react'
import { 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  DocumentTextIcon,
  BeakerIcon,
  TruckIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import rapportService from '../../../../services/rapportService'

export default function RapportsFinanciersPage() {
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
      
      const response = await rapportService.getRapportFinancier(params)
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rapports Financiers</h1>
        <p className="text-gray-600">Vue d'ensemble des revenus et dépenses</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Revenus</p>
              <p className="text-2xl font-bold text-gray-900">{rapport.revenus.toFixed(2)} $</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                  <ArrowTrendingDownIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Dépenses totales</p>
              <p className="text-2xl font-bold text-gray-900">{rapport.depenses.total.toFixed(2)} $</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${rapport.benefice >= 0 ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-red-500 to-orange-600'}`}>
                  <CurrencyDollarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Bénéfice</p>
              <p className={`text-2xl font-bold ${rapport.benefice >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {rapport.benefice.toFixed(2)} $
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Marge bénéficiaire</p>
              <p className={`text-2xl font-bold ${rapport.revenus > 0 ? ((rapport.benefice / rapport.revenus) * 100).toFixed(1) : 0}%`}>
                {rapport.revenus > 0 ? ((rapport.benefice / rapport.revenus) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>

          {/* Détail des dépenses */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Détail des dépenses</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                      <BeakerIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Maintenance</p>
                      <p className="text-lg font-semibold text-gray-900">{rapport.depenses.maintenance.toFixed(2)} $</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(rapport.depenses.maintenance / rapport.depenses.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                      <TruckIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Carburant</p>
                      <p className="text-lg font-semibold text-gray-900">{rapport.depenses.carburant.toFixed(2)} $</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(rapport.depenses.carburant / rapport.depenses.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                      <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Approvisionnement</p>
                      <p className="text-lg font-semibold text-gray-900">{rapport.depenses.approvisionnement.toFixed(2)} $</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${(rapport.depenses.approvisionnement / rapport.depenses.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Résumé de la période</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">
                    Ratio Revenus/Dépenses: {rapport.depenses.total > 0 ? (rapport.revenus / rapport.depenses.total).toFixed(2) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
