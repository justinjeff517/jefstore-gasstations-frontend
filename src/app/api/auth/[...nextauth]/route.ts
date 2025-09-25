import NextAuth, { type NextAuthOptions } from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"

const ALLOWED_LOCATIONS = new Set(["loboc", "sikatuna"])

const USERS = [
  { id: "1", name: "Sikatuna Cashier", email: "sikatuna@email.com", password: "pass123", role: "cashier", employee_number: "10001", location: "sikatuna" },
  { id: "2", name: "Loboc Manager",   email: "loboc@email.com",    password: "pass123", role: "manager", employee_number: "10002", location: "loboc" },
] as const

async function getUserByEmail(email: string) {
  return USERS.find(u => u.email === email) || null
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: { email: { label: "Email", type: "text" }, password: { label: "Password", type: "password" } },
      async authorize(c) {
        const user = USERS.find(u => u.email === c?.email && u.password === c?.password)
        if (!user) return null
        if (!ALLOWED_LOCATIONS.has(user.location)) return null
        const { password, ...safe } = user
        return safe
      },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.access_token) token.accessToken = account.access_token
      if (user) token.user = { ...token.user, ...user }
      if (!token.user?.location && token.email) {
        const dbUser = await getUserByEmail(token.email)
        if (dbUser && ALLOWED_LOCATIONS.has(dbUser.location)) token.user = { ...token.user, ...dbUser }
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = (token as any).accessToken
      session.user = { ...(session.user || {}), ...(token as any).user }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
