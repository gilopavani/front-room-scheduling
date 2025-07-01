import { z } from "zod";

export interface authMailModel {
  email: string;
}

export interface authModel {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken?: string;
  message: string;
  error?: string;
}

export interface CheckEmailResponse {
  message: string;
  exists: boolean;
}

export const authMailSchema = z.object({
  email: z.string().email("Email inválido"),
});

export type AuthMailSchema = z.infer<typeof authMailSchema>;

export const authSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type AuthSchema = z.infer<typeof authSchema>;
