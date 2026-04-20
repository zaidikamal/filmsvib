import SkeletonCard from "@/components/SkeletonCard"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 mt-32 min-h-screen">
      <div className="w-64 h-10 bg-white/10 rounded mb-8 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}
