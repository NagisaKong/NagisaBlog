import Link from "next/link";
import { getAllPostsAdmin, getAllProjects } from "@/lib/db";

export default async function AdminDashboard() {
  let posts: Awaited<ReturnType<typeof getAllPostsAdmin>> = [];
  let projects: Awaited<ReturnType<typeof getAllProjects>> = [];

  try {
    [posts, projects] = await Promise.all([getAllPostsAdmin(), getAllProjects()]);
  } catch {
    // DB not connected yet — show placeholder stats
  }

  const published = posts.filter((p) => p.published).length;

  const stats = [
    { label: "Total Posts", value: posts.length },
    { label: "Published", value: published },
    { label: "Drafts", value: posts.length - published },
    { label: "Projects", value: projects.length },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Welcome back, Admin.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm text-zinc-500">{label}</p>
            <p className="mt-1 text-3xl font-bold text-zinc-100">{value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
        >
          + New Post
        </Link>
        <Link
          href="/admin/projects/new"
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 transition-colors"
        >
          + New Project
        </Link>
      </div>

      {/* Analytics note */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="mb-2 font-semibold text-zinc-100">Site Analytics</h2>
        <p className="text-sm text-zinc-400">
          Full pageview charts and visitor data are available in the{" "}
          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
          >
            Vercel Dashboard → Analytics tab
          </a>
          .
        </p>
      </div>
    </div>
  );
}
