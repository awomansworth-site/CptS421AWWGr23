"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type Story = {
  id: number;
  documentId?: string | null;
  title: string;
  excerpt?: string;
  coverUrl?: string;
  coverFocalY?: "top" | "center" | "bottom";
};

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:1337";

const mediaUrl = (path?: string | null) =>
  !path ? "" : path.startsWith("http") ? path : `${CMS_URL}${path}`;

function objectPosFromFocal(f?: "top" | "center" | "bottom") {
  return f === "top" ? "50% 0%" : f === "bottom" ? "50% 100%" : "50% 50%";
}

export default function StoriesCarousel({ stories }: { stories: Story[] }) {
  const [pageSize, setPageSize] = useState(3);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setPageSize(w >= 1024 ? 3 : w >= 768 ? 2 : 1);
    };

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const pages = useMemo(() => {
    const out: Story[][] = [];

    for (let i = 0; i < stories.length; i += pageSize) {
      out.push(stories.slice(i, i + pageSize));
    }

    return out;
  }, [stories, pageSize]);

  useEffect(() => {
    setIdx(0);
  }, [pageSize, stories.length]);

  useEffect(() => {
    if (pages.length <= 1) return;

    const t = setInterval(() => {
      setIdx((p) => (p + 1) % pages.length);
    }, 6000);

    return () => clearInterval(t);
  }, [pages.length]);

  if (!stories.length) return null;

  return (
    <div className="relative">
      <div className="relative">
        {pages.map((group, i) => (
          <div
            key={i}
            className={`grid gap-6 transition-opacity duration-500 ${
              i === idx
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none absolute inset-0"
            } ${
              pageSize === 1
                ? "grid-cols-1"
                : pageSize === 2
                  ? "md:grid-cols-2"
                  : "lg:grid-cols-3"
            }`}
          >
            {group.map((s) => {
              const objPos = objectPosFromFocal(s.coverFocalY);

              return (
                <Link
                  key={s.id}
                  href={`/stories/${encodeURIComponent(s.documentId || String(s.id))}`}
                  className="group block h-full overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="aspect-video overflow-hidden relative">
                    {s.coverUrl ? (
                      <img
                        src={mediaUrl(s.coverUrl)}
                        alt={s.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        style={{ objectPosition: objPos }}
                      />
                    ) : (
                      <div className="relative h-full w-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0a3680] via-[#0d4ea6] to-[#f79520]" />
                        <div className="absolute inset-0 opacity-10 [background:radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_30%,white,transparent_35%)]" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-[#f7941D]">
                      {s.title}
                    </h3>

                    {s.excerpt && (
                      <p className="mb-4 line-clamp-3 leading-relaxed text-gray-600">
                        {s.excerpt}
                      </p>
                    )}

                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#f7941D] px-4 py-2 text-sm font-medium text-[#f7941D] transition-all duration-300 hover:bg-[#f7941D] hover:text-white">
                      Read Full Story
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {pages.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                idx === i ? "bg-[#f7941D]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}