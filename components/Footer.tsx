import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#050507] border-t border-gold-dark/10 pt-32 pb-20 overflow-hidden mt-40 marble-bg">
      <div className="container mx-auto px-8 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
          
          <div className="space-y-12">
            <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-md bg-gradient-to-br from-gold-light to-gold-dark flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                 <span className="text-black font-black text-lg italic">F</span>
               </div>
               <span className="font-black text-2xl tracking-tighter uppercase gold-gradient-text">Films<span className="text-white">vib</span></span>
            </div>
            <p className="text-gray-500 text-xl font-bold max-w-sm leading-relaxed">أكبر منصة استخبارات سينمائية في العالم العربي. نحن لا ننقل الخبر، نحن نحلل المستقبل بلمسة ملكية.</p>
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold-dark">التنقل السريع</h4>
              <div className="flex flex-col gap-4">
                <Link href="/" className="text-sm font-bold text-gray-500 hover:text-gold-light transition-colors">الأخبار العالمية</Link>
                <Link href="/exploration" className="text-sm font-bold text-gray-500 hover:text-gold-light transition-colors">الأرشيف الكامل</Link>
                <Link href="/trending" className="text-sm font-bold text-gray-500 hover:text-gold-light transition-colors">التريند الحالي</Link>
              </div>
            </div>
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold-dark">نظام الاستخبارات</h4>
              <div className="flex flex-col gap-4">
                <Link href="#" className="text-sm font-bold text-gray-500 hover:text-gold-light transition-colors">تقارير النخبة</Link>
                <Link href="#" className="text-sm font-bold text-gray-500 hover:text-gold-light transition-colors">أوراكل AI</Link>
                <Link href="#" className="text-sm font-bold text-gray-500 hover:text-gold-light transition-colors">عضوية VIP</Link>
              </div>
            </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-gold-dark/10 gap-8">
          <p className="text-[10px] font-black text-gray-800 uppercase tracking-widest">© 2026 FILMSVIB INTELLIGENCE HUB. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-10">
             <Link href="#" className="text-[10px] font-black text-gray-700 hover:text-gold-dark transition-colors uppercase tracking-widest">بروتوكول الخصوصية</Link>
             <Link href="#" className="text-[10px] font-black text-gray-700 hover:text-gold-dark transition-colors uppercase tracking-widest">شروط الخدمة</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
