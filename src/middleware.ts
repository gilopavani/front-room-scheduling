import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", req.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: ["/booking/:path*", "/dashboard/:path*", "/(auth)/:path*"],
};
