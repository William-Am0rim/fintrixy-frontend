"use client";

import { Target, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

interface GoalsProgressProps {
  goals: Goal[];
  title?: string;
}

export const GoalsProgress = ({ goals, title }: GoalsProgressProps) => {
  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title || "Metas em Progresso"}</h3>
        <Link
          href="/goals"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
        >
          Ver todas
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              Nenhuma meta criada ainda
            </p>
            <Link
              href="/goals"
              className="text-sm text-blue-600 hover:underline"
            >
              Criar primeira meta
            </Link>
          </div>
        ) : (
          goals.map((goal) => {
            const percentage = Math.min((goal.current / goal.target) * 100, 100);

            return (
              <div
                key={goal.id}
                className="p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: goal.color }}
                    />
                    <span className="font-medium text-sm">{goal.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {goal.deadline}
                  </span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-2">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: goal.color,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    R$ {goal.current.toFixed(2).replace(".", ",")} de R$ {goal.target.toFixed(2).replace(".", ",")}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      percentage >= 100 ? "text-green-600" : "text-blue-600"
                    )}
                  >
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
