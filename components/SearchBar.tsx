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
    <div className="relative">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="ابحث عن فيلم..."
        className="bg-black/60 border border-white/20 text-white rounded-full py-2 px-6 pl-10 focus:outline-none focus:border-purple-500 w-full md:w-64 transition-all duration-300"
      />
      <button 
        onClick={handleSearch}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </button>
    </div>
  )
}
