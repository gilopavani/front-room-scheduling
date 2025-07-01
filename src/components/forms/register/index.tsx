"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  registerSchema,
  RegisterSchema,
  RegisterModel,
} from "@/models/register.model";
import { getCepService } from "@/service/cep";
import { registerService } from "@/service/register";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepFound, setCepFound] = useState(false);
  const [showAddressFields, setShowAddressFields] = useState(false);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length === 8) {
      setLoadingCep(true);
      try {
        const cepData = await getCepService(cleanCep);

        if (cepData && !cepData.erro) {
          form.setValue("street", cepData.logradouro || "");
          form.setValue("neighborhood", cepData.bairro || "");
          form.setValue("city", cepData.localidade || "");
          form.setValue("state", cepData.uf || "");

          // Só marca como encontrado se pelo menos o logradouro vier preenchido
          const hasValidData = !!(
            cepData.logradouro && cepData.logradouro.trim() !== ""
          );
          setCepFound(hasValidData);
          setShowAddressFields(true);

          if (hasValidData) {
            toast.success("CEP encontrado!");
          } else {
            toast.info("CEP encontrado, mas preencha os dados manualmente.");
          }
        }
      } catch {
        setCepFound(false);
        setShowAddressFields(true);
        form.setValue("street", "");
        form.setValue("neighborhood", "");
        form.setValue("city", "");
        form.setValue("state", "");
        toast.error("CEP não encontrado. Preencha os dados manualmente.");
      } finally {
        setLoadingCep(false);
      }
    } else {
      setCepFound(false);
      setShowAddressFields(false);
    }
  };

  const onSubmit = async (data: RegisterSchema) => {
    setIsLoading(true);

    try {
      const registerData: RegisterModel = {
        user: {
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          role: "user",
          status: "active",
          canViewLogs: true,
          canManageScheduling: true,
        },
        address: {
          cep: data.cep.replace(/\D/g, ""),
          number: data.number,
          street: data.street,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
        },
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      await registerService(registerData);
      toast.success("Cadastro realizado com sucesso!");
      router.push("/");
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error || "Tente novamente mais tarde."
          : "Tente novamente mais tarde.";

      toast.error("Erro ao realizar cadastro", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCep = (value: string) => {
    const cleanCep = value.replace(/\D/g, "");
    if (cleanCep.length <= 5) {
      return cleanCep;
    }
    return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5, 8)}`;
  };

  return (
    <form
      className="flex flex-col gap-4 w-full"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-[14px] flex text-end gap-1 font-medium text-black"
            >
              <div className="flex items-end">Nome</div>
              <p className="text-[12px] font-normal">(Obrigatório)</p>
            </label>
            <Input
              type="text"
              id="name"
              placeholder="Nome"
              {...form.register("name")}
              className="p-2 border rounded"
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="lastName"
              className="text-[14px] flex text-end gap-1 font-medium text-black"
            >
              <div className="flex items-end">Sobrenome</div>
              <p className="text-[12px] font-normal">(Obrigatório)</p>
            </label>
            <Input
              type="text"
              id="lastName"
              placeholder="Sobrenome"
              {...form.register("lastName")}
              className="p-2 border rounded"
            />
            {form.formState.errors.lastName && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-[14px] flex text-end gap-1 font-medium text-black"
          >
            <div className="flex items-end">E-mail</div>
            <p className="text-[12px] font-normal">(Obrigatório)</p>
          </label>
          <Input
            type="email"
            id="email"
            placeholder="E-mail"
            {...form.register("email")}
            className="p-2 border rounded"
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-[14px] flex text-end gap-1 font-medium text-black"
          >
            <div className="flex items-end">Senha de acesso</div>
            <p className="text-[12px] font-normal">(Obrigatório)</p>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Senha de acesso"
              {...form.register("password")}
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
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="confirmPassword"
            className="text-[14px] flex text-end gap-1 font-medium text-black"
          >
            <div className="flex items-end">Confirmar senha</div>
            <p className="text-[12px] font-normal">(Obrigatório)</p>
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Confirmar senha"
              {...form.register("confirmPassword")}
              className="p-2 border rounded pr-10"
            />
            <button
              type="button"
              onClick={toggleShowConfirmPassword}
              className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {!showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="cep"
            className="text-[14px] flex text-end gap-1 font-medium text-black"
          >
            <div className="flex items-end">CEP</div>
            <p className="text-[12px] font-normal">(Obrigatório)</p>
          </label>
          <Input
            type="text"
            id="cep"
            placeholder="CEP"
            {...form.register("cep", {
              onChange: (e) => {
                const formatted = formatCep(e.target.value);
                form.setValue("cep", formatted);
                handleCepChange(formatted);
              },
            })}
            className="p-2 border rounded"
            maxLength={9}
          />
          {loadingCep && (
            <p className="text-blue-500 text-sm">Buscando CEP...</p>
          )}
          {form.formState.errors.cep && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.cep.message}
            </p>
          )}
        </div>

        {showAddressFields && (
          <>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="street"
                className="text-[14px] flex text-end gap-1 font-medium text-black"
              >
                <div className="flex items-end">Endereço</div>
              </label>
              <Input
                type="text"
                id="street"
                placeholder="Endereço"
                {...form.register("street")}
                className="p-2 border rounded"
                disabled={cepFound}
              />
              {form.formState.errors.street && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.street.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="number"
                className="text-[14px] flex text-end gap-1 font-medium text-black"
              >
                <div className="flex items-end">Número</div>
              </label>
              <Input
                type="text"
                id="number"
                placeholder="Número"
                {...form.register("number")}
                className="p-2 border rounded"
              />
              {form.formState.errors.number && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.number.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="complement"
                className="text-[14px] flex text-end gap-1 font-medium text-black"
              >
                <div className="flex items-end">Complemento</div>
              </label>
              <Input
                type="text"
                id="complement"
                placeholder="Complemento"
                {...form.register("complement")}
                className="p-2 border rounded"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="neighborhood"
                className="text-[14px] flex text-end gap-1 font-medium text-black"
              >
                <div className="flex items-end">Bairro</div>
              </label>
              <Input
                type="text"
                id="neighborhood"
                placeholder="Bairro"
                {...form.register("neighborhood")}
                className="p-2 border rounded"
                disabled={cepFound}
              />
              {form.formState.errors.neighborhood && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.neighborhood.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="city"
                className="text-[14px] flex text-end gap-1 font-medium text-black"
              >
                <div className="flex items-end">Cidade</div>
              </label>
              <Input
                type="text"
                id="city"
                placeholder="Cidade"
                {...form.register("city")}
                className="p-2 border rounded"
                disabled={cepFound}
              />
              {form.formState.errors.city && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.city.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="state"
                className="text-[14px] flex text-end gap-1 font-medium text-black"
              >
                <div className="flex items-end">Estado</div>
              </label>
              <Input
                type="text"
                id="state"
                placeholder="Estado"
                {...form.register("state")}
                className="p-2 border rounded"
                disabled={cepFound}
                maxLength={2}
              />
              {form.formState.errors.state && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.state.message}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <Button
        type="submit"
        className="bg-black hover:bg-gray-800 text-white p-2 rounded flex items-center justify-center gap-2 cursor-pointer text-[16px] font-semibold"
        disabled={isLoading || !form.formState.isValid}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-t-2 border-t-white border-blue-500 rounded-full animate-spin"></span>
        )}
        Cadastrar-se
      </Button>

      <div className="flex items-center justify-between mr-10">
        <p className="text-[14px]">Já tem uma conta?</p>
        <Button
          variant="link"
          className="text-black text-[14px] font-bold underline hover:text-black/80"
          onClick={() => router.push("/")}
        >
          Faça login
        </Button>
      </div>
    </form>
  );
}
