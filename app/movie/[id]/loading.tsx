export default function Loading() {
  return (
    <div className="min-h-screen bg-[#070710] flex flex-col items-center justify-center">
      <div className="relative">
        {/* Animated Glow Rings */}
        <div className="absolute inset-0 bg-purple-600/20 blur-[100px] animate-pulse rounded-full" />
        <div className="w-24 h-24 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">🎬</div>
      </div>
      <h2 className="mt-8 text-white font-black tracking-[0.3em] uppercase text-sm animate-pulse font-royal">
        Loading Cinematic Universe
      </h2>
      <div className="mt-4 flex gap-1">
        <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" />
      </div>
    </div>
  );
}
