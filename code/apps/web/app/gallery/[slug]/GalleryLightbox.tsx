"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function GalleryLightbox({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!selected) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {images.map((img, i) => (
          <button
            key={`${img}-${i}`}
            type="button"
            onClick={() => setSelected(img)}
            className="mb-5 block w-full break-inside-avoid overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <img
              src={img}
              className="h-auto w-full object-cover transition duration-500 hover:scale-105"
              style={{ imageOrientation: "from-image" }}
              alt={`${title} photo ${i + 1}`}
            />
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={() => setSelected(null)}
            className="absolute right-5 top-5 rounded-full bg-white/95 p-2 text-neutral-900 shadow-lg transition hover:bg-white"
          >
            <X className="h-6 w-6" />
          </button>

          <img
            src={selected}
            alt={title}
            className="max-h-[90vh] max-w-[95vw] rounded-2xl object-contain shadow-2xl"
            style={{ imageOrientation: "from-image" }}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}