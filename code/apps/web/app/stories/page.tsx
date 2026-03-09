import { StorySuccessNotice } from "./StorySuccessNotice";
export const revalidate = 0;

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";
const media = (p?: string | null) => (!p ? "" : p.startsWith("http") ? p : `${CMS_URL}${p}`);
import Link from "next/link";

type StoryCard = {
  id: number;
  documentId: string;
  title: string;
  author?: string | null;
  coverUrl?: string | null;
  excerpt: string;
};

function firstText(blocks?: any[]): string {
  if (!Array.isArray(blocks)) return "";
  for (const b of blocks) {
    const txt = (b?.children ?? []).map((c: any) => c?.text ?? "").join("");
    if (txt.trim()) return txt.trim();
  }
  return "";
}

async function getStories(): Promise<StoryCard[]> {
  const url =
    `${CMS_URL}/api/stories?` +
    `filters[storyStatus][$eq]=approved&populate=cover&sort=publishedAt:desc&pagination[pageSize]=200`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  const rows: any[] = (await res.json())?.data ?? [];
  return rows.map((r) => {
    const a = r?.attributes ?? r;
    const cover =
      a?.cover?.url ||
      a?.cover?.data?.attributes?.url ||
      (Array.isArray(a?.cover?.data) ? a.cover.data[0]?.attributes?.url : null);
    return {
      id: r.id,
      documentId: r.documentId ?? a.documentId,
      title: a?.title ?? "Story",
      author: a?.authorName ?? null,
      coverUrl: cover ? media(cover) : null,
      excerpt: firstText(a?.body) || "",
    };
  });
}

export default async function StoriesPage() {
  const stories = await getStories();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <StorySuccessNotice />
      <section
        className="rounded-2xl p-6 text-white shadow-lg"
        style={{ background: "linear-gradient(135deg,#0a3680 0%,#0d4ea6 55%,#f79520 100%)" }}
      >
        <h1 className="text-2xl font-extrabold">Our Stories</h1>
        <p className="mt-1 text-white/85">Real women, real transformation.</p>
      </section>
      <div className="mt-6 flex justify-end">
      <Link
        href="/stories/submit"
        className="inline-flex items-center rounded-md bg-[var(--aww-navy)] px-5 py-3 text-white hover:bg-[#f7941D] transition"
      >
        Share Your Story
      </Link>
      </div>

      <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((s) => (
          <a
            key={s.id}
            href={`/stories/${encodeURIComponent(s.documentId) || String(s.id)}`}
            className="block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="aspect-[16/9] w-full">
              {s.coverUrl ? (
                <img src={s.coverUrl} alt="" className="h-full w-full object-cover" loading="lazy"/>
              ) : (
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0a3680] via-[#0d4ea6] to-[#f79520]"/>
                  <div className="absolute inset-0 opacity-10 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_30%,white,transparent_35%)]"/>
                </div>
              )}
            </div>
            <div className="p-5">
              <h2 className="text-lg font-semibold">{s.title}</h2>
              {s.author ? <div className="mt-1 text-xs text-neutral-500">By {s.author}</div> : null}
              {s.excerpt ? <p className="mt-3 line-clamp-3 text-sm text-neutral-700">{s.excerpt}</p> : null}
            </div>
          </a>
        ))}
      </section>
    </main>
  );
}
