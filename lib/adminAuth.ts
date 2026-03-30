import { auth } from "@/auth";

export async function requireAdmin(): Promise<Response | null> {
  const session = await auth();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const login = (session.user as { login?: string })?.login;
  if (login !== process.env.ADMIN_GITHUB_USERNAME) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
