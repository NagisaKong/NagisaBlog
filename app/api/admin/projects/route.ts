import { revalidatePath } from "next/cache";
import { createProject } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const body = await req.json();
  const { title, description, tags, github_url, gitlab_url, demo_url, featured } = body;

  if (!title || !description) {
    return Response.json({ error: "title and description are required" }, { status: 400 });
  }

  const project = await createProject({ title, description, tags, github_url, gitlab_url, demo_url, featured });

  revalidatePath("/projects");

  return Response.json(project, { status: 201 });
}
