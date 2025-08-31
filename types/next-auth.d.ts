import { UserRole } from "@prisma/client";
import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

export type ExtendedUser = User & {
  role: UserRole; // adds your Prisma role
};

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole; // JWT will carry role
  }
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser; // session.user now has role
  }
}
