'use client'

import { usePathname } from 'next/navigation'
import SharedLayout from '@/components/SharedLayout'

export default function LayoutWithClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Extraire le nom de la page actuelle
  const getCurrentPage = () => {
    const segments = pathname.split('/')
    return segments[1] || 'dashboard'
  }

  return (
    <SharedLayout currentPage={getCurrentPage()}>
      {children}
    </SharedLayout>
  )
}
