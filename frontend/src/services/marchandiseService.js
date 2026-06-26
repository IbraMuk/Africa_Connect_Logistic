import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const merchandiseService = {
  // Obtenir toutes les marchandises avec pagination et filtres
  async getAllMarchandises(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/marchandises`, { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des marchandises:', error)
      throw error
    }
  },

  // Obtenir la liste des catégories disponibles
  getCategories() {
    return [
      { value: 'Toutes', label: 'Toutes les catégories' },
      { value: 'general', label: 'Général' },
      { value: 'dangerux', label: 'Dangerux' },
      { value: 'perissable', label: 'Périssable' },
      { value: 'electronique', label: 'Électronique' },
      { value: 'vehicule', label: 'Véhicule' },
      { value: 'textile', label: 'Textile' },
      { value: 'agricole', label: 'Agricole' },
      { value: 'standard', label: 'Standard' },
      { value: 'fragile', label: 'Fragile' },
      { value: 'dangereux', label: 'Dangereux' },
      { value: 'lourde', label: 'Lourde' },
      { value: 'volumineux', label: 'Volumineux' }
    ]
  },

  // Obtenir une marchandise par son ID
  async getMarchandiseById(id) {
    try {
      const response = await axios.get(`${API_URL}/marchandises/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération de la marchandise:', error)
      throw error
    }
  },

  // Créer une nouvelle marchandise
  async createMarchandise(data) {
    try {
      const response = await axios.post(`${API_URL}/marchandises`, data)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création de la marchandise:', error)
      throw error
    }
  },

  // Mettre à jour une marchandise
  async updateMarchandise(id, data) {
    try {
      const response = await axios.put(`${API_URL}/marchandises/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la marchandise:', error)
      throw error
    }
  },

  // Supprimer une marchandise
  async deleteMarchandise(id) {
    try {
      const response = await axios.delete(`${API_URL}/marchandises/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la suppression de la marchandise:', error)
      throw error
    }
  },

  // Mettre à jour le statut d'une marchandise
  async updateStatut(id, data) {
    try {
      const response = await axios.patch(`${API_URL}/marchandises/${id}/statut`, data)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error)
      throw error
    }
  },

  // Obtenir les statistiques des marchandises
  async getMarchandiseStats() {
    try {
      const response = await axios.get(`${API_URL}/marchandises/stats`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  },

  // Suivre une marchandise par numéro de suivi
  async trackMarchandise(numeroSuivi) {
    try {
      const response = await axios.get(`${API_URL}/marchandises`, {
        params: { search: numeroSuivi }
      })
      return response.data
    } catch (error) {
      console.error('Erreur lors du suivi de la marchandise:', error)
      throw error
    }
  },

  // Obtenir l'historique des statuts d'une marchandise
  async getStatutHistory(id) {
    try {
      // Cette fonctionnalité pourrait être implémentée plus tard avec une table d'historique
      const response = await axios.get(`${API_URL}/marchandises/${id}`)
      return {
        current: response.data.data.statut,
        history: [
          { statut: 'En attente', date: response.data.data.dateEnvoi },
          // Autres statuts selon l'historique
        ]
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error)
      throw error
    }
  }
}

export default merchandiseService
