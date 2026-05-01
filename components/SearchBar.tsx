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
    <div className="relative group" dir="rtl">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="ابحث في الأرشيف الملكي..."
        className="bg-black/60 border border-gold-dark/20 text-white rounded-sm py-3 px-6 pr-12 focus:outline-none focus:border-gold-light w-full md:w-80 transition-all duration-500 placeholder:text-gray-600 font-bold text-sm"
      />
      <button 
        onClick={handleSearch}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-dark hover:text-gold-light transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </button>
      <div className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-gold-light/40 to-transparent w-0 group-focus-within:w-full transition-all duration-700" />
    </div>
  )
}
