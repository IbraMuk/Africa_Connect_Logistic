'use client'

import React, { useState, useEffect } from 'react'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import PageHeader from '@/components/PageHeader'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    nom: 'Référence générique',
    categorie: '',
    sousCategorie: '',
    description: '',
    codeHS: ''
  })
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null)
  const [categoryMarchandises, setCategoryMarchandises] = useState<Record<number, any[]>>({})
  const [loadingMarchandises, setLoadingMarchandises] = useState<number | null>(null)

  // Charger les catégories
  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories`)
      const data = await response.json()
      if (data.success && data.data) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error)
      toast.error('Erreur lors du chargement des catégories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const method = selectedCategory ? 'PUT' : 'POST'
      const url = selectedCategory 
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories/${selectedCategory.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories`
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(selectedCategory ? 'Catégorie mise à jour' : 'Catégorie créée')
        loadCategories()
        setShowNewModal(false)
        setShowEditModal(false)
        setSelectedCategory(null)
        setFormData({ nom: 'Référence générique', categorie: '', sousCategorie: '', description: '', codeHS: '' })
      } else {
        toast.error(data.message || 'Une erreur est survenue')
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
      toast.error('Une erreur est survenue')
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories/${id}`, {
          method: 'DELETE'
        })
        
        const data = await response.json()
        
        if (data.success) {
          toast.success('Catégorie supprimée')
          loadCategories()
        } else {
          toast.error(data.message || 'Impossible de supprimer cette catégorie')
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        toast.error('Une erreur est survenue')
      }
    }
  }

  const handleEdit = (category: any) => {
    setSelectedCategory(category)
    setFormData({
      nom: category.nom,
      categorie: category.categorie,
      sousCategorie: category.sousCategorie || '',
      description: category.description || '',
      codeHS: category.codeHS || ''
    })
    setShowEditModal(true)
  }

  const toggleExpand = async (category: any) => {
    if (expandedCategoryId === category.id) {
      setExpandedCategoryId(null)
      return
    }
    setExpandedCategoryId(category.id)
    if (!categoryMarchandises[category.id]) {
      try {
        setLoadingMarchandises(category.id)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories/${category.id}/marchandises`)
        const data = await response.json()
        if (data.success) {
          setCategoryMarchandises(prev => ({ ...prev, [category.id]: data.data }))
        }
      } catch (error) {
        console.error('Erreur lors du chargement des marchandises:', error)
        toast.error('Erreur lors du chargement des marchandises')
      } finally {
        setLoadingMarchandises(null)
      }
    }
  }

  const filteredCategories = categories.filter(category =>
    category.categorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.nom.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* En-tête moderne */}
      <PageHeader
        title="Gestion des Catégories"
        subtitle="Gérez les catégories de marchandises"
        action={{
          label: 'Nouvelle Catégorie',
          onClick: () => setShowNewModal(true),
          icon: <PlusIcon className="h-4 w-4" />
        }}
      />

      {/* Barre de recherche moderne */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Tableau des catégories */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sous-catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code HS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marchandises
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <React.Fragment key={category.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleExpand(category)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Voir les marchandises"
                      >
                        {expandedCategoryId === category.id ? (
                          <ChevronDownIcon className="h-4 w-4" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TagIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">{category.nom}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{category.categorie}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{category.sousCategorie || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{category.codeHS || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 truncate max-w-xs">
                        {category.description || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleExpand(category)}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                      >
                        {category.nombreMarchandises || 0}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  {expandedCategoryId === category.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={8} className="px-6 py-4">
                        {loadingMarchandises === category.id ? (
                          <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          </div>
                        ) : (categoryMarchandises[category.id]?.length || 0) === 0 ? (
                          <p className="text-sm text-gray-500 italic">Aucune marchandise dans cette catégorie</p>
                        ) : (
                          <table className="min-w-full">
                            <thead>
                              <tr className="text-xs font-medium text-gray-500 uppercase">
                                <th className="px-3 py-2 text-left">Référence</th>
                                <th className="px-3 py-2 text-left">Désignation</th>
                                <th className="px-3 py-2 text-left">Quantité</th>
                                <th className="px-3 py-2 text-left">Poids</th>
                                <th className="px-3 py-2 text-left">Volume</th>
                                <th className="px-3 py-2 text-left">Statut</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {categoryMarchandises[category.id].map((m: any) => (
                                <tr key={m.id}>
                                  <td className="px-3 py-2 text-sm text-gray-900">{m.reference}</td>
                                  <td className="px-3 py-2 text-sm text-gray-900">{m.designation}</td>
                                  <td className="px-3 py-2 text-sm text-gray-500">{m.quantite} {m.unite}</td>
                                  <td className="px-3 py-2 text-sm text-gray-500">{m.poids} kg</td>
                                  <td className="px-3 py-2 text-sm text-gray-500">{m.volume} m³</td>
                                  <td className="px-3 py-2 text-sm text-gray-500">{m.statut}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Nouvelle/Édition Catégorie */}
      {(showNewModal || showEditModal) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                 onClick={() => {
                   setShowNewModal(false)
                   setShowEditModal(false)
                   setSelectedCategory(null)
                 }}></div>
            
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    {selectedCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowNewModal(false)
                      setShowEditModal(false)
                      setSelectedCategory(null)
                    }}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Référence générique"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.categorie}
                    onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Produits agricoles & agroalimentaires"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sous-catégorie
                  </label>
                  <input
                    type="text"
                    value={formData.sousCategorie}
                    onChange={(e) => setFormData({ ...formData, sousCategorie: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Céréales"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code HS
                  </label>
                  <input
                    type="text"
                    value={formData.codeHS}
                    onChange={(e) => setFormData({ ...formData, codeHS: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 09"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description de la catégorie..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewModal(false)
                      setShowEditModal(false)
                      setSelectedCategory(null)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    {selectedCategory ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
