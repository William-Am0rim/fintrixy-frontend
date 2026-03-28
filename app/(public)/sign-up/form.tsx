"use client";

import { useState } from "react";
import { FormWrapper } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, User, Loader2 } from "lucide-react";
import { TypeSchemas } from "./validate";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemas } from "./validate";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const methods = useForm<TypeSchemas>({
    resolver: zodResolver(schemas),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { errors } = methods.formState;

  const onSubmit = async (data: TypeSchemas) => {
    setIsLoading(true);
    setError(null);

    try {
      const registerRes = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok || !registerData.success) {
        setError(registerData.message || "Erro ao criar conta");
        setIsLoading(false);
        return;
      }

      if (registerData.data?.token) {
        localStorage.setItem("token", registerData.data.token);
      }

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/sign-in");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Erro ao se conectar com o servidor. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <FormWrapper methods={methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
        <FormInput
          name="name"
          label="Nome completo"
          type="text"
          placeholder="Seu nome"
          icon={<User className="w-5 h-5" />}
          register={methods.register}
          error={errors.name}
        />
        <FormInput
          name="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          icon={<Mail className="w-5 h-5" />}
          register={methods.register}
          error={errors.email}
        />
        <FormInput
          name="password"
          label="Senha"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="w-5 h-5" />}
          register={methods.register}
          isPassword
          error={errors.password}
        />
        <Link
          href="/sign-in"
          className="text-blue-600 flex justify-end hover:underline"
        >
          Esqueceu a senha?
        </Link>
        <Button
          type="submit"
          className="w-full flex items-center justify-center gap-2 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Criando...
            </>
          ) : (
            <>
              Criar conta <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Já possui uma conta?{" "}
          <Link href="/sign-in" className="text-blue-600 hover:underline">
            Fazer login
          </Link>
        </p>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-4 text-muted-foreground">
              ou cadastre-se com
            </span>
          </div>
        </div>

        <Button
          className="btn-secondary flex items-center justify-center gap-2 w-full cursor-pointer"
          variant="outline"
          onClick={() => signIn("google")}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Ao continuar, você concorda com nossos Termos de Serviço e Política de
          Privacidade
        </p>
      </form>
    </FormWrapper>
  );
};
