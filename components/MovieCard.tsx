'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function MovieCard({ movie }: { movie: any }) {
  if (!movie) return null

  return (
    <div className="group relative aspect-[2/3] w-full rounded-sm overflow-hidden border border-gold-dark/10 bg-[#0a0a0c] transition-all duration-700 hover:scale-[1.02] hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] gold-border-hover" dir="rtl">
      
      {/* ── POSTER ── */}
      <Image 
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        fill
        className="object-cover transition-all duration-1000 grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110"
      />

      {/* ── OVERLAY (CINEMATIC) ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-700 opacity-80 group-hover:opacity-100" />

      {/* ── CONTENT (STATIC) ── */}
      <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3 z-10 transition-transform duration-700 group-hover:-translate-y-24">
         <div className="flex items-center gap-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-gold-dark">المعرف: {movie.id || '---'}</span>
            <div className="w-1 h-1 bg-gold-dark/40 rounded-full" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gold-light">تقييم {(movie.vote_average || 0).toFixed(1)}</span>
         </div>
         <h3 className="text-2xl font-black uppercase tracking-tight leading-none group-hover:text-gold-light transition-colors">
           {movie.title}
         </h3>
      </div>

      {/* ── HOVER REVEAL (THE INTEL) ── */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-10 group-hover:translate-y-0 bg-gradient-to-t from-[#050507] via-black/40 to-transparent">
         <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-black/60 backdrop-blur-xl border border-gold-dark/20 p-3 rounded-sm flex flex-col items-center gap-1 group/btn hover:bg-gold-dark transition-all cursor-pointer">
               <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 group-hover/btn:text-black">مقال</span>
               <span className="text-[10px] font-bold group-hover/btn:text-black">تحليل</span>
            </div>
            <div className="bg-black/60 backdrop-blur-xl border border-gold-dark/20 p-3 rounded-sm flex flex-col items-center gap-1 group/btn hover:bg-gold-dark transition-all cursor-pointer">
               <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 group-hover/btn:text-black">استخبارات</span>
               <span className="text-[10px] font-bold group-hover/btn:text-black">أسرار</span>
            </div>
            <div className="bg-black/60 backdrop-blur-xl border border-gold-dark/20 p-3 rounded-sm flex flex-col items-center gap-1 group/btn hover:bg-gold-dark transition-all cursor-pointer col-span-2">
               <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 group-hover/btn:text-black">بث مباشر</span>
               <span className="text-[10px] font-bold group-hover/btn:text-black">نشرة الأخبار</span>
            </div>
         </div>
         <Link href={`/movies/${movie.id}`} className="w-full bg-white text-black py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] text-center hover:bg-gold-light transition-all">
            استكشاف الملف
          </Link>
      </div>

      {/* ── DECOR ── */}
      <div className="absolute top-6 left-6 z-10 w-2 h-2 rounded-full bg-gold-light/40 animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
    </div>
  )
}
