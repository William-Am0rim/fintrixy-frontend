"use client";

import { motion } from "framer-motion";

interface BarChartProps {
  data: {
    label: string;
    income: number;
    expense: number;
  }[];
  title?: string;
}

export const BarChart = ({ data, title }: BarChartProps) => {
  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.income, d.expense))
  );

  return (
    <div className="bg-card rounded-xl border p-6">
      {title && (
        <h3 className="text-lg font-semibold mb-6">{title}</h3>
      )}
      <div className="flex items-end justify-between gap-2 h-48">
        {data.map((item, index) => {
          const incomeHeight = (item.income / maxValue) * 100;
          const expenseHeight = (item.expense / maxValue) * 100;

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center gap-1 h-36">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${incomeHeight}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-5 bg-green-500 rounded-t"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${expenseHeight}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
                  className="w-5 bg-red-500 rounded-t"
                />
              </div>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span className="text-xs text-muted-foreground">Receitas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span className="text-xs text-muted-foreground">Despesas</span>
        </div>
      </div>
    </div>
  );
};
