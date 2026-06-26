'use client'

import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
    icon?: React.ReactNode
  }
  backHref?: string
}

export default function PageHeader({ title, subtitle, action, backHref }: PageHeaderProps) {
  return (
    <div className="mb-8">
      {backHref && (
        <Link href={backHref} className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-4 transition-colors">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Retour
        </Link>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {action && (
          action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </button>
          )
        )}
      </div>
    </div>
  )
}
