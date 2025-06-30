import api from "@/lib/api";
import { authAdminModel, AuthAdminResponse } from "@/models/auth-admin.model";

export async function adminAuthService(
  data: authAdminModel
): Promise<AuthAdminResponse> {
  const response = await api.post<AuthAdminResponse>("/auth/admin", data);
  return response.data;
}
