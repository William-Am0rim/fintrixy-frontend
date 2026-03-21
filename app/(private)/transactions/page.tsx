"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Download, TrendingUp, TrendingDown, Wallet, Receipt, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DialogForm } from "@/components/DialogForm";
import { TransactionForm } from "./form";
import { TransactionsList, TransactionFilters } from "@/components/transactions";
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

const TransactionsPage = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [noWalletOpen, setNoWalletOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const toggleOpen = () => setOpen(!open);

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

  const handleNewTransaction = () => {
    if (wallets.length === 0) {
      setNoWalletOpen(true);
    } else {
      setOpen(true);
    }
  };

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
          date: new Date(t.date).toLocaleDateString("pt-BR"),
          wallet: t.wallet?.name || "Carteira",
          walletId: t.walletId,
          paid: t.paid,
          color: t.color,
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
    return transactions.filter((t) => {
      const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || t.category.toLowerCase().includes(categoryFilter);
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, search, typeFilter, categoryFilter]);

  const totalIncome = transactions
    .filter((t) => t.type === "income" && t.paid)
    .reduce((acc, t) => acc + t.value, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense" && t.paid)
    .reduce((acc, t) => acc + t.value, 0);

  const handleDelete = async (id: string) => {
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.deleteTransaction(id);
      if (result.success) {
        setTransactions(transactions.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleEdit = (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      setEditingTransaction(transaction);
      setOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingTransaction(null);
  };

  const formatDateForInput = (dateStr: string) => {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

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
          <h1 className="text-xl sm:text-2xl font-bold">Transações</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Gerencie suas receitas, despesas e transferências
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="cursor-pointer w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
          <Button className="cursor-pointer w-full sm:w-auto" onClick={handleNewTransaction}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Receitas</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-green-600 truncate">
            R$ {totalIncome.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Despesas</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-red-600 truncate">
            R$ {totalExpense.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Wallet className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Saldo</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-blue-600 truncate">
            R$ {(totalIncome - totalExpense).toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Receipt className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Total</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-purple-600">
            {transactions.length}
          </p>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <TransactionFilters
          search={search}
          setSearch={setSearch}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />
      </div>

      <div className="w-full overflow-x-auto">
        <TransactionsList
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <p className="text-sm text-muted-foreground text-center">
        {filteredTransactions.length} transação(ões) encontrada(s)
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTransaction ? "Editar Transação" : "Nova Transação"}</DialogTitle>
            <DialogDescription>
              {editingTransaction ? "Edite as informações da transação" : "Registre uma nova transação"}
            </DialogDescription>
          </DialogHeader>
          <TransactionForm 
            toggleOpen={handleCloseDialog} 
            onSuccess={loadTransactions}
            initialData={editingTransaction ? {
              id: editingTransaction.id,
              type: editingTransaction.type,
              date: formatDateForInput(editingTransaction.date),
              value: editingTransaction.value,
              category: editingTransaction.category,
              description: editingTransaction.description,
              wallet_id: editingTransaction.walletId,
              paid: editingTransaction.paid,
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
            Para criar transações, você precisa primeiro criar uma carteira para associar a transação.
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
    </div>
  );
};

export default TransactionsPage;
