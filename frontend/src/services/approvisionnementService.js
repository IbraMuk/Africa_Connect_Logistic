import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const approvisionnementService = {
  async getAllApprovisionnements(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/approvisionnements`, { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des approvisionnements:', error)
      throw error
    }
  },

  async getApprovisionnementById(id) {
    try {
      const response = await axios.get(`${API_URL}/approvisionnements/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'approvisionnement:', error)
      throw error
    }
  },

  async createApprovisionnement(approvisionnementData) {
    try {
      const response = await axios.post(`${API_URL}/approvisionnements`, approvisionnementData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création de l\'approvisionnement:', error)
      throw error
    }
  },

  async updateApprovisionnement(id, approvisionnementData) {
    try {
      const response = await axios.put(`${API_URL}/approvisionnements/${id}`, approvisionnementData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'approvisionnement:', error)
      throw error
    }
  },

  async deleteApprovisionnement(id) {
    try {
      const response = await axios.delete(`${API_URL}/approvisionnements/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'approvisionnement:', error)
      throw error
    }
  },

  async getApprovisionnementStats() {
    try {
      const response = await axios.get(`${API_URL}/approvisionnements/stats`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  }
}

export default approvisionnementService
