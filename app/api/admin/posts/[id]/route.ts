import { requireAdmin } from "@/lib/adminAuth";
import { deletePost, getPostById, updatePost } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const body = await req.json();

  // Capture the old slug before update so we can invalidate it if the slug changed.
  const existing = await getPostById(Number(id));
  const post = await updatePost(Number(id), body);

  // 清除该文章页面和博客列表的缓存
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/blog");

  return Response.json(post);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;

  // 删除前先取 slug，用于精确清缓存
  const post = await getPostById(Number(id));
  await deletePost(Number(id));

  if (post) {
    revalidatePath(`/blog/${post.slug}`);
  }
  revalidatePath("/blog");

  return new Response(null, { status: 204 });
}
