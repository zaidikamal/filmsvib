import Link from "next/link"

export default function SubmittedPage() {
  return (
    <main className="min-h-screen pt-40 pb-20 bg-[#0a0a0f] flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto bg-white/[0.03] backdrop-blur-xl p-12 rounded-[3rem] border border-white/10 shadow-2xl animate-fade-in-up">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/20">
            <span className="text-4xl text-white">✅</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 font-cairo">تم استلام مقالك بنجاح! 🎉</h1>
          
          <p className="text-gray-400 text-lg mb-10 leading-relaxed font-cairo">
            شكراً لمساهمتك القيمة في Filmsvib. لقد دخل مقالك الآن مرحلة المراجعة من قبل فريق التحرير للتأكد من جودته وتوافقه مع معاييرنا.
            <br />
            <span className="text-purple-400 font-bold mt-4 block">سيتم إعلامك فور نشره!</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/news/my-articles" 
              className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-10 rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <span>📄</span> متابعة مقالاتي
            </Link>
            <Link 
              href="/news" 
              className="bg-gradient-to-r from-purple-600 to-red-600 hover:scale-105 active:scale-95 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              <span>🏠</span> العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
