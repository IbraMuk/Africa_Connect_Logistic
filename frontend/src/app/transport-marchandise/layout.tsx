import MainLayout from '@/components/MainLayout'

export default function TransportMarchandiseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MainLayout title="Transport Marchandise">
      {children}
    </MainLayout>
  )
}
