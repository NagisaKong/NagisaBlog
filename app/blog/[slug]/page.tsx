import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import {
  getAllPosts as getAllPostsFromDB,
  getPostBySlug as getPostBySlugFromDB,
  postRowToMeta,
} from "@/lib/db";
import { getAllPosts as getAllPostsFromFS, getPostBySlug as getPostBySlugFromFS } from "@/lib/posts";
import { mdxComponents } from "@/components/MDXComponents";
import TableOfContents from "@/components/TableOfContents";
import GiscusComments from "@/components/GiscusComments";
import ViewCounter from "@/components/ViewCounter";
import LikeButton from "@/components/LikeButton";
import Link from "next/link";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const rows = await getAllPostsFromDB();
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return getAllPostsFromFS().map((p) => ({ slug: p.slug }));
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let title = "";
  let description = "";

  try {
    const row = await getPostBySlugFromDB(slug);
    if (row) {
      title = row.title;
      description = row.description ?? "";
    }
  } catch {
    const post = getPostBySlugFromFS(slug);
    if (post) {
      title = post.title;
      description = post.description;
    }
  }

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  let title = "";
  let date = "";
  let tags: string[] = [];
  let readingTime = 0;
  let content = "";

  try {
    const row = await getPostBySlugFromDB(slug);
    if (!row) notFound();
    const meta = postRowToMeta(row);
    title = meta.title;
    date = meta.date;
    tags = meta.tags;
    readingTime = meta.readingTime;
    content = row.content;
  } catch {
    const post = getPostBySlugFromFS(slug);
    if (!post) notFound();
    title = post.title;
    date = post.date;
    tags = post.tags;
    readingTime = post.readingTime;
    content = post.content;
  }

  return (
    <div className="flex gap-12">
      <div className="min-w-0 flex-1">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← Back to blog
        </Link>

        <header className="mb-8">
          <div className="mb-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400 hover:bg-emerald-900 hover:text-emerald-300"
              >
                {tag}
              </Link>
            ))}
          </div>
          <h1 className="mb-3 text-2xl sm:text-3xl font-bold leading-tight text-zinc-100">{title}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500">
            <time dateTime={date}>{date}</time>
            <span>·</span>
            <span>{readingTime} min read</span>
            <span>·</span>
            <ViewCounter slug={slug} />
          </div>
        </header>

        <article className="prose-custom">
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypePrettyCode, { theme: "github-dark", keepBackground: true }],
                ],
              },
            }}
          />
        </article>

        <LikeButton slug={slug} />
        <GiscusComments />
      </div>

      <TableOfContents />
    </div>
  );
}
