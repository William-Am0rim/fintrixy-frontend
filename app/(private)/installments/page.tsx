"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, CreditCard, Pencil, Trash2, Clock, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InstallmentForm } from "@/components/forms/InstallmentForm";
import { LimitExceededDialog } from "@/components/LimitExceededDialog";
import { api } from "@/lib/api";

interface Installment {
  id: string;
  description: string;
  totalValue: number;
  paidValue: number;
  remainingValue: number;
  remainingInstallments: number;
  totalInstallments: number;
  paidInstallments: number;
  nextDueDate: string;
  color: string;
  category: string;
  completed: boolean;
}

interface InstallmentFormData {
  description: string;
  totalValue: number;
  totalInstallments: number;
  startDate: string;
  category: string;
  color: string;
}

const InstallmentsPage = () => {
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInstallment, setEditingInstallment] = useState<Installment | null>(null);
  const [loading, setLoading] = useState(true);
  const [limitExceededOpen, setLimitExceededOpen] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  const loadInstallments = useCallback(async () => {
    setLoading(true);
    try {
      api.setToken(localStorage.getItem("token"));
      const res = await api.getInstallments();
      if (res.success && res.data) {
        const formatted = res.data.map((i: any) => ({
          id: i.id,
          description: i.description,
          totalValue: i.totalValue,
          paidValue: i.paidValue,
          remainingValue: i.totalValue - i.paidValue,
          remainingInstallments: i.totalInstallments - i.paidInstallments,
          totalInstallments: i.totalInstallments,
          paidInstallments: i.paidInstallments,
          nextDueDate: i.nextDueDate ? new Date(i.nextDueDate).toLocaleDateString("pt-BR") : "Pago",
          color: i.color,
          category: i.category,
          completed: i.completed || i.paidInstallments >= i.totalInstallments,
        }));
        setInstallments(formatted);
      }
    } catch (error) {
      console.error("Error loading installments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInstallments();
  }, [loadInstallments]);

  const formatDateForApi = (dateStr: string) => {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  const formatDateForInput = (dateStr: string) => {
    if (dateStr && dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  const handleCreate = async (data: InstallmentFormData) => {
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.createInstallment({
        description: data.description,
        totalValue: data.totalValue,
        totalInstallments: data.totalInstallments,
        startDate: formatDateForApi(data.startDate),
        category: data.category,
        color: data.color,
      });
      if (result.success) {
        loadInstallments();
        setIsDialogOpen(false);
        setEditingInstallment(null);
      } else if (result.message?.includes("Limite")) {
        setLimitMessage(result.message);
        setLimitExceededOpen(true);
      }
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("Limite")) {
        setLimitMessage(error.response.data.message);
        setLimitExceededOpen(true);
      } else {
        console.error("Error creating installment:", error);
      }
    }
  };

  const handleUpdate = async (data: InstallmentFormData) => {
    if (!editingInstallment) return;
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.updateInstallment(editingInstallment.id, {
        description: data.description,
        totalValue: data.totalValue,
        totalInstallments: data.totalInstallments,
        startDate: formatDateForApi(data.startDate),
        category: data.category,
        color: data.color,
      });
      if (result.success) {
        loadInstallments();
        setIsDialogOpen(false);
        setEditingInstallment(null);
      }
    } catch (error) {
      console.error("Error updating installment:", error);
    }
  };

  const handleEdit = (installment: Installment) => {
    setEditingInstallment(installment);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.deleteInstallment(id);
      if (result.success) {
        setInstallments(installments.filter((i) => i.id !== id));
      }
    } catch (error) {
      console.error("Error deleting installment:", error);
    }
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
    if (isDialogOpen) {
      setEditingInstallment(null);
    }
  };

  const totalRemaining = installments
    .filter((i) => i.remainingInstallments > 0)
    .reduce((acc, i) => acc + i.remainingValue, 0);
  const totalMonthly = installments
    .filter((i) => i.remainingInstallments > 0)
    .reduce((acc, i) => acc + (i.totalValue / i.totalInstallments), 0);
  const activeCount = installments.filter((i) => i.remainingInstallments > 0).length;
  const completedCount = installments.filter((i) => i.remainingInstallments === 0).length;

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Parcelamentos</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Acompanhe seus parcelamentos e cartões
          </p>
        </div>
        <Button className="cursor-pointer w-full sm:w-auto" onClick={toggleDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Parcelamento
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-card rounded-xl border p-3 md:p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 md:p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Total Restante</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-red-600 truncate">
            R$ {totalRemaining.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="bg-card rounded-xl border p-3 md:p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Parcela Média</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-blue-600 truncate">
            R$ {totalMonthly.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="bg-card rounded-xl border p-3 md:p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 md:p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Ativos</p>
          </div>
          <p className="text-lg md:text-2xl font-bold">{activeCount}</p>
        </div>
        <div className="bg-card rounded-xl border p-3 md:p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 md:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Quitados</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-green-600">{completedCount}</p>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        {installments.map((installment) => {
          const progress = installment.totalValue > 0 ? (installment.paidValue / installment.totalValue) * 100 : 0;
          const isCompleted = installment.remainingInstallments === 0;

          return (
            <div
              key={installment.id}
              className={cn(
                "bg-card rounded-xl border p-4 md:p-5 hover:shadow-lg transition-shadow",
                isCompleted && "opacity-70"
              )}
            >
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${installment.color}20` }}
                  >
                    <CreditCard className="w-5 h-5 md:w-6 md:h-6" style={{ color: installment.color }} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm md:text-base truncate">{installment.description}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{installment.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(installment)}
                    className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(installment.id)}
                    className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3 md:w-4 md:h-4 text-destructive" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total</p>
                  <p className="font-semibold text-sm md:text-base">R$ {installment.totalValue.toFixed(2).replace(".", ",")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Restante</p>
                  <p className="font-semibold text-sm md:text-base text-red-600">R$ {installment.remainingValue.toFixed(2).replace(".", ",")}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Parcelas</p>
                  <p className="font-semibold text-sm md:text-base">{installment.paidInstallments}/{installment.totalInstallments}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Próxima</p>
                  <p className="font-semibold text-sm md:text-base flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {installment.nextDueDate}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className={cn(isCompleted ? "text-green-600 font-medium" : "")}>
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <div className="relative h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: installment.color }}
                  />
                </div>
              </div>

              {isCompleted && (
                <div className="mt-3 md:mt-4 p-2 md:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  <span className="text-xs md:text-sm text-green-700 dark:text-green-400 font-medium">
                    Parcelamento quitado!
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {installments.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <CreditCard className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-sm md:text-base mb-4">
            Nenhum parcelamento encontrado
          </p>
          <Button className="cursor-pointer" onClick={toggleDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar parcelamento
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingInstallment ? "Editar Parcelamento" : "Novo Parcelamento"}
            </DialogTitle>
            <DialogDescription>
              {editingInstallment
                ? "Atualize as informações do parcelamento."
                : "Preencha as informações para criar um novo parcelamento."}
            </DialogDescription>
          </DialogHeader>
          <InstallmentForm
            toggleOpen={toggleDialog}
            onSubmit={editingInstallment ? handleUpdate : handleCreate}
            initialData={editingInstallment ? {
              description: editingInstallment.description,
              totalValue: editingInstallment.totalValue,
              totalInstallments: editingInstallment.totalInstallments,
              startDate: formatDateForInput(editingInstallment.nextDueDate),
              category: editingInstallment.category,
              color: editingInstallment.color,
            } : undefined}
          />
        </DialogContent>
      </Dialog>

      <LimitExceededDialog
        open={limitExceededOpen}
        onOpenChange={setLimitExceededOpen}
        itemType="cartões"
        message={limitMessage}
        onClose={toggleDialog}
      />
    </div>
  );
};

export default InstallmentsPage;
