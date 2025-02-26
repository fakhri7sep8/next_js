import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials: any, req) {
        return {
          id: credentials.id,
          name: credentials.name,
          email: credentials.email,
          accessToken: credentials.accessToken,
          refreshToken: credentials.refreshToken,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.name = user.name as string;
        token.email = user.email as string;
        token.accessToken = user.accessToken as string;
        token.refreshToken = user.refreshToken as string;
      }

      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = typeof token.id === "string" ? token.id : "";
      session.user.name = typeof token.name === "string" ? token.name : "";
      session.user.email = typeof token.email === "string" ? token.email : "";
      session.user.accessToken = typeof token.accessToken === "string" ? token.accessToken : "";
      session.user.refreshToken = typeof token.refreshToken === "string" ? token.refreshToken : "";
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
