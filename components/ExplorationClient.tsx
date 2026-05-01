'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ExplorationClient({ movies }: { movies: any[] }) {
  const [activeBg, setActiveBg] = useState<string | null>(movies[0]?.backdrop_path)

  return (
    <div className="relative min-h-screen transition-colors duration-1000 bg-[#050507]">
      
      {/* ── DYNAMIC BACKDROP (IMMERSIVE) ── */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10 backdrop-blur-sm" />
        {activeBg && (
          <Image 
            src={`https://image.tmdb.org/t/p/original${activeBg}`}
            alt="Backdrop"
            fill
            className="object-cover opacity-30 transition-opacity duration-1000 animate-fade-in"
            priority
          />
        )}
      </div>

      <div className="relative z-10 pt-40 px-8 lg:px-20">
        
        {/* ── HEADER ── */}
        <div className="max-w-4xl mb-24 space-y-6">
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500">The Vault Exploration</span>
           <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter leading-none premium-gradient-text uppercase">Cinema<br/>Discovery</h1>
           <p className="text-gray-400 text-xl font-bold max-w-xl leading-relaxed">تصفح أرشيف الاستخبارات السينمائية. كل صورة هي مدخل لعالم جديد من البيانات والتحليلات.</p>
        </div>

        {/* ── MASONRY WALL ── */}
        <div className="columns-2 md:columns-4 lg:columns-6 gap-6 space-y-6 pb-40">
          {movies.map((movie, idx) => (
            <Link 
              key={movie.id}
              href={`/movies/${movie.id}`}
              onMouseEnter={() => setActiveBg(movie.backdrop_path)}
              className="block relative break-inside-avoid rounded-2xl overflow-hidden border border-white/5 group transform transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <Image 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={500}
                height={750}
                className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                 <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Ref: {movie.id}</p>
                 <h3 className="text-lg font-black leading-tight uppercase">{movie.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
