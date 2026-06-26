import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const itineraireService = {
  // Obtenir tous les itinéraires
  async getAllItineraires(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/itineraires`, { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des itinéraires:', error)
      throw error
    }
  },

  // Obtenir un itinéraire par son ID
  async getItineraireById(id) {
    try {
      const response = await axios.get(`${API_URL}/itineraires/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'itinéraire:', error)
      throw error
    }
  },

  // Créer un nouvel itinéraire
  async createItineraire(itineraireData) {
    try {
      const response = await axios.post(`${API_URL}/itineraires`, itineraireData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création de l\'itinéraire:', error)
      throw error
    }
  },

  // Mettre à jour un itinéraire
  async updateItineraire(id, itineraireData) {
    try {
      const response = await axios.put(`${API_URL}/itineraires/${id}`, itineraireData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'itinéraire:', error)
      throw error
    }
  },

  // Supprimer un itinéraire
  async deleteItineraire(id) {
    try {
      const response = await axios.delete(`${API_URL}/itineraires/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'itinéraire:', error)
      throw error
    }
  },

  // Obtenir les statistiques des itinéraires
  async getItineraireStats() {
    try {
      const response = await axios.get(`${API_URL}/itineraires/stats`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  }
}

export default itineraireService
