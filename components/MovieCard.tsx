'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function MovieCard({ movie }: { movie: any }) {
  if (!movie) return null

  return (
    <div className="royal-card group relative flex flex-col overflow-hidden" dir="rtl">
      
      {/* ── POSTER ── */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Image 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* RATING TAG */}
        <div className="absolute top-4 left-4 glass-panel px-3 py-1.5 rounded-xl text-[10px] font-bold text-indigo-400">
          ★ {(movie.vote_average || 0).toFixed(1)}
        </div>
      </div>

      {/* ── DETAILS ── */}
      <div className="p-5 space-y-3">
         <div className="flex items-center gap-2 text-[10px] font-bold text-white/40">
            <span>{movie.release_date?.split('-')[0]}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="uppercase">Exclusive</span>
         </div>
         <h3 className="text-lg font-bold text-white group-hover:purple-glow-text transition-all line-clamp-1">
           {movie.title}
         </h3>
         <Link href={`/movies/${movie.id}`} className="inline-flex items-center gap-2 text-indigo-400 text-[11px] font-bold hover:gap-4 transition-all">
            استكشاف التفاصيل 
            <span className="text-lg">←</span>
         </Link>
      </div>

    </div>
  )
}
