import { revalidatePath } from "next/cache";
import { getPostById, updatePost, deletePost } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const body = await req.json();

  // 取旧 slug，便于 slug 变更时同时失效新旧两条路径
  const existing = await getPostById(Number(id));
  const post = await updatePost(Number(id), body);

  // 清除首页（最近文章）、博客列表和该文章页面的缓存
  revalidatePath("/");
  revalidatePath("/blog");
  if (existing?.slug) revalidatePath(`/blog/${existing.slug}`);
  if (post.slug && post.slug !== existing?.slug) revalidatePath(`/blog/${post.slug}`);

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
  const existing = await getPostById(Number(id));
  await deletePost(Number(id));

  revalidatePath("/");
  revalidatePath("/blog");
  if (existing?.slug) revalidatePath(`/blog/${existing.slug}`);

  return new Response(null, { status: 204 });
}
