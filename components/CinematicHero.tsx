'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function CinematicHero({ movie }: { movie: any }) {
  if (!movie) return null

  return (
    <div className="relative h-[90vh] w-full overflow-hidden" dir="rtl">
      
      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0">
        <Image 
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover opacity-70 scale-105 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-transparent to-transparent" />
      </div>

      {/* ── CONTENT ── */}
      <div className="absolute inset-0 container mx-auto px-6 lg:px-12 flex flex-col justify-center">
        <div className="max-w-4xl space-y-10">
           
           <div className="flex items-center gap-4 text-indigo-400 font-bold text-xs uppercase tracking-[8px]">
              <span className="w-12 h-[1px] bg-indigo-500" />
              عرض ملكي حصري
           </div>

           <h1 className="text-6xl md:text-9xl font-black text-white leading-[1.1] tracking-tighter purple-glow-text">
             {movie.title}
           </h1>

           <p className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-2xl font-medium">
             {movie.overview}
           </p>

           <div className="flex items-center gap-8 pt-8">
              <Link href={`/movies/${movie.id}`} className="royal-button px-12 py-5 rounded-full text-sm font-bold tracking-widest uppercase">
                مشاهدة التفاصيل
              </Link>
              <button className="px-12 py-5 rounded-full border border-white/20 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
                المقطع الدعائي
              </button>
           </div>

        </div>
      </div>

      {/* OVERLAY DECOR */}
      <div className="absolute bottom-12 right-12 hidden md:block">
         <div className="p-6 glass-panel rounded-3xl flex flex-col items-center gap-2">
            <span className="text-indigo-400 font-black text-2xl">{(movie.vote_average || 0).toFixed(1)}</span>
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">IMDB Rating</span>
         </div>
      </div>

    </div>
  )
}
