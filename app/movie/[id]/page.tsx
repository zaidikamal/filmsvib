import { getMovieById } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import Image from "next/image";
import Hero from "@/components/Hero";
import WatchlistButton from "@/components/WatchlistButton";

type MovieParams = {
  params: { id: string }
};

export const revalidate = 3600; // Cache the page for 1 hour to prevent function limits 

export default async function MoviePage({ params }: MovieParams) {
  try {
    const movie = await getMovieById(params.id);
    
    if (!movie) {
      return notFound(); // Will return 404
    }

    return (
      <main className="min-h-screen">
        <Hero movie={movie} />
        <div className="container mx-auto px-4 py-16 text-white max-w-4xl">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {movie.poster_path && (
              <div className="w-full md:w-1/3 shrink-0">
                 <Image 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    width={500} 
                    height={750} 
                    alt={movie.title}
                    className="rounded-xl shadow-lg border border-white/10"
                    priority
                 />
              </div>
            )}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">القصة</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">{movie.overview || "لا توجد قصة متوفرة لهذا الفيلم."}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h3 className="text-gray-400 text-sm mb-1">التقييم</h3>
                  <p className="font-bold text-xl text-yellow-400">⭐ {movie.vote_average?.toFixed(1)} <span className="text-sm text-gray-500">/ 10</span></p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h3 className="text-gray-400 text-sm mb-1">تاريخ الإصدار</h3>
                  <p className="font-bold text-xl">{movie.release_date}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h3 className="text-gray-400 text-sm mb-1">مدة العرض</h3>
                  <p className="font-bold text-xl">{movie.runtime ? `${movie.runtime} دقيقة` : "غير متوفر"}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 col-span-2 md:col-span-1">
                  <h3 className="text-gray-400 text-sm mb-1">التصنيف</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {movie.genres?.map((g: any) => (
                      <span key={g.id} className="bg-purple-600/30 text-purple-200 text-xs px-2 py-1 rounded-full border border-purple-500/30">
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <WatchlistButton movie={movie} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    // If TMDB returns an error or invalid ID format that isn't cleanly 404
    return notFound();
  }
}
