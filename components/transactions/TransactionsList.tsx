"use client";

import { ArrowDownCircle, ArrowUpCircle, ArrowRightLeft, Pencil, Trash2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  description: string;
  category: string;
  value: number;
  type: "income" | "expense" | "transfer";
  date: string;
  wallet: string;
  paid: boolean;
}

interface TransactionsListProps {
  transactions: Transaction[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
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

export const TransactionsList = ({
  transactions,
  onEdit,
  onDelete,
}: TransactionsListProps) => {
  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Descrição</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Categoria</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Carteira</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Data</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Valor</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-center p-4 text-sm font-medium text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const config = typeConfig[transaction.type];
              const Icon = config.icon;

              return (
                <tr key={transaction.id} className="border-t hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", config.color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{transaction.description}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{transaction.category}</td>
                  <td className="p-4 text-muted-foreground">{transaction.wallet}</td>
                  <td className="p-4 text-muted-foreground">{transaction.date}</td>
                  <td className="p-4 text-right">
                    <span className={cn("font-semibold", config.valueColor)}>
                      {config.prefix}R$ {transaction.value.toFixed(2).replace(".", ",")}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        transaction.paid
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      )}
                    >
                      {transaction.paid ? "Pago" : "Pendente"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit?.(transaction.id)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => onDelete?.(transaction.id)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {transactions.length === 0 && (
        <div className="text-center py-12">
          <ArrowRightLeft className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Nenhuma transação encontrada
          </p>
        </div>
      )}
    </div>
  );
};

interface TransactionFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
}

export const TransactionFilters = ({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
}: TransactionFiltersProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar transações..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        className="px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
      >
        <option value="all">Todos os tipos</option>
        <option value="income">Receitas</option>
        <option value="expense">Despesas</option>
        <option value="transfer">Transferências</option>
      </select>
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
      >
        <option value="all">Todas categorias</option>
        <option value="salary">Salário</option>
        <option value="food">Alimentação</option>
        <option value="transport">Transporte</option>
        <option value="entertainment">Entretenimento</option>
        <option value="health">Saúde</option>
        <option value="education">Educação</option>
        <option value="bills">Contas</option>
      </select>
    </div>
  );
};
