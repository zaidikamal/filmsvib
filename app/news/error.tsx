'use client'
 
import { useEffect } from 'react'
import Link from 'next/link'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/[0.03] backdrop-blur-xl p-12 rounded-[3rem] border border-white/10 text-center shadow-2xl">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">⚠️</span>
        </div>
        <h2 className="text-3xl font-black text-white mb-4">حدث خطأ غير متوقع</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          نعتذر عن هذا الخلل. فريقنا الفني يعمل على استقرار المنصة.
          {error.digest && (
            <span className="block mt-4 text-[10px] text-gray-600 font-mono">
              Error Digest: {error.digest}
            </span>
          )}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="btn-royal-gold py-4 rounded-2xl font-bold"
          >
            إعادة المحاولة
          </button>
          <Link 
            href="/"
            className="text-gray-500 hover:text-white transition-colors text-sm py-2"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
