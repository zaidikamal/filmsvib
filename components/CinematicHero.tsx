"use client"
import { motion } from "framer-motion"
import Link from "next/link"

export default function CinematicHero({ movie }: { movie: any }) {
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
          <p className="text-base md:text-lg text-white/70 mb-12 max-w-3xl mx-auto font-medium leading-relaxed line-clamp-3">
            {movie.overview}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
            <Link href={`/movie/${movie.id}`} className="btn-royal-gold w-full sm:w-auto hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] flex items-center justify-center">
              عرض التفاصيل الملكية
            </Link>
            <button className="px-10 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white hover:text-black transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              أضف للمفضلة
            </button>
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
