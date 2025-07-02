export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/booking/:path*",
    "/(auth)/:path*",
    "/clients/:path*",
    "/rooms/:path*",
    "/logs/:path*",
    "/profile/:path*",
  ],
};
