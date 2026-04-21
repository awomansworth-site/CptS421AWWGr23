"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { href: "/",             label: "Home" },
  { href: "/services",     label: "Services" },
  { href: "/stories",      label: "Stories" },
  { href: "/events",       label: "Events" },
  { href: "/partnerships", label: "Partnerships" },
  { href: "/store",        label: "Store" },
  { href: "/contact",      label: "Contact" },
];

function isActive(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export default function Navigation() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center flex-shrink-0">
            <div className="relative h-[52px] w-[280px] overflow-visible">
              <Image
                src="/branding/logo.png"
                alt="A Woman's Worth"
                fill
                priority
                sizes="280px"
                className="object-contain object-left scale-[1.45] origin-top-left translate-y-0.5 -translate-x-10"
              />
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV.map((n) => {
              const active = isActive(n.href, pathname);
              return (
                <motion.div
                  key={n.href}
                  className="relative"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Link
                    href={n.href}
                    className={`block px-3 py-2 text-[15px] font-medium rounded transition-colors ${
                      active ? "text-[#f7941D]" : "text-gray-600 hover:text-[#f7941D]"
                    }`}
                  >
                    {n.label}
                  </Link>
                  {active && (
                    <motion.span
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#f7941D] rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Donate + hamburger */}
          <div className="flex items-center gap-3">
            <motion.a
              href="https://www.paypal.com/donate/?hosted_button_id=4HQXUB47ZQSUG"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center justify-center bg-[#004080] hover:bg-[#003066] text-white px-5 py-2 rounded-full text-sm font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              Donate Now
            </motion.a>
            <button
              className="md:hidden p-2 rounded text-gray-600 hover:text-[#f7941D] transition-colors"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {NAV.map((n, i) => {
                const active = isActive(n.href, pathname);
                return (
                  <motion.div
                    key={n.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className={`block w-full px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                        active
                          ? "text-[#f7941D] bg-orange-50"
                          : "text-gray-600 hover:text-[#f7941D] hover:bg-gray-50"
                      }`}
                    >
                      {n.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV.length * 0.04, type: "spring", stiffness: 300, damping: 25 }}
              >
                <a
                  href="https://www.paypal.com/donate/?hosted_button_id=4HQXUB47ZQSUG"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="block w-full mt-2 px-3 py-2.5 rounded-lg text-base font-medium text-center bg-[#004080] text-white hover:bg-[#003066] transition-colors"
                >
                  Donate Now
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
