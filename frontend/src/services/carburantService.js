import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const carburantService = {
  async getAllCarburants(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/carburants`, { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des carburants:', error)
      throw error
    }
  },

  async getCarburantById(id) {
    try {
      const response = await axios.get(`${API_URL}/carburants/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du carburant:', error)
      throw error
    }
  },

  async createCarburant(carburantData) {
    try {
      const response = await axios.post(`${API_URL}/carburants`, carburantData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création du carburant:', error)
      throw error
    }
  },

  async updateCarburant(id, carburantData) {
    try {
      const response = await axios.put(`${API_URL}/carburants/${id}`, carburantData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour du carburant:', error)
      throw error
    }
  },

  async deleteCarburant(id) {
    try {
      const response = await axios.delete(`${API_URL}/carburants/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la suppression du carburant:', error)
      throw error
    }
  },

  async getCarburantStats() {
    try {
      const response = await axios.get(`${API_URL}/carburants/stats`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  }
}

export default carburantService
