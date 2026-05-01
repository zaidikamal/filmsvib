"use client"
import { motion } from "framer-motion"

export default function BreakingNewsTicker() {
  const news = [
    "🔥 الإعلان رسمياً عن فيلم الجوكر 3 في كواليس السينما العالمية",
    "🎬 فيلم أوبنهايمر يكتسح جوائز الأوسكار بنسخة خاصة",
    "⭐ ترقبوا لقاءً حصرياً مع مخرجي هوليوود على فيلم فيب",
    "🎥 بدء تصوير الجزء الجديد من سلسلة جيمس بوند",
    "🌟 كريستوفر نولان يحضر لمفاجأة سينمائية كبرى قريباً"
  ]

  return (
    <div className="ticker-container" dir="rtl">
      <div className="bg-[#d4af37] text-black px-6 h-full flex items-center font-black text-[10px] tracking-widest uppercase z-10 shadow-[5px_0_15px_rgba(212,175,55,0.3)]">
        عاجل
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-ticker whitespace-nowrap flex items-center gap-16 py-2">
          {[...news, ...news].map((item, i) => (
            <span key={i} className="text-white/80 text-[13px] font-medium flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full shadow-[0_0_8px_#d4af37]"></span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
