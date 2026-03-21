"use client";

import { ArrowDownCircle, ArrowUpCircle, ArrowRightLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  description: string;
  category: string;
  value: number;
  type: "income" | "expense" | "transfer";
  date: string;
  wallet: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  title?: string;
  onAddClick?: () => void;
}

const typeConfig = {
  income: {
    icon: ArrowUpCircle,
    color: "text-green-600 bg-green-100 dark:bg-green-900/30",
    valueColor: "text-green-600",
    prefix: "+",
  },
  expense: {
    icon: ArrowDownCircle,
    color: "text-red-600 bg-red-100 dark:bg-red-900/30",
    valueColor: "text-red-600",
    prefix: "-",
  },
  transfer: {
    icon: ArrowRightLeft,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    valueColor: "text-blue-600",
    prefix: "",
  },
};

export const RecentTransactions = ({
  transactions,
  title,
  onAddClick,
}: RecentTransactionsProps) => {
  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title || "Transações Recentes"}</h3>
        <div className="flex items-center gap-2">
          {onAddClick && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs cursor-pointer"
              onClick={onAddClick}
            >
              <Plus className="w-3 h-3 mr-1" />
              Adicionar
            </Button>
          )}
          <Link
            href="/transactions"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Ver todas
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma transação encontrada
          </p>
        ) : (
          transactions.map((transaction) => {
            const config = typeConfig[transaction.type];
            const Icon = config.icon;

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg", config.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.category} • {transaction.wallet}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("font-semibold", config.valueColor)}>
                    {config.prefix}R$ {transaction.value.toFixed(2).replace(".", ",")}
                  </p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
