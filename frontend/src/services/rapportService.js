import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const rapportService = {
  async getRapportFinancier(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/rapports/financiers`, { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du rapport financier:', error)
      throw error
    }
  },

  async getRapportFactures(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/rapports/factures`, { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du rapport factures:', error)
      throw error
    }
  },

  async getRapportDepenses(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/rapports/depenses`, { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du rapport dépenses:', error)
      throw error
    }
  },

  async getRapportActivite(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/rapports/activite`, { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du rapport activité:', error)
      throw error
    }
  },

  async getRapportClients(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/rapports/clients`, { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du rapport clients:', error)
      throw error
    }
  },

  async getRapportVehicules(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/rapports/vehicules`, { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du rapport véhicules:', error)
      throw error
    }
  }
}

export default rapportService
