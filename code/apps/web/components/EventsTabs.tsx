"use client";

import { Calendar as Cal, MapPin } from "lucide-react";

export type EventItem = {
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

const FALLBACK_IMG = "/branding/logo.png";

function fmtDateOnly(iso?: string | null) {
  if (!iso) return "TBA";
  try {
    return new Date(iso).toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "UTC" });
  } catch {
    return "TBA";
  }
}

function fmtTime(iso?: string | null) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "UTC" });
  } catch {
    return null;
  }
}

function DateBadge({ iso }: { iso: string | null }) {
  if (!iso) return null;
  const d = new Date(iso);
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate();
  return (
    <div className="flex-shrink-0 rounded-xl bg-[#f7941D] px-3 py-2 text-center text-white min-w-[52px]">
      <div className="text-[10px] font-semibold tracking-wide">{month}</div>
      <div className="text-2xl font-bold leading-tight">{day}</div>
    </div>
  );
}

function EventCard({ ev }: { ev: EventItem }) {
  const href = ev.documentId?.startsWith("placeholder")
    ? "/events"
    : `/events/${encodeURIComponent((ev.documentId || ev.id).toString())}`;

  return (
    <a href={href} className="block overflow-hidden rounded-2xl border border-black/5 bg-white shadow transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="h-48 sm:h-56 w-full overflow-hidden bg-neutral-200">
        <img
          src={ev.imageUrl || FALLBACK_IMG}
          alt={ev.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start gap-3">
          <DateBadge iso={ev.startDateTime} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {ev.featured && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Featured</span>
              )}
              {ev.category && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">{ev.category}</span>
              )}
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 leading-snug">{ev.title}</h2>
            <div className="mt-2 space-y-1 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <Cal className="h-4 w-4 flex-shrink-0" />
                {fmtDateOnly(ev.startDateTime)}
              </div>
              {fmtTime(ev.startDateTime) && (
                <div className="flex items-center gap-2 pl-6">
                  {fmtTime(ev.startDateTime)}
                  {fmtTime(ev.endDateTime) && <><span>–</span>{fmtTime(ev.endDateTime)}</>}
                </div>
              )}
              {ev.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  {ev.location}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function EventsTabs({ events }: { events: EventItem[] }) {
  const now = new Date();
  const upcoming = events.filter((e) => !e.startDateTime || new Date(e.startDateTime) >= now);

  return (
    <section className="mt-6 space-y-6">
      {upcoming.length === 0 ? (
        <p className="text-center text-neutral-500 py-16">No upcoming events at this time. Check back soon!</p>
      ) : (
        upcoming.map((ev) => (
          <EventCard key={ev.id} ev={ev} />
        ))
      )}
    </section>
  );
}
