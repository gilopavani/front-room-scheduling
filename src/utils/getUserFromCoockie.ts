import { createSecretKey } from "crypto";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserModel } from "@/models/user.model";

export async function getUserFromCookie(): Promise<UserModel | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (!token) return null;
  const cleanToken = token.replace(/^Bearer\s+/i, "");

  const secretKey = createSecretKey(
    Buffer.from(process.env.NEXT_JWT_ACCESS_TOKEN_SECRET!, "utf-8")
  );

  try {
    const { payload } = await jwtVerify<UserModel>(cleanToken, secretKey);
    return payload;
  } catch (err: any) {
    console.error("❌ JWT verify failed:", err.code, err.message);
    if (err.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
      redirect("/login");
    }

    return null;
  }
}
