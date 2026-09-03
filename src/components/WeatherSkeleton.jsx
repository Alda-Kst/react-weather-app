export default function WeatherSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto p-6 animate-pulse space-y-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg mt-10">
      {/* Search bar skeleton */}
      <div className="h-12 bg-slate-300/40 rounded-lg w-full"></div>
      
      {/* Main weather info skeleton */}
      <div className="h-40 bg-slate-300/40 rounded-xl w-full"></div>
      
      {/* Metrics (humidity / wind) skeleton */}
      <div className="grid grid-cols-2 gap-4">
        <div className="h-20 bg-slate-300/40 rounded-lg"></div>
        <div className="h-20 bg-slate-300/40 rounded-lg"></div>
      </div>
    </div>
  );
}