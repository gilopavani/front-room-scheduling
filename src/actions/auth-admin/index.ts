"use server";

import { cookies } from "next/headers";
import { authAdminSchema, authAdminModel } from "@/models/auth-admin.model";
import { adminAuthService } from "@/service/admin-auth";

export async function authAdminAction(data: authAdminModel) {
  const parsedData = authAdminSchema.safeParse(data);

  if (!parsedData.success) {
    return { error: parsedData.error.message };
  }

  try {
    const response = await adminAuthService(parsedData.data);

    if (!response.accessToken || response.error) {
      return { error: "Invalid credentials" };
    }

    const cookieStore = await cookies();
    cookieStore.set({
      name: "accessToken",
      value: response.accessToken,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    console.log("Login successful:", response);

    return { message: "Login successful" };
  } catch (error) {
    return { error: "Invalid credentials" };
  }
}
