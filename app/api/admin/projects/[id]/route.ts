import { updateProject, deleteProject } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  const body = await req.json();
  const project = await updateProject(Number(id), body);
  return Response.json(project);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { id } = await params;
  await deleteProject(Number(id));
  return new Response(null, { status: 204 });
}
