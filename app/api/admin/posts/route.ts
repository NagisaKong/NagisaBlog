import { requireAdmin } from "@/lib/adminAuth";
import { createPost } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const body = await req.json();
  const { slug, title, description, content, tags, published } = body;

  if (!slug || !title || !content) {
    return Response.json({ error: "slug, title and content are required" }, { status: 400 });
  }

  const post = await createPost({ slug, title, description, content, tags, published });

  // 新文章发布后清除博客列表缓存，并预热文章页缓存
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  return Response.json(post, { status: 201 });
}
