"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calendar as Cal, MapPin, ArrowRight } from "lucide-react";

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

function fmtDateOnly(iso?: string | null) {
  if (!iso) return "TBA";

  try {
    return new Date(iso).toLocaleDateString("en-US", {
      dateStyle: "medium",
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

function DateBadge({ iso }: { iso: string | null }) {
  if (!iso) return null;

  const d = new Date(iso);
  const month = d
    .toLocaleString("en-US", { month: "short", timeZone: "UTC" })
    .toUpperCase();
  const day = d.getUTCDate();

  return (
    <div className="min-w-[58px] flex-shrink-0 rounded-xl bg-[#f7941D] px-3 py-2 text-center text-white shadow-sm">
      <div className="text-[10px] font-semibold tracking-wide">{month}</div>
      <div className="text-2xl font-bold leading-tight">{day}</div>
    </div>
  );
}

function GradientFallback() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#0a3680] via-[#0d4ea6] to-[#f79520]">
      <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_30%,white,transparent_30%)]" />
      <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-20 -right-20 h-52 w-52 rounded-full bg-white/10" />
    </div>
  );
}

function EventCard({ ev }: { ev: EventItem }) {
  const href = ev.documentId?.startsWith("placeholder")
    ? "/events"
    : `/events/${encodeURIComponent((ev.documentId || ev.id).toString())}`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="grid md:grid-cols-[280px_1fr]">
        <div className="h-48 w-full overflow-hidden bg-neutral-100 md:h-full">
          {ev.imageUrl ? (
            <img
              src={ev.imageUrl}
              alt={ev.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <GradientFallback />
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <DateBadge iso={ev.startDateTime} />

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {ev.featured && (
                  <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-[#f7941D]">
                    Featured
                  </span>
                )}

                {ev.category && (
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800">
                    {ev.category}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold leading-snug text-neutral-900">
                {ev.title}
              </h2>

              <div className="mt-3 space-y-2 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <Cal className="h-4 w-4 flex-shrink-0 text-[#f7941D]" />
                  <span>
                    {fmtDateOnly(ev.startDateTime)} ·{" "}
                    {fmtTimeRange(ev.startDateTime, ev.endDateTime)}
                  </span>
                </div>

                {ev.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-[#f7941D]" />
                    <span>{ev.location}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#f7941D]">
                View Event Details
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function EventsTabs({ events }: { events: EventItem[] }) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const { upcoming, past } = useMemo(() => {
    const now = new Date();

    const upcomingEvents = events.filter(
      (e) => !e.startDateTime || new Date(e.startDateTime) >= now
    );

    const pastEvents = events
      .filter((e) => e.startDateTime && new Date(e.startDateTime) < now)
      .reverse();

    return {
      upcoming: upcomingEvents,
      past: pastEvents,
    };
  }, [events]);

  const visibleEvents = activeTab === "upcoming" ? upcoming : past;

  return (
    <section className="mt-8">
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-full bg-neutral-100 p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeTab === "upcoming"
                ? "bg-[#f7941D] text-white shadow"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Upcoming Events
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("past")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              activeTab === "past"
                ? "bg-[#f7941D] text-white shadow"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Past Events
          </button>
        </div>
      </div>

      {visibleEvents.length === 0 ? (
        <div className="rounded-2xl border border-black/5 bg-white py-16 text-center shadow-sm">
          <p className="text-neutral-500">
            {activeTab === "upcoming"
              ? "No upcoming events at this time. Check back soon!"
              : "No past events available yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {visibleEvents.map((ev) => (
            <EventCard key={ev.id} ev={ev} />
          ))}
        </div>
      )}
    </section>
  );
}