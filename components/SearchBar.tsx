"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";

  const [open, setOpen] = useState(!!initialQ);
  const [value, setValue] = useState(initialQ);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 展开后自动聚焦
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // 点击外部关闭
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  });

  // ESC 关闭
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  function handleClose() {
    setOpen(false);
    if (value) {
      setValue("");
      pushSearch("");
    }
  }

  function pushSearch(q: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (q.trim()) {
      params.set("q", q.trim());
      params.delete("tag");
    } else {
      params.delete("q");
    }
    router.push(`/blog${params.toString() ? `?${params}` : ""}`);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    pushSearch(e.target.value);
  }

  function handleOpen() {
    setOpen(true);
  }

  return (
    <div ref={containerRef} className="relative flex items-center justify-end h-8">
      {/* 放大镜按钮：始终在 DOM，open 时淡出 */}
      <button
        onClick={handleOpen}
        aria-label="搜索"
        className={`absolute right-0 flex items-center justify-center w-8 h-8 rounded-full
          text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800
          transition-all duration-250 ease-in-out
          ${open ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"}`}
      >
        <SearchIcon />
      </button>

      {/* 搜索框：始终在 DOM，!open 时收缩 */}
      <div
        className={`flex items-center gap-2 rounded-full border bg-zinc-900 px-3 py-1.5
          transition-all duration-250 ease-in-out overflow-hidden
          ${open
            ? "w-48 sm:w-64 opacity-100 border-zinc-600 focus-within:border-emerald-500"
            : "w-8 opacity-0 border-transparent pointer-events-none"
          }`}
      >
        <SearchIcon className="shrink-0 text-zinc-500" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="搜索标题…"
          className="min-w-0 flex-1 bg-transparent text-sm text-zinc-200 placeholder-zinc-600 outline-none"
        />
        {value && (
          <button
            onClick={() => { setValue(""); pushSearch(""); inputRef.current?.focus(); }}
            className="shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors"
            aria-label="清除"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={`w-5 h-5 ${className}`}
    >
      <circle cx="8.5" cy="8.5" r="5.25" />
      <line x1="12.5" y1="12.5" x2="17" y2="17" strokeLinecap="round" />
    </svg>
  );
}
