import { SignUpForm } from "./form";
import { HeroLeftPanel } from "@/components/HeroLeftPanel";

const SignUpPage = () => {
  return (
    <div className="flex">
      <div className="hidden md:flex flex-col w-1/2 bg-slate-900 h-screen p-10">
        <HeroLeftPanel title="Comece sua jornada" title_span="financeira hoje" />
      </div>
      <div className="flex flex-col justify-center items-center w-full h-screen md:w-1/2">
        <div className="w-full max-w-[360px]">
          <h1 className="text-2xl font-bold">Crie sua conta</h1>
          <p className="text-gray-400">
            Preencha os dados abaixo para começar a usar o Fintrixy
          </p>
          <div className="mt-6">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
