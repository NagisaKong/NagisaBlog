"use client";

import { useEffect, useState } from "react";

function formatLikes(n: number): string {
  if (n >= 10000) return `${Math.floor(n / 1000)}k+`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export default function LikeButton({ slug }: { slug: string }) {
  const [likes, setLikes] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const hasLiked = localStorage.getItem(`liked:${slug}`) === "1";
    setLiked(hasLiked);
    fetch(`/api/likes/${slug}`)
      .then((r) => r.json())
      .then((data) => setLikes(data.likes))
      .catch(() => {});
  }, [slug]);

  async function handleLike() {
    if (liked || animating) return;
    setAnimating(true);
    try {
      const res = await fetch(`/api/likes/${slug}`, { method: "POST" });
      const data = await res.json();
      setLikes(data.likes);
      setLiked(true);
      localStorage.setItem(`liked:${slug}`, "1");
    } catch {
      // ignore
    } finally {
      setTimeout(() => setAnimating(false), 300);
    }
  }

  return (
    <div className="flex justify-center my-12">
      <button
        onClick={handleLike}
        disabled={liked}
        aria-label="点赞"
        className={`
          group flex flex-col items-center justify-center
          w-20 h-20 rounded-full border-2 transition-all duration-300
          ${liked
            ? "border-blue-500 bg-zinc-900 cursor-default"
            : "border-zinc-700 bg-zinc-900 hover:border-blue-500 hover:scale-105 cursor-pointer active:scale-95"
          }
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={liked ? 0 : 1.8}
          className={`w-7 h-7 transition-colors duration-300 ${
            liked
              ? "text-blue-400"
              : "text-zinc-500 group-hover:text-blue-400"
          } ${animating ? "scale-125" : "scale-100"} transition-transform`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08
               a9.041 9.041 0 0 1 2.861-2.4c.723-.384
               1.35-.956 1.653-1.715a4.498 4.498 0 0
               0 .322-1.672V2.75a.75.75 0 0 1 .75-.75
               2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26
               2.243-.723 3.218-.266.558.107 1.282.725
               1.282m0 0h3.126c1.026 0 1.945.694
               2.054 1.715.045.422.068.85.068 1.285a11.95
               11.95 0 0 1-2.649 7.521c-.388.482-.987.729
               -1.605.729H13.48c-.483 0-.964-.078
               -1.423-.23l-3.114-1.04a4.501 4.501 0 0
               0-1.423-.23H5.904m10.598-9.75H14.25M5.904
               18.5c.083.205.173.405.27.602.197.4-.078.898
               -.523.898h-.908c-.889 0-1.713-.518
               -1.972-1.368a12 12 0 0 1-.521-3.507c0
               -1.553.295-3.036.831-4.398C3.387 9.953
               4.167 9.5 5 9.5h1.053c.472 0 .745.556
               .5.96a48.96 48.96 0 0 0-.5 1.07
               3.28 3.28 0 0 0-.1 3.02"
          />
        </svg>
        <span
          className={`text-xs mt-0.5 transition-colors duration-300 ${
            liked ? "text-blue-400" : "text-zinc-500 group-hover:text-blue-400"
          }`}
        >
          {likes === null ? "赞" : `赞(${formatLikes(likes)})`}
        </span>
      </button>
    </div>
  );
}
