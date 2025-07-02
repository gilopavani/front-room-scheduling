import { signIn, SignInResponse } from "next-auth/react";
import api from "./api";
import { CheckEmailResponse } from "@/models/auth.model";

interface AuthCredentials {
  email: string;
  password: string;
}

export const authHelpers = {
  async checkEmail(email: string): Promise<CheckEmailResponse> {
    try {
      const response = await api.post("/auth/check-mail", { email });
      return response.data;
    } catch {
      throw { message: "Erro interno", exists: false };
    }
  },

  async signInAsAdmin(
    credentials: AuthCredentials
  ): Promise<SignInResponse | undefined> {
    return await signIn("admin-credentials", {
      email: credentials.email,
      password: credentials.password,
      userType: "admin",
      redirect: false,
    });
  },

  async signInAsUser(
    credentials: AuthCredentials
  ): Promise<SignInResponse | undefined> {
    return await signIn("user-credentials", {
      email: credentials.email,
      password: credentials.password,
      userType: "user",
      redirect: false,
    });
  },

  async signInAfterRegister(
    email: string,
    password: string
  ): Promise<SignInResponse | undefined> {
    return await signIn("user-credentials", {
      email,
      password,
      userType: "user",
      redirect: false,
    });
  },
};
