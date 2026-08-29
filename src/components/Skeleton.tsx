export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-shimmer rounded-lg bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:1000px_100%] ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-slate-900/50 border border-white/5 p-4 space-y-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
