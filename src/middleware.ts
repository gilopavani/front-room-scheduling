export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/booking/:path*", "/dashboard/:path*", "/(auth)/:path*"],
};
