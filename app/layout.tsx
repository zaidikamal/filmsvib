import '@/app/globals.css'
import type { Metadata } from 'next'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import BreakingNewsTicker from "@/components/BreakingNewsTicker"
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
      <body className="bg-[#0a0a0f] text-white selection:bg-purple-500/30">
        <BreakingNewsTicker />
        <div className="pt-12">
          <Navbar />
          {children}
        </div>
        <Analytics />
        <Footer />
      </body>
    </html>
  )
}

