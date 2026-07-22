import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap'
})

export async function generateMetadata(): Promise<Metadata> {
  const h = headers()
  const host = h.get('host') || 'localhost:3000'
  const proto = h.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https')
  const baseUrl = `${proto}://${host}`

  return {
    title: {
      default: 'Africa Connect Logistic - Solution Logistique Intégrée',
      template: '%s | Africa Connect Logistic'
    },
    description: 'Plateforme leader en logistique en Afrique. Transport personnel, marchandises, réservation de billets et services import/export. Fiabilité, rapidité et sécurité garanties.',
    keywords: [
      'logistique',
      'transport',
      'Afrique',
      'livraison',
      'cargo',
      'RDC',
      'Kinshasa',
      'transport personnel',
      'transport marchandises',
      'import export',
      'réservation billets'
    ],
    authors: [{ name: 'Africa Connect Logistic' }],
    creator: 'Africa Connect Logistic',
    publisher: 'Africa Connect Logistic',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: 'Africa Connect Logistic - Solution Logistique Intégrée',
      description: 'Plateforme leader en logistique en Afrique. Transport personnel, marchandises, réservation de billets et services import/export.',
      url: '/',
      siteName: 'Africa Connect Logistic',
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Africa Connect Logistic',
      description: 'Solution logistique intégrée en Afrique',
      creator: '@africaconnect',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
    icons: {
      icon: {
        url: '/images/logo.png',
        type: 'image/png',
      },
      shortcut: {
        url: '/images/logo.png',
        type: 'image/png',
      },
      apple: {
        url: '/images/logo.png',
        type: 'image/png',
      },
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
