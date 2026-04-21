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

const PLACEHOLDER_STORIES: StoryCard[] = [
  {
    id: 1001,
    documentId: "placeholder-1",
    title: "Finding My Voice",
    author: "Amara J.",
    coverUrl: null,
    excerpt: "After years of silence, AWW gave me the tools and community I needed to finally speak my truth and step into leadership.",
    category: null,
  },
  {
    id: 1002,
    documentId: "placeholder-2",
    title: "From Struggle to Strength",
    author: "Denise R.",
    coverUrl: null,
    excerpt: "Losing my job felt like the end — but AWW helped me turn that setback into the greatest comeback of my life.",
    category: null,
  },
  {
    id: 1003,
    documentId: "placeholder-3",
    title: "Building Bridges in Our Community",
    author: "Priya K.",
    coverUrl: null,
    excerpt: "Through AWW's mentorship program I connected with over 200 women in Spokane and launched a local resource network.",
    category: null,
  },
  {
    id: 1004,
    documentId: "placeholder-4",
    title: "Career Change at 40: My Journey",
    author: "Tanya M.",
    coverUrl: null,
    excerpt: "I left a 20-year career to follow my passion. AWW's support circle made the impossible feel completely achievable.",
    category: null,
  },
  {
    id: 1005,
    documentId: "placeholder-5",
    title: "Starting Over with Purpose",
    author: "Gloria W.",
    coverUrl: null,
    excerpt: "As a single mother re-entering the workforce, AWW's workshops gave me the confidence and skills to land my dream job.",
    category: null,
  },
  {
    id: 1006,
    documentId: "placeholder-6",
    title: "Empowering the Next Generation",
    author: "Cynthia B.",
    coverUrl: null,
    excerpt: "I founded a youth mentorship initiative inspired by what AWW did for me. Now I'm paying it forward every single day.",
    category: null,
  },
];

export default function StoriesGrid({ stories }: { stories: StoryCard[] }) {
  const displayStories = stories.length > 0 ? stories : PLACEHOLDER_STORIES;

  return (
    <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {displayStories.map((s) => (
        <a
          key={s.id}
          href={
            s.documentId.startsWith("placeholder")
              ? "/stories"
              : `/stories/${encodeURIComponent(s.documentId)}`
          }
          className="block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="aspect-[16/9] w-full">
            {s.coverUrl ? (
              <img src={s.coverUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="relative h-full w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a3680] via-[#0d4ea6] to-[#f79520]" />
                <div className="absolute inset-0 opacity-10 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_30%,white,transparent_35%)]" />
              </div>
            )}
          </div>
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-900">{s.title}</h2>
            {s.author ? <div className="mt-1 text-xs text-neutral-500">By {s.author}</div> : null}
            {s.excerpt ? <p className="mt-3 line-clamp-3 text-sm text-neutral-700">{s.excerpt}</p> : null}
            <span className="mt-4 inline-block text-sm font-medium text-[var(--aww-orange)] hover:underline">
              Read More →
            </span>
          </div>
        </a>
      ))}
    </section>
  );
}
