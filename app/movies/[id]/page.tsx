import Image from "next/image"
import Link from "next/link"
import { getMovieById } from "@/lib/tmdb"
import { notFound } from "next/navigation"

export default async function MovieDetailsPage({ params }: { params: { id: string } }) {
  const movie = await getMovieById(params.id)
  if (!movie) return notFound()

  return (
    <main className="min-h-screen bg-[#050507] text-white marble-bg" dir="rtl">
      
      {/* ── SECTION 1: IMMERSIVE HERO ── */}
      <section className="relative h-[85vh] w-full flex flex-col justify-end pb-24 px-8 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover opacity-40 animate-hero-zoom"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 space-y-10 max-w-6xl">
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-gold-light rounded-full shadow-[0_0_10px_rgba(212,175,55,1)]" />
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold-light">استخبارات الهدف</span>
              </div>
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 border border-gold-dark/20 rounded-md">
                 <span className="text-gold-light text-xl">★</span>
                 <span className="text-2xl font-black">{(movie.vote_average || 0).toFixed(1)}</span>
              </div>
           </div>

           <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter uppercase leading-[0.8] gold-gradient-text drop-shadow-2xl">
             {movie.title}
           </h1>

           <div className="flex flex-wrap items-center gap-10 pt-8">
              <button className="bg-gradient-to-r from-gold-dark to-gold-light text-black px-16 py-7 rounded-sm font-black uppercase tracking-[0.3em] text-[10px] hover:scale-105 transition-all shadow-2xl">
                مشاهدة الإعلان الرسمي
              </button>
              <div className="flex gap-16 border-r border-gold-dark/20 pr-16 py-2">
                 <div className="space-y-2">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">تاريخ الإصدار</p>
                    <p className="text-sm font-black uppercase tracking-widest">{movie.release_date}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">مدة العرض</p>
                    <p className="text-sm font-black uppercase tracking-widest">{movie.runtime} دقيقة</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ── SECTION 2: INTELLIGENCE TABS ── */}
      <section className="px-8 lg:px-20 -mt-20 relative z-20">
         <div className="bg-[#0a0a0c] gold-border rounded-sm p-5 flex flex-wrap gap-5 max-w-max backdrop-blur-3xl shadow-2xl mb-24">
            <button className="bg-gradient-to-r from-gold-dark to-gold-light text-black px-12 py-5 rounded-sm font-black uppercase tracking-widest text-[10px] shadow-xl">الاستخبارات</button>
            <button className="hover:bg-white/5 text-gray-500 px-12 py-5 rounded-sm font-black uppercase tracking-widest text-[10px] transition-all">آخر الأخبار</button>
            <button className="hover:bg-white/5 text-gray-500 px-12 py-5 rounded-sm font-black uppercase tracking-widest text-[10px] transition-all">أسرار مشفرة</button>
            <button className="hover:bg-white/5 text-gray-500 px-12 py-5 rounded-sm font-black uppercase tracking-widest text-[10px] transition-all">المواصفات</button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            
            {/* LEFT: MAIN CONTENT */}
            <div className="lg:col-span-8 space-y-20">
               <div className="space-y-10">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-px bg-gold-dark/30" />
                     <h2 className="text-4xl font-black uppercase tracking-tight gold-gradient-text">الإيجاز الاستخباراتي</h2>
                  </div>
                  <div className="prose prose-invert prose-2xl max-w-none text-gray-400 font-bold leading-relaxed border-r-4 border-gold-dark/20 pr-10">
                     <p className="first-letter:text-8xl first-letter:font-black first-letter:text-gold-light first-letter:ml-4 first-letter:float-right">
                       {movie.overview}
                     </p>
                  </div>
               </div>

               {/* SECRETS / EASTER EGGS */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-16">
                  <div className="bg-[#08080a] gold-border p-12 rounded-sm space-y-8 group hover:bg-gold-dark/5 transition-all duration-500">
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold-light">كود سري #01</span>
                     <h4 className="text-2xl font-black uppercase text-white">نمط بصري خفي</h4>
                     <p className="text-gray-500 text-sm font-bold leading-relaxed">تحليلنا يشير إلى وجود تكرار خفي لنمط بصري في كل مشهد يظهر فيه البطل، يرمز إلى حالة التشتت الذهني العميقة.</p>
                  </div>
                  <div className="bg-[#08080a] gold-border p-12 rounded-sm space-y-8 group hover:bg-gold-dark/5 transition-all duration-500">
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold-light">كود سري #02</span>
                     <h4 className="text-2xl font-black uppercase text-white">قرار إخراجي</h4>
                     <p className="text-gray-500 text-sm font-bold leading-relaxed">المخرج اختار استخدام عدسات كلاسيكية نادرة في مشاهد معينة لتعزيز شعور الحنين إلى الماضي السينمائي الذهبي.</p>
                  </div>
               </div>
            </div>

            {/* RIGHT: DATA PANEL */}
            <div className="lg:col-span-4 space-y-16">
               <div className="bg-[#08080a] gold-border p-12 rounded-sm space-y-16 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-dark to-transparent" />
                  <h3 className="text-2xl font-black uppercase tracking-tighter border-b border-gold-dark/10 pb-8 gold-gradient-text">مواصفات الإنتاج</h3>
                  
                  <div className="space-y-10">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">الحالة التشغيلية</span>
                        <span className="text-xs font-black uppercase text-green-500">مكتمل / جاهز</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">الميزانية</span>
                        <span className="text-xs font-black uppercase text-white">${((movie.budget || 0) / 1000000).toFixed(1)} مليون</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">الإيرادات</span>
                        <span className="text-xs font-black uppercase text-gold-light">${((movie.revenue || 0) / 1000000).toFixed(1)} مليون</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">اللغة الأصلية</span>
                        <span className="text-xs font-black uppercase text-white">{movie.original_language?.toUpperCase()}</span>
                     </div>
                  </div>

                  <button className="w-full bg-white text-black py-6 rounded-sm font-black uppercase tracking-widest text-[10px] hover:bg-gold-light hover:text-black transition-all shadow-2xl">
                    طلب التقرير الكامل
                  </button>
               </div>
            </div>

         </div>
      </section>

      {/* ── SECTION 3: SIMILAR ENTITIES ── */}
      <section className="py-40 px-8 lg:px-20 space-y-16">
         <div className="flex items-center gap-6">
            <h2 className="text-4xl font-black uppercase tracking-tight gold-gradient-text">ملفات استخباراتية مشابهة</h2>
            <div className="flex-1 h-px bg-gold-dark/10" />
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 opacity-60">
            <p className="text-gray-700 text-[10px] font-black uppercase tracking-widest italic animate-pulse">جاري مسح الأرشيف بحثاً عن تطابقات...</p>
         </div>
      </section>

    </main>
  )
}
