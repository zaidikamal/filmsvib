export default function SkeletonCard() {
  return (
    <div className="bg-[#12121a] rounded-2xl overflow-hidden shadow-lg border border-white/5 flex flex-col">
      <div className="relative aspect-[2/3] w-full bg-white/5 animate-pulse" />
      <div className="p-4">
        <div className="h-4 bg-white/10 rounded animate-pulse w-3/4 mb-2" />
        <div className="h-3 bg-white/10 rounded animate-pulse w-1/2" />
      </div>
    </div>
  )
}
