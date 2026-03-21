"use client";

import { useForm } from "react-hook-form";
import { FormWrapper } from "@/components/FormWrapper";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/ui/button";

interface BudgetFormData {
  category: string;
  limit: number;
  spent: number;
  color: string;
  icon: string;
}

interface BudgetFormProps {
  toggleOpen: () => void;
  onSubmit: (data: BudgetFormData) => void;
  initialData?: BudgetFormData;
}

const categories = [
  { value: "Alimentação", icon: "🍔", color: "#3B82F6" },
  { value: "Transporte", icon: "🚗", color: "#10B981" },
  { value: "Moradia", icon: "🏠", color: "#F59E0B" },
  { value: "Entretenimento", icon: "🎬", color: "#8B5CF6" },
  { value: "Saúde", icon: "💊", color: "#EF4444" },
  { value: "Educação", icon: "📚", color: "#06B6D4" },
  { value: "Serviços", icon: "💡", color: "#EC4899" },
  { value: "Outros", icon: "📦", color: "#6366F1" },
];

export const BudgetForm = ({ toggleOpen, onSubmit, initialData }: BudgetFormProps) => {
  const methods = useForm<BudgetFormData>({
    defaultValues: initialData || {
      category: "",
      limit: 0,
      spent: 0,
      color: "#3B82F6",
      icon: "📦",
    },
  });

  const { register, setValue, watch, formState: { errors } } = methods;

  const handleSubmit = (data: BudgetFormData) => {
    onSubmit(data);
  };

  const selectedCategory = categories.find(
    (cat) => cat.value === watch("category")
  );

  return (
    <FormWrapper methods={methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => {
                  setValue("category", cat.value, { shouldValidate: true });
                  setValue("icon", cat.icon, { shouldValidate: true });
                  setValue("color", cat.color, { shouldValidate: true });
                }}
                className={`p-3 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  watch("category") === cat.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                    : "border-border hover:bg-muted"
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                {cat.value}
              </button>
            ))}
          </div>
          {errors.category && (
            <p className="text-xs text-red-500">Selecione uma categoria</p>
          )}
        </div>

        <FormInput
          name="limit"
          label="Limite do orçamento (R$) *"
          type="number"
          placeholder="1000"
          register={register("limit", { 
            required: "Limite é obrigatório",
            min: { value: 1, message: "Valor deve ser maior que 0" }
          })}
          error={errors.limit}
        />

        <FormInput
          name="spent"
          label="Valor já gasto (R$)"
          type="number"
          placeholder="0"
          register={register("spent")}
          error={errors.spent}
        />

        {selectedCategory && (
          <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
            <span className="text-2xl">{selectedCategory.icon}</span>
            <div>
              <p className="font-medium">{selectedCategory.value}</p>
              <p className="text-xs text-muted-foreground">
                Categoria selecionada
              </p>
            </div>
          </div>
        )}

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
            {initialData ? "Salvar" : "Criar Orçamento"}
          </Button>
        </div>
      </form>
    </FormWrapper>
  );
};
