import { StorySuccessNotice } from "./StorySuccessNotice";
import StoriesGrid from "@/components/StoriesGrid";
export const revalidate = 30;

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
  category?: string | null;
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
  try {
    const res = await fetch(url, { next: { revalidate: 30 } });
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
        category: a?.category ?? null,
      };
    });
  } catch {
    return [];
  }
}

export default async function StoriesPage() {
  const stories = await getStories();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <StorySuccessNotice />
      <section
        className="rounded-2xl p-8 text-white shadow-lg text-center"
        style={{ background: "linear-gradient(135deg,#0a3680 0%,#0d4ea6 55%,#f79520 100%)" }}
      >
        <h1 className="text-3xl font-extrabold">Our Stories</h1>
        <p className="mt-2 text-white/85 text-lg">Real women, real transformation. Discover the inspiring journeys of our community members.</p>
        <div className="mt-5 flex justify-center">
          <Link
            href="/stories/submit"
            className="inline-flex items-center rounded-full bg-[#f7941D] px-6 py-2.5 text-white font-medium hover:bg-[#e08311] transition"
          >
            Share Your Story →
          </Link>
        </div>
      </section>

      <StoriesGrid stories={stories} />
    </main>
  );
}
