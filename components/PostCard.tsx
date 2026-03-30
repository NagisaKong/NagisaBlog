import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-600">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="mb-2 flex items-center gap-3 text-xs text-zinc-500">
          <time dateTime={post.date}>{post.date}</time>
          <span>·</span>
          <span>{post.readingTime} min read</span>
        </div>
        <h2 className="mb-2 text-lg font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
          {post.title}
        </h2>
        <p className="mb-4 text-sm text-zinc-400 leading-relaxed">{post.description}</p>
      </Link>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog?tag=${tag}`}
            className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400 hover:bg-emerald-900 hover:text-emerald-300 transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>
    </article>
  );
}
