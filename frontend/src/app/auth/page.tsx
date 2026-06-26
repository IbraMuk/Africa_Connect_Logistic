'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { EyeIcon, EyeSlashIcon, TruckIcon, GlobeAltIcon, ShieldCheckIcon, ClockIcon, UserIcon, LockClosedIcon, EnvelopeIcon, PhoneIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm()
  const password = watch('password')

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    
    if (isLogin) {
      if (data.email && data.password) {
        const mockUser = {
          id: '550e8400-e29b-41d4-a716-446655440000',
          nom: 'Admin',
          prenom: 'System',
          email: data.email,
          role: 'admin',
          statut: 'actif'
        }
        
        Cookies.set('token', 'demo-token-123', { expires: 7 })
        Cookies.set('user', JSON.stringify(mockUser), { expires: 7 })
        
        toast.success('Connexion réussie!')
        router.push('/dashboard')
      } else {
        toast.error('Veuillez remplir tous les champs')
      }
    } else {
      if (data.email && data.password && data.nom && data.prenom) {
        const mockUser = {
          id: 'user-' + Date.now(),
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          role: data.role || 'client',
          statut: 'actif'
        }
        
        Cookies.set('token', 'demo-token-123', { expires: 7 })
        Cookies.set('user', JSON.stringify(mockUser), { expires: 7 })
        
        toast.success('Inscription réussie!')
        router.push('/dashboard')
      } else {
        toast.error('Veuillez remplir tous les champs')
      }
    }
    
    setIsLoading(false)
  }

  const toggleForm = () => {
    setIsLogin(!isLogin)
    reset()
  }

  const features = [
    { icon: GlobeAltIcon, text: 'Couverture internationale', sub: 'RDC & Afrique Centrale' },
    { icon: ShieldCheckIcon, text: 'Sécurité maximale', sub: 'Protection des données' },
    { icon: ClockIcon, text: '24/7 Disponible', sub: 'Support client permanent' },
    { icon: TruckIcon, text: 'Transport rapide', sub: 'Livraison express' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Logo size={56} showText={false} />
            <div>
              <h3 className="text-white text-xl font-bold">Africa Connect</h3>
              <p className="text-blue-200 text-sm">Logistic Platform</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                Votre partenaire<br />
                <span className="text-blue-300">logistique</span> de confiance
              </h1>
              <p className="mt-4 text-blue-100 text-lg max-w-md leading-relaxed">
                Solutions de transport et logistique intégrées pour l'Afrique Centrale. 
                Rapide, sécurisé et fiable.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                >
                  <feature.icon className="h-6 w-6 text-blue-300 mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-white text-sm font-semibold">{feature.text}</p>
                  <p className="text-blue-200 text-xs">{feature.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Stats */}
          <div className="flex items-center space-x-8">
            <div>
              <p className="text-3xl font-bold text-white">15K+</p>
              <p className="text-blue-200 text-sm">Clients satisfaits</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-blue-200 text-sm">Livraisons à temps</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div>
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-blue-200 text-sm">Support client</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo - Only visible on mobile */}
          <div className="lg:hidden flex justify-center mb-6">
            <Logo size={72} showText={false} />
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {isLogin ? 'Bienvenue!' : 'Rejoignez-nous!'}
            </h2>
            <p className="mt-2 text-gray-500">
              {isLogin ? 'Connectez-vous pour accéder à votre tableau de bord' : 'Créez votre compte pour commencer'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 sm:p-8 border border-gray-100">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Prénom
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('prenom', { required: 'Le prénom est requis' })}
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                        placeholder="Jean"
                      />
                    </div>
                    {errors.prenom && typeof errors.prenom.message === 'string' && (
                      <p className="mt-1 text-sm text-red-500">{errors.prenom.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nom
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('nom', { required: 'Le nom est requis' })}
                        type="text"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                        placeholder="Dupont"
                      />
                    </div>
                    {errors.nom && typeof errors.nom.message === 'string' && (
                      <p className="mt-1 text-sm text-red-500">{errors.nom.message}</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email', { 
                      required: 'L\'email est requis',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email invalide'
                      }
                    })}
                    type="email"
                    autoComplete="email"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    placeholder="jean.dupont@email.com"
                  />
                </div>
                {errors.email && typeof errors.email.message === 'string' && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Téléphone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('telephone')}
                      type="tel"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="+243 XXX XXX XXX"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('password', { 
                      required: 'Le mot de passe est requis',
                      minLength: {
                        value: 6,
                        message: 'Minimum 6 caractères'
                      }
                    })}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && typeof errors.password.message === 'string' && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('confirmPassword', { 
                          required: 'La confirmation est requise',
                          validate: value => value === password || 'Les mots de passe ne correspondent pas'
                        })}
                        type="password"
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.confirmPassword && typeof errors.confirmPassword.message === 'string' && (
                      <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Type de compte
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        {...register('role')}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 bg-white rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                      >
                        <option value="client">Client</option>
                        <option value="chauffeur">Chauffeur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
                      Se souvenir de moi
                    </label>
                  </div>

                  <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    Mot de passe oublié?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? 'Connexion en cours...' : 'Création du compte...'}
                  </div>
                ) : (
                  <>
                    {isLogin ? 'Se connecter' : 'Créer mon compte'}
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Toggle Form */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              {isLogin ? "Pas encore de compte?" : "Déjà un compte?"}
              <button
                onClick={toggleForm}
                className="ml-2 font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              >
                {isLogin ? 'Créer un compte' : 'Se connecter'}
              </button>
            </p>
          </div>

          {/* Footer */}
          <div className="text-center space-y-2 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Africa Connect Logistic Platform
            </p>
            <p className="text-xs text-gray-400">
              © 2026 - Développé par Andy Mukonde
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
