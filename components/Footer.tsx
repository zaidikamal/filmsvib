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

          {/* INTELLIGENCE SECTIONS */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-8">The Hub</h4>
            <ul className="space-y-4">
              {['World Archives', 'The Vault (BTS)', 'Exclusive Intel', 'Director\'s Cut'].map(link => (
                <li key={link}>
                  <Link href="#" className="text-gray-500 hover:text-purple-400 text-sm font-bold transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-8">Access</h4>
            <ul className="space-y-4">
              {['About the Vision', 'Join the Crew', 'Oracle AI Guide', 'Privacy Protocol'].map(link => (
                <li key={link}>
                  <Link href="#" className="text-gray-500 hover:text-purple-400 text-sm font-bold transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT / NEWSLETTER */}
          <div className="space-y-8">
             <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-8">The Pulse</h4>
             <p className="text-gray-500 text-xs font-bold leading-relaxed">كن أول من يحصل على التقارير الحصرية.</p>
             <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Intelligence ID (Email)" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs font-black focus:outline-none focus:border-purple-500/50 transition-all"
                />
                <button className="absolute right-2 top-2 bottom-2 px-6 bg-white text-black text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all">Join</button>
             </div>
          </div>

        </div>

        {/* COPYRIGHT AREA */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">
            © 2024 FILMSVIB INTEL. ALL RIGHTS RESERVED. NO UNAUTHORIZED ACCESS.
          </p>
          <div className="flex items-center gap-6">
             <span className="text-[10px] font-black text-purple-900 uppercase">Status: Operational</span>
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </div>
        </div>
      </div>
    </footer>
  )
}
