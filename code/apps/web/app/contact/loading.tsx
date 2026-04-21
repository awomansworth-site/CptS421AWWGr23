export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-48 bg-gradient-to-br from-[#004080] to-[#0056b3] animate-pulse" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl p-8 shadow-md bg-white space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-full" />
            </div>
          ))}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
            <div className="h-32 bg-gray-200 rounded-lg animate-pulse w-full" />
          </div>
          <div className="h-12 bg-gray-200 rounded-full animate-pulse w-40" />
        </div>
      </div>
    </div>
  );
}
