import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import ArticleBookmarkButton from "@/components/ArticleBookmarkButton"
import ArticleViewTracker from "@/components/ArticleViewTracker"
import CommentSection from "./CommentSection"

export const revalidate = 60; // 1-minute caching for fresh news

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  const { data: article } = await supabase
    .from("articles")
    .select("title, content, image_url")
    .eq("slug", params.slug)
    .single()

  if (!article) return { title: "مقال غير موجود - Filmsvib" }

  const shortDesc = article.content.substring(0, 160).replace(/[#*`]/g, '');

  return {
    title: `${article.title} | Filmsvib`,
    description: shortDesc,
    openGraph: {
      title: article.title,
      description: shortDesc,
      images: article.image_url ? [{ url: article.image_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
    }
  }
}

export default async function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  
  // Fetch current article
  const { data: article } = await supabase
    .from("articles")
    .select(`
      *,
      author:author_id(email)
    `)
    .eq("slug", params.slug)
    .single()

  if (!article || !article.is_published) {
    return notFound()
  }

  // Fetch 3 related articles
  const { data: relatedArticles } = await supabase
    .from("articles")
    .select("id, title, slug, image_url, created_at, views")
    .eq("is_published", true)
    .neq("id", article.id)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <main className="min-h-screen pt-24 pb-16">
      <ArticleViewTracker articleId={article.id} />
      
      {/* Premium Hero Header */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        {article.image_url ? (
          <Image 
            src={article.image_url}
            alt={article.title}
            fill
            priority
            className="object-cover scale-105 animate-slow-zoom"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="container mx-auto max-w-4xl">
            <Link href="/news" className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#fef3c7] transition-colors text-sm font-bold mb-6 bg-[#d4af37]/10 px-4 py-2 rounded-full border border-[#d4af37]/20 backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              العودة للقسم
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
              {article.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-gray-300">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#4c1d95] border border-[#d4af37]/30 flex items-center justify-center font-bold text-[#d4af37]">
                    {article.author?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-bold">{article.author?.email?.split('@')[0] || 'كاتب'}</span>
               </div>
               <span>|</span>
               <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>
                    {article.created_at && !isNaN(new Date(article.created_at).getTime()) 
                      ? new Date(article.created_at).toLocaleDateString("ar-SA", { year: 'numeric', month: 'long', day: 'numeric' })
                      : '—'}
                  </span>
               </div>
               <span>|</span>
               <div className="flex items-center gap-2">
                  <span>👁️</span>
                  <span>{article.views || 0} مشاهدة</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-10 relative z-20">
        <article className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-16 border border-white/10 shadow-2xl">
          <div className="flex justify-end mb-8">
            <ArticleBookmarkButton articleId={article.id} />
          </div>

          <div className="prose prose-invert prose-lg max-w-none prose-p:leading-loose prose-headings:text-white prose-p:text-white/90 font-royal">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>

          {article.movie_id && (
            <div className="mt-16 p-8 bg-[#d4af37]/5 rounded-[2rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 group">
               <div className="text-right">
                  <h3 className="text-2xl font-black text-white mb-3">هل شاهدت هذا الفيلم؟ 🎬</h3>
                  <p className="text-gray-400">هذا المقال مرتبط بفيلم موجود في مكتبتنا. يمكنك الإطلاع على مراجعة الفيلم الكاملة وتقييمات الجمهور.</p>
               </div>
               <Link href={`/movie/${article.movie_id}`} className="bg-white text-black font-black py-4 px-10 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl whitespace-nowrap">
                  عرض الفيلم الآن
               </Link>
            </div>
          )}
        </article>

        {/* Related Articles Section */}
        {relatedArticles && relatedArticles.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
              <span className="w-2 h-10 bg-[#d4af37] shadow-[0_0_10px_#d4af37] rounded-full"></span>
              مقالات قد تهمك 🔥
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((rel: any) => (
                <Link href={`/news/${rel.slug}`} key={rel.id} className="group bg-white/[0.02] rounded-3xl overflow-hidden border border-white/5 hover:border-[#d4af37]/30 transition-all flex flex-col shadow-xl">
                  <div className="relative h-48 w-full bg-black/50 overflow-hidden">
                    <Image 
                      src={rel.image_url || "/placeholder-hero.jpg"}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-white text-lg mb-4 line-clamp-2 group-hover:text-[#d4af37] transition-colors">
                      {rel.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                        {rel.created_at && !isNaN(new Date(rel.created_at).getTime())
                          ? new Date(rel.created_at).toLocaleDateString("ar-SA")
                          : '—'}
                      </p>
                      <span className="text-xs text-[#d4af37] font-black">اقرأ المزيد</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <CommentSection articleId={article.id} />
      </div>
    </main>
  )
}
