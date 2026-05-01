import Image from "next/image"
import Link from "next/link"
import { getMovieById } from "@/lib/tmdb"
import { notFound } from "next/navigation"

export default async function MovieDetailsPage({ params }: { params: { id: string } }) {
  const movie = await getMovieById(params.id)
  if (!movie) return notFound()

  return (
    <main className="min-h-screen bg-[#050507] text-white">
      
      {/* ── SECTION 1: IMMERSIVE HERO ── */}
      <section className="relative h-[85vh] w-full flex flex-col justify-end pb-24 px-8 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 space-y-8 max-w-5xl">
           <div className="flex items-center gap-6">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500">Subject Intelligence</span>
              <div className="flex items-center gap-2">
                 <span className="text-gold text-lg">★</span>
                 <span className="text-xl font-black">{(movie.vote_average || 0).toFixed(1)}</span>
              </div>
           </div>

           <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.8] premium-gradient-text">
             {movie.title}
           </h1>

           <div className="flex flex-wrap items-center gap-8 pt-6">
              <button className="bg-white text-black px-12 py-6 rounded-full font-black uppercase tracking-[0.3em] text-[10px] hover:bg-purple-600 hover:text-white transition-all shadow-2xl">
                Watch Trailer
              </button>
              <div className="flex gap-12 border-l border-white/10 pl-12 py-2">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Release Date</p>
                    <p className="text-sm font-black uppercase tracking-widest">{movie.release_date}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Runtime</p>
                    <p className="text-sm font-black uppercase tracking-widest">{movie.runtime}m</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ── SECTION 2: INTELLIGENCE TABS (THE CORE) ── */}
      <section className="px-8 lg:px-20 -mt-20 relative z-20">
         <div className="bg-[#0a0a0c] border border-white/10 rounded-[3rem] p-4 flex flex-wrap gap-4 max-w-max backdrop-blur-3xl shadow-2xl mb-24">
            <button className="bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl">The Intelligence</button>
            <button className="hover:bg-white/5 text-gray-500 px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] transition-all">Latest News</button>
            <button className="hover:bg-white/5 text-gray-500 px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] transition-all">Encrypted Secrets</button>
            <button className="hover:bg-white/5 text-gray-500 px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] transition-all">Specs</button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            
            {/* LEFT: MAIN CONTENT */}
            <div className="lg:col-span-8 space-y-16">
               <div className="space-y-8">
                  <h2 className="text-4xl font-black uppercase tracking-tight">Intelligence Briefing</h2>
                  <div className="prose prose-invert prose-lg max-w-none text-gray-400 font-bold leading-relaxed">
                     <p className="first-letter:text-7xl first-letter:font-black first-letter:text-purple-500 first-letter:mr-3 first-letter:float-left">
                       {movie.overview}
                     </p>
                     <p>
                        هذا الفيلم ليس مجرد تجربة بصرية، بل هو رحلة في عقل المبدعين. تحليلنا الاستخباراتي يشير إلى أن التوجه الفني هنا يعتمد على رمزيات عميقة تربط بين الواقع والخيال.
                     </p>
                  </div>
               </div>

               {/* SECRETS / EASTER EGGS */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
                  <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] space-y-6 group hover:bg-purple-600/10 transition-colors">
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500">Secret Code #01</span>
                     <h4 className="text-xl font-black uppercase">Hidden Visual Motif</h4>
                     <p className="text-gray-500 text-sm font-bold">هناك تكرار خفي لنمط بصري في كل مشهد يظهر فيه البطل، يرمز إلى حالة التشتت الذهني.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] space-y-6 group hover:bg-purple-600/10 transition-colors">
                     <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500">Secret Code #02</span>
                     <h4 className="text-xl font-black uppercase">Directorial Choice</h4>
                     <p className="text-gray-500 text-sm font-bold">المخرج اختار استخدام عدسات قديمة في مشاهد معينة لتعزيز شعور الحنين إلى الماضي.</p>
                  </div>
               </div>
            </div>

            {/* RIGHT: DATA PANEL */}
            <div className="lg:col-span-4 space-y-12">
               <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-12">
                  <h3 className="text-xl font-black uppercase tracking-tighter border-b border-white/5 pb-6">Production Specs</h3>
                  
                  <div className="space-y-8">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Status</span>
                        <span className="text-xs font-black uppercase text-green-500">Operational</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Budget</span>
                        <span className="text-xs font-black uppercase">${((movie.budget || 0) / 1000000).toFixed(1)}M</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Revenue</span>
                        <span className="text-xs font-black uppercase text-purple-400">${((movie.revenue || 0) / 1000000).toFixed(1)}M</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Language</span>
                        <span className="text-xs font-black uppercase">{movie.original_language}</span>
                     </div>
                  </div>

                  <button className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-purple-500 transition-all shadow-xl">
                    Request Full Report
                  </button>
               </div>
            </div>

         </div>
      </section>

      {/* ── SECTION 3: SIMILAR ENTITIES ── */}
      <section className="py-40 px-8 lg:px-20 space-y-16">
         <h2 className="text-4xl font-black uppercase tracking-tight border-b border-white/5 pb-10">Similar Intelligence Files</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 opacity-60">
            {/* We could map similar movies here if we fetch them */}
            <p className="text-gray-700 text-[10px] font-black uppercase tracking-widest">Scanning Archive for matches...</p>
         </div>
      </section>

    </main>
  )
}
