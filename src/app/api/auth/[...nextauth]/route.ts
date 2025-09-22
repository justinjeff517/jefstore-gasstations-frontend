import NextAuth, { type NextAuthOptions } from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(c) {
        if (c?.email === "test@email.com" && c?.password === "pass123") {
          return { id: "1", name: "Test User", email: "test@email.com" }
        }
        // Returning null triggers CredentialsSignin error (handled by NextAuth)
        return null
      },
    }),
  ],
  pages: { signIn: "/login" }, // your login page
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.access_token) token.accessToken = account.access_token
      if (user) token.user = user
      return token
    },
    async session({ session, token }) {
      session.accessToken = (token as any).accessToken
      session.user = token.user as any
      return session
    },
  },
  // optional: debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }  // ✅ make sure BOTH exist
