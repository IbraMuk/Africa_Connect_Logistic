'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface TransportPersonnelFormProps {
  onClose: () => void
  onSave: (data: any) => void
}

export default function TransportPersonnelForm({ onClose, onSave }: TransportPersonnelFormProps) {
  const [formData, setFormData] = useState({
    type_transport: 'navette',
    point_depart: '',
    point_arrivee: '',
    date_heure_depart: '',
    date_heure_arrivee_estimee: '',
    nombre_passagers: 1,
    informations_supplementaires: '',
    prix: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nombre_passagers' || name === 'prix' ? Number(value) : value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Nouvelle Réservation - Transport Personnel</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type de transport */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de transport
            </label>
            <select
              name="type_transport"
              value={formData.type_transport}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
              required
            >
              <option value="navette">Navette</option>
              <option value="vip">VIP</option>
              <option value="collectif">Collectif</option>
              <option value="individuel">Individuel</option>
            </select>
          </div>

          {/* Point de départ et arrivée */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Point de départ
              </label>
              <input
                type="text"
                name="point_depart"
                value={formData.point_depart}
                onChange={handleChange}
                placeholder="Ex: Dakar, Plateau"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Point d'arrivée
              </label>
              <input
                type="text"
                name="point_arrivee"
                value={formData.point_arrivee}
                onChange={handleChange}
                placeholder="Ex: Aéroport Blaise Diagne"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date et heure de départ
              </label>
              <input
                type="datetime-local"
                name="date_heure_depart"
                value={formData.date_heure_depart}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date et heure d'arrivée (estimée)
              </label>
              <input
                type="datetime-local"
                name="date_heure_arrivee_estimee"
                value={formData.date_heure_arrivee_estimee}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          {/* Nombre de passagers et prix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de passagers
              </label>
              <input
                type="number"
                name="nombre_passagers"
                value={formData.nombre_passagers}
                onChange={handleChange}
                min="1"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix ($)
              </label>
              <input
                type="number"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Informations supplémentaires
            </label>
            <textarea
              name="informations_supplementaires"
              value={formData.informations_supplementaires}
              onChange={handleChange}
              rows={4}
              placeholder="Instructions spéciales, besoins particuliers, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            ></textarea>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Créer la réservation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
