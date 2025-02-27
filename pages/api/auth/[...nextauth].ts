import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials:any , req) {
         return {
          ...credentials,
        };
      }
    }),
  ],

  callbacks: {
    async jwt({ token, user, account , profile }) {
       return {...token,...user}
    },

    async session({ session, token }) {
      session.user.id = Number(token.id);
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/error",
  },
};

export default NextAuth(authOptions);
