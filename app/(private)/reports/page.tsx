"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Download, PieChart, BarChart3, TrendingUp, Calendar, ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface Transaction {
  id: string;
  description: string;
  category: string;
  value: number;
  type: "income" | "expense" | "transfer";
  date: string;
  paid: boolean;
}

interface ChartDataItem {
  label: string;
  income: number;
  expense: number;
}

interface CategoryDataItem {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const categoryColors = [
  "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444",
  "#06B6D4", "#EC4899", "#14B8A6", "#F97316", "#6366F1",
];

const ReportsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      api.setToken(localStorage.getItem("token"));
      const res = await api.getTransactions();
      if (res.success && res.data) {
        const formatted = res.data.map((t: any) => ({
          id: t.id,
          description: t.description,
          category: t.category,
          value: t.value,
          type: t.type,
          date: t.date,
          paid: t.paid,
        }));
        setTransactions(formatted);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((t) => {
      const txDate = new Date(t.date);
      switch (period) {
        case "week": {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return txDate >= weekAgo && txDate <= now;
        }
        case "month":
          return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
        case "quarter": {
          const currentQuarter = Math.floor(now.getMonth() / 3);
          const txQuarter = Math.floor(txDate.getMonth() / 3);
          return txQuarter === currentQuarter && txDate.getFullYear() === now.getFullYear();
        }
        case "year":
          return txDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }, [transactions, period]);

  const totalIncome = useMemo(
    () => filteredTransactions.filter((t) => t.type === "income" && t.paid).reduce((acc, t) => acc + t.value, 0),
    [filteredTransactions]
  );

  const totalExpense = useMemo(
    () => filteredTransactions.filter((t) => t.type === "expense" && t.paid).reduce((acc, t) => acc + t.value, 0),
    [filteredTransactions]
  );

  const balance = totalIncome - totalExpense;

  const daysInPeriod = useMemo(() => {
    const now = new Date();
    switch (period) {
      case "week": return 7;
      case "month": return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      case "quarter": return 90;
      case "year": return 365;
      default: return 30;
    }
  }, [period]);

  const dailyAverage = daysInPeriod > 0 ? totalExpense / daysInPeriod : 0;

  const chartData: ChartDataItem[] = useMemo(() => {
    const now = new Date();
    const months: Record<string, { income: number; expense: number }> = {};

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString("pt-BR", { month: "short" });
      months[key] = { income: 0, expense: 0 };
    }

    transactions.forEach((t) => {
      if (!t.paid) return;
      const date = new Date(t.date);
      const key = date.toLocaleDateString("pt-BR", { month: "short" });
      if (months[key]) {
        if (t.type === "income") {
          months[key].income += t.value;
        } else if (t.type === "expense") {
          months[key].expense += t.value;
        }
      }
    });

    return Object.entries(months).map(([label, data]) => ({
      label,
      income: data.income,
      expense: data.expense,
    }));
  }, [transactions]);

  const categoryData: CategoryDataItem[] = useMemo(() => {
    const categories: Record<string, number> = {};

    filteredTransactions
      .filter((t) => t.type === "expense" && t.paid)
      .forEach((t) => {
        const cat = t.category || "Outros";
        categories[cat] = (categories[cat] || 0) + t.value;
      });

    const total = Object.values(categories).reduce((a, b) => a + b, 0);

    return Object.entries(categories)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value], i) => ({
        name,
        value,
        percentage: total > 0 ? Math.round((value / total) * 100) : 0,
        color: categoryColors[i % categoryColors.length],
      }));
  }, [filteredTransactions]);

  const maxChartValue = useMemo(() => {
    const values = chartData.flatMap((d) => [d.income, d.expense]);
    return Math.max(...values, 1);
  }, [chartData]);

  const totalCategoryValue = categoryData.reduce((a, b) => a + b.value, 0);

  // Previous month comparison
  const previousMonthData = useMemo(() => {
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const prevTransactions = transactions.filter((t) => {
      const txDate = new Date(t.date);
      return txDate >= prevMonth && txDate <= prevMonthEnd && t.paid;
    });

    const prevIncome = prevTransactions.filter((t) => t.type === "income").reduce((acc, t) => acc + t.value, 0);
    const prevExpense = prevTransactions.filter((t) => t.type === "expense").reduce((acc, t) => acc + t.value, 0);

    return { income: prevIncome, expense: prevExpense };
  }, [transactions]);

  const incomeChange = previousMonthData.income > 0
    ? Math.round(((totalIncome - previousMonthData.income) / previousMonthData.income) * 100)
    : 0;
  const expenseChange = previousMonthData.expense > 0
    ? Math.round(((totalExpense - previousMonthData.expense) / previousMonthData.expense) * 100)
    : 0;

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <div className="h-64 bg-muted rounded-xl animate-pulse"></div>
          <div className="h-64 bg-muted rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Visualize e analise suas finanças
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 md:px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer text-sm"
          >
            <option value="week">Última semana</option>
            <option value="month">Este mês</option>
            <option value="quarter">Este trimestre</option>
            <option value="year">Este ano</option>
          </select>
          <Button variant="outline" className="cursor-pointer w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Exportar PDF</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ArrowUpCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Receitas</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-green-600">
            R$ {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          {incomeChange !== 0 && (
            <p className={cn("text-xs mt-1", incomeChange > 0 ? "text-green-600" : "text-red-600")}>
              {incomeChange > 0 ? "↑" : "↓"} {Math.abs(incomeChange)}% vs mês anterior
            </p>
          )}
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <ArrowDownCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Despesas</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-red-600">
            R$ {totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          {expenseChange !== 0 && (
            <p className={cn("text-xs mt-1", expenseChange < 0 ? "text-green-600" : "text-red-600")}>
              {expenseChange > 0 ? "↑" : "↓"} {Math.abs(expenseChange)}% vs mês anterior
            </p>
          )}
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Wallet className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Saldo</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-blue-600">
            R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className={cn("text-xs mt-1", balance >= 0 ? "text-green-600" : "text-red-600")}>
            {balance >= 0 ? "Positivo" : "Negativo"}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Média/Dia</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-purple-600">
            R$ {dailyAverage.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Por dia</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Bar Chart */}
        <div className="bg-card rounded-xl border p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline">Receitas vs Despesas</span>
              <span className="sm:hidden">Gráfico</span>
            </h3>
          </div>
          {chartData.every((d) => d.income === 0 && d.expense === 0) ? (
            <div className="flex items-center justify-center h-32 md:h-48 text-muted-foreground text-sm">
              Nenhuma transação registrada nos últimos 6 meses
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between gap-1 md:gap-2 h-32 md:h-48">
                {chartData.map((item, index) => {
                  const incomeHeight = (item.income / maxChartValue) * 100;
                  const expenseHeight = (item.expense / maxChartValue) * 100;

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1 md:gap-2">
                      <div className="w-full flex items-end justify-center gap-0.5 md:gap-1 h-24 md:h-36">
                        <div
                          className="w-2 md:w-4 bg-green-500 rounded-t transition-all"
                          style={{ height: `${incomeHeight}%` }}
                        />
                        <div
                          className="w-2 md:w-4 bg-red-500 rounded-t transition-all"
                          style={{ height: `${expenseHeight}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-4 md:gap-6 mt-4">
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded" />
                  <span className="text-xs text-muted-foreground hidden sm:inline">Receitas</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded" />
                  <span className="text-xs text-muted-foreground hidden sm:inline">Despesas</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-card rounded-xl border p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              <span className="hidden sm:inline">Gastos por Categoria</span>
              <span className="sm:hidden">Categorias</span>
            </h3>
          </div>
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-32 md:h-48 text-muted-foreground text-sm">
              Nenhuma despesa registrada no período
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8">
              <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {categoryData.reduce((acc, cat, i) => {
                    const percentage = cat.percentage;
                    const currentAngle = acc.angle;
                    acc.elements.push(
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={cat.color}
                        strokeWidth="20"
                        strokeDasharray={`${percentage} ${100 - percentage}`}
                        strokeDashoffset={-currentAngle}
                        className="transition-all"
                      />
                    );
                    acc.angle += percentage;
                    return acc;
                  }, { angle: 0, elements: [] as React.ReactNode[] }).elements}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg md:text-xl font-bold">
                    R$ {totalCategoryValue >= 1000
                      ? `${(totalCategoryValue / 1000).toFixed(1)}k`
                      : totalCategoryValue.toFixed(0)}
                  </p>
                </div>
              </div>
              <div className="flex-1 space-y-2 w-full">
                {categoryData.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs md:text-sm truncate">{cat.name}</span>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="font-medium text-xs md:text-sm">
                        R$ {cat.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1 md:ml-2">
                        ({cat.percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-card rounded-xl border p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Detalhamento
        </h3>
        {categoryData.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            Nenhuma despesa registrada no período
          </p>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {categoryData.map((cat, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="font-medium text-sm md:text-base">{cat.name}</span>
                  </div>
                  <span className="font-semibold text-sm md:text-base">
                    R$ {cat.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="h-2 md:h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Trend */}
      <div className="bg-card rounded-xl border p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Tendência Mensal
        </h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {chartData.map((month, i) => (
            <div key={i} className="text-center p-2 md:p-4 rounded-xl bg-muted/50">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">{month.label}</p>
              <p className="font-bold text-green-600 text-xs md:text-base">
                R$ {month.income.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </p>
              <p className="text-xs md:text-sm text-red-600">
                R$ {month.expense.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
