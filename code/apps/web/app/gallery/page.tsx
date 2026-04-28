import Link from "next/link";
import { Calendar, ImageIcon, Images, MapPin } from "lucide-react";
import { CMS_URL as CMS_URL_FROM_LIB } from "@/lib/strapi";

export const revalidate = 30;

const CMS_URL =
  process.env.NEXT_PUBLIC_CMS_URL || CMS_URL_FROM_LIB || "http://localhost:1337";

type Event = {
  id: number;
  title: string;
  slug: string;
  eventDate: string | null;
  location: string | null;
  description: string | null;
  coverImage: string | null;
  featured: boolean;
  displayOrder: number;
  imageCount: number;
};

const mediaUrl = (p?: string | null) =>
  !p ? null : p.startsWith("http") ? p : `${CMS_URL}${p}`;

const pickImage = (img: any): string | null =>
  img?.url ||
  img?.data?.attributes?.url ||
  img?.data?.url ||
  (Array.isArray(img) ? img[0]?.url : null) ||
  (Array.isArray(img?.data)
    ? img.data[0]?.attributes?.url || img.data[0]?.url
    : null) ||
  null;

const countImages = (imgs: any): number => {
  if (Array.isArray(imgs)) return imgs.length;
  if (Array.isArray(imgs?.data)) return imgs.data.length;
  return 0;
};

function richTextToPlainText(value: any): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    const text = value
      .map((block: any) =>
        (block?.children ?? [])
          .map((child: any) => child?.text ?? "")
          .join("")
      )
      .join(" ")
      .trim();

    return text || null;
  }

  return null;
}

async function getEvents(): Promise<Event[]> {
  try {
    const url =
      `${CMS_URL}/api/event-galleries?` +
      `populate[0]=coverImage` +
      `&populate[1]=galleryImages` +
      `&sort=displayOrder:asc` +
      `&pagination[pageSize]=100`;

    const res = await fetch(url, { next: { revalidate: 30 } });

    if (!res.ok) {
      console.error("Failed to fetch event galleries:", res.status);
      return [];
    }

    const rows: any[] = (await res.json())?.data ?? [];

    return rows
      .map((row) => {
        const a = row?.attributes ?? row;
        const img = pickImage(a?.coverImage);

        return {
          id: row.id ?? a.id,
          title: a?.title ?? "Event",
          slug: a?.slug ?? "",
          eventDate: a?.eventDate ?? null,
          location: a?.location ?? null,
          description: richTextToPlainText(a?.description),
          coverImage: img ? mediaUrl(img) : null,
          featured: a?.featured ?? false,
          displayOrder: a?.displayOrder ?? 0,
          imageCount: countImages(a?.galleryImages),
        };
      })
      .filter((event) => event.slug);
  } catch (error) {
    console.error("Error loading event galleries:", error);
    return [];
  }
}

function formatDate(date?: string | null) {
  if (!date) return null;

  return new Date(date).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ImageFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0a3680] via-[#0d4ea6] to-[#f79520]">
      <ImageIcon className="h-12 w-12 text-white/80" />
    </div>
  );
}

export default async function GalleryPage() {
  const events = await getEvents();

  const featured = events.find((e) => e.featured) || events[0];
  const others = featured
    ? events.filter((e) => e.id !== featured.id)
    : events;

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-blue-50/40">
      <section className="mx-auto max-w-6xl px-4 py-14 text-center sm:py-16">
        <p className="mb-3 inline-flex rounded-full bg-orange-100 px-4 py-1.5 text-sm font-bold text-[#d56f00]">
          A Woman&apos;s Worth Gallery
        </p>

        <h1 className="text-4xl font-black tracking-tight text-neutral-950 sm:text-5xl">
          Past Events
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-neutral-600">
          Explore moments from our past events, celebrations, and community
          impact.
        </p>
      </section>

      {events.length === 0 ? (
        <section className="mx-auto max-w-5xl px-4 pb-20">
          <div className="rounded-3xl border border-dashed border-neutral-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900">
              No gallery events yet
            </h2>
            <p className="mt-3 text-neutral-600">
              Past event galleries will appear here once they are added in
              Strapi and published.
            </p>
          </div>
        </section>
      ) : (
        <>
          {featured && (
            <section className="mx-auto max-w-6xl px-4 pb-14">
              <Link href={`/gallery/${featured.slug}`} className="block">
                <article className="group overflow-hidden rounded-3xl bg-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
                  <div className="relative h-[340px] overflow-hidden sm:h-[420px]">
                    {featured.coverImage ? (
                      <img
                        src={featured.coverImage}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        alt={featured.title}
                      />
                    ) : (
                      <ImageFallback />
                    )}

                    <div className="absolute left-5 top-5 rounded-full bg-[#f7941D] px-4 py-1.5 text-sm font-bold text-white shadow">
                      Featured Gallery
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-black text-neutral-950 sm:text-3xl">
                      {featured.title}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-neutral-600">
                      {featured.eventDate && (
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#f7941D]" />
                          {formatDate(featured.eventDate)}
                        </span>
                      )}

                      {featured.location && (
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#f7941D]" />
                          {featured.location}
                        </span>
                      )}

                      <span className="flex items-center gap-2">
                        <Images className="h-4 w-4 text-[#f7941D]" />
                        {featured.imageCount}{" "}
                        {featured.imageCount === 1 ? "photo" : "photos"}
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-3 max-w-3xl leading-7 text-neutral-600">
                      {featured.description || "View photos from this event."}
                    </p>
                  </div>
                </article>
              </Link>
            </section>
          )}

          {others.length > 0 && (
            <section className="mx-auto max-w-6xl px-4 pb-20">
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((event) => (
                  <Link key={event.id} href={`/gallery/${event.slug}`}>
                    <article className="group h-full overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                      <div className="h-56 overflow-hidden">
                        {event.coverImage ? (
                          <img
                            src={event.coverImage}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            alt={event.title}
                          />
                        ) : (
                          <ImageFallback />
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="text-xl font-black text-neutral-950">
                          {event.title}
                        </h3>

                        <div className="mt-3 space-y-2 text-sm text-neutral-600">
                          {event.eventDate && (
                            <p className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-[#f7941D]" />
                              {formatDate(event.eventDate)}
                            </p>
                          )}

                          {event.location && (
                            <p className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-[#f7941D]" />
                              {event.location}
                            </p>
                          )}

                          <p className="flex items-center gap-2">
                            <Images className="h-4 w-4 text-[#f7941D]" />
                            {event.imageCount}{" "}
                            {event.imageCount === 1 ? "photo" : "photos"}
                          </p>
                        </div>

                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-neutral-600">
                          {event.description || "View photos from this event."}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}