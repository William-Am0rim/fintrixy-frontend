"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, ChartPie, AlertCircle, Check, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BudgetForm } from "@/components/forms/BudgetForm";
import { LimitExceededDialog } from "@/components/LimitExceededDialog";
import { api } from "@/lib/api";

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  color: string;
  icon: string;
}

interface BudgetFormData {
  category: string;
  limit: number;
  spent?: number;
  color: string;
  icon: string;
}

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [limitExceededOpen, setLimitExceededOpen] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  const loadBudgets = useCallback(async () => {
    setLoading(true);
    try {
      api.setToken(localStorage.getItem("token"));
      const res = await api.getBudgets();
      if (res.success && res.data) {
        setBudgets(res.data);
      }
    } catch (error) {
      console.error("Error loading budgets:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const handleCreate = async (data: BudgetFormData) => {
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.createBudget({
        category: data.category,
        limit: data.limit,
        spent: data.spent || 0,
        color: data.color,
        icon: data.icon,
      });
      if (result.success) {
        loadBudgets();
        setIsDialogOpen(false);
        setEditingBudget(null);
      } else if (result.message?.includes("Limite")) {
        setLimitMessage(result.message);
        setLimitExceededOpen(true);
      }
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("Limite")) {
        setLimitMessage(error.response.data.message);
        setLimitExceededOpen(true);
      } else {
        console.error("Error creating budget:", error);
      }
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsDialogOpen(true);
  };

  const handleUpdate = async (data: BudgetFormData) => {
    if (!editingBudget) return;
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.updateBudget(editingBudget.id, {
        category: data.category,
        limit: data.limit,
        spent: data.spent,
        color: data.color,
        icon: data.icon,
      });
      if (result.success) {
        loadBudgets();
        setIsDialogOpen(false);
        setEditingBudget(null);
      }
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.deleteBudget(id);
      if (result.success) {
        setBudgets(budgets.filter((b) => b.id !== id));
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
    if (isDialogOpen) {
      setEditingBudget(null);
    }
  };

  const totalBudget = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const exceededCount = budgets.filter((b) => b.spent > b.limit).length;

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
          <h1 className="text-xl sm:text-2xl font-bold">Orçamentos</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Defina limites de gastos por categoria
          </p>
        </div>
        <Button className="cursor-pointer w-full sm:w-auto" onClick={toggleDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ChartPie className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Total Orçado</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-blue-600 truncate">
            R$ {totalBudget.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Total Gasto</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-green-600 truncate">
            R$ {totalSpent.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <ChartPie className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Restante</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-purple-600 truncate">
            R$ {(totalBudget - totalSpent).toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className={cn(
          "rounded-xl p-4",
          exceededCount > 0 ? "bg-red-50 dark:bg-red-900/20" : "bg-emerald-50 dark:bg-emerald-900/20"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <div className={cn(
              "p-2 rounded-lg",
              exceededCount > 0 ? "bg-red-100 dark:bg-red-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"
            )}>
              <AlertCircle className={cn(
                "w-4 h-4 md:w-5 md:h-5",
                exceededCount > 0 ? "text-red-600" : "text-emerald-600"
              )} />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Ultrapassados</p>
          </div>
          <p className={cn(
            "text-lg md:text-2xl font-bold",
            exceededCount > 0 ? "text-red-600" : "text-emerald-600"
          )}>
            {exceededCount}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Visão Geral</h3>
        <div className="h-4 md:h-6 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              totalSpent > totalBudget ? "bg-red-500" : "bg-gradient-to-r from-green-500 to-blue-500"
            )}
            style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs md:text-sm">
          <span className="text-muted-foreground truncate">
            R$ {totalSpent.toFixed(2).replace(".", ",")} gastos
          </span>
          <span className={cn(
            "font-medium shrink-0 mx-2",
            totalSpent > totalBudget ? "text-red-600" : "text-green-600"
          )}>
            {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}%
          </span>
          <span className="text-muted-foreground truncate">
            R$ {totalBudget.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {budgets.map((budget) => {
          const percentage = totalBudget > 0 ? (budget.spent / budget.limit) * 100 : 0;
          const isExceeded = budget.spent > budget.limit;
          const remaining = budget.limit - budget.spent;

          return (
            <div
              key={budget.id}
              className={cn(
                "bg-card/40 backdrop-blur-md rounded-xl border p-4 md:p-5 hover:shadow-lg transition-shadow",
                isExceeded && "border-red-300 dark:border-red-800"
              )}
            >
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${budget.color}20` }}
                  >
                    {budget.icon || "💰"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm md:text-base truncate">{budget.category}</h3>
                    <p className="text-xs text-muted-foreground">
                      {isExceeded ? "Excedido!" : "Dentro do orçamento"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3 md:w-4 md:h-4 text-destructive" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">
                    R$ {budget.spent.toFixed(2).replace(".", ",")}
                  </span>
                  <span className={cn(isExceeded ? "text-red-600" : "text-muted-foreground")}>
                    R$ {budget.limit.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="relative h-2 md:h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "absolute left-0 top-0 h-full rounded-full transition-all",
                      isExceeded ? "bg-red-500" : ""
                    )}
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: isExceeded ? undefined : budget.color,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-xs md:text-sm font-medium",
                    isExceeded ? "text-red-600" : "text-green-600"
                  )}>
                    {isExceeded ? (
                      <>
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                        Excedido
                      </>
                    ) : (
                      <>
                        <Check className="w-3 h-3 inline mr-1" />
                        Restam
                      </>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>

              {isExceeded && (
                <div className="mt-3 md:mt-4 p-2 md:p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <span className="text-xs text-red-700 dark:text-red-400">
                    Excedido em R$ {Math.abs(remaining).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <ChartPie className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-sm md:text-base mb-4">
            Nenhum orçamento criado ainda
          </p>
          <Button className="cursor-pointer" onClick={toggleDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Criar primeiro orçamento
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingBudget ? "Editar Orçamento" : "Novo Orçamento"}
            </DialogTitle>
            <DialogDescription>
              {editingBudget
                ? "Atualize as informações do orçamento."
                : "Preencha as informações para criar um novo orçamento."}
            </DialogDescription>
          </DialogHeader>
          <BudgetForm
            toggleOpen={toggleDialog}
            onSubmit={editingBudget ? handleUpdate : handleCreate}
            initialData={editingBudget ? {
              category: editingBudget.category,
              limit: editingBudget.limit,
              spent: editingBudget.spent,
              color: editingBudget.color,
              icon: editingBudget.icon,
            } : undefined}
          />
        </DialogContent>
      </Dialog>

      <LimitExceededDialog
        open={limitExceededOpen}
        onOpenChange={setLimitExceededOpen}
        itemType="orçamentos"
        message={limitMessage}
        onClose={toggleDialog}
      />
    </div>
  );
};

export default BudgetsPage;
