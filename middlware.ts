// middleware.ts (root)
export { auth as middleware } from "@/auth"

export const config = {
  matcher: [
    "/((?!api/auth|_next|static|favicon.ico|robots.txt|sitemap.xml|login).*)",
  ],
}
