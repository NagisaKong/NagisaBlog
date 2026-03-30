import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const allowed = process.env.ADMIN_GITHUB_USERNAME;
      console.log("[auth] profile.login:", profile?.login, "allowed:", allowed);
      if (!allowed || !profile?.login) return false;
      return profile.login === allowed;
    },
    async session({ session, token }) {
      if (session.user && token.login) {
        (session.user as { login?: string }).login = token.login as string;
      }
      return session;
    },
    async jwt({ token, profile }) {
      if (profile?.login) {
        token.login = profile.login;
      }
      return token;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
});
