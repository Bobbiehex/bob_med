import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";

export type ExtendedUser = NextAuth.User & {
  role: UserRole; // Adds Prisma role to User
};

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole; // JWT will carry the user's role
  }
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser; // session.user now has role
  }

  interface User {
    role: UserRole; // Include role on the User object
  }
}
