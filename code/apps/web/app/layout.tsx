import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";
import Navigation from "@/components/Navigation";
import { CartProvider } from "@/app/context/CartContext";
import { CMS_URL as CMS_URL_FROM_LIB } from "@/lib/strapi";

const CMS_URL =
  process.env.NEXT_PUBLIC_CMS_URL || CMS_URL_FROM_LIB || "http://localhost:1337";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A Woman's Worth",
  description: "Empowering women through community, support, and transformative programs.",
};

async function getDonationUrl(): Promise<string | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/donation-links`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const first = json?.data?.[0];
    const data = first?.attributes ?? first;

    return data?.donationUrl ?? null;
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const donationUrl = await getDonationUrl();
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navigation donationUrl={donationUrl} />
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
