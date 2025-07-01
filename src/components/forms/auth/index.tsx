"use client";
import React, { useState } from "react";
import {
  AuthSchema,
  authSchema,
  AuthMailSchema,
  authMailSchema,
} from "@/models/auth.model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { authHelpers } from "@/lib/auth-helpers";

export default function AuthForm() {
  const router = useRouter();
  const emailForm = useForm<AuthMailSchema>({
    resolver: zodResolver(authMailSchema),
    defaultValues: {
      email: "",
    },
  });

  const authForm = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const onEmailSubmit = async (data: AuthMailSchema) => {
    setIsLoading(true);
    try {
      const result = await authHelpers.checkEmail(data.email);

      if (result.exists) {
        setUserEmail(data.email);
        authForm.setValue("email", data.email);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setShowPasswordField(true);
      }
    } catch (error: any) {
      toast.error("Erro ao verificar email", {
        description: error.message || "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: AuthSchema) => {
    setIsLoading(true);
    try {
      const result = await authHelpers.signInAsUser({
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Credenciais inválidas", {
          description: "Verifique suas credenciais e tente novamente.",
        });
      } else if (result?.ok) {
        toast.success("Login realizado com sucesso!");
        router.push("/booking");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Erro interno", {
        description: "Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!showPasswordField ? (
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={emailForm.handleSubmit(onEmailSubmit)}
        >
          <div className="flex flex-col gap-4">
            <label
              htmlFor="email"
              className="text-[14px] flex text-end gap-1 font-medium text-black"
            >
              <div className="flex items-end">Email</div>
              <p className="text-[12px] font-normal">(obrigatório)</p>
            </label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              {...emailForm.register("email")}
              className="p-2 border rounded"
            />
          </div>
          <Button
            type="submit"
            className="#000000 text-white p-2 rounded flex items-center justify-center gap-2 cursor-pointer text-[16px] font-semibold"
            disabled={isLoading || !emailForm.formState.isValid}
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-t-2 border-t-white border-blue-500 rounded-full animate-spin"></span>
            )}
            Acessar conta
          </Button>

          <div className="flex items-center justify-between mr-10">
            <p className="text-[14px]">Ainda não tem um cadastro?</p>
            <Button
              variant="link"
              className="text-black text-[14px] font-bold underline hover:text-black/80"
              onClick={() => router.push("/register")}
            >
              Cadastre-se
            </Button>
          </div>
        </form>
      ) : (
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={authForm.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-4">
            <label
              htmlFor="email"
              className="text-[14px] flex text-end gap-1 font-medium text-black"
            >
              <div className="flex items-end">Email</div>
              <p className="text-[12px] font-normal">(confirmado)</p>
            </label>
            <Input
              type="email"
              id="email"
              value={userEmail}
              disabled
              className="p-2 border rounded bg-gray-50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-[14px] flex text-end gap-1 font-medium text-black"
            >
              <div className="flex items-end">Senha</div>
              <p className="text-[12px] font-normal">(obrigatório)</p>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Senha"
                {...authForm.register("password")}
                className="p-2 border rounded pr-10"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {!showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            className="#000000 text-white p-2 rounded flex items-center justify-center gap-2 cursor-pointer text-[16px] font-semibold"
            disabled={isLoading || !authForm.formState.isValid}
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-t-2 border-t-white border-blue-500 rounded-full animate-spin"></span>
            )}
            Acessar conta
          </Button>
        </form>
      )}
    </>
  );
}
