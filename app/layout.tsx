import '@/app/globals.css'
import type { Metadata } from 'next'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: 'Filmsvib | فيلم فيب',
  description: 'منصتك الأولى لأخبار الأفلام والمسلسلات العالمية',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Navbar />
        {children}
        <Analytics />
        <Footer />
      </body>
    </html>
  )
}

