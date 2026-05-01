export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#d4af37]/20 pt-20 pb-10" dir="rtl">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          {/* BRAND */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black gold-text uppercase">Filmsvib</h2>
            <p className="text-xs text-white/40 leading-relaxed font-bold uppercase tracking-wider">
              المصدر الأول للاستخبارات السينمائية والدراما العالمية. تغطية حصرية على مدار الساعة.
            </p>
          </div>

          {/* LINKS */}
          <div className="space-y-6">
             <h3 className="text-[#d4af37] text-[10px] font-black uppercase tracking-[5px]">روابط سريعة</h3>
             <ul className="space-y-4">
                <li><a href="#" className="text-sm font-bold text-white/60 hover:text-[#d4af37] transition-colors">أرشيف العالم</a></li>
                <li><a href="#" className="text-sm font-bold text-white/60 hover:text-[#d4af37] transition-colors">مركز البيانات</a></li>
                <li><a href="#" className="text-sm font-bold text-white/60 hover:text-[#d4af37] transition-colors">الغرفة السرية</a></li>
             </ul>
          </div>

          <div className="space-y-6">
             <h3 className="text-[#d4af37] text-[10px] font-black uppercase tracking-[5px]">الدعم التقني</h3>
             <ul className="space-y-4">
                <li><a href="#" className="text-sm font-bold text-white/60 hover:text-[#d4af37] transition-colors">سياسة النظام</a></li>
                <li><a href="#" className="text-sm font-bold text-white/60 hover:text-[#d4af37] transition-colors">تقارير الأداء</a></li>
             </ul>
          </div>

          {/* STATUS */}
          <div className="space-y-6">
             <h3 className="text-[#d4af37] text-[10px] font-black uppercase tracking-[5px]">حالة النظام</h3>
             <div className="p-4 bg-white/5 border border-white/10 rounded flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Imperial System Online</span>
             </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-6">
           <p className="text-[10px] font-bold text-white/20 uppercase tracking-[2px]">
             © 2026 Filmsvib Intelligence Agency. All Rights Reserved.
           </p>
           <div className="flex gap-8">
              <span className="text-[10px] font-black text-[#d4af37]">V1.0.0 GOLD EDITION</span>
           </div>
        </div>

      </div>
    </footer>
  )
}
