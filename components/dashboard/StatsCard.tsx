import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: "wallet" | "income" | "expense" | "balance";
  href?: string;
}

const iconMap = {
  wallet: Wallet,
  income: TrendingUp,
  expense: TrendingDown,
  balance: Wallet,
};

const colorMap = {
  wallet: "bg-blue-100 text-blue-600 dark:bg-blue-900/30",
  income: "bg-green-100 text-green-600 dark:bg-green-900/30",
  expense: "bg-red-100 text-red-600 dark:bg-red-900/30",
  balance: "bg-purple-100 text-purple-600 dark:bg-purple-900/30",
};

export const StatsCard = ({
  title,
  value,
  change,
  trend = "neutral",
  icon,
  href,
}: StatsCardProps) => {
  const Icon = iconMap[icon];
  const colorClass = colorMap[icon];

  const content = (
    <div className="bg-card rounded-xl border p-4 md:p-6 hover:shadow-lg transition-shadow min-h-[150px] flex flex-col justify-between h-full">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl md:text-2xl font-bold break-all">{value}</p>
        </div>
        <div className={cn("p-2 md:p-3 rounded-lg shrink-0", colorClass)}>
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </div>
      {change ? (
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend === "up" && "text-green-600",
            trend === "down" && "text-red-600",
            trend === "neutral" && "text-muted-foreground"
          )}
        >
          {trend === "up" && <TrendingUp className="w-3 h-3" />}
          {trend === "down" && <TrendingDown className="w-3 h-3" />}
          <span>{change}</span>
        </div>
      ) : (
        <div className="" />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
};
