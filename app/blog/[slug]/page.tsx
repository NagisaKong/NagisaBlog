import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { mdxComponents } from "@/components/MDXComponents";
import TableOfContents from "@/components/TableOfContents";
import GiscusComments from "@/components/GiscusComments";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="flex gap-12">
      {/* Article */}
      <div className="min-w-0 flex-1">
        {/* Back */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300"
        >
          ← Back to blog
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400 hover:bg-emerald-900 hover:text-emerald-300"
              >
                {tag}
              </Link>
            ))}
          </div>
          <h1 className="mb-3 text-3xl font-bold leading-tight text-zinc-100">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <time dateTime={post.date}>{post.date}</time>
            <span>·</span>
            <span>{post.readingTime} min read</span>
          </div>
        </header>

        {/* Content */}
        <article className="prose-custom">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                rehypePlugins: [
                  [
                    rehypePrettyCode,
                    {
                      theme: "github-dark",
                      keepBackground: true,
                    },
                  ],
                ],
              },
            }}
          />
        </article>

        <GiscusComments />
      </div>

      {/* TOC */}
      <TableOfContents />
    </div>
  );
}
