import { createPost } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const body = await req.json();
  const { slug, title, description, content, tags, published } = body;

  if (!slug || !title || !content) {
    return Response.json({ error: "slug, title and content are required" }, { status: 400 });
  }

  const post = await createPost({ slug, title, description, content, tags, published });
  return Response.json(post, { status: 201 });
}
