import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

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
    default: "HAL's Blog",
    template: "%s | HAL's Blog",
  },
  description: "A CS student writing about cybersecurity, networking, and project showcases.",
  openGraph: {
    title: "HAL's Blog",
    description: "A CS student writing about cybersecurity, networking, and project showcases.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <Nav />
        <main className="mx-auto max-w-4xl px-4 py-10">{children}</main>
        <footer className="border-t border-zinc-800 py-8 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} HAL. Built with Next.js & MDX.
        </footer>
      </body>
    </html>
  );
}
