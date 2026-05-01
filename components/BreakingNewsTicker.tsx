"use client"

export default function BreakingNewsTicker() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] ticker-bg h-10 flex items-center overflow-hidden" dir="rtl">
      
      {/* ── TAG ── */}
      <div className="relative z-10 bg-gradient-to-l from-indigo-600 to-purple-600 text-white px-6 h-full flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest shadow-[10px_0_20px_rgba(0,0,0,0.5)]">
         <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
         عاجل
      </div>

      {/* ── TICKER ── */}
      <div className="flex-1 overflow-hidden flex items-center h-full relative">
         <div className="flex gap-20 items-center animate-infinite-scroll whitespace-nowrap px-8">
            <p className="text-[11px] font-medium text-white/90 tracking-wide">
               أهلاً بكم في فيلم فيب - المصدر الأول لأخبار السينما العالمية والدراما بلمسة ملكية
            </p>
            <span className="text-purple-400">◆</span>
            <p className="text-[11px] font-medium text-white/90 tracking-wide">
               اكتشفوا مراجعاتنا الحصرية لأهم الأفلام المنتظرة لعام 2026 مدعومة بالذكاء الاصطناعي
            </p>
            <span className="text-purple-400">◆</span>
            <p className="text-[11px] font-medium text-white/90 tracking-wide">
               تغطية حصرية لمهرجانات السينما العالمية وتقارير خاصة عن كواليس هوليوود
            </p>
         </div>
      </div>

      {/* ── SYSTEM STATUS ── */}
      <div className="hidden md:flex items-center px-6 h-full text-[9px] font-bold text-white/30 uppercase tracking-[2px] border-r border-white/5 bg-black/20">
         Imperial System Online
      </div>

    </div>
  )
}
