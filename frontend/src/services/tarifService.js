import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const tarifService = {
  async getAllTarifs(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/tarifs`, { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des tarifs:', error)
      throw error
    }
  },

  async getTarifById(id) {
    try {
      const response = await axios.get(`${API_URL}/tarifs/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du tarif:', error)
      throw error
    }
  },

  async createTarif(tarifData) {
    try {
      const response = await axios.post(`${API_URL}/tarifs`, tarifData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création du tarif:', error)
      throw error
    }
  },

  async updateTarif(id, tarifData) {
    try {
      const response = await axios.put(`${API_URL}/tarifs/${id}`, tarifData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour du tarif:', error)
      throw error
    }
  },

  async deleteTarif(id) {
    try {
      const response = await axios.delete(`${API_URL}/tarifs/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la suppression du tarif:', error)
      throw error
    }
  },

  async getTarifStats() {
    try {
      const response = await axios.get(`${API_URL}/tarifs/stats`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  }
}

export default tarifService
