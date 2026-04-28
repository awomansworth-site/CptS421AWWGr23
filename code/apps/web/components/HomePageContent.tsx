"use client";

import { Calendar, MapPin, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import StoriesCarousel from "./StoriesCarousel";
// ── Types ─────────────────────────────────
export type StoryCard = {
  id: number;
  documentId?: string | null;
  title: string;
  coverUrl?: string;
  excerpt?: string;
};

export type EventCard = {
  id: number;
  documentId?: string | null;
  title: string;
  startDateTime?: string;
  location?: string;
};

// ── Animations (fixed types) ──────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const VP = { once: true, margin: "-50px" } as const;

// ── Helpers ───────────────────────────────

function eventHref(e: EventCard) {
  return e.documentId ? `/events/${encodeURIComponent(e.documentId)}` : "/events";
}

function fmtMonthDay(iso?: string) {
  if (!iso) return { month: "TBA", day: "" };
  const d = new Date(iso);
  return {
    month: d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase(),
    day: String(d.getUTCDate()),
  };
}

function fmtTime(iso?: string) {
  if (!iso) return "TBA";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

// ── Component ─────────────────────────────
export default function HomePageContent({
  stories: cmsStories,
  events: cmsEvents,
  sponsorStrip,
}: {
  stories: StoryCard[];
  events: EventCard[];
  sponsorStrip?: React.ReactNode;
}) {
  const events = cmsEvents.slice(0, 2);

  return (
    <div className="min-h-screen bg-white">

      {/* ── About ───────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.section
          className="text-center"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-[#f7941D]">A Woman&apos;s Worth</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            We believe every woman has inherent worth and unlimited potential.
          </motion.p>

          <motion.div variants={fadeUp}>
            <Link href="/stories" className="inline-flex items-center gap-2 bg-[#f7941D] text-white px-8 py-3 rounded-full">
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.section>
      </div>

      {sponsorStrip}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-16">

        {/* ── Stories ───────────────── */}
        <motion.section variants={stagger} initial="hidden" whileInView="visible" viewport={VP}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Stories</h2>
          </motion.div>
          {cmsStories.length === 0 ? (
              <p className="text-center text-gray-500">No stories available yet.</p>
          ) : (
         <StoriesCarousel stories={cmsStories} />
          )}  
        </motion.section>

        {/* ── EVENTS (STYLE FIXED) ───────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="bg-gradient-to-br from-gray-50 to-orange-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 rounded-2xl"
        >
          <motion.div variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Upcoming Events</h2>
          </motion.div>

          {events.length === 0 ? (
            <p className="text-center text-gray-500">No upcoming events available yet.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {events.map((ev) => {
                const { month, day } = fmtMonthDay(ev.startDateTime);

                return (
                  <motion.div key={ev.id} variants={fadeUp}>
                    <Link href={eventHref(ev)} className="block bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="bg-[#f7941D] text-white p-3 rounded-xl text-center min-w-[56px]">
                          <div className="text-xs">{month}</div>
                          <div className="text-xl font-bold">{day}</div>
                        </div>

                        <div>
                          <h3 className="font-bold">{ev.title}</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {fmtTime(ev.startDateTime)}
                          </div>
                          {ev.location && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              {ev.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.section>

        {/* ── CTA ───────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="bg-gradient-to-br from-[#004080] via-[#0056b3] to-[#003066] text-white rounded-2xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-20 -translate-y-20 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-16 translate-y-16 pointer-events-none" />
          <div className="relative z-10">
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold mb-5">
            Get Involved Today
          </motion.h2>

          <motion.p variants={fadeUp} className="text-lg md:text-xl mb-8 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Every woman deserves to know her worth. Join our community and help us create lasting change.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="https://www.paypal.com/donate/?hosted_button_id=4HQXUB47ZQSUG"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#f7941D] to-[#F79520] hover:from-[#e8830a] hover:to-[#e8830a] text-white px-8 py-3 font-bold rounded-full shadow-xl transition-all duration-300"
              >
                <Heart className="h-4 w-4" />
                Donate Now
              </motion.a>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/events" className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-[#004080] px-8 py-3 font-bold rounded-full transition-all duration-300">
                  Join an Event
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/stories/submit" className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-[#004080] px-8 py-3 font-bold rounded-full transition-all duration-300">
                  Share Your Story
                </Link>
              </motion.div>
            </motion.div>
            </div>
        </motion.section>
      </div>
    </div>
  );
}