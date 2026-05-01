'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function CinematicHero({ movie }: { movie: any }) {
  if (!movie) return null

  return (
    <section className="relative h-[90vh] w-full flex flex-col justify-end pb-24 px-8 lg:px-24 overflow-hidden" dir="rtl">
      
      {/* ── BACKGROUND (IMMERSIVE) ── */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover opacity-50 grayscale-[0.2]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-transparent to-transparent" />
        
        {/* SUBTLE ROYAL GLOW */}
        <div className="absolute bottom-0 right-0 w-full h-[40%] bg-gradient-to-t from-purple-900/20 to-transparent blur-3xl" />
      </div>

      {/* ── CONTENT (REFINED) ── */}
      <div className="relative z-10 max-w-4xl space-y-6">
        <div className="flex items-center gap-4 animate-fade-in">
           <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-purple-500 bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-500/20">
             ملف استخباراتي حصرى
           </span>
           <div className="h-px w-12 bg-white/10" />
           <span className="text-gray-500 text-[10px] font-medium uppercase tracking-widest">
             AI INTEL: VERIFIED
           </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] premium-gradient-text animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {movie.title}
        </h1>

        <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {movie.overview?.length > 150 ? movie.overview.substring(0, 150) + '...' : movie.overview}
        </p>

        <div className="flex flex-wrap items-center gap-6 pt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link href={`/movies/${movie.id}`} className="bg-white text-black px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95">
            فتح الملف السينمائي
          </Link>
          <button className="bg-white/5 backdrop-blur-2xl border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
            مشاهدة الإعلان
          </button>
        </div>
      </div>

      {/* ── SECTION DECOR ── */}
      <div className="absolute top-1/2 right-24 -translate-y-1/2 hidden xl:block">
         <div className="flex flex-col gap-8 items-end">
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent" />
            <span className="[writing-mode:vertical-rl] text-[9px] font-bold text-gray-700 uppercase tracking-[1em] py-4">CINEMATIC ARCHIVE 2026</span>
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent" />
         </div>
      </div>
    </section>
  )
}
