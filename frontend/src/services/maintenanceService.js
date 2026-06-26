import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const maintenanceService = {
  async getAllMaintenances(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/maintenances`, { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des maintenances:', error)
      throw error
    }
  },

  async getMaintenanceById(id) {
    try {
      const response = await axios.get(`${API_URL}/maintenances/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération de la maintenance:', error)
      throw error
    }
  },

  async createMaintenance(maintenanceData) {
    try {
      const response = await axios.post(`${API_URL}/maintenances`, maintenanceData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création de la maintenance:', error)
      throw error
    }
  },

  async updateMaintenance(id, maintenanceData) {
    try {
      const response = await axios.put(`${API_URL}/maintenances/${id}`, maintenanceData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la maintenance:', error)
      throw error
    }
  },

  async deleteMaintenance(id) {
    try {
      const response = await axios.delete(`${API_URL}/maintenances/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la suppression de la maintenance:', error)
      throw error
    }
  },

  async getMaintenanceStats() {
    try {
      const response = await axios.get(`${API_URL}/maintenances/stats`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  }
}

export default maintenanceService
