export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-48 bg-gradient-to-br from-[#004080] to-[#0056b3] animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-md bg-white">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
