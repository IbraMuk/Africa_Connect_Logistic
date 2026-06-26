'use client'

import { useState, createContext, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import RouteGuard from './RouteGuard'
import DashboardDrawer from './DashboardDrawer'
import { ToastProvider } from './Toast'
import { Bars3Icon, ChevronLeftIcon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import ThemeSelector from './ThemeSelector'
import AdminDropdown from './AdminDropdown'

interface LayoutContextType {
  isDrawerOpen: boolean
  toggleDrawer: () => void
  closeDrawer: () => void
}

const LayoutContext = createContext<LayoutContextType>({
  isDrawerOpen: true,
  toggleDrawer: () => {},
  closeDrawer: () => {}
})

export const useLayout = () => useContext(LayoutContext)

export default function MainLayout({ 
  children,
  title 
}: { 
  children: React.ReactNode
  title?: string 
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen)
  const closeDrawer = () => setIsDrawerOpen(false)

  // Pages qui n'utilisent pas ce layout
  const noLayoutPages = ['/auth', '/_not-found']
  if (noLayoutPages.includes(pathname)) {
    return <RouteGuard>{children}</RouteGuard>
  }

  return (
    <LayoutContext.Provider value={{ isDrawerOpen, toggleDrawer, closeDrawer }}>
      <RouteGuard>
        <ToastProvider>
          <div className="min-h-screen bg-slate-50 relative flex">
            {/* Drawer - statique à gauche */}
            <div className={`
              fixed left-0 top-0 h-full w-72 z-50 transform transition-transform duration-300 ease-in-out
              ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:relative lg:translate-x-0 lg:flex-shrink-0
              ${!isDrawerOpen ? 'lg:hidden' : ''}
            `}>
              <DashboardDrawer 
                isOpen={isDrawerOpen} 
                onClose={toggleDrawer} 
              />
            </div>

            {/* Overlay pour mobile */}
            {isDrawerOpen && (
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={closeDrawer}
              />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
              {/* Header */}
              <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-16 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                {/* Ligne d'accent de marque */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600" />

                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleDrawer}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
                    title={isDrawerOpen ? "Fermer le menu" : "Ouvrir le menu"}
                  >
                    {isDrawerOpen ? (
                      <ChevronLeftIcon className="h-5 w-5" />
                    ) : (
                      <Bars3Icon className="h-5 w-5" />
                    )}
                  </button>
                  {title && (
                    <div>
                      <h1 className="text-base font-semibold text-gray-900 leading-tight">{title}</h1>
                      <p className="text-xs text-gray-400">Africa Connect Logistic</p>
                    </div>
                  )}
                </div>
                
                {/* Actions à droite */}
                <div className="flex items-center space-x-2">
                  {/* Barre de recherche */}
                  <div className="hidden md:flex items-center">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        className="w-56 pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-gray-50 text-gray-900 placeholder-gray-400 transition-all outline-none"
                      />
                      <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="w-px h-6 bg-gray-200 hidden md:block" />
                  
                  {/* Menu Admin - Dropdown */}
                  <AdminDropdown />
                  
                  {/* Sélecteur de thème */}
                  <ThemeSelector />
                  
                  {/* Bouton notifications */}
                  <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800">
                    <BellIcon className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                  </button>
                  
                  {/* Avatar utilisateur */}
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                </div>
              </header>

              {/* Page Content */}
              <main className="flex-1 p-6 lg:p-8 min-h-0">
                {children}
              </main>
            </div>
          </div>
        </ToastProvider>
      </RouteGuard>
    </LayoutContext.Provider>
  )
}
