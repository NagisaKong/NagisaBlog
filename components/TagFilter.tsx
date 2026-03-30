"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TagFilter({ tags }: { tags: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") ?? "";

  function handleTag(tag: string) {
    if (tag === activeTag) {
      router.push("/blog");
    } else {
      router.push(`/blog?tag=${tag}`);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => router.push("/blog")}
        className={`rounded-full px-3 py-1 text-xs transition-colors ${
          !activeTag
            ? "bg-emerald-600 text-white"
            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTag(tag)}
          className={`rounded-full px-3 py-1 text-xs transition-colors ${
            activeTag === tag
              ? "bg-emerald-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
