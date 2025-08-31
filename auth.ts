// auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getUserById } from "@/lib/user";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.email = token.email!;
        session.user.name = token.name!;
        session.user.image = token.picture!;
        session.user.role = token.role!;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const dbUser = await getUserById(token.sub);
      if (!dbUser) return token;
      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.role = dbUser.role;
      return token;
    },
  },
  // debug: process.env.NODE_ENV !== "production",
});
