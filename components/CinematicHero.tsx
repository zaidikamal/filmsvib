'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function CinematicHero({ movie }: { movie: any }) {
  if (!movie) return null

  return (
    <section className="relative h-screen w-full flex flex-col justify-end pb-32 px-8 lg:px-20 overflow-hidden">
      
      {/* ── BACKGROUND (IMMERSIVE) ── */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover animate-hero-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-transparent to-transparent" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* ── CONTENT (FOCUS) ── */}
      <div className="relative z-10 max-w-5xl space-y-8 animate-fade-in-up">
        <div className="flex items-center gap-4">
           <span className="bg-purple-600/20 text-purple-400 border border-purple-500/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Featured Report</span>
           <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
             <div className="w-1 h-1 bg-gray-500 rounded-full" />
             AI Intelligence Rank: Critical
           </span>
        </div>

        <h1 className="cinematic-title premium-gradient-text">
          {movie.title}
        </h1>

        <p className="text-gray-300 text-xl md:text-2xl font-bold max-w-2xl leading-relaxed">
          {movie.overview?.length > 180 ? movie.overview.substring(0, 180) + '...' : movie.overview}
        </p>

        <div className="flex flex-wrap items-center gap-8 pt-4">
          <Link href={`/movies/${movie.id}`} className="bg-white text-black px-12 py-6 rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-purple-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-purple-500/20">
            Analyze Intel
          </Link>
          <button className="bg-white/5 backdrop-blur-xl border border-white/10 text-white px-12 py-6 rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/10 transition-all">
            Watch Archive
          </button>
        </div>
      </div>

      {/* ── STATUS BAR (BOTTOM) ── */}
      <div className="absolute bottom-10 left-8 lg:left-20 right-8 lg:right-20 flex justify-between items-center z-20 border-t border-white/5 pt-8">
         <div className="flex gap-12">
            <div className="space-y-1">
               <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Global Status</p>
               <p className="text-xs font-black uppercase tracking-widest text-green-500 animate-pulse">● Operational</p>
            </div>
            <div className="space-y-1">
               <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Intelligence Data</p>
               <p className="text-xs font-black uppercase tracking-widest">9.4 PB Verified</p>
            </div>
         </div>
         <div className="hidden md:flex gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
         </div>
      </div>
    </section>
  )
}
