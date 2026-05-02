"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import WatchlistButton from "./WatchlistButton"
import { createClient } from "@/utils/supabase/client"
import { useState, useEffect } from "react"

export default function CinematicHero({ movie }: { movie: any }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        const superAdminEmail = "fr.capsules20@gmail.com"
        if (profile?.role === "admin" || profile?.role === "super_admin" || user.email === superAdminEmail) {
          setIsAdmin(true)
        }
      }
    }
    checkAdmin()
  }, [])

  if (!movie) return null;

  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`

  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
      
      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-[#050505]/80 z-10" />
        <div className="absolute inset-0 bg-[#4c1d95]/10 mix-blend-overlay z-10" />
        <img 
          src={backdropUrl} 
          alt={movie.title || "Cinematic Background"}
          className="w-full h-full object-cover animate-hero-zoom opacity-50"
        />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-20 text-center px-6 max-w-5xl" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
            فيلم الواجهة المختار
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter gold-text-glow">
            {movie.title || movie.name}
          </h1>
          <p className="text-lg md:text-xl text-white mb-12 max-w-3xl mx-auto font-royal leading-relaxed line-clamp-3">
            {movie.overview}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
            <Link href={`/movie/${movie.id}`} className="btn-royal-gold px-12 py-4 hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] flex items-center justify-center min-w-[220px]">
              عرض التفاصيل الملكية
            </Link>
            
            <Link href="/news/create" className="px-10 py-4 rounded-full border border-white/20 bg-white/5 text-white font-black hover:bg-white hover:text-black transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 min-w-[220px]">
              <span>✍️</span>
              أكتب مقالاً سينمائياً
            </Link>

            <WatchlistButton movie={movie} variant="outline" />

            {isAdmin && (
              <Link href={`/admin/articles/create?movie_id=${movie.id}`} className="px-8 py-3 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/5 text-[#d4af37] font-bold hover:bg-[#d4af37] hover:text-black transition-all flex items-center justify-center gap-2">
                <span>🛠️</span>
                تعديل معلومات الفلم
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[9px] uppercase tracking-[3px] text-white/40 font-bold">استكشف</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#d4af37] to-transparent"></div>
      </motion.div>

      {/* ── BOTTOM DECOR ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-20" />
    </section>
  )
}
