"use client"
import { motion } from "framer-motion"
import Link from "next/link"

interface NewsTickerProps {
  articles: any[]
}

export default function NewsTicker({ articles }: NewsTickerProps) {
  if (!articles || articles.length === 0) return null

  return (
    <div className="bg-[#d4af37]/10 border-y border-[#d4af37]/20 backdrop-blur-md py-3 overflow-hidden relative z-40" dir="rtl">
      <div className="container mx-auto px-4 flex items-center gap-6">
        <div className="shrink-0 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37]"></span>
          </span>
          <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest whitespace-nowrap">عاجل الآن</span>
        </div>
        
        <div className="flex-1 overflow-hidden relative h-6">
          <motion.div 
            className="flex gap-12 whitespace-nowrap absolute"
            animate={{ x: [0, -1000] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {/* Repeat items for seamless loop */}
            {[...articles, ...articles].map((article, i) => (
              <Link 
                key={`${article.id}-${i}`} 
                href={`/news/${article.slug}`}
                className="text-white/80 hover:text-[#d4af37] transition-colors text-xs font-bold flex items-center gap-4"
              >
                <span>{article.title}</span>
                <span className="text-white/20">•</span>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
