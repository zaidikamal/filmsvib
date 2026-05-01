'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function CinematicHero({ movie }: { movie: any }) {
  if (!movie) return null

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden" dir="rtl">
      
      {/* ── BACKGROUND LAYER (MESH) ── */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover opacity-30 scale-110 animate-hero-zoom blur-[2px]"
          priority
        />
        <div className="absolute inset-0 bg-[#030303]/60" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 blur-[150px] rounded-full floating" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/20 blur-[150px] rounded-full floating" style={{ animationDelay: '2s' }} />
      </div>

      {/* ── CONTENT (RADICAL) ── */}
      <div className="relative z-10 text-center px-6 max-w-6xl space-y-12 animate-fade-in">
        <div className="flex flex-col items-center gap-6">
           <span className="text-[10px] font-black uppercase tracking-[0.8em] text-indigo-400 bg-indigo-500/10 px-6 py-2 rounded-full border border-indigo-500/20">
             ملف الاستخبارات الرئيسي
           </span>
           <h1 className="hero-title text-center leading-[0.85] py-4">
             {movie.title}
           </h1>
        </div>

        <p className="text-white/60 text-xl md:text-3xl font-medium max-w-3xl mx-auto leading-relaxed">
          {movie.overview?.length > 150 ? movie.overview.substring(0, 150) + '...' : movie.overview}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-10 pt-10">
          <Link href={`/movies/${movie.id}`} className="btn-primary scale-110">
            تحليل التقرير الكامل
          </Link>
          <button className="text-sm font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all border-b border-white/10 pb-2 hover:border-indigo-500">
            مشاهدة العرض الحى
          </button>
        </div>
      </div>

      {/* ── STATUS INDICATORS ── */}
      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end z-20">
         <div className="space-y-2 border-r-2 border-indigo-500 pr-6">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">تاريخ التحقق</p>
            <p className="text-xs font-bold font-mono">01.05.2026 // INTEL</p>
         </div>
         <div className="flex gap-12">
            <div className="text-center">
               <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">التقييم العالمي</p>
               <p className="text-2xl font-black text-indigo-500">{(movie.vote_average || 0).toFixed(1)}</p>
            </div>
         </div>
      </div>
    </section>
  )
}
