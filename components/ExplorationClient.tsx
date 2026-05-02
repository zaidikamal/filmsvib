'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ExplorationClient({ movies }: { movies: any[] }) {
  const [activeBg, setActiveBg] = useState<string | null>(movies[0]?.backdrop_path)

  return (
    <div className="relative min-h-screen bg-[#050507]">
      
      {/* ── DYNAMIC BACKDROP (IMMERSIVE) ── */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/80 z-10 backdrop-blur-sm" />
        {activeBg && (
          <Image 
            src={`https://image.tmdb.org/t/p/original${activeBg}`}
            alt="Backdrop"
            fill
            className="object-cover opacity-30 transition-opacity duration-1000 animate-hero-zoom"
            priority
          />
        )}
      </div>

      <div className="relative z-10 pt-6 px-8 lg:px-20 pb-40">
        
        {/* ── HEADER (WORLD-CLASS) ── */}
        <div className="max-w-4xl mb-32 space-y-8 animate-fade-in-up">
           <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#d4af37]">أرشيف الأفلام العالمية</span>
           <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter leading-[0.8] gold-text-glow royal-title uppercase">بوابة<br/>الاكتشاف</h1>
           <p className="text-gray-400 text-xl font-bold max-w-xl leading-relaxed">استكشف أرشيفنا الاستخباراتي الكامل. كل صورة هي بوابة لمعلومات معقدة وتحليلات فنية عميقة.</p>
        </div>

        {/* ── GRID WALL (REFINED) ── */}
        <div className="columns-1 sm:columns-2 lg:columns-4 xl:columns-5 gap-8 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {movies.map((movie) => (
            <Link 
              key={movie.id}
              href={`/movies/${movie.id}`}
              onMouseEnter={() => setActiveBg(movie.backdrop_path)}
              className="block relative break-inside-avoid rounded-[2rem] overflow-hidden border border-white/5 bg-white/5 group transform transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
            >
              <Image 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={500}
                height={750}
                className="w-full h-auto grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-end">
                 <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[8px] font-black text-[#d4af37] uppercase tracking-widest">رقم: {movie.id}</span>
                    <h3 className="text-xl font-black leading-tight uppercase tracking-tighter">{movie.title}</h3>
                 </div>
              </div>

              {/* Status Dot */}
              <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#d4af37] transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
