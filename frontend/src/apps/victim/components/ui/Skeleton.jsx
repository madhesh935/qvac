export default function Skeleton({ className = '', lines = 1, height = 'h-4' }) {
  if (lines === 1) {
    return (
      <div
        className={`animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded-xl ${height} ${className}`}
      />
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded-xl ${height} ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}
