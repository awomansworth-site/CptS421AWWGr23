export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-48 bg-gradient-to-br from-[#004080] to-[#0056b3] animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl p-6 shadow-md bg-white flex gap-6">
            <div className="w-16 h-16 rounded-xl bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
