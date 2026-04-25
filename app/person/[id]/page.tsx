import { getPersonById, getPersonMovies } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 86400; // 24h cache

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const person = await getPersonById(params.id);
  if (!person) return { title: "شخص غير موجود" };
  return {
    title: `${person.name} | Filmsvib`,
    description: person.biography?.substring(0, 160) || `تفاصيل عن ${person.name}`,
  };
}

export default async function PersonPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [person, moviesData] = await Promise.all([
    getPersonById(params.id),
    getPersonMovies(params.id),
  ]);

  if (!person) return notFound();

  // Top known movies sorted by popularity
  const knownMovies: any[] = (moviesData?.cast || [])
    .filter((m: any) => m.poster_path)
    .sort((a: any, b: any) => b.popularity - a.popularity)
    .slice(0, 12);

  const profileUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/w400${person.profile_path}`
    : null;

  // Age calc
  const birthYear = person.birthday ? new Date(person.birthday).getFullYear() : null;
  const endYear = person.deathday
    ? new Date(person.deathday).getFullYear()
    : new Date().getFullYear();
  const age = birthYear ? endYear - birthYear : null;

  const genderMap: Record<number, string> = { 1: "أنثى", 2: "ذكر" };

  return (
    <main className="min-h-screen bg-[#070710] text-white pt-24 pb-20">
      {/* Minimal dark backdrop blur */}
      <div className="fixed inset-0 pointer-events-none">
        {profileUrl && (
          <Image
            src={profileUrl}
            alt=""
            fill
            className="object-cover object-top opacity-5 blur-3xl scale-110"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-[#070710]/90" />
      </div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">

        {/* ── Profile Header ── */}
        <div className="flex flex-col md:flex-row gap-10 mb-14">
          {/* Photo */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="relative w-52 h-72 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10">
              {profileUrl ? (
                <Image
                  src={profileUrl}
                  alt={person.name}
                  fill
                  sizes="208px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-6xl">👤</div>
              )}
              <div className="absolute inset-0 ring-1 ring-white/10 rounded-3xl" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Known for dept */}
            {person.known_for_department && (
              <div className="inline-flex w-fit items-center gap-1.5 bg-purple-500/15 border border-purple-500/30 px-3 py-1 rounded-full text-purple-300 text-xs font-bold mb-4">
                🎭 {person.known_for_department}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-black mb-2 leading-tight">
              {person.name}
            </h1>
            {person.also_known_as?.[0] && (
              <p className="text-gray-500 text-base italic mb-6">{person.also_known_as[0]}</p>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "تاريخ الميلاد", value: person.birthday || "—" },
                { label: "العمر", value: age ? `${age} سنة` : "—" },
                { label: "الجنس", value: genderMap[person.gender] || "—" },
                { label: "مكان الميلاد", value: person.place_of_birth || "—" },
              ].map((s) => (
                <div key={s.label} className="bg-white/4 border border-white/8 rounded-2xl p-3">
                  <p className="text-gray-500 text-xs mb-1">{s.label}</p>
                  <p className="text-white text-sm font-bold line-clamp-2">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Popularity */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="text-yellow-400 font-bold">🔥 {Math.round(person.popularity)}</span>
              <span>درجة الشهرة على TMDB</span>
            </div>
          </div>
        </div>

        {/* ── Biography ── */}
        {person.biography && (
          <div className="mb-14">
            <h2 className="text-2xl font-bold mb-4 text-white border-b border-white/10 pb-3">
              السيرة الذاتية
            </h2>
            <p className="text-gray-300 leading-relaxed text-base whitespace-pre-line">
              {person.biography}
            </p>
          </div>
        )}

        {/* ── Known Movies ── */}
        {knownMovies.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-3">
              أبرز أعماله السينمائية
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {knownMovies.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movie/${movie.id}`}
                  className="group text-center"
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-[2/3] bg-white/5 border border-white/8 group-hover:border-purple-500/50 transition-all mb-2 shadow-lg">
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      sizes="120px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {movie.vote_average > 0 && (
                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-yellow-400 text-xs font-bold">
                        ⭐ {movie.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <p className="text-white text-xs font-bold line-clamp-2 group-hover:text-purple-400 transition-colors leading-tight">
                    {movie.title}
                  </p>
                  {movie.release_date && (
                    <p className="text-gray-600 text-xs mt-0.5">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
