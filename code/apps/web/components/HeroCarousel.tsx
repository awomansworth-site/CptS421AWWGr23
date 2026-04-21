"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, ArrowRight } from "lucide-react";

type Slide = { src: string; alt: string; objectPosition?: string };

const LOCAL_SLIDES: Slide[] = [
  { src: "/hero/slide-2.jpeg", alt: "A Woman's Worth community" },
  { src: "/hero/slide-1.jpeg", alt: "A Woman's Worth event" },
  { src: "/hero/slide-3.jpeg", alt: "A Woman's Worth empowerment" },
  { src: "/hero/slide-4.jpeg", alt: "A Woman's Worth celebration", objectPosition: "center 12%" },
];

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";

export default function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>(LOCAL_SLIDES);
  const [current, setCurrent] = useState(0);
  // Refs to Ken Burns wrapper divs — animation restarted via direct DOM,
  // nothing ever remounts so there is zero decode jitter.
  const kbRefs = useRef<(HTMLDivElement | null)[]>([]);

  const restartKenBurns = (idx: number) => {
    const el = kbRefs.current[idx];
    if (!el) return;
    el.style.animation = "none";
    void el.offsetHeight; // flush reflow so the browser resets the animation
    el.style.animation = "kenBurns 8s ease-out forwards";
  };

  const go = (next: number) => {
    const n = (next + slides.length) % slides.length;
    restartKenBurns(n);
    setCurrent(n);
  };

  // Kick off Ken Burns on the first slide once refs are ready
  useEffect(() => {
    restartKenBurns(0);
  }, []);

  useEffect(() => {
    const t = setInterval(() => go(current + 1), 5000);
    return () => clearInterval(t);
  }, [current, slides.length]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${CMS_URL}/api/hero-slides?populate=image&sort=createdAt:asc`, { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        const rows: any[] = Array.isArray(json) ? json : json?.data || [];
        const mapped: Slide[] = rows
          .map((node: any) => node?.attributes ?? node)
          .map((a: any) => {
            const raw =
              a?.image?.url ||
              a?.image?.data?.attributes?.url ||
              (Array.isArray(a?.image?.data) && a.image.data[0]?.attributes?.url) ||
              "";
            if (!raw) return null;
            return { src: raw.startsWith("http") ? raw : `${CMS_URL}${raw}`, alt: a?.alt || "" };
          })
          .filter(Boolean) as Slide[];
        if (!cancelled && mapped.length) { setSlides(mapped); setCurrent(0); }
      } catch { /* keep LOCAL_SLIDES */ }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[700px] flex items-center justify-center overflow-hidden">
      {slides.map((s, idx) => (
        <div
          key={`slide-${idx}`}
          className="absolute inset-0"
          style={{
            opacity: idx === current ? 1 : 0,
            transition: 'opacity 1800ms cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: idx === current ? 1 : 0,
            willChange: 'opacity',
          }}
        >
          {/* Ken Burns wrapper — never remounted; animation restarted via DOM ref */}
          <div
            ref={(el) => { kbRefs.current[idx] = el; }}
            className="w-full h-full"
            style={{ willChange: 'transform' }}
          >
            <img
              src={s.src}
              alt={s.alt}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
              style={{ objectPosition: s.objectPosition ?? 'center center' }}
            />
          </div>
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50" />

      <div className="relative z-10 text-center text-white w-full px-8">
        <h1
          className="font-extrabold uppercase tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] whitespace-nowrap"
          style={{ fontSize: 'clamp(1.2rem, 3vw, 2.8rem)', lineHeight: 1.1 }}
        >
          Refuse to Miss <span className="text-[#f7941D]">Your Blessings</span>
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/donate"
            className="inline-flex items-center justify-center gap-2 bg-[#004080] hover:bg-[#003066] text-white px-8 py-3 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Heart size={18} />
            Make a Donation
          </Link>
          <Link
            href="/stories"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/80 text-white hover:bg-white hover:text-[#f7941D] px-8 py-3 font-semibold rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            Read Our Stories
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <button
        onClick={() => go(current - 1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/35 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="text-white" size={20} />
      </button>
      <button
        onClick={() => go(current + 1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/35 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="text-white" size={20} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => go(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === current ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
