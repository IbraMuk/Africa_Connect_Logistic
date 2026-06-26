import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const clientService = {
  // Obtenir tous les clients
  getAllClients: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/clients`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtenir un client par son ID
  getClientById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/clients/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Créer un nouveau client
  createClient: async (clientData) => {
    try {
      const response = await axios.post(`${API_URL}/clients`, clientData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mettre à jour un client
  updateClient: async (id, clientData) => {
    try {
      const response = await axios.put(`${API_URL}/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Supprimer un client
  deleteClient: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/clients/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtenir les statistiques des clients
  getClientStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/clients/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default clientService;
