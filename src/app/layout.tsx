import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { coupleNames, mainEvent } from "@/content/wedding";
import { longDate } from "@/lib/dates";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans",
});

const title = `${coupleNames} | ${longDate(mainEvent.date)}`;
const description = `You're invited to celebrate the wedding of ${coupleNames}.`;

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/images/logo.svg" },
  openGraph: { title, description, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#f8f5ed",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
