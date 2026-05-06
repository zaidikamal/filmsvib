"use client";

import { useState } from "react";
import { generateAIArticleContent, addExternalArticle, createAdminArticle } from "@/app/actions/articles";
import { useRouter } from "next/navigation";

export default function AdminAIContentEngine({ movie }: { movie: any }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerateInternal = async () => {
    setLoading(true);
    setStatus("جاري التوليد والتحقق من الجودة...");
    try {
      const content = await generateAIArticleContent(movie.title);
      
      const score = content.confidenceScore * 100;
      const confirmMsg = `
        تم توليد المقال بنجاح!
        درجة الموثوقية (Confidence): ${score.toFixed(1)}%
        
        هل تريد معاينة المقال وحفظه كمسودة للمراجعة؟
      `;

      if (confirm(confirmMsg)) {
        await createAdminArticle({
          ...content,
          category: "نقد وتحليل",
          isBreaking: false,
          isPublished: false, // Save as DRAFT for review
          movieId: movie.id,
          imageUrl: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : undefined,
          isAiGenerated: true,
          aiConfidenceScore: content.confidenceScore
        });
        setStatus("تم الحفظ كمسودة (Draft) للمراجعة النهائية. 🎉");
        router.refresh();
      }
    } catch (err: any) {
      setStatus(`خطأ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExternal = async () => {
    const title = prompt("عنوان المقال الخارجي:");
    if (!title) return;
    const url = prompt("رابط المقال (URL):");
    if (!url) return;
    const source = prompt("اسم المصدر (مثلاً: Variety, IMDb):", "Variety");
    if (!source) return;
    const commentary = prompt("رأي خبير Filmsvib (اختياري):");

    setLoading(true);
    try {
      await addExternalArticle({
        title,
        sourceUrl: url,
        sourceName: source,
        movieId: movie.id,
        imageUrl: movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : undefined,
        excerpt: "تغطية خارجية عالمية لهذا العمل.",
        expertCommentary: commentary || undefined
      });
      setStatus("تم إضافة الرابط الخارجي مع تعليق الخبير! 🌏");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <div className="bg-[#12121a] border border-purple-500/30 p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Admin AI Engine</span>
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGenerateInternal}
            disabled={loading}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black transition-all disabled:opacity-50"
          >
            <span>🤖</span> {loading ? "جاري العمل..." : "توليد مقال AI كامل"}
          </button>
          
          <button
            onClick={handleAddExternal}
            disabled={loading}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-black transition-all disabled:opacity-50"
          >
            <span>🌏</span> إضافة تغطية خارجية (Hybrid)
          </button>
        </div>

        {status && (
          <p className="mt-3 text-[10px] text-gray-400 font-bold text-center animate-fade-in">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
