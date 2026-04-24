import { getMovieById, getMovieCredits } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import WatchlistButton from "@/components/WatchlistButton";

type MovieParams = { params: { id: string } };

export const revalidate = 3600;

export default async function MoviePage({ params }: MovieParams) {
  try {
    const [movie, credits] = await Promise.all([
      getMovieById(params.id),
      getMovieCredits(params.id),
    ]);
    if (!movie) return notFound();

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
        <div className="relative min-h-[70vh] flex items-end">
          {/* Backdrop */}
          {backdropUrl && (
            <>
              <Image
                src={backdropUrl}
                alt={movie.title}
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
              {/* Cinematic gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070710] via-[#070710]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#070710]/90 via-transparent to-transparent" />
            </>
          )}

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 pb-12 pt-32 flex flex-col md:flex-row gap-8 items-end">
            {/* Poster card */}
            {posterUrl && (
              <div className="shrink-0 w-44 md:w-56 hidden md:block">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10">
                  <Image
                    src={posterUrl}
                    width={224}
                    height={336}
                    alt={movie.title}
                    className="w-full"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
                </div>
              </div>
            )}

            {/* Title block */}
            <div className="flex-1 pb-2">
              {/* Genres */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {movie.genres?.slice(0, 3).map((g: any) => (
                  <span
                    key={g.id}
                    className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-medium"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-6xl font-black leading-tight mb-3 drop-shadow-2xl">
                {movie.title}
              </h1>
              {movie.original_title && movie.original_title !== movie.title && (
                <p className="text-gray-400 text-lg mb-4 italic">{movie.original_title}</p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                {movie.release_date && (
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                )}
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span>{runtimeStr}</span>
                {score > 0 && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span className={`font-black text-base ${scoreColor}`}>
                      ⭐ {score.toFixed(1)}
                      <span className="text-gray-600 font-normal text-xs"> /10</span>
                    </span>
                  </>
                )}
                {director && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <Link href={`/person/${director.id}`} className="hover:text-white transition-colors">
                      🎬 {director.name}
                    </Link>
                  </>
                )}
              </div>

              {/* Overview */}
              {movie.overview && (
                <p className="text-gray-300 max-w-2xl leading-relaxed text-base mb-8 line-clamp-3 md:line-clamp-none">
                  {movie.overview}
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 items-center">
                <WatchlistButton movie={movie} />
                <Link
                  href="/ai"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 hover:border-purple-500/50 text-sm font-bold transition-all"
                >
                  ✨ اقتراح مشابه
                </Link>
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

          {/* ── Cast ── */}
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
      </main>
    );
  } catch {
    return notFound();
  }
}
