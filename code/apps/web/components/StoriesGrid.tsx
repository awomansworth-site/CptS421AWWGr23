"use client";

export type StoryCard = {
  id: number;
  documentId: string;
  title: string;
  author?: string | null;
  coverUrl?: string | null;
  excerpt: string;
  category?: string | null;
};

export default function StoriesGrid({ stories }: { stories: StoryCard[] }) {
  if (!stories || stories.length === 0) {
    return (
      <section className="mt-6 text-center text-neutral-500">
        No stories available yet.
      </section>
    );
  }

  return (
    <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stories.map((s) => (
        <a
          key={s.id}
          href={`/stories/${encodeURIComponent(s.documentId)}`}
          className="block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="aspect-[16/9] w-full">
            {s.coverUrl ? (
              <img
                src={s.coverUrl}
                alt={s.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="relative h-full w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a3680] via-[#0d4ea6] to-[#f79520]" />
                <div className="absolute inset-0 opacity-10 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_30%,white,transparent_35%)]" />
              </div>
            )}
          </div>
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900">{s.title}</h2>
            {s.author && (
              <div className="mt-1 text-xs text-neutral-500">By {s.author}</div>
            )}
            {s.excerpt && (
              <p className="mt-3 line-clamp-3 text-sm text-neutral-700">
                {s.excerpt}
              </p>
            )}
            <span className="mt-4 inline-block text-sm font-medium text-[var(--aww-orange)] hover:underline">
              Read More →
            </span>
          </div>
        </a>
      ))}
    </section>
  );
}