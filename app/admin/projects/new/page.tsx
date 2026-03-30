import ProjectForm from "../ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-100">New Project</h1>
      <ProjectForm />
    </div>
  );
}
