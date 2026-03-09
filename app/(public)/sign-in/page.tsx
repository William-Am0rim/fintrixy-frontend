import { HeroLeftPanel } from "@/components/HeroLeftPanel";
import { SignInForm } from "./form";

const SignInPage = () => {
    return (
      <div className="flex">
        <div className="hidden md:flex flex-col w-1/2 bg-slate-900 h-screen p-10">
          <HeroLeftPanel
            title="Controle suas finanças"
            title_span="com inteligência"
          />
        </div>
        <div className="flex flex-col justify-center items-center w-full h-screen md:w-1/2">
          <div className="w-full max-w-[360px]">
            <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
            <p className="text-gray-400">
              Entre com suas credenciais para acessar sua conta
            </p>
            <div className="mt-6">
              <SignInForm />
            </div>
          </div>
        </div>
      </div>
    );
};

export default SignInPage;