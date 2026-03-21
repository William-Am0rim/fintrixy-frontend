"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormWrapper } from "@/components/FormWrapper";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/ui/button";

interface GoalFormData {
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
  icon: string;
}

interface GoalFormProps {
  toggleOpen: () => void;
  onSubmit: (data: GoalFormData) => void;
  initialData?: GoalFormData;
}

const icons = [
  { value: "✈️", label: "Viagem" },
  { value: "🏦", label: "Banco" },
  { value: "💻", label: "Tecnologia" },
  { value: "📚", label: "Educação" },
  { value: "🚗", label: "Carro" },
  { value: "🏠", label: "Casa" },
  { value: "💍", label: "Joias" },
  { value: "🎮", label: "Games" },
  { value: "📱", label: "Celular" },
  { value: "💰", label: "Dinheiro" },
];

const colors = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1",
];

export const GoalForm = ({ toggleOpen, onSubmit, initialData }: GoalFormProps) => {
  const methods = useForm<GoalFormData>({
    defaultValues: initialData || {
      name: "",
      target: 0,
      current: 0,
      deadline: "",
      color: "#3B82F6",
      icon: "💰",
    },
  });

  const { register, setValue, watch, formState: { errors } } = methods;

  useEffect(() => {
    if (initialData) {
      methods.reset(initialData);
    }
  }, [initialData, methods]);

  const handleSubmit = (data: GoalFormData) => {
    onSubmit(data);
  };

  const selectedIcon = methods.watch("icon");
  const selectedColor = methods.watch("color");

  return (
    <FormWrapper methods={methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
        <FormInput
          name="name"
          label="Nome da meta *"
          type="text"
          placeholder="Ex: Viagem de Férias"
          register={register("name", { required: "Nome é obrigatório" })}
          error={errors.name}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            name="target"
            label="Meta (R$) *"
            type="number"
            placeholder="5000"
            register={register("target", { 
              required: "Meta é obrigatória",
              min: { value: 1, message: "Valor deve ser maior que 0" }
            })}
            error={errors.target}
          />
          <FormInput
            name="current"
            label="Valor atual (R$)"
            type="number"
            placeholder="0"
            register={register("current")}
            error={errors.current}
          />
        </div>

        <FormInput
          name="deadline"
          label="Prazo *"
          type="date"
          register={register("deadline", { required: "Prazo é obrigatório" })}
          error={errors.deadline}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Ícone *</label>
          <div className="flex flex-wrap gap-2">
            {icons.map((icon) => (
              <button
                key={icon.value}
                type="button"
                onClick={() => setValue("icon", icon.value, { shouldValidate: true })}
                className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all cursor-pointer ${
                  watch("icon") === icon.value
                    ? "bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {icon.value}
              </button>
            ))}
          </div>
          {errors.icon && (
            <p className="text-xs text-red-500">Selecione um ícone</p>
          )}
        </div>

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
            {initialData ? "Salvar" : "Criar Meta"}
          </Button>
        </div>
      </form>
    </FormWrapper>
  );
};
