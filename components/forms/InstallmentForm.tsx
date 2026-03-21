"use client";

import { useForm, Controller } from "react-hook-form";
import { FormWrapper } from "@/components/FormWrapper";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";

interface InstallmentFormData {
  description: string;
  totalValue: number;
  totalInstallments: number;
  startDate: string;
  category: string;
  color: string;
}

interface InstallmentFormProps {
  toggleOpen: () => void;
  onSubmit: (data: InstallmentFormData) => void;
  initialData?: InstallmentFormData;
}

const categories = [
  { value: "Tecnologia", label: "Tecnologia" },
  { value: "Educação", label: "Educação" },
  { value: "Casa", label: "Casa" },
  { value: "Veículo", label: "Veículo" },
  { value: "Vestuário", label: "Vestuário" },
  { value: "Lazer", label: "Lazer" },
  { value: "Outros", label: "Outros" },
];

const colors = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1",
];

export const InstallmentForm = ({ toggleOpen, onSubmit, initialData }: InstallmentFormProps) => {
  const methods = useForm<InstallmentFormData>({
    defaultValues: initialData || {
      description: "",
      totalValue: 0,
      totalInstallments: 1,
      startDate: "",
      category: "",
      color: "#3B82F6",
    },
  });

  const { register, setValue, watch, formState: { errors } } = methods;

  const handleSubmit = (data: InstallmentFormData) => {
    onSubmit(data);
  };

  const installmentValue = methods.watch("totalValue") / methods.watch("totalInstallments");
  const selectedColor = methods.watch("color");

  return (
    <FormWrapper methods={methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
        <FormInput
          name="description"
          label="Descrição *"
          type="text"
          placeholder="Ex: iPhone 15 Pro"
          register={register("description", { required: "Descrição é obrigatória" })}
          error={errors.description}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            name="totalValue"
            label="Valor Total (R$) *"
            type="number"
            placeholder="5000"
            register={register("totalValue", { 
              required: "Valor total é obrigatório",
              min: { value: 1, message: "Valor deve ser maior que 0" }
            })}
            error={errors.totalValue}
          />
          <FormInput
            name="totalInstallments"
            label="Nº de Parcelas *"
            type="number"
            placeholder="12"
            register={register("totalInstallments", { 
              required: "Número de parcelas é obrigatório",
              min: { value: 1, message: "Mínimo 1 parcela" },
              valueAsNumber: true
            })}
            error={errors.totalInstallments}
          />
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Valor da parcela:</span>
            <span className="font-semibold">R$ {isNaN(installmentValue) ? "0,00" : installmentValue.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>

        <FormInput
          name="startDate"
          label="Data da primeira parcela *"
          type="date"
          register={register("startDate", { required: "Data é obrigatória" })}
          error={errors.startDate}
        />

        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Categoria *</Label>
          <Controller
            name="category"
            control={methods.control}
            rules={{ required: "Selecione uma categoria" }}
            render={({ field }) => (
              <>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={`h-9 text-sm ${errors.category ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-red-500">{errors.category.message as string}</p>
                )}
              </>
            )}
          />
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
                  selectedColor === color ? "ring-2 ring-offset-2 ring-blue-500" : ""
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
            {initialData ? "Salvar" : "Criar Parcelamento"}
          </Button>
        </div>
      </form>
    </FormWrapper>
  );
};
