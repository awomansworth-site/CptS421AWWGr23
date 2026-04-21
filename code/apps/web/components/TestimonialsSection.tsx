"use client";

import { useState, useEffect } from "react";
import { Quote } from "lucide-react";

const testimonials = [
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
    quote: "The workshops and events transformed how I see myself. I'm now mentoring other women in my field.",
    author: "Jennifer Chen",
    role: "Tech Professional",
    image: "https://images.unsplash.com/photo-1555725305-0406b7607be0?w=80&q=80",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrent((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, []);

  const t = testimonials[current];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Community Says</h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from the women whose lives have been transformed.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 via-white to-blue-50 p-8 shadow-xl">
            {/* decorative */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#f7941D]/10 to-transparent rounded-full -translate-y-16 translate-x-16 pointer-events-none" />

            <div className="text-center relative">
              <Quote className="h-12 w-12 text-[#f7941D] mx-auto mb-6" />

              <p className="text-xl md:text-2xl text-gray-800 leading-relaxed italic font-medium mb-6">
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
            </div>
          </div>

          {/* dots */}
          <div className="flex justify-center gap-2 mt-5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === current ? "bg-[#f7941D] scale-125" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
