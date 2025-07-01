import api from "@/lib/api";
import { RegisterModel } from "@/models/register.model";

export const registerService = async (
  data: RegisterModel
): Promise<{ message: string }> => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};
