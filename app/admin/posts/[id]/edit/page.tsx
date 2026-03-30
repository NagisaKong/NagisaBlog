import { notFound } from "next/navigation";
import { getPostById } from "@/lib/db";
import PostForm from "../../PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(Number(id));
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100">Edit Post</h1>
      <PostForm post={post} />
    </div>
  );
}
