"use client";
import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/stories", label: "Stories" },
  { href: "/events", label: "Events" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/partnerships", label: "Partnerships" },
  { href: "/store", label: "Store" },
  { href: "/contact", label: "Contact" },
];

const FALLBACK_DONATION_URL =
  "https://www.paypal.com/donate/?hosted_button_id=4HQXUB47ZQSUG";

function safeExternalUrl(url?:string | null){
  if(!url) return FALLBACK_DONATION_URL;
  try{
    const parsed = new URL(url);
    if(parsed.protocol == "https:" || parsed.protocol == "http:"){
      return parsed.toString();
    }
  }catch{
    return FALLBACK_DONATION_URL;
  }

  return FALLBACK_DONATION_URL;
}



export default function Navigation({
  donationUrl,
}: {
  donationUrl?:string|null;
}){

  const pathname = usePathname() || "/";
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [open, setOpen] = useState(false);
  const finalDonationUrl = safeExternalUrl(donationUrl);

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="mx-auto h-20 w-full px-3 sm:px-6 lg:px-8 grid grid-cols-[auto_1fr_auto] items-center">
        <Link href="/" className="flex items-center justify-self-start" onClick={() => setOpen(false)}>
          <div className="relative h-[72px] w-[260px] overflow-visible sm:w-[230px] lg:w-[280px]">
            <Image
              src="/branding/logo.png"
              alt="A Woman's Worth"
              fill
              priority
              sizes="(max-width: 640px) 190px, (max-width: 1024px) 260px, 290px"
              // Logo PNG has large transparent padding; scale + top-anchor keeps top visible and allows bottom bleed.
              className="pointer-events-none object-contain object-left object-top object-center scale-[1.2] sm:scale-[1.3] lg:scale-[1.5] origin-top-left translate-y-1 -translate-x-16"
          />
          </div>
        </Link>

        <div className="hidden lg:flex items-center justify-center gap-7">
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
                className={`relative py-1 text-[16px] font-medium transition-colors
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

        <div className="flex items-center justify-self-end gap-2 sm:gap-3">
          <Link
            href="/cart"
            aria-label={`Cart${totalItems > 0 ? ` (${totalItems} item${totalItems === 1 ? "" : "s"})` : ""}`}
            className="relative inline-flex items-center justify-center rounded-full p-2 text-gray-700 hover:text-[var(--aww-orange)] hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 rounded-full bg-[var(--aww-orange)] text-white text-xs font-semibold flex items-center justify-center"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
          <a
            href={finalDonationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-[var(--aww-navy)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#003366] sm:inline-flex"
          >
            Donate Now
          </a>
          <button
            type="button"
            aria-label={open? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex rounded-full p-2 text-gray-700 transition hover:bg-gray-100 hover:text-[var(--aww-orange)] lg:hidden"
          >
            {open? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-lg lg:hidden">
          <div className="flex flex-col gap-1">
            {nav.map((n) => {
              const isActive=
                n.href === "/"
                  ? pathname === "/"
                  : pathname === n.href || pathname.startsWith(n.href + "/");
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive? "page" : undefined}
                  className={`rounded-xl px-4 py-3 text-base font-medium transition
                    ${
                      isActive
                        ? "bg-orange-50 text-[var(--aww-orange)]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[var(--aww-orange)]"
                    }`}
                >
                {n.label}
                </Link>
              );
            })}
            <a
              href={finalDonationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-full bg-[var(--aww-navy)] px-4 py-3 text-center text-base font-semibold text-white transition hover:bg-[#003366]"
            >
              Donate Now
            </a>
          </div>
        </div>

      )}
    </nav>
  );
}
