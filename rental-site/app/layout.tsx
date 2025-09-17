import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://rentals.lakecountyoutdoors.com'),
  title: 'LCO Equipment Rentals | Lake County Outdoors',
  description: 'Rent professional landscaping and snow removal equipment from Lake County Outdoors. Snow blowers, lawn mowers, and more available for hourly, daily, and weekly rentals.',
  keywords: 'equipment rental, snow blower rental, lawn mower rental, landscaping equipment, Edina MN',
  openGraph: {
    title: 'LCO Equipment Rentals',
    description: 'Professional equipment rentals for landscaping and snow removal',
    url: 'https://rentals.lakecountyoutdoors.com',
    siteName: 'Lake County Outdoors',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}