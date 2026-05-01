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
      <div className="flex items-center gap-3 px-8 border-l border-white/5 h-full">
         <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
         <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-500">LIVE FEED</span>
      </div>

      {/* ── TICKER CONTENT ── */}
      <div className="flex-1 overflow-hidden flex items-center h-full">
         <div className="flex gap-20 items-center animate-infinite-scroll whitespace-nowrap px-8">
            <div className="flex items-center gap-4">
               <div className="w-1 h-1 bg-purple-600 rounded-full" />
               <p className="text-[10px] font-bold text-gray-400">مرحباً بكم في Filmsvib - وجهتكم الملكية لأخبار السينما العالمية</p>
               <span className="text-[9px] text-gray-600 font-mono">[{currentTime}]</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-1 h-1 bg-purple-600 rounded-full" />
               <p className="text-[10px] font-bold text-gray-400">تغطية حصرية وحية لمهرجانات السينما العالمية عبر نظامنا الذكي</p>
               <span className="text-[9px] text-gray-600 font-mono">[{currentTime}]</span>
            </div>
         </div>
      </div>

      {/* ── LATEST NEWS BUTTON ── */}
      <button className="bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white px-8 h-full flex items-center gap-4 transition-all border-r border-white/5 font-bold text-[10px] uppercase tracking-widest group">
         أحدث التقارير
         <div className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:bg-white animate-pulse" />
      </button>

    </div>
  )
}
