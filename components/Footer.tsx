import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#050507] border-t border-white/5 pt-32 pb-20 overflow-hidden mt-20">
      <div className="container mx-auto px-8 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
          
          <div className="space-y-12">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                 <span className="text-black font-black text-sm">V</span>
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
