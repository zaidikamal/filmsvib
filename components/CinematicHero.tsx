'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function CinematicHero({ movie }: { movie: any }) {
  if (!movie) return null

  return (
    <section className="relative h-screen w-full flex flex-col justify-end pb-32 px-8 lg:px-20 overflow-hidden" dir="rtl">
      
      {/* ── BACKGROUND (IMMERSIVE) ── */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover animate-hero-zoom opacity-60"
          priority
        />
        {/* ROYAL OVERLAYS */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-l from-[#050507] via-transparent to-transparent" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        
        {/* GOLDEN DUST PARTICLES (Simulated with orbs) */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gold-dark/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-red-900/10 blur-[100px] rounded-full" />
      </div>

      {/* ── CONTENT (FOCUS) ── */}
      <div className="relative z-10 max-w-5xl space-y-10 animate-fade-in-up">
        <div className="flex items-center gap-6">
           <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-dark to-gold-light rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
              <span className="relative bg-black/60 text-gold-light border border-gold-dark/30 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shimmer-gold">
                 تقرير ملكي خاص
              </span>
           </div>
           <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-gold-dark rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
              تصنيف الاستخبارات: حرج جداً
           </span>
        </div>

        <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter uppercase leading-[0.8] gold-gradient-text drop-shadow-2xl">
          {movie.title}
        </h1>

        <p className="text-gray-300 text-xl md:text-3xl font-bold max-w-3xl leading-relaxed border-r-4 border-gold-dark/40 pr-8">
          {movie.overview?.length > 200 ? movie.overview.substring(0, 200) + '...' : movie.overview}
        </p>

        <div className="flex flex-wrap items-center gap-8 pt-6">
          <Link href={`/movies/${movie.id}`} className="relative group">
             <div className="absolute -inset-1 bg-gold-light blur-md opacity-20 group-hover:opacity-60 transition duration-500"></div>
             <button className="relative bg-gradient-to-r from-gold-dark to-gold-light text-black px-16 py-7 rounded-sm font-black uppercase tracking-[0.3em] text-[10px] transform hover:scale-105 active:scale-95 transition-all shadow-2xl">
                تحليل البيانات
             </button>
          </Link>
          <button className="bg-white/5 backdrop-blur-xl border border-gold-dark/20 text-gold-light px-16 py-7 rounded-sm font-black uppercase tracking-[0.3em] text-[10px] hover:bg-gold-dark/10 transition-all">
             دخول الأرشيف
          </button>
        </div>
      </div>

      {/* ── STATUS BAR (BOTTOM) ── */}
      <div className="absolute bottom-10 left-8 lg:left-20 right-8 lg:right-20 flex justify-between items-center z-20 border-t border-gold-dark/10 pt-10">
         <div className="flex gap-16">
            <div className="space-y-2">
               <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">حالة النظام العالمي</p>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold-light animate-pulse shadow-[0_0_10px_rgba(212,175,55,1)]" />
                  <p className="text-xs font-black uppercase tracking-widest text-gold-light">تحت السيطرة</p>
               </div>
            </div>
            <div className="space-y-2">
               <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">مصادقة البيانات</p>
               <p className="text-xs font-black uppercase tracking-widest text-white italic">Oracle Verified</p>
            </div>
         </div>
         <div className="hidden lg:flex gap-6 items-center">
            <span className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em]">FILMSVIB INTEL UNIT</span>
            <div className="flex gap-3">
               <div className="w-12 h-px bg-gold-dark/10" />
               <div className="w-12 h-px bg-gold-dark/40" />
               <div className="w-12 h-px bg-gold-dark/10" />
            </div>
         </div>
      </div>
    </section>
  )
}
