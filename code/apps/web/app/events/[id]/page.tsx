import { Calendar as Cal, MapPin, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CMS_URL as CMS_URL_FROM_LIB } from "@/lib/strapi";

export const revalidate = 0;

const CMS_URL =
  process.env.NEXT_PUBLIC_CMS_URL || CMS_URL_FROM_LIB || "http://localhost:1337";

const mediaUrl = (p?: string | null) =>
  !p ? "" : p.startsWith("http") ? p : `${CMS_URL}${p}`;

const pickImageUrl = (img: any): string | null =>
  img?.url || img?.data?.attributes?.url || null;

function fmtDateOnly(iso?: string | null) {
  if (!iso) return "TBA";

  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return "TBA";
  }
}

function fmtTime(iso?: string | null) {
  if (!iso) return null;

  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });
  } catch {
    return null;
  }
}

function fmtTimeRange(startIso?: string | null, endIso?: string | null) {
  const start = fmtTime(startIso);
  const end = fmtTime(endIso);

  if (start && end) return `${start} – ${end}`;
  if (start) return start;
  if (end) return end;

  return "Time TBA";
}

function GradientFallback() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#0a3680] via-[#0d4ea6] to-[#f79520]">
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_30%,white,transparent_30%)]" />
      <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/10" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/10" />
    </div>
  );
}

function renderSummary(summary: any) {
  if (!Array.isArray(summary)) return null;

  return summary.map((block: any, i: number) => {
    const text = block?.children?.map((c: any) => c?.text || "").join("") || "";

    if (!text.trim()) return null;

    if (block?.type === "heading") {
      return (
        <h2 key={i} className="mt-6 text-2xl font-bold text-neutral-900">
          {text}
        </h2>
      );
    }

    return (
      <p key={i} className="leading-relaxed text-neutral-700">
        {text}
      </p>
    );
  });
}

type EventData = {
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
  summary?: any;
};

function mapEventRow(row: any): EventData | null {
  if (!row) return null;

  const a = row?.attributes ?? row;
  const img = pickImageUrl(a?.image);

  return {
    id: row.id ?? a.id,
    documentId: row.documentId ?? a.documentId,
    title: a?.title ?? "Event",
    startDateTime: a?.startDateTime ?? null,
    endDateTime: a?.endDateTime ?? null,
    location: a?.location ?? null,
    imageUrl: img ? mediaUrl(img) : "",
    category: a?.category ?? null,
    featured: a?.featured ?? false,
    rsvpEmail: a?.rsvpEmail ?? null,
    summary: a?.summary ?? null,
  };
}

async function getEventByAnyId(idOrDocId: string): Promise<EventData | null> {
  const isNumeric = /^\d+$/.test(idOrDocId);

  async function hitNumeric() {
    const url = `${CMS_URL}/api/events/${idOrDocId}?populate=image`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) return null;

    const row = (await res.json())?.data;
    return mapEventRow(row);
  }

  async function hitDocumentId() {
    const url = `${CMS_URL}/api/events?populate=image&filters[documentId][$eq]=${encodeURIComponent(
      idOrDocId
    )}&pagination[pageSize]=1`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) return null;

    const row = (await res.json())?.data?.[0];
    return mapEventRow(row);
  }

  if (isNumeric) {
    const hit = await hitNumeric();
    if (hit) return hit;
    return hitDocumentId();
  }

  return hitDocumentId();
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getEventByAnyId(id);

  if (!data) return notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <section
        className="rounded-2xl p-6 text-white shadow-lg"
        style={{
          background:
            "linear-gradient(135deg,#0a3680 0%,#0d4ea6 55%,#f79520 100%)",
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {data.featured && (
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                  Featured
                </span>
              )}

              {data.category && (
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                  {data.category}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-extrabold">{data.title}</h1>
            <p className="mt-1 text-white/85">Details & information</p>
          </div>

          <Link
            href="/events"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm transition hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="h-64 w-full overflow-hidden bg-neutral-100 sm:h-80">
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt={data.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <GradientFallback />
          )}
        </div>

        <div className="p-6">
          <div className="rounded-2xl bg-neutral-50 p-5">
            <div className="space-y-3 text-sm text-neutral-700">
              <div className="flex items-center gap-2">
                <Cal className="h-4 w-4 flex-shrink-0 text-[#f7941D]" />
                <span>
                  {fmtDateOnly(data.startDateTime)} ·{" "}
                  {fmtTimeRange(data.startDateTime, data.endDateTime)}
                </span>
              </div>

              {data.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-[#f7941D]" />
                  <span>{data.location}</span>
                </div>
              )}

              {data.rsvpEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0 text-[#f7941D]" />
                  <a
                    href={`mailto:${data.rsvpEmail}`}
                    className="hover:underline underline-offset-4"
                  >
                    {data.rsvpEmail}
                  </a>
                </div>
              )}
            </div>
          </div>

          {Array.isArray(data.summary) && data.summary.length > 0 && (
            <div className="mt-6 space-y-4">
              {renderSummary(data.summary)}
            </div>
          )}

          <div className="mt-8">
            <Link
              href="/events"
              className="inline-flex items-center rounded-full border border-neutral-300 px-5 py-2.5 font-medium text-neutral-800 transition hover:bg-neutral-50"
            >
              Back to Events
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}