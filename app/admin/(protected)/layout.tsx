import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const login = (session?.user as { login?: string } | undefined)?.login;
  if (!session || login !== process.env.ADMIN_GITHUB_USERNAME) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-zinc-800 flex flex-col">
        <div className="border-b border-zinc-800 px-5 py-4">
          <Link href="/admin" className="font-mono text-sm font-bold text-emerald-400">
            Admin
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-zinc-800 px-3 py-4">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-500 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-8 py-8">{children}</div>
      </div>
    </div>
  );
}
