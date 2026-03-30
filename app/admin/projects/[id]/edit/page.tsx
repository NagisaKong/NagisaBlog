import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/db";
import ProjectForm from "../../ProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(Number(id));
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100">Edit Project</h1>
      <ProjectForm project={project} />
    </div>
  );
}
