'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function MovieCard({ movie }: { movie: any }) {
  if (!movie) return null

  return (
    <div className="group relative aspect-[2/3] w-full rounded-3xl overflow-hidden border border-white/5 bg-white/5 transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] glow-purple">
      
      {/* ── POSTER ── */}
      <Image 
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        fill
        className="object-cover transition-all duration-1000 grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110"
      />

      {/* ── OVERLAY (CINEMATIC) ── */}
      <div className="absolute inset-0 movie-card-overlay transition-opacity duration-700 opacity-80 group-hover:opacity-100" />

      {/* ── CONTENT (STATIC) ── */}
      <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3 z-10 transition-transform duration-700 group-hover:-translate-y-24">
         <div className="flex items-center gap-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-purple-400">ID: {movie.id}</span>
            <div className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gold">{movie.vote_average.toFixed(1)} Rating</span>
         </div>
         <h3 className="text-2xl font-black uppercase tracking-tight leading-none group-hover:text-purple-400 transition-colors">
           {movie.title}
         </h3>
      </div>

      {/* ── HOVER REVEAL (THE INTEL) ── */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 reveal-on-hover bg-gradient-to-t from-[#050507] via-transparent to-transparent">
         <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex flex-col items-center gap-1 group/btn hover:bg-purple-600 transition-all cursor-pointer">
               <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 group-hover/btn:text-white">Article</span>
               <span className="text-[10px] font-bold">Analysis</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex flex-col items-center gap-1 group/btn hover:bg-purple-600 transition-all cursor-pointer">
               <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 group-hover/btn:text-white">Intel</span>
               <span className="text-[10px] font-bold">Secrets</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex flex-col items-center gap-1 group/btn hover:bg-purple-600 transition-all cursor-pointer col-span-2">
               <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 group-hover/btn:text-white">Live</span>
               <span className="text-[10px] font-bold">News Stream</span>
            </div>
         </div>
         <Link href={`/movies/${movie.id}`} className="w-full bg-white text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-center hover:bg-purple-600 hover:text-white transition-all">
            Explore Universe
          </Link>
      </div>

      {/* ── DECOR ── */}
      <div className="absolute top-6 right-6 z-10 w-2 h-2 rounded-full bg-white/20 animate-pulse" />
    </div>
  )
}
