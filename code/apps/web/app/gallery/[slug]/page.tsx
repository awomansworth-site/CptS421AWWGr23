import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, ImageIcon, MapPin } from "lucide-react";
import { CMS_URL as CMS_URL_FROM_LIB } from "@/lib/strapi";
import GalleryLightbox from "./GalleryLightbox";

export const revalidate = 30;

const CMS_URL =
  process.env.NEXT_PUBLIC_CMS_URL || CMS_URL_FROM_LIB || "http://localhost:1337";

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

const pickImages = (imgs: any): string[] => {
  const raw = Array.isArray(imgs)
    ? imgs
    : Array.isArray(imgs?.data)
      ? imgs.data
      : [];

  return raw
    .map((i: any) => i?.url || i?.attributes?.url)
    .filter(Boolean)
    .map((url: string) => mediaUrl(url));
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

async function getEvent(slug: string) {
  try {
    const url =
      `${CMS_URL}/api/event-galleries?` +
      `filters[slug][$eq]=${encodeURIComponent(slug)}` +
      `&populate[0]=coverImage` +
      `&populate[1]=galleryImages`;

    const res = await fetch(url, { next: { revalidate: 30 } });

    if (!res.ok) {
      console.error("Failed to fetch event:", res.status);
      return null;
    }

    const row = (await res.json())?.data?.[0];
    if (!row) return null;

    const a = row?.attributes ?? row;
    const cover = pickImage(a?.coverImage);

    return {
      title: a?.title ?? "Event",
      eventDate: a?.eventDate ?? null,
      location: a?.location ?? null,
      description: richTextToPlainText(a?.description),
      coverImage: cover ? mediaUrl(cover) : null,
      gallery: pickImages(a?.galleryImages),
    };
  } catch (err) {
    console.error("Error loading event:", err);
    return null;
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

export default async function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = await getEvent(params.slug);

  if (!event) return notFound();

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-blue-50/40">
      <section className="mx-auto max-w-6xl px-4 py-8">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#0a3680] shadow-sm transition hover:text-[#f7941D]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl">
          <div className="h-[320px] overflow-hidden sm:h-[460px]">
            {event.coverImage ? (
              <img
                src={event.coverImage}
                className="h-full w-full object-cover object-center"
                alt={event.title}
              />
            ) : (
              <ImageFallback />
            )}
          </div>

          <div className="p-6 sm:p-10">
            <h1 className="text-3xl font-black tracking-tight text-neutral-950 sm:text-5xl">
              {event.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-600">
              {event.eventDate && (
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#f7941D]" />
                  {formatDate(event.eventDate)}
                </span>
              )}

              {event.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#f7941D]" />
                  {event.location}
                </span>
              )}
            </div>

            <p className="mt-6 max-w-4xl text-base leading-8 text-neutral-700">
              {event.description || "View photos from this event."}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-8 text-center">
          <p className="mb-3 inline-flex rounded-full bg-orange-100 px-4 py-1.5 text-sm font-bold text-[#d56f00]">
            Event Photos
          </p>

          <h2 className="text-3xl font-black text-neutral-950">Gallery</h2>
        </div>

        {event.gallery.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-200 bg-white p-12 text-center shadow-sm">
            <p className="text-neutral-600">
              Photos for this event will be added soon.
            </p>
          </div>
        ) : (
          <GalleryLightbox images={event.gallery} title={event.title} />
        )}
      </section>
    </main>
  );
}