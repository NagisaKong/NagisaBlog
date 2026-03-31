import PostCard from "@/components/PostCard";
import { getAllPostsMeta } from "@/lib/db";
import type { PostMeta } from "@/lib/posts";
import { getAllPosts as getAllPostsFromFS } from "@/lib/posts";
import Link from "next/link";

// ISR：最多 60 秒重新生成一次
export const revalidate = 60;

async function fetchRecentPosts(): Promise<PostMeta[]> {
  try {
    const rows = await getAllPostsMeta();
    return rows.slice(0, 3).map((r) => ({
      slug: r.slug,
      title: r.title,
      date: r.created_at.slice(0, 10),
      description: r.description ?? "",
      tags: r.tags ?? [],
      published: r.published,
      readingTime: r.reading_time,
    }));
  } catch {
    return getAllPostsFromFS().slice(0, 3);
  }
}

export default async function HomePage() {
  const recentPosts = await fetchRecentPosts();

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="pt-4 sm:pt-8">
        <div className="mb-2 font-mono text-sm text-emerald-400">Welcome to my blog</div>
        <h1 className="mb-4 text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
          秋水叶个人博客
        </h1>
        <p className="max-w-prose text-base sm:text-lg text-zinc-400 leading-relaxed">
          I&apos;m Nagisa, a CS student form UOW. I write about <span className="text-zinc-200">cybersecurity</span>,{" "}
          <span className="text-zinc-200">networking</span>, and document my personal projects.
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
