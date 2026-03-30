"use client";

import { useEffect, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

function extractHeadings(): Heading[] {
  const elements = document.querySelectorAll("article h2, article h3");
  return Array.from(elements).map((el) => ({
    id: el.id,
    text: el.textContent ?? "",
    level: el.tagName === "H2" ? 2 : 3,
  }));
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    setHeadings(extractHeadings());
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "0px 0px -70% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden lg:block sticky top-24 h-fit w-56 shrink-0">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        On this page
      </p>
      <nav>
        <ul className="space-y-1.5">
          {headings.map((h) => (
            <li key={h.id} style={{ paddingLeft: h.level === 3 ? "0.75rem" : "0" }}>
              <a
                href={`#${h.id}`}
                className={`block text-sm transition-colors ${
                  activeId === h.id
                    ? "text-emerald-400"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
