'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function MovieCard({ movie }: { movie: any }) {
  if (!movie) return null

  return (
    <div className="news-card group relative flex flex-col rounded-sm overflow-hidden" dir="rtl">
      
      {/* ── IMAGE ── */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-[#d4af37] text-black px-3 py-1 text-[10px] font-black">
          خبر حصرى
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="p-6 space-y-4">
         <div className="flex justify-between items-center text-[10px] font-bold text-[#d4af37]">
            <span>تقييم {(movie.vote_average || 0).toFixed(1)}</span>
            <span>{movie.release_date?.split('-')[0]}</span>
         </div>
         <h3 className="text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors line-clamp-1">
           {movie.title}
         </h3>
         <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
           {movie.overview}
         </p>
         <Link href={`/movies/${movie.id}`} className="inline-block text-[#d4af37] text-[10px] font-black uppercase tracking-widest border-b border-[#d4af37]/30 pb-1 hover:border-[#d4af37]">
            قراءة المزيد
         </Link>
      </div>

      {/* DECOR */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}
