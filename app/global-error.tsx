"use client";

import "@/app/globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#050507] text-white flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full bg-[#1a1a1a] border border-red-500/30 rounded-[2.5rem] p-10 text-center shadow-2xl backdrop-blur-3xl">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
             <span className="text-4xl">⚠️</span>
          </div>
          
          <h1 className="text-3xl font-black mb-4 font-royal">خطأ في النظام الرئيسي</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            حدث خطأ تقني في بنية الموقع الأساسية. يرجى تزويدنا برمز الخطأ التالي:
          </p>

          {error.digest && (
            <div className="bg-black/50 rounded-2xl p-4 mb-6 text-red-400 font-mono text-xs break-all border border-red-500/20">
              Digest: {error.digest}
            </div>
          )}

          <div className="bg-red-500/5 rounded-2xl p-4 mb-8 text-left">
            <p className="text-red-400/80 text-[10px] font-mono break-all">
              {error.message || "Root level exception detected."}
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-red-900/20"
          >
            إعادة محاولة تشغيل النظام
          </button>
        </div>
      </body>
    </html>
  );
}
