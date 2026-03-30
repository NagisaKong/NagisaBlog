"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { PostRow } from "@/lib/db";

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function PostForm({ post }: { post?: PostRow }) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [tags, setTags] = useState(post?.tags?.join(", ") ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEdit) setSlug(slugify(val));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const body = {
      title,
      slug,
      description,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      content,
      published,
    };

    const url = isEdit ? `/api/admin/posts/${post!.id}` : "/api/admin/posts";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to save post.");
      return;
    }

    window.location.href = "/admin/posts";
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
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Post title"
          required
          className="bg-zinc-900 border-zinc-700 text-zinc-100"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-zinc-400">Slug *</label>
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="post-slug"
          required
          className="bg-zinc-900 border-zinc-700 text-zinc-100 font-mono text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-zinc-400">Description</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="One-sentence summary"
          className="bg-zinc-900 border-zinc-700 text-zinc-100"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-zinc-400">Tags (comma-separated)</label>
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Cybersecurity, Networking, Python"
          className="bg-zinc-900 border-zinc-700 text-zinc-100"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-zinc-400">Content (Markdown / MDX) *</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="## Introduction&#10;&#10;Write your post here..."
          rows={20}
          required
          className="bg-zinc-900 border-zinc-700 text-zinc-100 font-mono text-sm resize-y"
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="published"
          checked={published}
          onCheckedChange={setPublished}
          className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-zinc-600 [&>span]:bg-white [&>span]:shadow-md [&>span]:border [&>span]:border-zinc-300"
        />
        <label htmlFor="published" className="text-sm text-zinc-300 cursor-pointer">
          Published
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-500 text-white">
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create post"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.location.href = "/admin/posts"}
          disabled={saving}
          className="border-zinc-500 text-zinc-200 hover:bg-zinc-700 hover:text-white"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
