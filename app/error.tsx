'use client'
 
import { useEffect } from 'react'
 
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <span className="text-6xl mb-6">⚠️</span>
      <h2 className="text-3xl font-bold mb-4 text-red-500">حدث خطأ غير متوقع</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        نأسف، واجهنا مشكلة أثناء جلب البيانات. يرجى المحاولة مرة أخرى لاحقاً.
      </p>
      <button
        onClick={() => reset()}
        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg"
      >
        حاول مرة أخرى
      </button>
    </div>
  )
}
