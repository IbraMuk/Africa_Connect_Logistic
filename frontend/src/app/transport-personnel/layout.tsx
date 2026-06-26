import MainLayout from '@/components/MainLayout'

export default function TransportPersonnelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MainLayout title="Transport Personnel">
      {children}
    </MainLayout>
  )
}
