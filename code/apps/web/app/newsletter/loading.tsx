export default function NewsletterLoading() {
  return (
    <main className="min-h-screen bg-white">
      <section
        className="py-20"
        style={{ background: "linear-gradient(135deg,#0a3680 0%,#0d4ea6 55%,#f79520 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="h-6 w-32 bg-white/20 rounded-full mx-auto mb-4 animate-pulse" />
          <div className="h-12 w-72 bg-white/20 rounded-xl mx-auto mb-3 animate-pulse" />
          <div className="h-5 w-96 bg-white/15 rounded-lg mx-auto animate-pulse" />
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-64 rounded-2xl bg-neutral-100 animate-pulse mb-10" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-neutral-100 h-72 animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  );
}
