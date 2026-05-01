import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative bg-[#050507] pt-24 pb-12 border-t border-white/5 mt-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* BRANDING SECTION */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
               <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 transition-colors">
                 <span className="text-white font-black text-lg italic">V</span>
               </div>
               <span className="font-black text-2xl tracking-tighter">FILMS<span className="text-purple-500">VIB</span></span>
            </Link>
            <p className="text-gray-500 text-sm font-bold leading-relaxed">
              منصتك الاستخباراتية الأولى في عالم السينما. نحن لا ننقل الخبر، نحن نصنع الرؤية الكاملة لما يحدث خلف الكواليس.
            </p>
            <div className="flex gap-4">
               {['Twitter', 'Instagram', 'YouTube'].map(social => (
                 <div key={social} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
                    <span className="sr-only">{social}</span>
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                 </div>
               ))}
            </div>
          </div>

               <span className="font-black text-2xl tracking-tighter uppercase font-orbitron">Films<span className="text-purple-500">vib</span></span>
            </div>
            <p className="text-gray-500 text-xl font-bold max-w-sm leading-relaxed">أكبر منصة استخبارات سينمائية في العالم العربي. نحن لا ننقل الخبر، نحن نحلل المستقبل.</p>
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500">Navigation</h4>
              <div className="flex flex-col gap-4">
                <Link href="/" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Intelligence</Link>
                <Link href="/exploration" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Exploration</Link>
                <Link href="/news" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">The Vault</Link>
              </div>
            </div>
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500">Intelligence</h4>
              <div className="flex flex-col gap-4">
                <Link href="#" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Global Reports</Link>
                <Link href="#" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Oracle AI</Link>
                <Link href="#" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Elite Access</Link>
              </div>
            </div>
          </div>

        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-8">
          <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">© 2026 FILMSVIB INTELLIGENCE HUB. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-10">
             <Link href="#" className="text-[10px] font-black text-gray-700 hover:text-purple-500 transition-colors uppercase tracking-widest">Privacy Protocol</Link>
             <Link href="#" className="text-[10px] font-black text-gray-700 hover:text-purple-500 transition-colors uppercase tracking-widest">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
