'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function MovieCard({ movie }: { movie: any }) {
  if (!movie) return null

  return (
    <div className="royal-card-item group relative flex flex-col h-full" dir="rtl">
      
      {/* POSTER */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Image 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* RATING */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-indigo-400">
          ★ {(movie.vote_average || 0).toFixed(1)}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
         <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
               <span>{movie.release_date?.split('-')[0]}</span>
               <span className="w-1 h-1 rounded-full bg-indigo-500/50" />
               <span>Official</span>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
              {movie.title}
            </h3>
         </div>
         
         <Link href={`/movies/${movie.id}`} className="inline-flex items-center gap-2 text-indigo-500 text-[11px] font-bold hover:gap-3 transition-all">
            استكشاف التفاصيل 
            <span className="text-lg">←</span>
         </Link>
      </div>

    </div>
  )
}
