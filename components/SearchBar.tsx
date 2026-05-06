"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SearchBar() {
  const [q, setQ] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (q.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(q)}`)
    }
  }

  return (
    <div className="relative group w-full md:w-96" dir="rtl">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="ابحث في الأرشيف الملكي..."
        className="bg-black/40 backdrop-blur-xl border border-white/10 text-white rounded-full py-3.5 px-8 pr-14 focus:outline-none focus:border-[#d4af37]/50 w-full transition-all duration-500 placeholder:text-white/20 font-medium text-[15px] shadow-2xl"
      />
      <button 
        onClick={handleSearch}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-[#d4af37]/60 hover:text-[#d4af37] transition-all hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </button>
    </div>
  )
}
