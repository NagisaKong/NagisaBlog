/**
 * One-time migration: MDX files + static projects → Vercel Postgres
 * Run with: npx tsx scripts/migrate-to-db.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { initSchema, createPost, createProject } from "../lib/db";
import { getAllPosts, getPostBySlug } from "../lib/posts";
import { projects } from "../lib/projects";

async function main() {
  console.log("🔄 Initializing schema...");
  await initSchema();
  console.log("✅ Schema ready.\n");

  // ── Posts ────────────────────────────────────────────────────────────────
  const allPosts = getAllPosts();
  console.log(`📝 Found ${allPosts.length} published MDX posts.`);

  let postsInserted = 0;
  for (const meta of allPosts) {
    const full = getPostBySlug(meta.slug);
    if (!full) continue;
    try {
      await createPost({
        slug: full.slug,
        title: full.title,
        description: full.description,
        content: full.content,
        tags: full.tags,
        published: full.published,
      });
      console.log(`  ✔ Post: ${full.slug}`);
      postsInserted++;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("unique")) {
        console.log(`  ⚠ Skipped (already exists): ${full.slug}`);
      } else {
        throw err;
      }
    }
  }

  // ── Projects ─────────────────────────────────────────────────────────────
  console.log(`\n🗂  Found ${projects.length} projects.`);

  let projectsInserted = 0;
  for (const p of projects) {
    try {
      await createProject({
        title: p.title,
        description: p.description,
        tags: p.tags,
        github_url: p.github,
        gitlab_url: (p as { gitlab?: string }).gitlab,
        demo_url: p.demo,
        featured: p.featured,
      });
      console.log(`  ✔ Project: ${p.title}`);
      projectsInserted++;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("unique")) {
        console.log(`  ⚠ Skipped (already exists): ${p.title}`);
      } else {
        throw err;
      }
    }
  }

  console.log(`
✅ Migration complete!
   Posts inserted:    ${postsInserted}
   Projects inserted: ${projectsInserted}
`);
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
