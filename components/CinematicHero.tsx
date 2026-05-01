'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function CinematicHero({ movie }: { movie: any }) {
  if (!movie) return null

  return (
    <div className="relative h-[85vh] w-full overflow-hidden border-b-2 border-[#d4af37]/20" dir="rtl">
      
      {/* ── BACKDROP ── */}
      <div className="absolute inset-0">
        <Image 
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      {/* ── CONTENT ── */}
      <div className="absolute inset-0 container mx-auto px-6 flex flex-col justify-center">
        <div className="max-w-3xl space-y-8">
           
           <div className="flex items-center gap-4 text-[#d4af37] font-bold text-xs uppercase tracking-widest">
              <span className="w-8 h-[2px] bg-[#d4af37]" />
              الآن في صالات العرض
           </div>

           <h1 className="text-6xl md:text-8xl font-black text-white leading-tight gold-text">
             {movie.title}
           </h1>

           <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl font-medium">
             {movie.overview}
           </p>

           <div className="flex items-center gap-6 pt-6">
              <Link href={`/movies/${movie.id}`} className="gold-button px-10 py-4 rounded text-sm font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all">
                التفاصيل الكاملة
              </Link>
              <button className="px-10 py-4 border-2 border-white/20 text-white font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                المقطع الدعائي
              </button>
           </div>

        </div>
      </div>

      {/* DECOR */}
      <div className="absolute bottom-10 right-10 flex flex-col items-end gap-2">
         <span className="text-[10px] font-black text-[#d4af37] tracking-[10px] uppercase">Cinema Intel</span>
         <div className="w-20 h-1 bg-[#d4af37]" />
      </div>

    </div>
  )
}
