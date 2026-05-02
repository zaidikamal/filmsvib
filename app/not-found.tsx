"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0a0f]">
      {/* Background Cinematic Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4c1d95]/10 blur-[120px] rounded-full" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-[#d4af37]/10 blur-[100px] rounded-full animate-pulse" />
      
      <div className="text-center relative z-10 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-[180px] md:text-[250px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/5 opacity-20">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="-mt-16 md:-mt-24"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 font-royal">المشهد غير موجود 🎬</h2>
          <p className="text-gray-500 text-lg mb-12 leading-relaxed">
            يبدو أنك سلكت طريقاً خاطئاً في كواليس السينما. الصفحة التي تبحث عنها قد تم نقلها أو حذفها من الأرشيف.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
            <Link 
              href="/" 
              className="btn-royal-gold"
            >
              العودة للرئيسية 🏠
            </Link>
            <Link 
              href="/news" 
              className="px-10 py-4 bg-white/5 border border-[#d4af37]/20 text-[#d4af37] font-black rounded-full hover:bg-[#d4af37]/10 transition-all uppercase tracking-widest text-sm"
            >
              استكشاف الأخبار 📰
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Film Strip Pattern (CSS Only) */}
      <div className="absolute bottom-10 left-0 w-full h-24 opacity-5 pointer-events-none flex gap-4 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="min-w-[150px] h-full bg-white rounded-lg" />
        ))}
      </div>
    </div>
  )
}
