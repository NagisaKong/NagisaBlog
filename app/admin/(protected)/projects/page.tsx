import Link from "next/link";
import { getAllProjects } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import DeleteProjectButton from "./DeleteProjectButton";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  let projects: Awaited<ReturnType<typeof getAllProjects>> = [];
  try {
    projects = await getAllProjects();
  } catch {
    // DB not connected
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
        >
          + New Project
        </Link>
      </div>

      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-zinc-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Tags</th>
              <th className="px-4 py-3 text-left">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                  No projects yet.
                </td>
              </tr>
            )}
            {projects.map((project) => (
              <tr key={project.id} className="bg-zinc-950 hover:bg-zinc-900 transition-colors">
                <td className="px-4 py-3 font-medium text-zinc-100 max-w-xs truncate">
                  {project.title}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {project.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={project.featured ? "default" : "outline"}>
                    {project.featured ? "Featured" : "Normal"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="rounded px-2 py-1 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteProjectButton id={project.id} title={project.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
