"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // هنا يمكن إضافة كود لإرسال الخطأ إلى Sentry مستقبلاً
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0f] text-center">
      <div className="max-w-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 rounded-[3rem] bg-white/[0.02] border border-red-500/20 backdrop-blur-2xl shadow-2xl"
        >
          <div className="text-6xl mb-8">🛠️</div>
          <h1 className="text-3xl font-black text-white mb-4 font-cairo">حدث خطأ تقني غير متوقع</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            نعتذر منك، حدث خلل مفاجئ أثناء محاولة معالجة طلبك. طاقم العمل لدينا يعمل على إصلاح هذه المشكلة الآن.
          </p>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={() => reset()}
              className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-red-500 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              إعادة المحاولة 🔄
            </button>
            <p className="text-[10px] text-gray-700 font-mono mt-4 uppercase tracking-tighter">
              Error Digest: {error.digest || "Internal Engine Failure"}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
