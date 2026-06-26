'use client'

import { useState, useEffect } from 'react'
import { 
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

interface ReservationFormProps {
  isOpen: boolean
  onClose: () => void
  trajet: any
  onSuccess?: (reservation: any) => void
}

export default function ReservationForm({ isOpen, onClose, trajet, onSuccess }: ReservationFormProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Informations passager
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    nationalite: '',
    passeport: '',
    cni: '',
    
    // Informations de vol
    classe: 'economique',
    siege: '',
    bagages: {
      cabine: 1,
      soute: 1
    },
    assurances: {
      annulation: false,
      medicaux: false,
      bagages: false
    },
    
    // Paiement
    methodePaiement: 'carte',
    numeroCarte: '',
    nomCarte: '',
    expirationCarte: '',
    cvv: '',
    
    // Options additionnelles
    repasSpecial: '',
    assistanceSpeciale: '',
    preferences: ''
  })

  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setFormData({
        ...formData,
        classe: trajet.classe || 'economique'
      })
    }
  }, [isOpen, trajet])

  const validateStep1 = () => {
    const newErrors: any = {}
    
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis'
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis'
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email invalide'
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis'
    if (!formData.dateNaissance) newErrors.dateNaissance = 'La date de naissance est requise'
    if (!formData.nationalite) newErrors.nationalite = 'La nationalité est requise'
    
    if (trajet.type === 'aviation' || trajet.type === 'maritime') {
      if (!formData.passeport.trim()) newErrors.passeport = 'Le passeport est requis'
    } else {
      if (!formData.cni.trim()) newErrors.cni = 'La CNI est requise'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: any = {}
    
    if (!formData.methodePaiement) newErrors.methodePaiement = 'Méthode de paiement requise'
    if (formData.methodePaiement === 'carte') {
      if (!formData.numeroCarte.trim()) newErrors.numeroCarte = 'Numéro de carte requis'
      else if (!/^\d{16}$/.test(formData.numeroCarte.replace(/\s/g, ''))) newErrors.numeroCarte = 'Numéro invalide'
      if (!formData.nomCarte.trim()) newErrors.nomCarte = 'Nom sur la carte requis'
      if (!formData.expirationCarte) newErrors.expirationCarte = 'Date d\'expiration requise'
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV requis'
      else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'CVV invalide'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (step === 1) {
      if (validateStep1()) setStep(2)
    } else if (step === 2) {
      if (validateStep2()) {
        await processReservation()
      }
    }
  }

  const processReservation = async () => {
    setLoading(true)
    try {
      // Simulation d'appel API
      const reservation = {
        id: `RES-${Date.now()}`,
        trajet: trajet,
        passager: {
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone
        },
        details: {
          classe: formData.classe,
          siege: formData.siege,
          prix: trajet.prix[formData.classe],
          assurances: formData.assurances,
          bagages: formData.bagages
        },
        statut: 'confirmée',
        dateReservation: new Date().toISOString()
      }
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Réservation confirmée avec succès !')
      onSuccess?.(reservation)
      onClose()
      setStep(1)
    } catch (error) {
      toast.error('Erreur lors de la réservation')
    } finally {
      setLoading(false)
    }
  }

  const calculerTotal = () => {
    let total = trajet.prix[formData.classe]
    
    // Assurance annulation
    if (formData.assurances.annulation) total += total * 0.05
    
    // Assurance médicale
    if (formData.assurances.medicaux) total += 50
    
    // Assurance bagages
    if (formData.assurances.bagages) total += 30
    
    // Bagages supplémentaires
    if (formData.bagages.cabine > 1) total += (formData.bagages.cabine - 1) * 50
    if (formData.bagages.soute > 1) total += (formData.bagages.soute - 1) * 40
    
    return total
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Réservation de billet</h3>
                <p className="text-blue-100 text-sm mt-1">
                  {trajet.compagnie} - {trajet.depart} → {trajet.arrivee}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step >= 1 ? 'bg-white text-blue-600' : 'bg-blue-400 text-white'
                }`}>
                  1
                </div>
                <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-white' : 'bg-blue-400'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step >= 2 ? 'bg-white text-blue-600' : 'bg-blue-400 text-white'
                }`}>
                  2
                </div>
              </div>
              <div className="flex mt-2 text-xs text-blue-100">
                <span className="flex-1 text-center">Informations passager</span>
                <span className="flex-1 text-center">Paiement</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                {/* Informations du passager */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Informations du passager</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.nom ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nom"
                      />
                      {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.prenom ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Prénom"
                      />
                      {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="email@exemple.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.telephone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+243 XXX XXX XXX"
                      />
                      {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de naissance <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.dateNaissance}
                        onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.dateNaissance ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.dateNaissance && <p className="text-red-500 text-sm mt-1">{errors.dateNaissance}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nationalité <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.nationalite}
                        onChange={(e) => setFormData({ ...formData, nationalite: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.nationalite ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Sélectionner</option>
                        <option value="CD">Congo (RDC)</option>
                        <option value="CG">Congo (Brazzaville)</option>
                        <option value="FR">France</option>
                        <option value="BE">Belgique</option>
                        <option value="CA">Canada</option>
                        <option value="US">États-Unis</option>
                      </select>
                      {errors.nationalite && <p className="text-red-500 text-sm mt-1">{errors.nationalite}</p>}
                    </div>
                    
                    {(trajet.type === 'aviation' || trajet.type === 'maritime') ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Passeport <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.passeport}
                          onChange={(e) => setFormData({ ...formData, passeport: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.passeport ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Numéro de passeport"
                        />
                        {errors.passeport && <p className="text-red-500 text-sm mt-1">{errors.passeport}</p>}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CNI <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.cni}
                          onChange={(e) => setFormData({ ...formData, cni: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.cni ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Numéro de carte d'identité"
                        />
                        {errors.cni && <p className="text-red-500 text-sm mt-1">{errors.cni}</p>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Options du voyage */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Options du voyage</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                      <select
                        value={formData.classe}
                        onChange={(e) => setFormData({ ...formData, classe: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {trajet.type === 'bus' ? (
                          <>
                            <option value="economique">Standard - ${trajet.prix.economique}</option>
                            <option value="vip">VIP - ${trajet.prix.vip}</option>
                            <option value="premium">Premium - ${trajet.prix.premium}</option>
                          </>
                        ) : (
                          <>
                            <option value="economique">Économique - ${trajet.prix.economique}</option>
                            <option value="affaire">Affaire - ${trajet.prix.affaire}</option>
                            <option value="premiere">Première - ${trajet.prix.premiere}</option>
                          </>
                        )}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Préférence de siège</label>
                      <input
                        type="text"
                        value={formData.siege}
                        onChange={(e) => setFormData({ ...formData, siege: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Fenêtre, Allée, etc."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bagages cabine</label>
                        <select
                          value={formData.bagages.cabine}
                          onChange={(e) => setFormData({ ...formData, bagages: { ...formData.bagages, cabine: parseInt(e.target.value) } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={1}>1 bagage inclus</option>
                          <option value={2}>2 bagages (+$50)</option>
                          <option value={3}>3 bagages (+$100)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bagages soute</label>
                        <select
                          value={formData.bagages.soute}
                          onChange={(e) => setFormData({ ...formData, bagages: { ...formData.bagages, soute: parseInt(e.target.value) } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={1}>1 bagage inclus</option>
                          <option value={2}>2 bagages (+$40)</option>
                          <option value={3}>3 bagages (+$80)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assurances */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Assurances optionnelles</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.assurances.annulation}
                        onChange={(e) => setFormData({ ...formData, assurances: { ...formData.assurances, annulation: e.target.checked } })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Assurance annulation (5% du prix)
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.assurances.medicaux}
                        onChange={(e) => setFormData({ ...formData, assurances: { ...formData.assurances, medicaux: e.target.checked } })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Assurance médicale (+$50)
                      </span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.assurances.bagages}
                        onChange={(e) => setFormData({ ...formData, assurances: { ...formData.assurances, bagages: e.target.checked } })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Assurance bagages (+$30)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* Récapitulatif */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Récapitulatif de la réservation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passager:</span>
                      <span className="font-medium">{formData.prenom} {formData.nom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trajet:</span>
                      <span className="font-medium">{trajet.depart} → {trajet.arrivee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(trajet.dateDepart).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Classe:</span>
                      <span className="font-medium capitalize">{formData.classe}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span className="text-lg text-blue-600">${calculerTotal()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Méthode de paiement */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Méthode de paiement</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <label className="flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="carte"
                          checked={formData.methodePaiement === 'carte'}
                          onChange={(e) => setFormData({ ...formData, methodePaiement: e.target.value })}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <CreditCardIcon className="h-8 w-8 mx-auto mb-2" />
                          <span className="text-sm">Carte bancaire</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="mobile"
                          checked={formData.methodePaiement === 'mobile'}
                          onChange={(e) => setFormData({ ...formData, methodePaiement: e.target.value })}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <PhoneIcon className="h-8 w-8 mx-auto mb-2" />
                          <span className="text-sm">Mobile Money</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="payment"
                          value="especes"
                          checked={formData.methodePaiement === 'especes'}
                          onChange={(e) => setFormData({ ...formData, methodePaiement: e.target.value })}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <CurrencyDollarIcon className="h-8 w-8 mx-auto mb-2" />
                          <span className="text-sm">Espèces</span>
                        </div>
                      </label>
                    </div>
                    
                    {formData.methodePaiement === 'carte' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Numéro de carte <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.numeroCarte}
                            onChange={(e) => setFormData({ ...formData, numeroCarte: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.numeroCarte ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                          {errors.numeroCarte && <p className="text-red-500 text-sm mt-1">{errors.numeroCarte}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom sur la carte <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.nomCarte}
                            onChange={(e) => setFormData({ ...formData, nomCarte: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.nomCarte ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="NOM COMPLET"
                          />
                          {errors.nomCarte && <p className="text-red-500 text-sm mt-1">{errors.nomCarte}</p>}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expiration <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.expirationCarte}
                              onChange={(e) => setFormData({ ...formData, expirationCarte: e.target.value })}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.expirationCarte ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="MM/AA"
                              maxLength={5}
                            />
                            {errors.expirationCarte && <p className="text-red-500 text-sm mt-1">{errors.expirationCarte}</p>}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CVV <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.cvv}
                              onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.cvv ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="123"
                              maxLength={4}
                            />
                            {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {formData.methodePaiement === 'mobile' && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          Vous recevrez une notification sur votre téléphone pour confirmer le paiement.
                        </p>
                      </div>
                    )}
                    
                    {formData.methodePaiement === 'especes' && (
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          Veuillez vous présenter à nos agences pour payer en espèces avant la date de départ.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sécurité */}
                <div className="flex items-center p-4 bg-green-50 rounded-lg">
                  <ShieldCheckIcon className="h-5 w-5 text-green-600 mr-2" />
                  <p className="text-sm text-green-800">
                    Paiement sécurisé via SSL. Vos informations sont protégées.
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Précédent
                </button>
              )}
              
              <div className="flex space-x-3 ml-auto">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Traitement...
                    </>
                  ) : step === 1 ? (
                    'Suivant'
                  ) : (
                    'Confirmer la réservation'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
