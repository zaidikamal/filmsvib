"use client"
import { useState, useEffect } from "react"

export default function BreakingNewsTicker() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] ticker-bg h-12 flex items-center border-b-2 border-[#d4af37]" dir="rtl">
      
      {/* ── TAG ── */}
      <div className="bg-[#d4af37] text-black px-6 h-full flex items-center gap-2 font-black text-xs">
         <span className="animate-pulse">●</span>
         عاجل
      </div>

      {/* ── TICKER ── */}
      <div className="flex-1 overflow-hidden flex items-center h-full">
         <div className="flex gap-20 items-center animate-infinite-scroll whitespace-nowrap px-8">
            <p className="text-xs font-bold text-white tracking-wide">
               أهلاً بكم في Filmsvib - التغطية الأولى والحصرية لأخبار السينما العالمية والدراما
            </p>
            <span className="text-[#d4af37]">★</span>
            <p className="text-xs font-bold text-white tracking-wide">
               انتظروا تحليلاتنا الحصرية لأهم الأفلام المنتظرة لعام 2026 قريباً
            </p>
         </div>
      </div>

      {/* ── DATE ── */}
      <div className="hidden md:flex items-center px-8 border-r border-white/10 h-full text-[10px] font-bold text-white/60">
         نظام الاستخبارات السينمائي v1.0
      </div>

    </div>
  )
}
