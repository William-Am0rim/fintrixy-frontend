"use client";

import { useForm } from "react-hook-form";
import { FormWrapper } from "@/components/FormWrapper";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { Wallet, PiggyBank, CreditCard, Building2, Banknote } from "lucide-react";

interface WalletFormData {
  name: string;
  type: string;
  value_initial: number;
  color: string;
}

interface WalletFormProps {
  toggleOpen: () => void;
  onSubmit: (data: WalletFormData) => void;
  initialData?: WalletFormData;
}

const walletTypes = [
  { value: "conta_corrente", label: "Conta Corrente", icon: Building2 },
  { value: "poupanca", label: "Poupança", icon: PiggyBank },
  { value: "carteira_digital", label: "Carteira Digital", icon: Wallet },
  { value: "cartao_credito", label: "Cartão de Crédito", icon: CreditCard },
  { value: "dinheiro", label: "Dinheiro", icon: Banknote },
];

const colors = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1",
];

export const WalletForm = ({ toggleOpen, onSubmit, initialData }: WalletFormProps) => {
  const methods = useForm<WalletFormData>({
    defaultValues: initialData || {
      name: "",
      type: "conta_corrente",
      value_initial: 0,
      color: "#3B82F6",
    },
  });

  const { register, setValue, watch, formState: { errors } } = methods;

  const handleSubmit = (data: WalletFormData) => {
    onSubmit(data);
  };

  return (
    <FormWrapper methods={methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
        <FormInput
          name="name"
          label="Nome da carteira *"
          type="text"
          placeholder="Ex: Nubank, Itau..."
          register={register("name", { required: "Nome é obrigatório" })}
          error={errors.name}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo da conta *</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {walletTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setValue("type", type.value, { shouldValidate: true })}
                className={`p-3 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  watch("type") === type.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                    : "border-border hover:bg-muted"
                }`}
              >
                <type.icon className="w-5 h-5" />
                {type.label}
              </button>
            ))}
          </div>
          {errors.type && (
            <p className="text-xs text-red-500">Selecione um tipo de conta</p>
          )}
        </div>

        <FormInput
          name="value_initial"
          label="Saldo inicial"
          type="number"
          placeholder="0,00"
          register={register("value_initial")}
          error={errors.value_initial}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Cor *</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue("color", color, { shouldValidate: true })}
                className={`w-8 h-8 rounded-full transition-all cursor-pointer ${
                  watch("color") === color ? "ring-2 ring-offset-2 ring-blue-500" : ""
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          {errors.color && (
            <p className="text-xs text-red-500">Selecione uma cor</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={toggleOpen}
          >
            Cancelar
          </Button>
          <Button type="submit" className="flex-1 cursor-pointer">
            {initialData ? "Salvar" : "Criar Carteira"}
          </Button>
        </div>
      </form>
    </FormWrapper>
  );
};
