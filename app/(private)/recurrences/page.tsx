"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw, Pencil, Trash2, Calendar, Clock, Wallet, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RecurrenceForm } from "@/components/forms/RecurrenceForm";
import { LimitExceededDialog } from "@/components/LimitExceededDialog";
import { api } from "@/lib/api";

interface Recurrence {
  id: string;
  description: string;
  value: number;
  type: "income" | "expense";
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  nextDate: string;
  category: string;
  active: boolean;
  color: string;
}

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

const frequencyLabels: Record<string, string> = {
  daily: "Diário",
  weekly: "Semanal",
  monthly: "Mensal",
  yearly: "Anual",
};

const RecurrencesPage = () => {
  const router = useRouter();
  const [recurrences, setRecurrences] = useState<Recurrence[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecurrence, setEditingRecurrence] = useState<Recurrence | null>(null);
  const [loading, setLoading] = useState(true);
  const [noWalletOpen, setNoWalletOpen] = useState(false);
  const [limitExceededOpen, setLimitExceededOpen] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  const loadWallets = useCallback(async () => {
    try {
      api.setToken(localStorage.getItem("token"));
      const res = await api.getWallets();
      if (res.success && res.data) {
        setWallets(res.data);
      }
    } catch (error) {
      console.error("Error loading wallets:", error);
    }
  }, []);

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  const handleNewRecurrence = () => {
    if (wallets.length === 0) {
      setNoWalletOpen(true);
    } else {
      setIsDialogOpen(true);
    }
  };

  const loadRecurrences = useCallback(async () => {
    setLoading(true);
    try {
      api.setToken(localStorage.getItem("token"));
      const res = await api.getRecurrences();
      if (res.success && res.data) {
        const formatted = res.data.map((r: any) => ({
          id: r.id,
          description: r.description,
          value: r.value,
          type: r.type,
          frequency: r.frequency,
          nextDate: new Date(r.nextDate).toLocaleDateString("pt-BR"),
          category: r.category,
          active: r.active,
          color: r.color,
        }));
        setRecurrences(formatted);
      }
    } catch (error) {
      console.error("Error loading recurrences:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecurrences();
  }, [loadRecurrences]);

  const handleCreate = async (data: RecurrenceFormData) => {
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.createRecurrence({
        description: data.description,
        value: data.value,
        type: data.type,
        frequency: data.frequency,
        nextDate: data.nextDate,
        wallet_id: data.wallet_id,
        category: data.category,
        color: data.color,
      });
      if (result.success) {
        loadRecurrences();
        setIsDialogOpen(false);
        setEditingRecurrence(null);
      } else if (result.message?.includes("Limite")) {
        setLimitMessage(result.message);
        setLimitExceededOpen(true);
      }
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("Limite")) {
        setLimitMessage(error.response.data.message);
        setLimitExceededOpen(true);
      } else {
        console.error("Error creating recurrence:", error);
      }
    }
  };

  const handleUpdate = async (data: RecurrenceFormData) => {
    if (!editingRecurrence) return;
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.updateRecurrence(editingRecurrence.id, {
        description: data.description,
        value: data.value,
        type: data.type,
        frequency: data.frequency,
        nextDate: data.nextDate,
        wallet_id: data.wallet_id,
        category: data.category,
        active: editingRecurrence.active,
        color: data.color,
      });
      if (result.success) {
        loadRecurrences();
        setIsDialogOpen(false);
        setEditingRecurrence(null);
      }
    } catch (error) {
      console.error("Error updating recurrence:", error);
    }
  };

  const handleEdit = (recurrence: Recurrence) => {
    setEditingRecurrence(recurrence);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.deleteRecurrence(id);
      if (result.success) {
        setRecurrences(recurrences.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error("Error deleting recurrence:", error);
    }
  };

  const handleToggle = async (id: string) => {
    const recurrence = recurrences.find(r => r.id === id);
    if (!recurrence) return;
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.updateRecurrence(id, {
        active: !recurrence.active,
      });
      if (result.success) {
        setRecurrences(recurrences.map((r) =>
          r.id === id ? { ...r, active: !r.active } : r
        ));
      }
    } catch (error) {
      console.error("Error toggling recurrence:", error);
    }
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
    if (isDialogOpen) {
      setEditingRecurrence(null);
    }
  };

  const totalIncome = recurrences
    .filter((r) => r.type === "income" && r.active)
    .reduce((acc, r) => acc + r.value, 0);
  const totalExpense = recurrences
    .filter((r) => r.type === "expense" && r.active)
    .reduce((acc, r) => acc + r.value, 0);
  const activeCount = recurrences.filter((r) => r.active).length;

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
          <h1 className="text-xl sm:text-2xl font-bold">Recorrências</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Gerencie suas transações recorrentes
          </p>
        </div>
        <Button className="cursor-pointer w-full sm:w-auto" onClick={handleNewRecurrence}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Recorrência
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-card rounded-xl border p-3 md:p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <RefreshCw className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Ativas</p>
          </div>
          <p className="text-xl md:text-2xl font-bold">{activeCount}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 md:p-5">
          <p className="text-xs md:text-sm text-green-600 dark:text-green-400 mb-1">Receitas</p>
          <p className="text-lg md:text-xl font-bold text-green-600 truncate">
            R$ {totalIncome.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 md:p-5">
          <p className="text-xs md:text-sm text-red-600 dark:text-red-400 mb-1">Despesas</p>
          <p className="text-lg md:text-xl font-bold text-red-600 truncate">
            R$ {totalExpense.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 md:p-5">
          <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 mb-1">Saldo</p>
          <p className="text-lg md:text-xl font-bold text-blue-600 truncate">
            R$ {(totalIncome - totalExpense).toFixed(2).replace(".", ",")}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="md:hidden space-y-3 p-4">
              {recurrences.map((recurrence) => (
                <div
                  key={recurrence.id}
                  className={cn(
                    "p-4 rounded-xl border bg-background",
                    !recurrence.active && "opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: recurrence.color }}
                      />
                      <div>
                        <h3 className="font-semibold">{recurrence.description}</h3>
                        <p className="text-xs text-muted-foreground">{recurrence.category}</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        recurrence.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      {recurrence.type === "income" ? "Receita" : "Despesa"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-muted-foreground">Frequência:</span> {frequencyLabels[recurrence.frequency] || recurrence.frequency}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Próxima:</span> {recurrence.nextDate}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <button
                        onClick={() => handleToggle(recurrence.id)}
                        className={cn(
                          "ml-1 cursor-pointer",
                          recurrence.active ? "text-green-600" : "text-gray-400"
                        )}
                      >
                        {recurrence.active ? "Ativo" : "Pausado"}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "font-bold",
                        recurrence.type === "income" ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {recurrence.type === "income" ? "+" : "-"}R$ {recurrence.value.toFixed(2).replace(".", ",")}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(recurrence)}
                        className="p-2 hover:bg-muted rounded-lg cursor-pointer"
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(recurrence.id)}
                        className="p-2 hover:bg-muted rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <table className="hidden md:table w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Descrição</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tipo</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Frequência</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Próxima Data</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Valor</th>
                  <th className="text-center p-4 text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {recurrences.map((recurrence) => (
                  <tr
                    key={recurrence.id}
                    className={cn(
                      "border-t hover:bg-muted/30 transition-colors",
                      !recurrence.active && "opacity-60"
                    )}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: recurrence.color }}
                        />
                        <div>
                          <span className="font-medium">{recurrence.description}</span>
                          <p className="text-xs text-muted-foreground">{recurrence.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium capitalize",
                          recurrence.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        )}
                      >
                        {recurrence.type === "income" ? "Receita" : "Despesa"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {frequencyLabels[recurrence.frequency] || recurrence.frequency}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {recurrence.nextDate}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggle(recurrence.id)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors",
                          recurrence.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        )}
                      >
                        {recurrence.active ? "Ativo" : "Pausado"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={cn(
                          "font-semibold",
                          recurrence.type === "income" ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {recurrence.type === "income" ? "+" : "-"}R$ {recurrence.value.toFixed(2).replace(".", ",")}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEdit(recurrence)}
                          className="p-2 hover:bg-muted rounded-lg cursor-pointer"
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(recurrence.id)}
                          className="p-2 hover:bg-muted rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {recurrences.length === 0 && (
          <div className="text-center py-8 md:py-12">
            <RefreshCw className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-sm md:text-base mb-4">
              Nenhuma recorrência encontrada
            </p>
            <Button className="cursor-pointer" onClick={toggleDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Criar primeira recorrência
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRecurrence ? "Editar Recorrência" : "Nova Recorrência"}
            </DialogTitle>
            <DialogDescription>
              {editingRecurrence
                ? "Atualize as informações da recorrência."
                : "Preencha as informações para criar uma nova recorrência."}
            </DialogDescription>
          </DialogHeader>
          <RecurrenceForm
            toggleOpen={toggleDialog}
            onSubmit={editingRecurrence ? handleUpdate : handleCreate}
            initialData={editingRecurrence ? {
              description: editingRecurrence.description,
              value: editingRecurrence.value,
              type: editingRecurrence.type,
              frequency: editingRecurrence.frequency,
              nextDate: editingRecurrence.nextDate,
              wallet_id: "",
              category: editingRecurrence.category,
              color: editingRecurrence.color,
            } : undefined}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={noWalletOpen} onOpenChange={setNoWalletOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <DialogTitle className="text-xl">Nenhuma carteira encontrada</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center py-4">
            Para criar recorrências, você precisa primeiro criar uma carteira para associar a recorrência.
          </DialogDescription>
          <div className="flex flex-col gap-3 pt-2">
            <Button 
              className="w-full cursor-pointer gap-2" 
              onClick={() => {
                setNoWalletOpen(false);
                router.push("/wallets");
              }}
            >
              <Wallet className="w-4 h-4" />
              Criar Carteira
            </Button>
            <Button 
              variant="outline" 
              className="w-full cursor-pointer"
              onClick={() => setNoWalletOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <LimitExceededDialog
        open={limitExceededOpen}
        onOpenChange={setLimitExceededOpen}
        itemType="recorrências"
        message={limitMessage}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingRecurrence(null);
        }}
      />
    </div>
  );
};

export default RecurrencesPage;
