import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      login: string;
      fullname: string;
      occupation: string;
      faculty: string;
      inviteCode: string;
    }
  }
}