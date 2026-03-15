import { HeartHandshake, BookOpen, Users, MessageCircleHeart, ArrowRight } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "Development Stage",
    icon: HeartHandshake,
    description:
      "We help women reconnect with their strengths, rediscover their purpose, and begin shaping a future aligned with their true potential.",
  },
  {
    title: "Workshops",
    icon: BookOpen,
    description:
      "Our workshops include guided journaling, poetry readings, writing activities, and practical exercises that help participants define goals and build plans.",
  },
  {
    title: "Group Gatherings",
    icon: Users,
    description:
      "Participants join supportive group environments where they can share experiences, receive encouragement, and build meaningful community connections.",
  },
  {
    title: "One-on-One Counseling",
    icon: MessageCircleHeart,
    description:
      "Individual support sessions give participants space to discuss challenges, reflect on progress, and receive encouragement from experienced mentors.",
  },
];

export const metadata = {
  title: "Services | A Woman's Worth",
  description:
    "Explore the programs and support services offered by A Woman's Worth.",
};

export default function ServicesPage() {
  return (
    <main className="bg-white text-[var(--aww-text)]">
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="aww-grad rounded-[28px] px-8 py-12 text-white shadow-[0_18px_40px_rgba(0,0,0,.12)]">
            <div className="max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                Programs & Support
              </p>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                Services designed to uplift, empower, and restore.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
                We provide intentional spaces, guided programs, and supportive
                resources that help women move toward healing, confidence, and
                purpose.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">How We Serve</h2>
          <p className="mt-4 text-lg leading-8 text-neutral-600">
            Each service is meant to meet women where they are and help them
            move forward with clarity, support, and community.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="group rounded-[24px] border border-black/5 bg-white p-7 shadow-[0_10px_30px_rgba(0,0,0,.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,.10)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[rgba(247,148,29,.12)] text-[var(--aww-orange)]">
                    <Icon className="h-7 w-7" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-base leading-7 text-neutral-600">
                      {service.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="rounded-[28px] bg-neutral-50 px-8 py-10 shadow-[0_10px_30px_rgba(0,0,0,.05)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--aww-orange)]">
                More than a program
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-neutral-900 sm:text-4xl">
                A support system built around growth and hope.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
                Our goal is not only to provide services, but to create a space
                where women feel seen, supported, and equipped to move toward a
                brighter future.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-start">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[var(--aww-orange)] px-6 py-3 font-semibold text-white transition hover:brightness-95"
              >
                Contact Us
              </Link>

              <Link
                href="/events"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-6 py-3 font-semibold text-neutral-800 transition hover:bg-neutral-100"
              >
                View Events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}