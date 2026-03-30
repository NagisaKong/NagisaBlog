import PostForm from "../PostForm";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100">New Post</h1>
      <PostForm />
    </div>
  );
}
