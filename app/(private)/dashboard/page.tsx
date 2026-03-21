"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  StatsCard,
  BarChart,
  RecentTransactions,
  GoalsProgress,
  InstallmentsCard,
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TransactionForm } from "@/app/(private)/transactions/form";
import { api } from "@/lib/api";

interface Transaction {
  id: string;
  description: string;
  category: string;
  value: number;
  type: "income" | "expense" | "transfer";
  date: string;
  wallet: string;
  walletId: string;
  paid: boolean;
  color?: string;
}

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
  icon: string;
}

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
}

const DashboardPage = () => {
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<{ label: string; income: number; expense: number }[]>([]);

  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  const loadData = useCallback(async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      api.setToken(localStorage.getItem("token"));

      const [walletsRes, transactionsRes, goalsRes, installmentsRes] = await Promise.all([
        api.getWallets(),
        api.getTransactions(),
        api.getGoals(),
        api.getInstallments(),
      ]);

      if (walletsRes.success && walletsRes.data) {
        setWallets(walletsRes.data);
      }

      if (transactionsRes.success && transactionsRes.data) {
        const formattedTransactions = transactionsRes.data.map((t: any) => ({
          id: t.id,
          description: t.description,
          category: t.category,
          value: t.value,
          type: t.type,
          date: new Date(t.date).toLocaleDateString("pt-BR"),
          wallet: t.wallet?.name || "Carteira",
          walletId: t.walletId,
          paid: t.paid,
          color: t.color,
        }));
        setTransactions(formattedTransactions);
        generateChartData(formattedTransactions);
      }

      if (goalsRes.success && goalsRes.data) {
        const formattedGoals = goalsRes.data.map((g: any) => ({
          id: g.id,
          name: g.name,
          target: g.target,
          current: g.current,
          deadline: new Date(g.deadline).toLocaleDateString("pt-BR"),
          color: g.color,
          icon: g.icon || "🎯",
        }));
        setGoals(formattedGoals);
      }

      if (installmentsRes.success && installmentsRes.data) {
        const formattedInstallments = installmentsRes.data.map((i: any) => ({
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
        }));
        setInstallments(formattedInstallments);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const generateChartData = (txns: Transaction[]) => {
    const months: Record<string, { income: number; expense: number }> = {};
    
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString("pt-BR", { month: "short" });
      months[key] = { income: 0, expense: 0 };
    }

    txns.forEach((t) => {
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

    setChartData(
      Object.entries(months).map(([label, data]) => ({
        label,
        income: data.income,
        expense: data.expense,
      }))
    );
  };

  const totalBalance = useMemo(() => 
    wallets.reduce((acc, w) => acc + w.balance, 0)
  , [wallets]);
  
  const totalIncome = useMemo(() => 
    transactions
      .filter((t) => t.type === "income" && t.paid)
      .reduce((acc, t) => acc + t.value, 0)
  , [transactions]);

  const totalExpense = useMemo(() => 
    transactions
      .filter((t) => t.type === "expense" && t.paid)
      .reduce((acc, t) => acc + t.value, 0)
  , [transactions]);

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6 w-full overflow-hidden">
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
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            Visão geral das suas finanças
          </p>
        </div>
        <Button className="cursor-pointer w-full sm:w-auto" onClick={toggleDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatsCard
          title="Saldo Total"
          value={`R$ ${totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          change={`${wallets.length} carteiras`}
          trend="up"
          icon="balance"
          href="/wallets"
        />
        <StatsCard
          title="Receitas"
          value={`R$ ${totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          change="Este mês"
          trend="up"
          icon="income"
        />
        <StatsCard
          title="Despesas"
          value={`R$ ${totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          change="Este mês"
          trend="down"
          icon="expense"
        />
        <StatsCard
          title="Carteiras"
          value={`R$ ${totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          icon="wallet"
          href="/wallets"
        />
      </div>

      <BarChart data={chartData} title="Receitas vs Despesas" />

      <GoalsProgress goals={goals} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <RecentTransactions transactions={transactions} onAddClick={toggleDialog} />
        <InstallmentsCard installments={installments} />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
            <DialogDescription>
              Registre uma nova transação
            </DialogDescription>
          </DialogHeader>
          <TransactionForm toggleOpen={toggleDialog} onSuccess={loadData} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage;
