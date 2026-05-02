import '@/app/globals.css'
import type { Metadata } from 'next'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import BreakingNewsTicker from "@/components/BreakingNewsTicker"
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: {
    default: 'Filmsvib | فيلم فيب - وجهتك السينمائية الأولى',
    template: '%s | Filmsvib'
  },
  description: 'منصتك الأولى لأخبار الأفلام والمسلسلات العالمية، مراجعات حصرية، واقتراحات مدعومة بالذكاء الاصطناعي.',
  keywords: ['أفلام', 'مسلسلات', 'أخبار السينما', 'مراجعات أفلام', 'ذكاء اصطناعي', 'فيلم فيب', 'Filmsvib'],
  authors: [{ name: 'Kamal Zaidi' }],
  openGraph: {
    title: 'Filmsvib | فيلم فيب',
    description: 'اكتشف عالم السينما بأبعاد جديدة مع Filmsvib.',
    url: 'https://filmsvib.com',
    siteName: 'Filmsvib',
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Filmsvib | فيلم فيب',
    description: 'منصتك الأولى لأخبار الأفلام والمسلسلات العالمية.',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#050507] text-white selection:bg-white/20 selection:text-white">
        <BreakingNewsTicker />
        <Navbar />
        <div className="pt-[7.5rem]">
          {children}
        </div>
        <Analytics />
        <Footer />
      </body>
    </html>
  )
}

