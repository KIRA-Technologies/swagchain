import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      try {
        const target = new URL(url);
        const base = new URL(baseUrl);

        if (target.origin === base.origin) {
          return url;
        }

        // If a stale localhost callbackUrl leaks into production, keep only path/query/hash.
        if (target.hostname === "localhost" || target.hostname === "127.0.0.1") {
          return `${base.origin}${target.pathname}${target.search}${target.hash}`;
        }
      } catch {
        return baseUrl;
      }

      return baseUrl;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Fetch the role from the database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        session.user.role = dbUser?.role || "USER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  session: {
    strategy: "database",
  },
});
