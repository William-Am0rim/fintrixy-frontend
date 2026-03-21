"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Wallet, PiggyBank, CreditCard, Building2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogForm } from "@/components/DialogForm";
import { WalletForm } from "./form";
import { WalletCard } from "@/components/wallets/WalletCard";
import { LimitExceededDialog } from "@/components/LimitExceededDialog";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface Wallet {
  id: string;
  name: string;
  type: string;
  balance: number;
  color: string;
  icon?: string;
}

const walletTypes = [
  { value: "all", label: "Todas", icon: Wallet },
  { value: "conta_corrente", label: "Conta", icon: Building2 },
  { value: "poupanca", label: "Poupança", icon: PiggyBank },
  { value: "carteira_digital", label: "Digital", icon: Wallet },
  { value: "cartao_credito", label: "Cartão", icon: CreditCard },
  { value: "dinheiro", label: "Dinheiro", icon: Wallet },
];

const WalletsPage = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [limitExceededOpen, setLimitExceededOpen] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  const toggleOpen = () => setOpen(!open);

  const loadWallets = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadWallets();
  }, [loadWallets]);

  const filteredWallets = wallets.filter((wallet) => {
    if (filter === "all") return true;
    return wallet.type.toLowerCase().includes(filter);
  });

  const totalBalance = wallets.reduce((acc, w) => acc + w.balance, 0);
  const totalIncome = wallets
    .filter((w) => w.balance > 0)
    .reduce((acc, w) => acc + w.balance, 0);
  const totalExpense = wallets
    .filter((w) => w.balance < 0)
    .reduce((acc, w) => acc + Math.abs(w.balance), 0);

  const handleCreate = async (data: { name: string; type: string; value_initial: number; color: string }) => {
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.createWallet(data);
      if (result.success) {
        loadWallets();
        toggleOpen();
      } else if (result.message?.includes("Limite")) {
        setLimitMessage(result.message);
        setLimitExceededOpen(true);
      }
    } catch (error: any) {
      if (error?.response?.data?.message?.includes("Limite")) {
        setLimitMessage(error.response.data.message);
        setLimitExceededOpen(true);
      } else {
        console.error("Error creating wallet:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.deleteWallet(id);
      if (result.success) {
        setWallets(wallets.filter((w) => w.id !== id));
      }
    } catch (error) {
      console.error("Error deleting wallet:", error);
    }
  };

  const handleEdit = (id: string) => {
    const wallet = wallets.find((w) => w.id === id);
    if (wallet) {
      setEditingWallet(wallet);
      setOpen(true);
    }
  };

  const handleUpdate = async (data: { name: string; type: string; value_initial: number; color: string }) => {
    if (!editingWallet) return;
    try {
      api.setToken(localStorage.getItem("token"));
      const result = await api.updateWallet(editingWallet.id, {
        name: data.name,
        type: data.type,
        color: data.color,
      });
      if (result.success) {
        loadWallets();
        setOpen(false);
        setEditingWallet(null);
      }
    } catch (error) {
      console.error("Error updating wallet:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingWallet(null);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Carteiras</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Gerencie suas contas e carteiras
          </p>
        </div>
        <DialogForm
          title={editingWallet ? "Editar Carteira" : "Nova Carteira"}
          description={editingWallet ? "Edite as informações da carteira" : "Adicione uma nova carteira ou conta"}
          form={<WalletForm toggleOpen={handleCloseDialog} onSubmit={editingWallet ? handleUpdate : handleCreate} initialData={editingWallet ? {
            name: editingWallet.name,
            type: editingWallet.type,
            value_initial: editingWallet.balance,
            color: editingWallet.color,
          } : undefined} />}
          open={open}
          onOpenChange={setOpen}
          button={
            <Button className="cursor-pointer w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Nova Carteira
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ArrowUpCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Entradas</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-green-600 truncate">
            R$ {totalIncome.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <ArrowDownCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Saídas</p>
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
            R$ {totalBalance.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Building2 className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Total Carteiras</p>
          </div>
          <p className="text-lg md:text-2xl font-bold text-purple-600">
            {wallets.length}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
        {walletTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setFilter(type.value)}
            className={cn(
              "px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 md:gap-2",
              filter === type.value
                ? "bg-blue-600 text-white"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            <type.icon className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">{type.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {filteredWallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            {...wallet}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredWallets.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <Wallet className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-sm md:text-base">
            Nenhuma carteira encontrada
          </p>
          <Button
            variant="outline"
            className="mt-4 cursor-pointer"
            onClick={toggleOpen}
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar primeira carteira
          </Button>
        </div>
      )}

      <LimitExceededDialog
        open={limitExceededOpen}
        onOpenChange={setLimitExceededOpen}
        itemType="carteiras"
        message={limitMessage}
        onClose={handleCloseDialog}
      />
    </div>
  );
};

export default WalletsPage;
