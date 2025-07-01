import api from "@/lib/api";
import { authModel, AuthResponse } from "@/models/auth.model";

export async function userAuthService(data: authModel): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/signin", data);
  return response.data;
}
