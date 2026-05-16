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
    console.error('Admin Error Boundary:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#07070a] rounded-[2.5rem] border border-white/5">
      <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-4xl mb-8 border border-red-500/20">
        ⚠️
      </div>
      <h2 className="text-3xl font-black text-white mb-4">حدث خطأ تقني في الإدارة</h2>
      <p className="text-gray-500 max-w-md mb-10 leading-relaxed">
        وقع خطأ غير متوقع أثناء معالجة هذه الصفحة. قد يكون ذلك بسبب انقطاع الاتصال أو مشكلة في البيانات.
      </p>
      
      {error.digest && (
        <div className="mb-8 p-3 bg-white/5 rounded-xl border border-white/10 text-[10px] font-mono text-gray-500">
          Error ID: {error.digest}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-white text-black font-black py-4 px-10 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl"
        >
          إعادة المحاولة
        </button>
        <Link 
          href="/admin"
          className="bg-white/5 text-white font-black py-4 px-10 rounded-2xl border border-white/10 transition-all hover:bg-white/10"
        >
          لوحة التحكم
        </Link>
      </div>
    </div>
  )
}
