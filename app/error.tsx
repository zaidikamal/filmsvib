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
          className="p-12 rounded-[2rem] bg-[#0a0a0f]/80 border border-[#d4af37]/20 backdrop-blur-3xl shadow-[0_0_50px_rgba(76,29,149,0.15)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50" />
          <div className="text-6xl mb-8">⚠️</div>
          <h1 className="text-3xl font-black text-white mb-4 gold-text-glow">حدث خطأ تقني غير متوقع</h1>
          <p className="text-white/50 mb-10 leading-relaxed font-medium">
            نعتذر منك، حدث خلل مفاجئ أثناء محاولة معالجة طلبك. طاقم العمل لدينا يعمل على إصلاح هذه المشكلة الآن.
          </p>
          
          <div className="flex flex-col gap-4 items-center justify-center">
            <button
              onClick={() => reset()}
              className="btn-royal-gold px-12"
            >
              إعادة المحاولة 🔄
            </button>
            <p className="text-[10px] text-white/30 font-mono mt-4 uppercase tracking-[3px]">
              Error Digest: {error.digest || "Internal Engine Failure"}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
