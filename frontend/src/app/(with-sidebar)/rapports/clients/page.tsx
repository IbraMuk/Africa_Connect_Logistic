'use client'

import { useState, useEffect } from 'react'
import { 
  UserGroupIcon,
  UserIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import rapportService from '../../../../services/rapportService'

export default function RapportsClientsPage() {
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
      
      const response = await rapportService.getRapportClients(params)
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rapports Clients</h1>
        <p className="text-gray-600">Analyse de la clientèle</p>
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <UserGroupIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Total clients</p>
              <p className="text-2xl font-bold text-gray-900">{rapport.total}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Clients actifs</p>
              <p className="text-2xl font-bold text-gray-900">{rapport.actifs}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Nouveaux clients</p>
              <p className="text-2xl font-bold text-gray-900">{rapport.nouveaux}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">Taux d'activité</p>
              <p className="text-2xl font-bold text-gray-900">
                {rapport.total > 0 ? ((rapport.actifs / rapport.total) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>

          {/* Répartition par type */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Répartition par type</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rapport.parType && rapport.parType.map((item: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-600 capitalize">{item.type}</span>
                    </div>
                    <p className="text-2xl font-semibold text-gray-900">{item.count}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(item.count / rapport.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top clients */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Top clients</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factures</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rapport.topClients && rapport.topClients.length > 0 ? (
                      rapport.topClients.map((client: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {client.nom} {client.prenom}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {client.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {client.nombreFactures}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {client.totalFactures ? `${client.totalFactures.toFixed(2)} $` : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          Aucun client avec factures
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
