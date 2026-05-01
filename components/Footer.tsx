import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative mt-40 pb-20 px-8 lg:px-24" dir="rtl">
      {/* ── DECORATIVE LINE ── */}
      <div className="absolute top-0 left-8 lg:left-24 right-8 lg:right-24 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 pt-20">
        
        {/* ── BRAND INFO ── */}
        <div className="md:col-span-2 space-y-8">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/20">
                <span className="text-white font-black text-xl">F</span>
              </div>
              <span className="text-2xl font-bold tracking-tighter uppercase">Filmsvib</span>
           </div>
           <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-md">
             أكبر منصة استخبارات سينمائية في العالم العربي. نحن لا ننقل الخبر، نحن نحلل المستقبل بلمسة ملكية فاخرة.
           </p>
           <div className="flex gap-6 text-gray-400">
              <a href="#" className="hover:text-purple-500 transition-colors">Twitter</a>
              <a href="#" className="hover:text-purple-500 transition-colors">Instagram</a>
              <a href="#" className="hover:text-purple-500 transition-colors">YouTube</a>
           </div>
        </div>

        {/* ── QUICK LINKS ── */}
        <div className="space-y-6">
           <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-purple-500">التنقل السريع</h4>
           <ul className="space-y-4 text-sm font-medium text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">الأرشيف العالمي</Link></li>
              <li><Link href="/trending" className="hover:text-white transition-colors">التقارير الرائجة</Link></li>
              <li><Link href="/cinema" className="hover:text-white transition-colors">السينما المباشرة</Link></li>
              <li><Link href="/ai" className="hover:text-white transition-colors">مركز الذكاء الاصطناعي</Link></li>
           </ul>
        </div>

        {/* ── INTEL SYSTEM ── */}
        <div className="space-y-6">
           <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-purple-500">نظام الاستخبارات</h4>
           <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">حالة النظام</p>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-xs font-bold">جميع الأنظمة تعمل</span>
              </div>
              <p className="text-[9px] text-gray-600 leading-tight font-medium">يتم تحديث البيانات السينمائية كل 15 دقيقة عبر أقمارنا الاصطناعية الرقمية.</p>
           </div>
        </div>

      </div>

      {/* ── COPYRIGHT ── */}
      <div className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
         <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">© 2026 FILMSVIB INTEL REGIME. ALL RIGHTS RESERVED.</p>
         <div className="flex gap-8 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Access</a>
         </div>
      </div>
    </footer>
  )
}
