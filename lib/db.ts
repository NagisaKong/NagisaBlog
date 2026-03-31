import { sql } from "@vercel/postgres";
import type { PostMeta } from "./posts";

/** Convert a JS string array to PostgreSQL array literal, e.g. '{"a","b"}' */
function pgArray(arr: string[] | undefined | null): string {
  if (!arr || arr.length === 0) return "{}";
  return "{" + arr.map((s) => `"${s.replace(/"/g, '\\"')}"`).join(",") + "}";
}

export function postRowToMeta(row: PostRow): PostMeta {
  const words = row.content.trim().split(/\s+/).length;
  return {
    slug: row.slug,
    title: row.title,
    date: row.created_at.slice(0, 10),
    description: row.description ?? "",
    tags: row.tags ?? [],
    published: row.published,
    readingTime: Math.ceil(words / 200),
  };
}

export type PostRow = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  content: string;
  tags: string[];
  published: boolean;
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
};

/** 列表页专用：不含 content，reading_time 由 SQL 计算 */
export type PostMetaRow = Omit<PostRow, "content"> & { reading_time: number };

export type ProjectRow = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  github_url: string | null;
  gitlab_url: string | null;
  demo_url: string | null;
  featured: boolean;
  created_at: string;
};

// ── Posts ────────────────────────────────────────────────────────────────────

/** 列表页专用：只取元数据，reading_time 在 SQL 中计算，避免传输大量 content */
export async function getAllPostsMeta(): Promise<PostMetaRow[]> {
  const { rows } = await sql<PostMetaRow>`
    SELECT
      id, slug, title, description, tags, published, views, likes,
      created_at, updated_at,
      GREATEST(1,
        CEIL(
          array_length(regexp_split_to_array(trim(content), '\s+'), 1)::numeric / 200
        )
      )::int AS reading_time
    FROM posts
    WHERE published = true
    ORDER BY created_at DESC
  `;
  return rows;
}

export async function getAllPosts(): Promise<PostRow[]> {
  const { rows } = await sql<PostRow>`
    SELECT * FROM posts
    WHERE published = true
    ORDER BY created_at DESC
  `;
  return rows;
}

export async function getAllPostsAdmin(): Promise<PostRow[]> {
  const { rows } = await sql<PostRow>`
    SELECT * FROM posts ORDER BY created_at DESC
  `;
  return rows;
}

export async function getPostBySlug(slug: string): Promise<PostRow | null> {
  const { rows } = await sql<PostRow>`
    SELECT * FROM posts WHERE slug = ${slug} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getPostById(id: number): Promise<PostRow | null> {
  const { rows } = await sql<PostRow>`
    SELECT * FROM posts WHERE id = ${id} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function createPost(data: {
  slug: string;
  title: string;
  description?: string;
  content: string;
  tags?: string[];
  published?: boolean;
}): Promise<PostRow> {
  const tagsLiteral = pgArray(data.tags);
  const { rows } = await sql.query<PostRow>(
    `INSERT INTO posts (slug, title, description, content, tags, published)
     VALUES ($1, $2, $3, $4, $5::text[], $6)
     RETURNING *`,
    [data.slug, data.title, data.description ?? null, data.content, tagsLiteral, data.published ?? false]
  );
  return rows[0];
}

export async function updatePost(
  id: number,
  data: Partial<{
    slug: string;
    title: string;
    description: string;
    content: string;
    tags: string[];
    published: boolean;
  }>
): Promise<PostRow> {
  const tagsLiteral = data.tags !== undefined ? pgArray(data.tags) : undefined;
  const { rows } = await sql.query<PostRow>(
    `UPDATE posts SET
      slug        = COALESCE($2, slug),
      title       = COALESCE($3, title),
      description = COALESCE($4, description),
      content     = COALESCE($5, content),
      tags        = CASE WHEN $6::text IS NOT NULL THEN $6::text[] ELSE tags END,
      published   = COALESCE($7, published),
      updated_at  = NOW()
    WHERE id = $1
    RETURNING *`,
    [id, data.slug ?? null, data.title ?? null, data.description ?? null,
     data.content ?? null, tagsLiteral ?? null, data.published ?? null]
  );
  return rows[0];
}

export async function deletePost(id: number): Promise<void> {
  await sql`DELETE FROM posts WHERE id = ${id}`;
}

export async function getPostViews(slug: string): Promise<number> {
  const { rows } = await sql<{ views: number }>`
    SELECT views FROM posts WHERE slug = ${slug} LIMIT 1
  `;
  return rows[0]?.views ?? 0;
}

export async function incrementPostViews(slug: string): Promise<number> {
  const { rows } = await sql<{ views: number }>`
    UPDATE posts SET views = views + 1 WHERE slug = ${slug} RETURNING views
  `;
  return rows[0]?.views ?? 0;
}

export async function getPostLikes(slug: string): Promise<number> {
  const { rows } = await sql<{ likes: number }>`
    SELECT likes FROM posts WHERE slug = ${slug} LIMIT 1
  `;
  return rows[0]?.likes ?? 0;
}

export async function incrementPostLikes(slug: string): Promise<number> {
  const { rows } = await sql<{ likes: number }>`
    UPDATE posts SET likes = likes + 1 WHERE slug = ${slug} RETURNING likes
  `;
  return rows[0]?.likes ?? 0;
}

// ── Projects ─────────────────────────────────────────────────────────────────

export async function getAllProjects(): Promise<ProjectRow[]> {
  const { rows } = await sql<ProjectRow>`
    SELECT * FROM projects ORDER BY featured DESC, created_at DESC
  `;
  return rows;
}

export async function getProjectById(id: number): Promise<ProjectRow | null> {
  const { rows } = await sql<ProjectRow>`
    SELECT * FROM projects WHERE id = ${id} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function createProject(data: {
  title: string;
  description: string;
  tags?: string[];
  github_url?: string;
  gitlab_url?: string;
  demo_url?: string;
  featured?: boolean;
}): Promise<ProjectRow> {
  const tagsLiteral = pgArray(data.tags);
  const { rows } = await sql.query<ProjectRow>(
    `INSERT INTO projects (title, description, tags, github_url, gitlab_url, demo_url, featured)
     VALUES ($1, $2, $3::text[], $4, $5, $6, $7)
     RETURNING *`,
    [data.title, data.description, tagsLiteral, data.github_url ?? null,
     data.gitlab_url ?? null, data.demo_url ?? null, data.featured ?? false]
  );
  return rows[0];
}

export async function updateProject(
  id: number,
  data: Partial<{
    title: string;
    description: string;
    tags: string[];
    github_url: string;
    gitlab_url: string;
    demo_url: string;
    featured: boolean;
  }>
): Promise<ProjectRow> {
  const tagsLiteral = data.tags !== undefined ? pgArray(data.tags) : undefined;
  const { rows } = await sql.query<ProjectRow>(
    `UPDATE projects SET
      title       = COALESCE($2, title),
      description = COALESCE($3, description),
      tags        = CASE WHEN $4::text IS NOT NULL THEN $4::text[] ELSE tags END,
      github_url  = COALESCE($5, github_url),
      gitlab_url  = COALESCE($6, gitlab_url),
      demo_url    = COALESCE($7, demo_url),
      featured    = COALESCE($8, featured)
    WHERE id = $1
    RETURNING *`,
    [id, data.title ?? null, data.description ?? null, tagsLiteral ?? null,
     data.github_url ?? null, data.gitlab_url ?? null, data.demo_url ?? null,
     data.featured ?? null]
  );
  return rows[0];
}

export async function deleteProject(id: number): Promise<void> {
  await sql`DELETE FROM projects WHERE id = ${id}`;
}

// ── Schema init (run once) ───────────────────────────────────────────────────

export async function initSchema(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id          SERIAL PRIMARY KEY,
      slug        TEXT UNIQUE NOT NULL,
      title       TEXT NOT NULL,
      description TEXT,
      content     TEXT NOT NULL,
      tags        TEXT[] DEFAULT '{}',
      published   BOOLEAN DEFAULT false,
      views       INTEGER DEFAULT 0,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    ALTER TABLE posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id          SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT NOT NULL,
      tags        TEXT[] DEFAULT '{}',
      github_url  TEXT,
      gitlab_url  TEXT,
      demo_url    TEXT,
      featured    BOOLEAN DEFAULT false,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
