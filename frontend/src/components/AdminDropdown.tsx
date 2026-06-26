'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CogIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ServerIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

export default function AdminDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const adminMenuItems = [
    {
      title: 'Paramètres',
      description: 'Configuration générale',
      icon: CogIcon,
      href: '/settings'
    },
    {
      title: 'Utilisateurs',
      description: 'Gestion des comptes',
      icon: UserGroupIcon,
      href: '/admin/users'
    },
    {
      title: 'Statistiques',
      description: 'Rapports et analyses',
      icon: ChartBarIcon,
      href: '/admin/statistics'
    },
    {
      title: 'Logs Système',
      description: 'Journaux d\'activité',
      icon: DocumentTextIcon,
      href: '/admin/logs'
    },
    {
      title: 'Sécurité',
      description: 'Permissions et rôles',
      icon: ShieldCheckIcon,
      href: '/admin/security'
    },
    {
      title: 'Base de données',
      description: 'Sauvegardes et maintenance',
      icon: ServerIcon,
      href: '/admin/database'
    }
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <CogIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <span className="hidden lg:block text-sm text-gray-700 dark:text-gray-300">Admin</span>
        <ChevronDownIcon className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Système Admin</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Outils d'administration</p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {adminMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  router.push(item.href)
                  setIsOpen(false)
                }}
                className="w-full flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <item.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
