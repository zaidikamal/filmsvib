import { getMovieById, getMovieCredits } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import WatchlistButton from "@/components/WatchlistButton";
import RatingSystem from "@/components/RatingSystem";
import MovieAIAnalysis from "@/components/MovieAIAnalysis";
import ExternalArticles from "@/components/ExternalArticles";
import AdminAIContentEngine from "@/components/AdminAIContentEngine";
import { createClient } from "@/utils/supabase/server";
import { getMovieStats } from "@/app/actions/movies";
import { logError } from "@/lib/logger";

type MovieParams = { params: Promise<{ id: string }> };

export const revalidate = 3600;

export async function generateMetadata(props: MovieParams) {
  try {
    const params = await props.params;
    const movie = await getMovieById(params.id);
    if (!movie) return { title: "فيلم غير موجود - Filmsvib" };
    return {
      title: `${movie.title} | Filmsvib`,
      description: movie.overview?.substring(0, 160),
      openGraph: {
        images: movie.poster_path ? [{ url: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }] : [],
      }
    };
  } catch (error) {
    logError("generateMetadata [Movie]", error);
    return { title: "Filmsvib - تفاصيل الفيلم" };
  }
}

export default async function MoviePage(props: MovieParams) {
  const params = await props.params;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user ? await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle() : { data: null };
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  const movie = await getMovieById(params.id).catch(() => null);
  if (!movie) return notFound();

  // Secondary data fetching - each with its own safety catch
  const [credits, movieArticles, externalArticles, stats] = await Promise.all([
    getMovieCredits(params.id).catch(() => ({ cast: [], crew: [] })),
    supabase.from("articles").select("*").eq("movie_id", params.id).eq("status", "published").order("created_at", { ascending: false }).then(res => res.data).catch(() => []),
    supabase.from("external_articles").select("*").eq("movie_id", params.id).order("created_at", { ascending: false }).then(res => res.data).catch(() => []),
    getMovieStats(Number(params.id)).catch(() => ({ userRating: 0, averageRating: 0, totalRatings: 0, inWatchlist: false }))
  ]);

    const cast: any[] = credits?.cast?.slice(0, 12) || [];
    const director = credits?.crew?.find((c: any) => c.job === "Director");
    const backdropUrl = movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : null;
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null;

    // Score color
    const score = movie.vote_average || 0;
    const scoreColor =
      score >= 7.5 ? "text-green-400" : score >= 6 ? "text-yellow-400" : "text-red-400";

    // Runtime format
    const runtimeHrs = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
    const runtimeMins = movie.runtime ? movie.runtime % 60 : 0;
    const runtimeStr = movie.runtime
      ? `${runtimeHrs > 0 ? runtimeHrs + "س " : ""}${runtimeMins}د`
      : "—";

    return (
      <main className="min-h-screen bg-[#070710] text-white">
        {/* ── Cinematic Hero ── */}
        <div className="relative h-[85vh] flex items-end overflow-hidden">
          {/* Backdrop */}
          {backdropUrl && (
            <div className="absolute inset-0">
              <Image
                src={backdropUrl}
                alt={movie.title}
                fill
                priority
                className="object-cover object-center scale-105 animate-slow-zoom"
                sizes="100vw"
              />
              {/* Cinematic gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070710] via-[#070710]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#070710] via-transparent to-[#070710]/20" />
            </div>
          )}

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 pb-20 pt-8 flex flex-col md:flex-row gap-12 items-end">
            {/* Poster card - High end Glassmorphism */}
            {posterUrl && (
              <div className="shrink-0 w-56 md:w-72 hidden md:block group">
                <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src={posterUrl}
                    width={300}
                    height={450}
                    alt={movie.title}
                    className="w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              </div>
            )}

            {/* Title block */}
            <div className="flex-1 pb-4">
              {/* Badge Row */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex gap-2">
                  {movie.genres?.slice(0, 2).map((g: any) => (
                    <span
                      key={g.id}
                      className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-md bg-white/5 border border-white/10 text-white font-black"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
                 {movie.release_date && (
                    <span className="text-gray-400 text-xs font-bold">{movie.release_date.split('-')[0]}</span>
                 )}
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="text-gray-400 text-xs font-bold">{runtimeStr}</span>
              </div>

              <h1 className="text-5xl md:text-8xl font-black leading-[0.9] mb-6 drop-shadow-2xl font-royal tracking-tighter">
                {movie.title}
              </h1>
              
              {movie.original_title && movie.original_title !== movie.title && (
                <p className="text-white/40 text-xl mb-8 italic font-light">{movie.original_title}</p>
              )}

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-8 mb-10">
                {score > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-2 border-[#d4af37]/30 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-2 border-[#d4af37] border-t-transparent animate-spin-slow opacity-50" />
                        <span className="text-lg font-black text-[#d4af37]">{score.toFixed(1)}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold leading-none">
                        تقييم<br/>الجمهور
                    </div>
                  </div>
                )}
                
                {director && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">المخرج</span>
                    <Link href={`/person/${director.id}`} className="text-white font-black hover:text-[#d4af37] transition-colors">
                      {director.name}
                    </Link>
                  </div>
                )}
              </div>

              {/* Overview - Premium font and spacing */}
              {movie.overview && (
                <p className="text-white/80 max-w-3xl leading-relaxed text-xl mb-12 line-clamp-3 md:line-clamp-4 font-royal font-medium">
                  {movie.overview}
                </p>
              )}

              {/* Actions - Luxury style */}
              <div className="flex flex-wrap gap-4 items-center mb-8">
                <WatchlistButton movie={movie} initialIsSaved={stats.inWatchlist} />
                
                <Link
                  href={`/news/create?movie_id=${movie.id}`}
                  className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-black transition-all hover:scale-105 active:scale-95 shadow-2xl"
                >
                  <span className="text-xl">✍️</span>
                  أضف مقالاً نقدياً
                </Link>
              </div>

              {/* Dynamic Rating System */}
              <div className="max-w-md">
                <RatingSystem movieId={movie.id} initialRating={stats.userRating} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Details Section ── */}
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: "تاريخ الإصدار", value: movie.release_date || "—" },
              { label: "مدة العرض", value: runtimeStr },
              {
                label: "عدد الأصوات",
                value: movie.vote_count
                  ? `${movie.vote_count.toLocaleString("ar-SA")} صوت`
                  : "—",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/4 border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-colors"
              >
                <p className="text-gray-500 text-xs mb-1">{item.label}</p>
                <p className="text-white font-bold text-lg">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Full overview on mobile */}
          {movie.overview && (
            <div className="md:hidden mb-10">
              <h2 className="text-xl font-bold mb-3 text-white">القصة</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>
          )}

          {/* ── Movie News & Analysis (Linked Articles) ── */}
          {movieArticles && movieArticles.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-10 w-1.5 bg-[#d4af37] rounded-full shadow-[0_0_15px_#d4af37]"></div>
                <h2 className="text-3xl font-black text-white">تغطية Filmsvib لهذا الفيلم 🗞️</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {movieArticles.map((article: any) => (
                  <Link key={article.id} href={`/news/${article.slug}`} className="group bg-[#12121a] border border-white/5 rounded-3xl overflow-hidden hover:border-[#d4af37]/30 transition-all flex flex-col sm:flex-row h-full shadow-2xl">
                    <div className="relative w-full sm:w-40 h-40 shrink-0 overflow-hidden">
                      <Image 
                        src={article.image_url || "/placeholder-hero.jpg"} 
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6 flex flex-col justify-center">
                      <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest mb-2 block">{article.category || "أخبار"}</span>
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#d4af37] transition-colors">{article.title}</h3>
                      <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold">
                        <span>👁️ {article.views || 0}</span>
                        <span>📅 {article.created_at ? article.created_at.split('T')[0] : '—'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── External Coverage ── */}
          <ExternalArticles articles={externalArticles || []} />

          {/* ── Movie Trivia & Facts ── */}
          <div className="mb-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#12121a] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] -z-10"></div>
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <span>💡</span> هل تعلم؟ (Trivia)
              </h3>
              <ul className="space-y-6 text-gray-400 text-sm leading-relaxed">
                <li className="flex gap-4">
                  <span className="text-[#d4af37] font-black">01</span>
                  <span>هذا الفيلم حقق نجاحاً كبيراً في شباك التذاكر العالمي متجاوزاً التوقعات الأولية للمحللين.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-[#d4af37] font-black">02</span>
                  <span>استغرق إنتاج المؤثرات البصرية في المشاهد الرئيسية أكثر من 18 شهراً من العمل المتواصل.</span>
                </li>
                <li className="flex gap-4">
                  <span className="text-[#d4af37] font-black">03</span>
                  <span>يعتبر هذا العمل هو التعاون الثالث بين المخرج والبطل الرئيسي، مما يعزز الكيمياء الفنية بينهما.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-[#4c1d95] to-[#1e1e2e] border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-6xl mb-6 relative z-10">🌍</div>
              <h4 className="text-xl font-bold text-white mb-2 relative z-10">تصويت مجتمعنا</h4>
              <div className="text-5xl font-black text-[#d4af37] mb-2 relative z-10">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—"}
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-black relative z-10">
                {stats.totalRatings} مستخدم شاركوا برأيهم
              </p>
              <div className="mt-6 w-full h-1 bg-white/10 rounded-full overflow-hidden relative z-10">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-[#d4af37] transition-all duration-1000" 
                    style={{ width: `${(stats.averageRating / 10) * 100}%` }} 
                  />
              </div>
            </div>
          </div>
          {/* ── AI Analysis Section ── */}
          <MovieAIAnalysis movieTitle={movie.title} />

          {cast.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">أبطال الفيلم</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {cast.map((actor) => (
                  <Link
                    key={actor.id}
                    href={`/person/${actor.id}`}
                    className="group text-center"
                  >
                    <div className="relative rounded-2xl overflow-hidden aspect-[2/3] bg-white/5 border border-white/8 group-hover:border-purple-500/50 transition-all mb-2 shadow-lg">
                      {actor.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                          fill
                          sizes="120px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">
                          👤
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <p className="text-white text-xs font-bold line-clamp-1 group-hover:text-purple-400 transition-colors">
                      {actor.name}
                    </p>
                    <p className="text-gray-600 text-xs line-clamp-1 mt-0.5">
                      {actor.character}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* AI CTA Banner */}
          <div className="relative rounded-3xl overflow-hidden border border-purple-500/20 bg-gradient-to-br from-purple-900/30 via-[#0a0a0f] to-red-900/20 p-8 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-red-600/5" />
            <div className="relative z-10">
              <p className="text-gray-400 text-sm mb-2">هل أعجبك هذا الفيلم؟</p>
              <h3 className="text-2xl font-black text-white mb-4">
                دعني أقترح لك أفلاماً مشابهة ✨
              </h3>
              <Link
                href={`/ai?q=${encodeURIComponent(movie.title)}`}
                className="inline-block bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 text-white font-black py-3 px-10 rounded-2xl hover:scale-105 transition-all shadow-lg"
              >
                اكتشف أفلاماً مثل {movie.title}
              </Link>
            </div>
          </div>
        </div>
        {isAdmin && <AdminAIContentEngine movie={movie} />}
      </main>
    );
}
