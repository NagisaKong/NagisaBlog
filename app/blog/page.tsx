import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllPosts, postRowToMeta } from "@/lib/db";
import { getAllPosts as getAllPostsFromFS } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import TagFilter from "@/components/TagFilter";
import SearchBar from "@/components/SearchBar";
import type { PostMeta } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on cybersecurity, networking, and CS projects.",
  openGraph: {
    title: "Blog | Nagisa's Blog",
    description: "Articles on cybersecurity, networking, and CS projects.",
  },
};

async function fetchPosts(): Promise<PostMeta[]> {
  try {
    const rows = await getAllPosts();
    return rows.map(postRowToMeta);
  } catch (e) {
    console.error("[blog/page] getAllPosts failed, falling back to FS:", e);
    return getAllPostsFromFS();
  }
}

export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; q?: string }>;
}) {
  return (
    <Suspense>
      <BlogContent searchParams={searchParams} />
    </Suspense>
  );
}

async function BlogContent({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; q?: string }>;
}) {
  const { tag, q } = await searchParams;
  const allPosts = await fetchPosts();
  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags))).sort();

  // 先按 tag 过滤，再按标题关键字过滤
  let posts = tag ? allPosts.filter((p) => p.tags.includes(tag)) : allPosts;
  if (q?.trim()) {
    const keyword = q.trim().toLowerCase();
    posts = posts.filter((p) => p.title.toLowerCase().includes(keyword));
  }

  return (
    <div className="space-y-8">
      {/* 标题行 + 搜索按钮 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-zinc-100">Blog</h1>
          <p className="text-zinc-400">
            {allPosts.length} post{allPosts.length !== 1 ? "s" : ""} on cybersecurity, networking, and CS.
          </p>
        </div>
        <div className="pt-1">
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>
      </div>

      <Suspense>
        <TagFilter tags={allTags} />
      </Suspense>

      {posts.length > 0 ? (
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-zinc-500">
          {q?.trim()
            ? `没有找到标题包含 "${q}" 的文章。`
            : `No posts found for tag "${tag}".`}
        </p>
      )}
    </div>
  );
}
