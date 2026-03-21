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
import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight } from "lucide-react";
import { LimitExceededDialog } from "@/components/LimitExceededDialog";
import { api } from "@/lib/api";

interface TransactionFormData {
  id?: string;
  type: "income" | "expense" | "transfer";
  date: string;
  value: number;
  category: string;
  description: string;
  wallet_id: string;
  paid: boolean;
}

interface TransactionFormProps {
  toggleOpen: () => void;
  onSuccess?: () => void;
  initialData?: TransactionFormData;
}

const categories = [
  { value: "Salário", label: "Salário" },
  { value: "Alimentação", label: "Alimentação" },
  { value: "Transporte", label: "Transporte" },
  { value: "Entretenimento", label: "Entretenimento" },
  { value: "Saúde", label: "Saúde" },
  { value: "Educação", label: "Educação" },
  { value: "Compras", label: "Compras"},
  { value: "Contas", label: "Contas" },
  { value: "Investimento", label: "Investimento" },
  { value: "Moradia", label: "Moradia" },
  { value: "Outros", label: "Outros" },
];

export const TransactionForm = ({ toggleOpen, onSuccess, initialData }: TransactionFormProps) => {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [limitExceededOpen, setLimitExceededOpen] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  const methods = useForm<TransactionFormData>({
    defaultValues: initialData || {
      type: "expense",
      date: new Date().toISOString().split("T")[0],
      value: 0,
      category: "",
      description: "",
      wallet_id: "",
      paid: true,
    },
  });

  const { register, formState: { errors } } = methods;

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

  useEffect(() => {
    if (initialData) {
      methods.reset(initialData);
    }
  }, [initialData, methods]);

  const formatDateForApi = (dateStr: string) => {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  const handleSubmit = async (data: TransactionFormData) => {
    setSubmitting(true);
    try {
      api.setToken(localStorage.getItem("token"));
      const formattedDate = formatDateForApi(data.date);
      
      if (initialData?.id) {
        const result = await api.updateTransaction(initialData.id, {
          description: data.description,
          category: data.category,
          value: Number(data.value),
          type: data.type,
          date: formattedDate,
          wallet_id: data.wallet_id,
          paid: data.paid,
        });

        if (result.success) {
          if (onSuccess) onSuccess();
          toggleOpen();
        } else if (result.message?.includes("Limite")) {
          setLimitMessage(result.message);
          setLimitExceededOpen(true);
        }
      } else {
        const result = await api.createTransaction({
          description: data.description,
          category: data.category,
          value: Number(data.value),
          type: data.type,
          date: formattedDate,
          wallet_id: data.wallet_id,
          paid: data.paid,
        });

        if (result.success) {
          if (onSuccess) onSuccess();
          toggleOpen();
        } else if (result.message?.includes("Limite")) {
          setLimitMessage(result.message);
          setLimitExceededOpen(true);
        }
      }
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("Limite")) {
        setLimitMessage(error.response.data.message);
        setLimitExceededOpen(true);
      } else {
        console.error("Error saving transaction:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectedType = methods.watch("type");

  return (
    <>
      <FormWrapper methods={methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Transação</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => methods.setValue("type", "expense")}
                className={`p-3 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  selectedType === "expense"
                    ? "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-600"
                    : "border-border hover:bg-muted"
                }`}
            >
              <ArrowDownCircle className="w-5 h-5" />
              Despesa
            </button>
            <button
              type="button"
              onClick={() => methods.setValue("type", "income")}
              className={`p-3 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1 cursor-pointer ${
                selectedType === "income"
                  ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-600"
                  : "border-border hover:bg-muted"
              }`}
            >
              <ArrowUpCircle className="w-5 h-5" />
              Receita
            </button>
            <button
              type="button"
              onClick={() => methods.setValue("type", "transfer")}
              className={`p-3 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1 cursor-pointer ${
                selectedType === "transfer"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                  : "border-border hover:bg-muted"
              }`}
            >
              <ArrowLeftRight className="w-5 h-5" />
              Transferência
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            name="date"
            label="Data *"
            type="date"
            register={register("date", { required: "Data é obrigatória" })}
            error={errors.date}
          />

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
                  <SelectTrigger className={`h-10 text-sm ${errors.category ? "border-red-500" : ""}`}>
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

        <FormInput
          name="description"
          label="Descrição *"
          type="text"
          placeholder="Ex: Almoço no restaurante"
          register={register("description", { required: "Descrição é obrigatória" })}
          error={errors.description}
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
                  <SelectTrigger className={`h-10 text-sm ${errors.wallet_id ? "border-red-500" : ""}`}>
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

        <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
          <Label htmlFor="paid" className="cursor-pointer text-sm font-medium">
            Pago / Recebido
          </Label>
          <Controller
            name="paid"
            control={methods.control}
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange(!field.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  field.value
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {field.value ? "Sim" : "Não"}
              </button>
            )}
          />
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
          <Button type="submit" className="flex-1 cursor-pointer" disabled={submitting}>
            {submitting ? "Salvando..." : initialData ? "Salvar" : "Registrar"}
          </Button>
        </div>
      </form>
    </FormWrapper>

    <LimitExceededDialog
      open={limitExceededOpen}
      onOpenChange={setLimitExceededOpen}
      itemType="transações"
      message={limitMessage}
      onClose={toggleOpen}
    />
    </>
  );
};
