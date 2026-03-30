import type { Metadata } from "next";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "A showcase of my personal projects in cybersecurity and software development.",
};

export default function ProjectsPage() {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-zinc-100">Projects</h1>
        <p className="text-zinc-400">Things I&apos;ve built and am building.</p>
      </div>

      {featured.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Featured
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Other Projects
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {others.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <div className="flex flex-col rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="mb-2 font-semibold text-zinc-100">{project.title}</h3>
      <p className="mb-4 flex-1 text-sm text-zinc-400 leading-relaxed">{project.description}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-3">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-400 hover:text-zinc-200 underline underline-offset-2"
          >
            GitHub →
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
          >
            Live Demo →
          </a>
        )}
      </div>
    </div>
  );
}
