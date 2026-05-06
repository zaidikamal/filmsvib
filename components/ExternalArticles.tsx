import Image from "next/image";
import Link from "next/link";

export default function ExternalArticles({ articles }: { articles: any[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="mb-20">
      <div className="flex items-center gap-4 mb-10">
        <div className="h-10 w-1.5 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]"></div>
        <h2 className="text-3xl font-black text-white">من حول العالم 🌏</h2>
        <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-400">مقالات خارجية</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#0a0a0f] border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all shadow-xl"
          >
            {article.image_url && (
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] font-black bg-blue-600 px-2 py-0.5 rounded text-white uppercase tracking-tighter">
                    {article.source_name}
                  </span>
                </div>
              </div>
            )}
            <div className="p-5">
              <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                  {article.excerpt}
                </p>
              )}

              {article.expert_commentary && (
                <div className="mb-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 relative">
                  <div className="absolute -top-2 -right-2 bg-purple-600 text-[8px] font-black px-2 py-0.5 rounded shadow-lg uppercase">Filmsvib Insight</div>
                  <p className="text-[10px] text-purple-300 italic leading-snug">
                    "{article.expert_commentary}"
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                <span className="text-[10px] text-gray-600 font-bold">
                  {new Date(article.created_at).toLocaleDateString("ar-SA")}
                </span>
                <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                  اقرأ المزيد <span>←</span>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
