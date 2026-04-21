export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-48 bg-gradient-to-br from-[#004080] to-[#0056b3] animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-md bg-white">
              <div className="aspect-video bg-gray-200 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
