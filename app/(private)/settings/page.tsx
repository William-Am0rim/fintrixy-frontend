"use client";

import { useState, useEffect, useCallback } from "react";
import { User, Mail, Lock, Camera, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/FormInput";
import { FormWrapper } from "@/components/FormWrapper";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";

interface ProfileFormData {
  name: string;
  email: string;
  image?: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profile, setProfile] = useState<ProfileFormData | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const methods = useForm<ProfileFormData>({
    defaultValues: {
      name: "",
      email: "",
      image: "",
    },
  });

  const passwordMethods = useForm<PasswordData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { register, formState: { errors }, reset } = methods;
  const { register: registerPassword, formState: { errors: passwordErrors }, reset: resetPassword, handleSubmit: handlePasswordSubmit } = passwordMethods;

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      api.setToken(localStorage.getItem("token"));
      const res = await api.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        reset({
          name: res.data.name || "",
          email: res.data.email || "",
          image: res.data.image || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleProfileSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.updateProfile({
        name: data.name,
        image: data.image || undefined,
      });
      if (result.success) {
        setSuccessMessage("Perfil atualizado com sucesso!");
        setProfile({ ...profile!, name: data.name, image: data.image });
      } else {
        setErrorMessage(result.message || "Erro ao atualizar perfil");
      }
    } catch (error) {
      setErrorMessage("Erro ao atualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (data: PasswordData) => {
    if (data.newPassword !== data.confirmPassword) {
      setPasswordError("As senhas não conferem");
      return;
    }

    if (data.newPassword.length < 6) {
      setPasswordError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setChangingPassword(true);
    setPasswordSuccess("");
    setPasswordError("");
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.changePassword(data.currentPassword, data.newPassword);
      if (result.success) {
        setPasswordSuccess("Senha alterada com sucesso!");
        resetPassword();
      } else {
        setPasswordError(result.message || "Erro ao alterar senha");
      }
    } catch (error) {
      setPasswordError("Erro ao alterar senha");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </div>
        <div className="space-y-4">
          <div className="h-48 bg-muted rounded-xl animate-pulse"></div>
          <div className="h-48 bg-muted rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Gerencie suas informações pessoais
        </p>
      </div>

      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-green-600 dark:text-green-400 text-sm">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="bg-card rounded-xl border p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b">
          <User className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Informações do Perfil</h2>
        </div>

        <FormWrapper methods={methods}>
          <form onSubmit={methods.handleSubmit(handleProfileSubmit)} className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-muted">
                  {profile?.image ? (
                    <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="text"
                    placeholder="URL da imagem"
                    className="hidden"
                    {...register("image")}
                  />
                </label>
              </div>
            </div>

            <FormInput
              name="name"
              label="Nome"
              type="text"
              placeholder="Seu nome"
              register={register("name", { required: "Nome é obrigatório" })}
              error={errors.name}
            />

            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="seu@email.com"
              register={register("email")}
              error={errors.email}
              disabled
            />

            <FormInput
              name="image"
              label="URL da Foto de Perfil"
              type="text"
              placeholder="https://exemplo.com/foto.jpg"
              register={register("image")}
              error={errors.image}
            />

            <Button type="submit" disabled={saving} className="w-full cursor-pointer">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </form>
        </FormWrapper>
      </div>

      <div className="bg-card rounded-xl border p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b">
          <Lock className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Alterar Senha</h2>
        </div>

        {passwordSuccess && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-green-600 dark:text-green-400 text-sm">
            {passwordSuccess}
          </div>
        )}

        {passwordError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400 text-sm">
            {passwordError}
          </div>
        )}

        <FormWrapper methods={passwordMethods}>
          <form onSubmit={handlePasswordSubmit(handlePasswordChange)} className="space-y-4">
            <FormInput
              name="currentPassword"
              label="Senha Atual"
              type="password"
              placeholder="••••••••"
              register={registerPassword("currentPassword", { required: "Senha atual é obrigatória" })}
              error={passwordErrors.currentPassword}
            />

            <FormInput
              name="newPassword"
              label="Nova Senha"
              type="password"
              placeholder="••••••••"
              register={registerPassword("newPassword", { 
                required: "Nova senha é obrigatória",
                minLength: { value: 6, message: "Mínimo de 6 caracteres" }
              })}
              error={passwordErrors.newPassword}
            />

            <FormInput
              name="confirmPassword"
              label="Confirmar Nova Senha"
              type="password"
              placeholder="••••••••"
              register={registerPassword("confirmPassword", { required: "Confirmação é obrigatória" })}
              error={passwordErrors.confirmPassword}
            />

            <Button type="submit" disabled={changingPassword} className="w-full cursor-pointer">
              {changingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Alterando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Alterar Senha
                </>
              )}
            </Button>
          </form>
        </FormWrapper>
      </div>
    </div>
  );
};

export default SettingsPage;
