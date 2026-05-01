"use client"
import { useState, useEffect } from "react"

export default function BreakingNewsTicker() {
  const [currentTime, setCurrentTime] = useState("10:25")

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-[#050507] h-12 flex items-center border-b border-white/5" dir="rtl">
      
      {/* ── LIVE FEED TAG ── */}
      <div className="flex items-center gap-2 px-6 border-l border-white/5 h-full group cursor-pointer">
         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,1)]" />
         <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">LIVE FEED</span>
      </div>

      {/* ── TICKER CONTENT ── */}
      <div className="flex-1 overflow-hidden flex items-center h-full relative">
         <div className="flex gap-16 items-center animate-infinite-scroll whitespace-nowrap px-8">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
               <p className="text-[11px] font-bold text-gray-300 italic">مرحباً بكم في Filmsvib - وجهتكم الأولى لأخبار السينما العالمية</p>
               <span className="bg-white/5 px-2 py-0.5 rounded text-[9px] text-gray-500 font-mono ml-4">{currentTime}</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
               <p className="text-[11px] font-bold text-gray-300 italic">تابعونا للحصول على أحدث المراجعات والأخبار الحصرية قريباً</p>
               <span className="bg-white/5 px-2 py-0.5 rounded text-[9px] text-gray-500 font-mono ml-4">{currentTime}</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
               <p className="text-[11px] font-bold text-gray-300 italic">لمية</p>
               <span className="bg-white/5 px-2 py-0.5 rounded text-[9px] text-gray-500 font-mono ml-4">{currentTime}</span>
            </div>
         </div>
      </div>

      {/* ── LATEST NEWS BUTTON ── */}
      <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 h-full flex items-center gap-3 transition-all relative overflow-hidden group">
         <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12" />
         <span className="text-[11px] font-black uppercase tracking-widest relative z-10">أحدث الأخبار</span>
         <div className="w-2 h-2 bg-white rounded-full animate-pulse relative z-10" />
      </button>

    </div>
  )
}
