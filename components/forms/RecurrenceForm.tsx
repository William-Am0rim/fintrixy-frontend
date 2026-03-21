"use client";

import { useState, useEffect } from "react";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { api } from "@/lib/api";

interface RecurrenceFormData {
  description: string;
  value: number;
  type: "income" | "expense";
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  nextDate: string;
  wallet_id: string;
  category: string;
  color: string;
}

interface RecurrenceFormProps {
  toggleOpen: () => void;
  onSubmit: (data: RecurrenceFormData) => void;
  initialData?: RecurrenceFormData;
}

const categories = [
  { value: "Salário", label: "Salário" },
  { value: "Moradia", label: "Moradia" },
  { value: "Alimentação", label: "Alimentação" },
  { value: "Transporte", label: "Transporte" },
  { value: "Entretenimento", label: "Entretenimento" },
  { value: "Saúde", label: "Saúde" },
  { value: "Educação", label: "Educação" },
  { value: "Contas", label: "Contas" },
  { value: "Investimento", label: "Investimento" },
  { value: "Outros", label: "Outros" },
];

const frequencies = [
  { value: "daily", label: "Diário" },
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensal" },
  { value: "yearly", label: "Anual" },
];

const colors = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1",
];

export const RecurrenceForm = ({ toggleOpen, onSubmit, initialData }: RecurrenceFormProps) => {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const methods = useForm<RecurrenceFormData>({
    defaultValues: initialData || {
      description: "",
      value: 0,
      type: "expense",
      frequency: "monthly",
      nextDate: new Date().toISOString().split("T")[0],
      wallet_id: "",
      category: "",
      color: "#EF4444",
    },
  });

  const { register, setValue, watch, formState: { errors } } = methods;

  useEffect(() => {
    const loadWallets = async () => {
      setLoading(true);
      try {
        api.setToken(localStorage.getItem("token"));
        const res = await api.getWallets();
        if (res.success && res.data) {
          setWallets(res.data);
        }
      } catch (error) {
        console.error("Error loading wallets:", error);
      } finally {
        setLoading(false);
      }
    };
    loadWallets();
  }, []);

  const handleSubmit = (data: RecurrenceFormData) => {
    onSubmit(data);
  };

  return (
    <FormWrapper methods={methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Tipo de Transação
          </Label>
          <Controller
            name="type"
            control={methods.control}
            render={({ field }) => (
              <ToggleGroup
                type="single"
                value={field.value}
                onValueChange={field.onChange}
                className="w-full gap-1"
                variant="outline"
              >
                <ToggleGroupItem
                  value="expense"
                  className="flex-1 text-xs py-1.5 data-[state=on]:bg-red-500 data-[state=on]:text-white data-[state=on]:border-red-500"
                >
                  <ArrowDownCircle className="w-3 h-3 mr-1" />
                  Despesa
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="income"
                  className="flex-1 text-xs py-1.5 data-[state=on]:bg-green-500 data-[state=on]:text-white data-[state=on]:border-green-500"
                >
                  <ArrowUpCircle className="w-3 h-3 mr-1" />
                  Receita
                </ToggleGroupItem>
              </ToggleGroup>
            )}
          />
        </div>

        <FormInput
          name="description"
          label="Descrição *"
          type="text"
          placeholder="Ex: Aluguel, Netflix..."
          register={register("description", { required: "Descrição é obrigatória" })}
          error={errors.description}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            name="value"
            label="Valor (R$) *"
            type="number"
            placeholder="0,00"
            register={register("value", { 
              required: "Valor é obrigatório",
              min: { value: 0.01, message: "Valor deve ser maior que 0" }
            })}
            error={errors.value}
          />
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Frequência *</Label>
            <Controller
              name="frequency"
              control={methods.control}
              rules={{ required: "Selecione uma frequência" }}
              render={({ field }) => (
                <>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={`h-9 text-sm ${errors.frequency ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.frequency && (
                    <p className="text-xs text-red-500">{errors.frequency.message as string}</p>
                  )}
                </>
              )}
            />
          </div>
        </div>

        <FormInput
          name="nextDate"
          label="Próxima data *"
          type="date"
          register={register("nextDate", { required: "Data é obrigatória" })}
          error={errors.nextDate}
        />

        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Carteira *</Label>
          <Controller
            name="wallet_id"
            control={methods.control}
            rules={{ required: "Selecione uma carteira" }}
            render={({ field }) => (
              <>
                <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
                  <SelectTrigger className={`h-9 text-sm ${errors.wallet_id ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.id}>
                        {wallet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.wallet_id && (
                  <p className="text-xs text-red-500">{errors.wallet_id.message as string}</p>
                )}
              </>
            )}
          />
        </div>

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
                  watch("color") === color ? "ring-2 ring-offset-2 ring-blue-500" : ""
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          {errors.color && (
            <p className="text-xs text-red-500">{errors.color.message as string}</p>
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
            {initialData ? "Salvar" : "Criar Recorrência"}
          </Button>
        </div>
      </form>
    </FormWrapper>
  );
};
