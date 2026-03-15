"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/stories", label: "Stories" },
  { href: "/events", label: "Events" },
  { href: "/partnerships", label: "Partnerships" },
  { href: "/store", label: "Store" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname() || "/";

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-7xl h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="relative z-50 h-[68px] w-[360px] sm:w-[380px]  md:w-[400px] overflow-visible">
            <Image
              src="/branding/logo.png"
              alt="A Woman's Worth"
              fill
              priority
              sizes="(max-width: 640px) 360px, (max-width: 768px) 380px, 400px"
              // Logo PNG has large transparent padding; scale + top-anchor keeps top visible and allows bottom bleed.
              className="pointer-events-none object-contain object-left object-top scale-[1.5] origin-top-left translate-y-1 -translate-x-16"
          />
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {nav.map((n) => {
            const isActive =
              n.href === "/"
                ? pathname === "/"
                : pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative py-1 text-[17px] font-medium transition-colors
                  ${
                    isActive 
                    ? "text-[var(--aww-orange)]"
                    : "text-gray-700 hover:text-[var(--aww-orange)]"
                  }
                  after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-[var(--aww-orange)] after:origin-left after:transition-transform after:duration-200
                  ${
                    isActive 
                    ? "after:scale-x-100" 
                    : "after:scale-x-0 hover:after:scale-x-100"}
                  `}
              >
                {n.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center">
          <Link
            href="https://www.paypal.com/donate/?hosted_button_id=4HQXUB47ZQSUG"
            className="btn-pill bg-[var(--aww-navy)] text-white px-4 py-2 text-sm hover:bg-[#003366]"
          >
            Donate Now
          </Link>
        </div>
      </div>
    </nav>
  );
}
