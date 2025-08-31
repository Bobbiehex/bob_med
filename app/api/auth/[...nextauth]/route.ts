import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",          // Forces account selection every time
          access_type: "offline",     // Gets refresh token
          response_type: "code",      // Standard OAuth code flow
        },
      },
    }),
  ],
  pages: {
    error: "/auth/error", // custom error page (optional)
  },
  callbacks: {
    async session({ session, token }) {
      // You can attach additional info to session here
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
