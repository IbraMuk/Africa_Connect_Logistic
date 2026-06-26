import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const factureService = {
  // Obtenir toutes les factures
  async getAllFactures(params = {}) {
    try {
      const response = await axios.get(`${API_URL}/factures`, { params })
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des factures:', error)
      throw error
    }
  },

  // Obtenir une facture par son ID
  async getFactureById(id) {
    try {
      const response = await axios.get(`${API_URL}/factures/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération de la facture:', error)
      throw error
    }
  },

  // Créer une nouvelle facture
  async createFacture(factureData) {
    try {
      const response = await axios.post(`${API_URL}/factures`, factureData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error)
      throw error
    }
  },

  // Mettre à jour une facture
  async updateFacture(id, factureData) {
    try {
      const response = await axios.put(`${API_URL}/factures/${id}`, factureData)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la facture:', error)
      throw error
    }
  },

  // Supprimer une facture
  async deleteFacture(id) {
    try {
      const response = await axios.delete(`${API_URL}/factures/${id}`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la suppression de la facture:', error)
      throw error
    }
  },

  // Obtenir les statistiques des factures
  async getFactureStats() {
    try {
      const response = await axios.get(`${API_URL}/factures/stats`)
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  },

  // Générer le PDF d'une facture
  async generatePDF(id) {
    try {
      const response = await axios.get(`${API_URL}/factures/${id}/pdf`, {
        responseType: 'blob'
      })

      // Créer une URL pour le blob
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' })
      const pdfUrl = window.URL.createObjectURL(pdfBlob)

      // Créer un lien temporaire et cliquer dessus (sans download pour ouvrir dans un nouvel onglet)
      const link = document.createElement('a')
      link.href = pdfUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Nettoyer l'URL après 60 secondes
      setTimeout(() => window.URL.revokeObjectURL(pdfUrl), 60000)

      return true
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      throw error
    }
  },

  // Télécharger le PDF d'une facture
  async downloadPDF(id, factureNumber) {
    try {
      const response = await axios.get(`${API_URL}/factures/${id}/pdf`, {
        responseType: 'blob'
      })
      
      // Créer une URL pour le blob
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' })
      const pdfUrl = window.URL.createObjectURL(pdfBlob)
      
      // Créer un lien temporaire pour le téléchargement
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `facture-${factureNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Nettoyer l'URL
      window.URL.revokeObjectURL(pdfUrl)
      
      return true
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF:', error)
      throw error
    }
  }
}

export default factureService;
