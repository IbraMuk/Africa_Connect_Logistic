'use client'

import LayoutWithClient from '@/components/LayoutWithClient'

export default function WithSidebarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <LayoutWithClient>{children}</LayoutWithClient>
}
