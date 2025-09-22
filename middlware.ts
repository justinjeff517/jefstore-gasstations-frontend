import withAuth from "next-auth/middleware"
import authOptions from "@/app/api/auth/[...nextauth]/route"
export default withAuth({
  jwt: { decode: authOptions.jwt?.decode },
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})