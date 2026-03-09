"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

const nav = [
  { href: "/", label: "Home" },
  { href: "/stories", label: "Stories" },
  { href: "/events", label: "Events" },
  { href: "/store", label: "Store" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname() || "/";
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-7xl h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/branding/logo.png"
            alt="A Woman's Worth"
            width={210}
            height={48}
            priority
            className="h-auto w-auto relative top-5"
          />
        </Link>

        <div className="hidden md:flex items-center gap-10">
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
                className={`relative text-[17px] font-medium transition
                  ${isActive ? "text-[var(--aww-orange)]" : "text-gray-700 hover:text-[var(--aww-orange)]"}
                  after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-[var(--aww-orange)]
                  ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"} after:transition-all after:duration-200`}
              >
                {n.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative text-gray-700 hover:text-gray-900 p-2"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6m0 0a2 2 0 100 4 2 2 0 000-4zm-10 0a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {itemCount}
              </span>
            )}
          </Link>

          <a
            href="https://www.paypal.com/donate/?hosted_button_id=4HQXUB47ZQSUG"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill bg-[var(--aww-navy)] text-white px-4 py-2 text-sm hover:bg-[#003366]"
          >
            Donate Now
          </a>
        </div>
      </div>
    </nav>
  );
}
