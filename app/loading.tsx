import SkeletonCard from "@/components/SkeletonCard"

export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="w-full h-[70vh] min-h-[500px] mt-16 bg-[#12121a] animate-pulse" />
      <section className="container mx-auto px-4 mt-16">
        <div className="w-48 h-10 bg-white/10 rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    </main>
  )
}
