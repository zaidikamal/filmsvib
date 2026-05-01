"use client"

export default function BreakingNewsTicker() {
  return (
    <div className="ticker-container" dir="rtl">
      {/* TAG */}
      <div className="relative z-20 bg-indigo-600 text-white px-5 h-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-2xl">
         <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
         عاجل
      </div>

      {/* SCROLLING CONTENT */}
      <div className="flex-1 relative flex items-center h-full">
         <div className="flex gap-20 items-center animate-ticker whitespace-nowrap px-8">
            <p className="text-[11px] font-medium text-white/90">
               أهلاً بكم في فيلم فيب - المصدر الأول لأخبار السينما العالمية والدراما بلمسة ملكية
            </p>
            <span className="text-indigo-400">◆</span>
            <p className="text-[11px] font-medium text-white/90">
               اكتشفوا مراجعاتنا الحصرية لأهم الأفلام المنتظرة لعام 2026 مدعومة بالذكاء الاصطناعي
            </p>
            <span className="text-indigo-400">◆</span>
            <p className="text-[11px] font-medium text-white/90">
               تغطية حصرية لمهرجانات السينما العالمية وتقارير خاصة عن كواليس هوليوود
            </p>
         </div>
      </div>
    </div>
  )
}
