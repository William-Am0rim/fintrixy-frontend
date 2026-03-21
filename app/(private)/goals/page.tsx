"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Target, Pencil, Trash2, Calendar, TrendingUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GoalForm } from "@/components/forms/GoalForm";
import { LimitExceededDialog } from "@/components/LimitExceededDialog";
import { api } from "@/lib/api";

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
  icon: string;
  completed: boolean;
}

interface GoalFormData {
  name: string;
  target: number;
  current?: number;
  deadline: string;
  color: string;
  icon: string;
}

const GoalsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [limitExceededOpen, setLimitExceededOpen] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  const loadGoals = useCallback(async () => {
    setLoading(true);
    try {
      api.setToken(localStorage.getItem("token"));
      const res = await api.getGoals();
      if (res.success && res.data) {
        const formatted = res.data.map((g: any) => ({
          id: g.id,
          name: g.name,
          target: g.target,
          current: g.current,
          deadline: new Date(g.deadline).toLocaleDateString("pt-BR"),
          color: g.color,
          icon: g.icon || "🎯",
          completed: g.completed || g.current >= g.target,
        }));
        setGoals(formatted);
      }
    } catch (error) {
      console.error("Error loading goals:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const formatDateForApi = (dateStr: string) => {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  const handleCreate = async (data: GoalFormData) => {
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.createGoal({
        name: data.name,
        target: data.target,
        current: data.current || 0,
        deadline: formatDateForApi(data.deadline),
        color: data.color,
        icon: data.icon,
      });
      if (result.success) {
        loadGoals();
        setIsDialogOpen(false);
        setEditingGoal(null);
      } else if (result.message?.includes("Limite")) {
        setLimitMessage(result.message);
        setLimitExceededOpen(true);
      }
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("Limite")) {
        setLimitMessage(error.response.data.message);
        setLimitExceededOpen(true);
      } else {
        console.error("Error creating goal:", error);
      }
    }
  };

  const handleUpdate = async (data: GoalFormData) => {
    if (!editingGoal) return;
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.updateGoal(editingGoal.id, {
        name: data.name,
        target: data.target,
        current: data.current,
        deadline: formatDateForApi(data.deadline),
        color: data.color,
        icon: data.icon,
      });
      if (result.success) {
        loadGoals();
        setIsDialogOpen(false);
        setEditingGoal(null);
      }
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.deleteGoal(id);
      if (result.success) {
        setGoals(goals.filter((g) => g.id !== id));
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
    if (isDialogOpen) {
      setEditingGoal(null);
    }
  };

  const formatDateForInput = (dateStr: string) => {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
  const totalCurrent = goals.reduce((acc, g) => acc + g.current, 0);
  const completedGoals = goals.filter((g) => g.current >= g.target).length;

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
          <h1 className="text-xl sm:text-2xl font-bold">Metas</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Defina e acompanhe seus objetivos financeiros
          </p>
        </div>
        <Button className="cursor-pointer w-full sm:w-auto" onClick={toggleDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Target className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Total de Metas</p>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-blue-600">{goals.length}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Concluídas</p>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-green-600">{completedGoals}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Economizado</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-purple-600 truncate">
            R$ {totalCurrent.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="bg-card rounded-xl border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Meta Total</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-amber-600 truncate">
            R$ {totalTarget.toFixed(2).replace(".", ",")}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Progresso Geral</h3>
        <div className="h-3 md:h-4 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
            style={{ width: `${totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs md:text-sm text-muted-foreground">
          <span>R$ {totalCurrent.toFixed(2).replace(".", ",")}</span>
          <span>{totalTarget > 0 ? ((totalCurrent / totalTarget) * 100).toFixed(1) : 0}%</span>
          <span>R$ {totalTarget.toFixed(2).replace(".", ",")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {goals.map((goal) => {
          const percentage = totalTarget > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
          const isCompleted = goal.current >= goal.target;

          return (
            <div
              key={goal.id}
              className={cn("bg-card rounded-xl border p-4 md:p-5 hover:shadow-lg transition-shadow")}
            >
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${goal.color}20` }}
                  >
                    {goal.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm md:text-base truncate">{goal.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {goal.deadline}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="p-1.5 md:p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3 md:w-4 md:h-4 text-destructive" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">
                    R$ {goal.current.toFixed(2).replace(".", ",")}
                  </span>
                  <span className={cn(isCompleted ? "text-green-600" : "text-muted-foreground")}>
                    R$ {goal.target.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="relative h-2 md:h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: goal.color }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {percentage.toFixed(0)}% concluído
                  </span>
                  {isCompleted && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      ✓ Concluído
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <Target className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-sm md:text-base mb-4">
            Nenhuma meta criada ainda
          </p>
          <Button className="cursor-pointer" onClick={toggleDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Criar primeira meta
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? "Editar Meta" : "Nova Meta"}
            </DialogTitle>
            <DialogDescription>
              {editingGoal
                ? "Atualize as informações da meta."
                : "Preencha as informações para criar uma nova meta."}
            </DialogDescription>
          </DialogHeader>
          <GoalForm
            toggleOpen={toggleDialog}
            onSubmit={editingGoal ? handleUpdate : handleCreate}
            initialData={editingGoal ? {
              name: editingGoal.name,
              target: editingGoal.target,
              current: editingGoal.current,
              deadline: formatDateForInput(editingGoal.deadline),
              color: editingGoal.color,
              icon: editingGoal.icon,
            } : undefined}
          />
        </DialogContent>
      </Dialog>

      <LimitExceededDialog
        open={limitExceededOpen}
        onOpenChange={setLimitExceededOpen}
        itemType="metas"
        message={limitMessage}
        onClose={toggleDialog}
      />
    </div>
  );
};

export default GoalsPage;
