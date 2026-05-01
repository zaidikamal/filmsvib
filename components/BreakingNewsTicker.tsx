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
    <div className="fixed top-0 left-0 right-0 z-[60] flex justify-center py-4 px-6" dir="rtl">
      <div className="glass-island px-8 h-10 rounded-full flex items-center gap-12 max-w-5xl w-full border border-white/10 relative overflow-hidden">
        
        {/* ── STATUS ── */}
        <div className="flex items-center gap-3 shrink-0">
           <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
           <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">LIVE DATA FEED</span>
        </div>

        {/* ── TICKER ── */}
        <div className="flex-1 overflow-hidden flex items-center h-full">
           <div className="flex gap-20 items-center animate-infinite-scroll whitespace-nowrap px-8">
              <div className="flex items-center gap-4">
                 <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                 <p className="text-[9px] font-black uppercase tracking-widest text-white/60 italic">Filmsvib Intelligence Regime // All systems operational // Monitoring cinematic fluctuations...</p>
                 <span className="text-[9px] text-indigo-500 font-mono font-bold">[{currentTime}]</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                 <p className="text-[9px] font-black uppercase tracking-widest text-white/60 italic">Global Archive Synchronized // AI core active // Analyzing high-priority files...</p>
                 <span className="text-[9px] text-indigo-500 font-mono font-bold">[{currentTime}]</span>
              </div>
           </div>
        </div>

        {/* ── TIMESTAMP ── */}
        <div className="shrink-0 text-[10px] font-black text-indigo-400 font-mono border-r border-white/5 pr-6">
           SECURE_LINK // {currentTime}
        </div>

        {/* GLOW DECOR */}
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-indigo-500/10 to-transparent" />
      </div>
    </div>
  )
}
