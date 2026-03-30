import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllPosts as getAllPostsFromDB, postRowToMeta } from "@/lib/db";
import { getAllPosts as getAllPostsFromFS } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import TagFilter from "@/components/TagFilter";
import type { PostMeta } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on cybersecurity, networking, and CS projects.",
  openGraph: {
    title: "Blog | HAL's Blog",
    description: "Articles on cybersecurity, networking, and CS projects.",
  },
};

async function fetchPosts(): Promise<PostMeta[]> {
  try {
    const rows = await getAllPostsFromDB();
    return rows.map(postRowToMeta);
  } catch {
    return getAllPostsFromFS();
  }
}

export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
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
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const allPosts = await fetchPosts();
  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags))).sort();
  const posts = tag ? allPosts.filter((p) => p.tags.includes(tag)) : allPosts;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-zinc-100">Blog</h1>
        <p className="text-zinc-400">
          {allPosts.length} post{allPosts.length !== 1 ? "s" : ""} on cybersecurity, networking, and CS.
        </p>
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
        <p className="text-zinc-500">No posts found for tag &quot;{tag}&quot;.</p>
      )}
    </div>
  );
}
