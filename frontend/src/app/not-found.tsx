'use client'

import Link from 'next/link'
import { HomeIcon, ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
            <ExclamationTriangleIcon className="h-10 w-10 text-primary-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Page non trouvée
          </h2>
          <p className="text-gray-600 mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/"
            className="btn-primary w-full"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Retour à l'accueil
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="btn-secondary w-full"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour en arrière
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Besoin d'aide ?{' '}
            <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
              Contactez notre support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
