"use client";

import { CreditCard, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";

interface Installment {
  id: string;
  description: string;
  totalValue: number;
  paidValue: number;
  remainingValue: number;
  remainingInstallments: number;
  totalInstallments: number;
  nextDueDate: string;
  color: string;
}

interface InstallmentsCardProps {
  installments: Installment[];
  title?: string;
}

export const InstallmentsCard = ({
  installments,
  title,
}: InstallmentsCardProps) => {
  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title || "Parcelamentos"}</h3>
        <Link
          href="/installments"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
        >
          Ver todos
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {installments.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              Nenhum parcelamento encontrado
            </p>
          </div>
        ) : (
          installments.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-sm">{item.description}</span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.nextDueDate}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {item.remainingInstallments}/{item.totalInstallments} parcelas restantes
                </span>
                <span className="text-sm font-semibold text-red-600">
                  R$ {item.remainingValue.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="mt-2 relative h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-red-500 transition-all duration-500"
                  style={{
                    width: `${(item.paidValue / item.totalValue) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
