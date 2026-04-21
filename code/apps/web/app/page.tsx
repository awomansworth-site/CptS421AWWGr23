import { CMS_URL as CMS_URL_FROM_LIB } from "@/lib/strapi";
import HeroCarousel from "@/components/HeroCarousel";
import SponsorStatsStrip from "@/components/SponsorStatsStrip";
import HomePageContent, { StoryCard, EventCard } from "@/components/HomePageContent";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || CMS_URL_FROM_LIB || "http://localhost:1337";

async function fetchJSON<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${CMS_URL}${path}`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function pickUrl(img: any): string {
  return img?.url || img?.data?.attributes?.url || "";
}

function textExcerpt(rich: any, max = 160): string {
  if (typeof rich === "string") return rich.slice(0, max);
  const para = Array.isArray(rich) ? rich.find((b: any) => b?.type === "paragraph") : null;
  const txt = para?.children?.map((c: any) => c?.text || "").join(" ") || "";
  return txt.slice(0, max);
}

async function getStories(): Promise<StoryCard[]> {
  const res = await fetchJSON<any>(
    "/api/stories?filters[storyStatus][$eq]=approved&populate=cover&sort=publishedAt:desc&pagination[pageSize]=3"
  );
  const rows: any[] = (res && (Array.isArray(res) ? res : res?.data)) || [];
  return rows.map((s: any) => {
    const a = s?.attributes ?? s;
    return {
      id: s?.id ?? Math.random(),
      documentId: a?.documentId ?? null,
      title: a?.title ?? "Story",
      coverUrl: pickUrl(a?.cover) ? `${CMS_URL}${pickUrl(a?.cover)}`.replace(/([^:])\/\//g, "$1/") : undefined,
      excerpt: textExcerpt(a?.body, 160),
    };
  });
}

async function getEvents(): Promise<EventCard[]> {
  const now = new Date().toISOString();
  const res = await fetchJSON<any>(
    `/api/events?filters[startDateTime][$gte]=${encodeURIComponent(now)}&sort=startDateTime:asc&pagination[pageSize]=2`
  );
  const rows: any[] = (res && (Array.isArray(res) ? res : res?.data)) || [];
  return rows.map((e: any) => {
    const a = e?.attributes ?? e;
    return {
      id: e?.id ?? Math.random(),
      documentId: a?.documentId ?? null,
      title: a?.title ?? "Event",
      startDateTime: a?.startDateTime,
      location: a?.location,
    };
  });
}

export default async function HomePage() {
  const [stories, events] = await Promise.all([getStories(), getEvents()]);
  return (
    <main className="min-h-screen bg-white">
      <HeroCarousel />
      <HomePageContent
        stories={stories}
        events={events}
        sponsorStrip={<SponsorStatsStrip />}
      />
    </main>
  );
}
