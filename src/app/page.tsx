import AuthForm from "@/components/forms/auth";
import UnauthenticatedHeader from "@/components/unauthenticated-header";
import { Wind } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-full">
      <UnauthenticatedHeader />
      <div className="flex flex-col w-full h-full items-center justify-center gap-4">
        <h2 className="font-semibold text-[28px] text-black">
          Entre na sua conta
        </h2>
        <div className="md:h-min md:w-min md:min-w-[600px] w-full h-full md:rounded-md bg-white border border-[#D7D7D7] p-5 flex flex-col">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
