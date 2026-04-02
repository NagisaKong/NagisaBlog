import Nav from "@/components/Nav";
import { getSiteSetting } from "@/lib/db";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nagisa's Blog",
    template: "%s | Nagisa's Blog",
  },
  description: "A CS student writing about cybersecurity, networking, and project showcases.",
  openGraph: {
    title: "Nagisa's Blog",
    description: "A CS student writing about cybersecurity, networking, and project showcases.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let logoText = "Nagisa/blog";
  try {
    logoText = (await getSiteSetting("logo_text")) ?? logoText;
  } catch {
    // DB not available — use default
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <Nav logoText={logoText} />
        <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">{children}</main>
        <footer className="border-t border-zinc-800 py-6 sm:py-8 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} Nagisa. Built with Next.js & MDX.
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
