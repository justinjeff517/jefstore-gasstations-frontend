import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: DefaultSession["user"] & {
      id?: string
      role?: string
      employee_number?: string
      location?: "loboc" | "sikatuna"
    }
  }
  interface User {
    id?: string
    role?: string
    employee_number?: string
    location?: "loboc" | "sikatuna"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    user?: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      employee_number?: string
      location?: "loboc" | "sikatuna"
    }
  }
}
