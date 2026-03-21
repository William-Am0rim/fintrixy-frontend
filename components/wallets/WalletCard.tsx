"use client";

import { Wallet, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletCardProps {
  id: string;
  name: string;
  type: string;
  balance: number;
  color: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const WalletCard = ({
  id,
  name,
  type,
  balance,
  color,
  onEdit,
  onDelete,
}: WalletCardProps) => {
  const isNegative = balance < 0;

  return (
    <div className="bg-card rounded-xl border p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Wallet className="w-6 h-6" style={{ color }} />
          </div>
          <div>
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{type}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit?.(id)}
            className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => onDelete?.(id)}
            className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>
      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground mb-1">Saldo atual</p>
        <p
          className={cn(
            "text-2xl font-bold",
            isNegative ? "text-destructive" : "text-foreground"
          )}
        >
          R$ {balance.toFixed(2).replace(".", ",")}
        </p>
      </div>
    </div>
  );
};

interface WalletStatsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

export const WalletStats = ({
  totalBalance,
  totalIncome,
  totalExpense,
}: WalletStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
        <p className="text-sm text-green-600 dark:text-green-400 mb-1">Entradas</p>
        <p className="text-xl font-bold text-green-600">
          R$ {totalIncome.toFixed(2).replace(".", ",")}
        </p>
      </div>
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
        <p className="text-sm text-red-600 dark:text-red-400 mb-1">Saídas</p>
        <p className="text-xl font-bold text-red-600">
          R$ {totalExpense.toFixed(2).replace(".", ",")}
        </p>
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
        <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Saldo Total</p>
        <p className="text-xl font-bold text-blue-600">
          R$ {totalBalance.toFixed(2).replace(".", ",")}
        </p>
      </div>
    </div>
  );
};
