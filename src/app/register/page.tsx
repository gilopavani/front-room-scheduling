import RegisterForm from "@/components/forms/register";
import UnauthenticatedHeader from "@/components/unauthenticated-header";

export default function Register() {
  return (
    <div className="flex flex-col w-full h-screen overflow-y-hidden">
      <UnauthenticatedHeader />
      <div className="flex flex-col w-full h-full items-center justify-center gap-4">
        <h2 className="font-semibold text-[28px] text-black">Cadastre-se</h2>
        <div className="md:h-min md:w-min md:min-w-[600px] w-full h-full md:rounded-md bg-white border border-[#D7D7D7] p-5 flex flex-col overflow-y-scroll">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
