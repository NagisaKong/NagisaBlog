"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { ProjectRow } from "@/lib/db";

export default function ProjectForm({ project }: { project?: ProjectRow }) {
  const router = useRouter();
  const isEdit = !!project;

  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [tags, setTags] = useState(project?.tags?.join(", ") ?? "");
  const [githubUrl, setGithubUrl] = useState(project?.github_url ?? "");
  const [gitlabUrl, setGitlabUrl] = useState(project?.gitlab_url ?? "");
  const [demoUrl, setDemoUrl] = useState(project?.demo_url ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const body = {
      title,
      description,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      github_url: githubUrl || null,
      gitlab_url: gitlabUrl || null,
      demo_url: demoUrl || null,
      featured,
    };

    const url = isEdit ? `/api/admin/projects/${project!.id}` : "/api/admin/projects";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to save project.");
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {error && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm text-zinc-400">Title *</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project title"
          required
          className="bg-zinc-900 border-zinc-700 text-zinc-100"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-zinc-400">Description *</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description of the project"
          rows={4}
          required
          className="bg-zinc-900 border-zinc-700 text-zinc-100 resize-y"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-zinc-400">Tags (comma-separated)</label>
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Python, Networking, CLI"
          className="bg-zinc-900 border-zinc-700 text-zinc-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">GitHub URL</label>
          <Input
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
            type="url"
            className="bg-zinc-900 border-zinc-700 text-zinc-100"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">GitLab URL</label>
          <Input
            value={gitlabUrl}
            onChange={(e) => setGitlabUrl(e.target.value)}
            placeholder="https://gitlab.com/..."
            type="url"
            className="bg-zinc-900 border-zinc-700 text-zinc-100"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Demo URL</label>
          <Input
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="https://..."
            type="url"
            className="bg-zinc-900 border-zinc-700 text-zinc-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
        <label htmlFor="featured" className="text-sm text-zinc-400">
          Featured project
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-500">
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create project"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/projects")}
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
