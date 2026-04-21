import EventsTabs from "@/components/EventsTabs";

export const revalidate = 30;

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";
const FALLBACK_IMG = "/branding/logo.png";

const mediaUrl = (p?: string | null) =>
  !p ? "" : p.startsWith("http") ? p : `${CMS_URL}${p}`;
const pickImageUrl = (img: any): string | null =>
  img?.url || img?.data?.attributes?.url || null;

type EventItem = {
  id: number;
  documentId?: string | null;
  title: string;
  startDateTime: string | null;
  endDateTime?: string | null;
  location?: string | null;
  imageUrl: string;
  category?: string | null;
  featured?: boolean | null;
  rsvpEmail?: string | null;
};

async function getEvents(): Promise<EventItem[]> {
  const url = `${CMS_URL}/api/events?populate=image&sort=startDateTime:asc&pagination[pageSize]=200`;
  try {
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const json = await res.json();
    const rows: any[] = json?.data || [];
    return rows.map((row) => {
      const a = row?.attributes ?? row;
      const img = pickImageUrl(a?.image);
      return {
        id: row?.id ?? a?.id,
        documentId: row?.documentId ?? a?.documentId,
        title: a?.title ?? "Event",
        startDateTime: a?.startDateTime ?? null,
        endDateTime: a?.endDateTime ?? null,
        location: a?.location ?? null,
        imageUrl: img ? mediaUrl(img) : FALLBACK_IMG,
        category: a?.category ?? null,
        featured: a?.featured ?? null,
        rsvpEmail: a?.rsvpEmail ?? null,
      };
    });
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header band */}
      <section
        className="rounded-2xl p-8 text-white shadow-lg"
        style={{ background: "linear-gradient(135deg,#0a3680 0%,#0d4ea6 55%,#f79520 100%)" }}
      >
        <h1 className="text-3xl font-extrabold">Events</h1>
        <p className="mt-2 text-white/85 text-lg">
          Join our community events designed to empower, educate, and connect.
        </p>
      </section>

      <EventsTabs events={events} />
    </main>
  );
}
