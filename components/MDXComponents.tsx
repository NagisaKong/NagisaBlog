import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1 className="mt-8 mb-4 text-3xl font-bold text-zinc-100 scroll-mt-20" {...props} />
  ),
  h2: (props) => (
    <h2
      className="mt-8 mb-3 text-2xl font-semibold text-zinc-100 scroll-mt-20 border-b border-zinc-800 pb-1"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-6 mb-2 text-xl font-semibold text-zinc-200 scroll-mt-20" {...props} />
  ),
  p: (props) => <p className="mb-4 leading-7 text-zinc-300" {...props} />,
  a: ({ href, ...props }) => {
    if (href?.startsWith("/") || href?.startsWith("#")) {
      return <Link href={href} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2" {...props} />;
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
        {...props}
      />
    );
  },
  ul: (props) => <ul className="mb-4 ml-6 list-disc space-y-1 text-zinc-300" {...props} />,
  ol: (props) => <ol className="mb-4 ml-6 list-decimal space-y-1 text-zinc-300" {...props} />,
  li: (props) => <li className="leading-7" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mb-4 border-l-4 border-emerald-500 pl-4 text-zinc-400 italic"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm font-mono text-emerald-300"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mb-6 overflow-x-auto rounded-lg border border-zinc-700 bg-zinc-900 p-4 text-sm"
      {...props}
    />
  ),
  table: (props) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full text-sm text-zinc-300" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border border-zinc-700 bg-zinc-800 px-3 py-2 text-left font-semibold text-zinc-200" {...props} />
  ),
  td: (props) => <td className="border border-zinc-700 px-3 py-2" {...props} />,
  hr: () => <hr className="my-8 border-zinc-800" />,
  strong: (props) => <strong className="font-semibold text-zinc-200" {...props} />,
};
