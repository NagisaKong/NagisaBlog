import Link from "next/link";
import { getAllPosts as getAllPostsFromDB, postRowToMeta } from "@/lib/db";
import { getAllPosts as getAllPostsFromFS } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import type { PostMeta } from "@/lib/posts";

async function fetchRecentPosts(): Promise<PostMeta[]> {
  try {
    const rows = await getAllPostsFromDB();
    return rows.slice(0, 3).map(postRowToMeta);
  } catch {
    return getAllPostsFromFS().slice(0, 3);
  }
}

export default async function HomePage() {
  const recentPosts = await fetchRecentPosts();

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="pt-8">
        <div className="mb-2 font-mono text-sm text-emerald-400">Welcome to my blog!</div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-100">
          I&apos;m Nagisa, a CS student form UOW.
        </h1>
        <p className="max-w-xl text-lg text-zinc-400 leading-relaxed">
          I write about <span className="text-zinc-200">cybersecurity</span>,{" "}
          <span className="text-zinc-200">networking</span>, and document my personal projects.
          Occasionally I share CTF writeups and security research notes.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href="/blog"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
          >
            Read the blog
          </Link>
          <Link
            href="/projects"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 transition-colors"
          >
            View projects
          </Link>
        </div>
      </section>

      {/* Recent Posts */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-100">Recent Posts</h2>
          <Link href="/blog" className="text-sm text-emerald-400 hover:text-emerald-300">
            All posts →
          </Link>
        </div>
        {recentPosts.length > 0 ? (
          <div className="grid gap-4">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-zinc-500">No posts yet.</p>
        )}
      </section>
    </div>
  );
}
