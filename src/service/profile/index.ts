import api from "@/lib/api";
import { ProfileResponse, UpdateProfileModel } from "@/models/profile.model";

export const getProfileService = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>("/me");
  return response.data;
};

export const updateProfileService = async (
  data: UpdateProfileModel
): Promise<{ message: string }> => {
  const response = await api.patch("/me", data);
  return response.data;
};
