"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, ArrowRight, Heart, Quote } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────────
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

// ── Static data ────────────────────────────────────────────────────────────────
const PLACEHOLDER_STORIES: StoryCard[] = [
  {
    id: 1001,
    documentId: "placeholder-1",
    title: "Sarah's Journey to Success",
    coverUrl: "https://images.unsplash.com/photo-1507005941618-1ca013b9a018?w=600&q=80",
    excerpt: "From single mother to business owner, Sarah's story shows how community support can transform lives.",
  },
  {
    id: 1002,
    documentId: "placeholder-2",
    title: "Breaking Barriers Together",
    coverUrl: "https://images.unsplash.com/photo-1573167243872-43c6433b9d40?w=600&q=80",
    excerpt: "How our mentorship program helped Maria overcome obstacles and pursue her dreams in technology.",
  },
  {
    id: 1003,
    documentId: "placeholder-3",
    title: "Finding Your Voice",
    coverUrl: "https://images.unsplash.com/photo-1555725305-0406b7607be0?w=600&q=80",
    excerpt: "Jennifer's powerful story of self-advocacy and how she found her strength through our community.",
  },
];

const PLACEHOLDER_EVENTS: EventCard[] = [
  {
    id: 2001,
    documentId: "placeholder-ev-1",
    title: "Women's Leadership Workshop",
    startDateTime: "2026-06-15T18:00:00.000Z",
    location: "Community Center, Downtown",
  },
  {
    id: 2002,
    documentId: "placeholder-ev-2",
    title: "New Year, New Opportunities",
    startDateTime: "2026-07-20T10:00:00.000Z",
    location: "Virtual Event",
  },
];

const TESTIMONIALS = [
  {
    quote: "AWW gave me the confidence to start my own business. The support and mentorship I received was life-changing.",
    author: "Maria Rodriguez",
    role: "Entrepreneur & Mother",
    image: "https://images.unsplash.com/photo-1507005941618-1ca013b9a018?w=80&q=80",
  },
  {
    quote: "I found my voice through this incredible community. Every woman should know her worth and potential.",
    author: "Sarah Johnson",
    role: "Community Leader",
    image: "https://images.unsplash.com/photo-1573167243872-43c6433b9d40?w=80&q=80",
  },
  {
    quote: "The workshops and events transformed how I see myself. I am now mentoring other women in my field.",
    author: "Jennifer Chen",
    role: "Tech Professional",
    image: "https://images.unsplash.com/photo-1555725305-0406b7607be0?w=80&q=80",
  },
];

// ── Animation variants ─────────────────────────────────────────────────────────
const fadeUp  = { hidden: { opacity: 0, y: 36 },  visible: { opacity: 1, y: 0,  transition: { duration: 0.6, ease: "easeOut" } } };
const slideL  = { hidden: { opacity: 0, x: -36 }, visible: { opacity: 1, x: 0,  transition: { duration: 0.6, ease: "easeOut" } } };
const slideR  = { hidden: { opacity: 0, x:  36 }, visible: { opacity: 1, x: 0,  transition: { duration: 0.6, ease: "easeOut" } } };
const stagger = { hidden: { opacity: 1 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

const VP = { once: true, margin: "-50px" } as const;

// ── Helpers ────────────────────────────────────────────────────────────────────
function storyHref(s: StoryCard) {
  if (!s.documentId || s.documentId.startsWith("placeholder")) return "/stories";
  return `/stories/${encodeURIComponent(s.documentId)}`;
}

function eventHref(e: EventCard) {
  if (!e.documentId || e.documentId.startsWith("placeholder")) return "/events";
  return `/events/${encodeURIComponent(e.documentId)}`;
}

function fmtMonthDay(iso?: string) {
  if (!iso) return { month: "TBA", day: "" };
  const d = new Date(iso);
  return { month: d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase(), day: String(d.getUTCDate()) };
}

function fmtTime(iso?: string) {
  if (!iso) return "TBA";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" });
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function HomePageContent({
  stories: cmsStories,
  events: cmsEvents,
  sponsorStrip,
}: {
  stories: StoryCard[];
  events: EventCard[];
  sponsorStrip?: React.ReactNode;
}) {
  const cmsIds = new Set(cmsStories.map((s) => s.id));
  const extras = PLACEHOLDER_STORIES.filter((s) => !cmsIds.has(s.id));
  const stories = [...cmsStories, ...extras].slice(0, 3);
  const events = cmsEvents.length > 0 ? cmsEvents : PLACEHOLDER_EVENTS;

  const [testimonialIdx, setTestimonialIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTestimonialIdx((p) => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);
  const t = TESTIMONIALS[testimonialIdx];

  return (
    <div className="min-h-screen bg-white">

      {/* ── About ──────────────────────────────────────────────────────────── */}
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
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            We believe every woman has inherent worth and unlimited potential. Through mentorship,
            community support, and empowerment programs, we help women discover their strength,
            pursue their dreams, and create positive change in their lives and communities.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f7941D] to-[#F79520] hover:from-[#e8830a] hover:to-[#e8830a] text-white px-8 py-3 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Learn More About Our Impact
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.section>
      </div>

      {/* ── Stats + Sponsors — full width ──────────────────────────────────── */}
      {sponsorStrip}

      {/* ── Rest of page ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-16">

        {/* ── Featured Stories ─────────────────────────────────────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Stories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real women, real transformations. Discover the inspiring journeys of our community members.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {stories.slice(0, 3).map((story, i) => (
              <motion.div
                key={story.id}
                variants={i % 2 === 0 ? slideL : slideR}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <Link
                  href={storyHref(story)}
                  className="block rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white h-full"
                >
                  <div className="aspect-video overflow-hidden relative">
                    {story.coverUrl ? (
                      <img
                        src={story.coverUrl}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0a3680] via-[#0d4ea6] to-[#f79520]" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#f7941D] transition-colors">
                      {story.title}
                    </h3>
                    {story.excerpt && (
                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{story.excerpt}</p>
                    )}
                    <span className="inline-flex items-center gap-2 w-full justify-center border border-[#f7941D] text-[#f7941D] hover:bg-[#f7941D] hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300">
                      Read Full Story
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Upcoming Events ──────────────────────────────────────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
          className="bg-gradient-to-br from-gray-50 to-orange-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 rounded-2xl"
        >
          <motion.div variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join us for inspiring events that bring our community together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {events.slice(0, 2).map((ev) => {
              const { month, day } = fmtMonthDay(ev.startDateTime);
              return (
                <motion.div
                  key={ev.id}
                  variants={fadeUp}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={eventHref(ev)}
                    className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-[#f7941D] to-[#F79520] text-white p-3 rounded-xl flex-shrink-0 shadow-md text-center min-w-[56px]">
                        <div className="text-[10px] font-bold opacity-90 tracking-wide">{month}</div>
                        <div className="text-2xl font-bold leading-tight">{day}</div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{ev.title}</h3>
                        <div className="flex items-center text-gray-600 mb-1">
                          <Calendar className="h-4 w-4 mr-2 text-[#f7941D] flex-shrink-0" />
                          <span className="text-sm">{fmtTime(ev.startDateTime)}</span>
                        </div>
                        {ev.location && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-[#f7941D] flex-shrink-0" />
                            <span className="text-sm">{ev.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── Testimonials ─────────────────────────────────────────────────── */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <motion.div variants={fadeUp} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from the women whose lives have been transformed.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="max-w-3xl mx-auto">
            <div className="relative rounded-2xl bg-gradient-to-br from-orange-50 via-white to-blue-50 p-8 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#f7941D]/10 to-transparent rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
              <div className="text-center relative">
                <Quote className="h-12 w-12 text-[#f7941D] mx-auto mb-6" />
                <motion.div
                  key={testimonialIdx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <p className="text-xl md:text-2xl text-gray-800 leading-relaxed italic font-medium">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                      <img src={t.image} alt={t.author} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">{t.author}</p>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-5">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${i === testimonialIdx ? "bg-[#f7941D] scale-125" : "bg-gray-300 hover:bg-gray-400"}`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
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
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold mb-5">Get Involved Today</motion.h2>
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
