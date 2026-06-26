import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const categoryService = {
  // Obtenir toutes les catégories
  async getAllCategories() {
    try {
      const response = await axios.get(`${API_URL}/categories`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error)
      throw error
    }
  },

  // Obtenir une catégorie par son ID
  async getCategoryById(id) {
    try {
      const response = await axios.get(`${API_URL}/categories/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération de la catégorie:', error)
      throw error
    }
  },

  // Créer une nouvelle catégorie
  async createCategory(data) {
    try {
      const response = await axios.post(`${API_URL}/categories`, data)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error)
      throw error
    }
  },

  // Mettre à jour une catégorie
  async updateCategory(id, data) {
    try {
      const response = await axios.put(`${API_URL}/categories/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error)
      throw error
    }
  },

  // Supprimer une catégorie
  async deleteCategory(id) {
    try {
      const response = await axios.delete(`${API_URL}/categories/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error)
      throw error
    }
  }
}

export default categoryService
