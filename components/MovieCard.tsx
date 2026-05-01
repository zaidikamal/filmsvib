'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function MovieCard({ movie }: { movie: any }) {
  if (!movie) return null

  return (
    <div className="glass-card group relative aspect-[2/3] w-full rounded-[2.5rem] overflow-hidden" dir="rtl">
      
      {/* ── IMAGE ── */}
      <Image 
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        fill
        className="object-cover transition-all duration-1000 grayscale group-hover:grayscale-0 scale-105 group-hover:scale-110"
      />

      {/* ── GLASS OVERLAY ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/10 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
      
      {/* ── CONTENT (HIDDEN TILL HOVER) ── */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-10 translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
         <div className="glass-island p-8 rounded-[2rem] space-y-6">
            <div className="flex justify-between items-center">
               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">ملف استخباراتي</span>
               <div className="bg-white/10 px-3 py-1 rounded-full text-[9px] font-black">
                 {(movie.vote_average || 0).toFixed(1)}
               </div>
            </div>
            
            <h3 className="text-2xl font-bold tracking-tight leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-rose-400 transition-all">
              {movie.title}
            </h3>

            <Link href={`/movies/${movie.id}`} className="block w-full bg-white text-black text-center py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all shadow-xl">
               فتح البيانات
            </Link>
         </div>
      </div>

      {/* ── STATIC DECOR ── */}
      <div className="absolute top-8 right-8 z-10 w-3 h-3 rounded-full bg-rose-500/50 blur-[2px] animate-pulse" />
      
      {/* ── TITLE (STATIC) ── */}
      <div className="absolute bottom-10 left-10 right-10 z-10 group-hover:opacity-0 transition-opacity duration-500">
         <h3 className="text-2xl font-bold tracking-tight text-white/90 truncate">{movie.title}</h3>
      </div>
    </div>
  )
}
