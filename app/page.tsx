import Link from "next/link";
import PostCard from "@/components/PostCard";
import { getAllPosts, getAllProjects, postRowToMeta } from "@/lib/db";
import { getAllPosts as getAllPostsFromFS } from "@/lib/posts";
import { projects as staticProjects } from "@/lib/projects";
import type { PostMeta } from "@/lib/posts";
import type { ProjectRow } from "@/lib/db";
import type { Project } from "@/lib/projects";

export const dynamic = "force-dynamic";

async function fetchRecentPosts(): Promise<PostMeta[]> {
  try {
    const rows = await getAllPosts();
    return rows.slice(0, 4).map(postRowToMeta);
  } catch (e) {
    console.error("[app/page] getAllPosts failed, falling back to FS:", e);
    return getAllPostsFromFS().slice(0, 4);
  }
}

async function fetchFeaturedProjects(): Promise<(ProjectRow | Project)[]> {
  try {
    const all = await getAllProjects();
    const featured = all.filter((p) => p.featured);
    return (featured.length ? featured : all).slice(0, 3);
  } catch {
    const featured = staticProjects.filter((p) => p.featured);
    return (featured.length ? featured : staticProjects).slice(0, 3);
  }
}

function isDbProject(p: ProjectRow | Project): p is ProjectRow {
  return "github_url" in p;
}

const INTERESTS = [
  "Cybersecurity",
  "Networking",
  "Systems Programming",
  "Machine Learning",
  "Linux",
  "Packet Analysis",
  "Reverse Engineering",
  "PHP",
  "C++",
  "Python",
  "Java",
  "Open Source",
];

export default async function HomePage() {
  const [recentPosts, featuredProjects] = await Promise.all([
    fetchRecentPosts(),
    fetchFeaturedProjects(),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-14">
      {/* Profile / Hero */}
      <section className="pt-4 sm:pt-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div
            aria-hidden
            className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-zinc-800 ring-2 ring-zinc-800 sm:h-32 sm:w-32"
          >
            <span className="font-mono text-3xl font-semibold text-emerald-400 sm:text-4xl">
              秋
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="flex flex-wrap items-baseline gap-x-3 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
              <span>Nagisa</span>
              <span className="text-2xl text-zinc-400 sm:text-3xl">秋水叶</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400 sm:text-base">
              CS Student at <span className="text-zinc-200">UOW</span> · Security Enthusiast · Builder
            </p>

            {/* Social links */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <SocialLink href="https://github.com/" label="GitHub">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.07 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.83 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.6.23 2.78.11 3.07.74.81 1.19 1.84 1.19 3.1 0 4.44-2.7 5.41-5.27 5.7.41.36.78 1.07.78 2.15v3.18c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
                GitHub
              </SocialLink>
              <SocialLink href="mailto:yt15563812390@gmail.com" label="Email">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                Email
              </SocialLink>
              <SocialLink href="/blog" label="Blog" internal>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4Z" />
                  <path d="M8 9h8M8 13h8M8 17h5" />
                </svg>
                Blog
              </SocialLink>
              <SocialLink href="/projects" label="Projects" internal>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M3 7h18M3 12h18M3 17h18" />
                </svg>
                Projects
              </SocialLink>
            </div>
          </div>
        </div>

        {/* Intro */}
        <div className="mt-8 space-y-4 text-[15px] leading-7 text-zinc-300">
          <p>
            Hi! I&apos;m Nagisa, a computer science student at UOW with a deep interest in{" "}
            <span className="text-zinc-100">cybersecurity</span> and{" "}
            <span className="text-zinc-100">networking</span>. I love exploring how things work
            under the hood — dissecting network protocols, analyzing malware, and building small
            tools to automate the tedious. This blog is where I document what I learn.
          </p>
          <p className="text-zinc-400">
            你好，我是秋水叶。这里记录我对计算机安全、网络与系统的探索，以及一些个人项目的思考与实践。
          </p>
        </div>
      </section>

      {/* Interests */}
      <Section heading="Interests" subheading="兴趣方向">
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((item) => (
            <span
              key={item}
              className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400"
            >
              {item}
            </span>
          ))}
        </div>
      </Section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <Section
          heading="Featured Projects"
          subheading="精选项目"
          action={{ href: "/projects", label: "All projects →" }}
        >
          <ul className="divide-y divide-zinc-800/80 border-y border-zinc-800/80">
            {featuredProjects.map((p) => {
              const github = isDbProject(p) ? p.github_url : p.github;
              const gitlab = isDbProject(p) ? p.gitlab_url : (p as Project).gitlab;
              const demo = isDbProject(p) ? p.demo_url : p.demo;
              return (
                <li key={p.title} className="py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-semibold text-zinc-100">{p.title}</h3>
                    <div className="flex items-center gap-3 text-xs">
                      {github && (
                        <a href={github} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-400">
                          GitHub →
                        </a>
                      )}
                      {gitlab && (
                        <a href={gitlab} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300">
                          GitLab →
                        </a>
                      )}
                      {demo && (
                        <a href={demo} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">
                          Demo →
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-400">{p.description}</p>
                  {p.tags?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded bg-zinc-800/70 px-1.5 py-0.5 text-[11px] text-zinc-400">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {/* Recent Posts */}
      <Section
        heading="Recent Posts"
        subheading="最新文章"
        action={{ href: "/blog", label: "All posts →" }}
      >
        {recentPosts.length > 0 ? (
          <div className="grid gap-4">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No posts yet.</p>
        )}
      </Section>
    </div>
  );
}

function Section({
  heading,
  subheading,
  action,
  children,
}: {
  heading: string;
  subheading?: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between border-b border-zinc-800 pb-2">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-emerald-500/70" aria-hidden>
            §
          </span>
          <h2 className="text-lg font-semibold text-zinc-100">{heading}</h2>
          {subheading && (
            <span className="text-sm text-zinc-500">{subheading}</span>
          )}
        </div>
        {action && (
          <Link href={action.href} className="text-xs text-emerald-400 hover:text-emerald-300">
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function SocialLink({
  href,
  label,
  internal,
  children,
}: {
  href: string;
  label: string;
  internal?: boolean;
  children: React.ReactNode;
}) {
  const className =
    "inline-flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-xs text-zinc-300 hover:border-emerald-700 hover:text-emerald-300 transition-colors";
  if (internal) {
    return (
      <Link href={href} aria-label={label} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      aria-label={label}
      className={className}
    >
      {children}
    </a>
  );
}
