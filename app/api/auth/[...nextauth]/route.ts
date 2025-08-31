// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database", // "jwt" or "database" depending on your setup
  },
  pages: {
    signIn: "/login", // your login page
  },
  callbacks: {
    async session({ session, user }) {
      // Add role to session.user
      if (session.user) session.user.role = user.role;
      return session;
    },
  },
});
