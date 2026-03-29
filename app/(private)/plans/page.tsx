"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Crown,
  Check,
  X,
  CreditCard,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";

interface SubscriptionStats {
  plan: string;
  status: string;
  stats: {
    wallets: { current: number; limit: number };
    transactions: { current: number; limit: number };
    recurrences: { current: number; limit: number };
    goals: { current: number; limit: number };
    installments: { current: number; limit: number };
    budgets: { current: number; limit: number };
  };
}

const PLAN_LIMITS = {
  free: {
    wallets: 1,
    transactions: 10,
    recurrences: 5,
    goals: 5,
    installments: 5,
    budgets: 5,
  },
  pro: {
    wallets: "∞",
    transactions: "∞",
    recurrences: "∞",
    goals: "∞",
    installments: "∞",
    budgets: "∞",
  },
};

const FREE_FEATURES = [
  { label: "Carteiras", limit: "1", key: "wallets" },
  { label: "Transações", limit: "10", key: "transactions" },
  { label: "Recorrências", limit: "5", key: "recurrences" },
  { label: "Metas", limit: "5", key: "goals" },
  { label: "Cartões", limit: "5", key: "installments" },
  { label: "Orçamentos", limit: "5", key: "budgets" },
];

const PRO_FEATURES = [
  { label: "Carteiras", limit: "Ilimitadas", key: "wallets" },
  { label: "Transações", limit: "Ilimitadas", key: "transactions" },
  { label: "Recorrências", limit: "Ilimitadas", key: "recurrences" },
  { label: "Metas", limit: "Ilimitadas", key: "goals" },
  { label: "Cartões", limit: "Ilimitados", key: "installments" },
  { label: "Orçamentos", limit: "Ilimitados", key: "budgets" },
];

const PlansPage = () => {
  const [subscription, setSubscription] = useState<SubscriptionStats | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const loadSubscription = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      api.setToken(localStorage.getItem("token"));
      const res = await api.getSubscriptionStats();
      console.log("Subscription stats response:", res);
      if (res.success && res.data) {
        setSubscription(res.data);
      } else if (res.message || res.error) {
        setApiError(res.message || res.error || "Erro ao carregar assinatura");
      }
    } catch (error: any) {
      console.error("Error loading subscription:", error);
      setApiError(error?.message || "Erro ao carregar assinatura");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  const handleUpgrade = async () => {
    setProcessing(true);
    try {
      const res = await api.upgradeToPro({ paymentMethod: "pix" });
      if (res.success) {
        setShowSuccessDialog(true);
        loadSubscription();
      } else {
        setErrorDialog(res.error || "Erro ao processar assinatura");
      }
    } catch (error) {
      setErrorDialog("Erro ao processar assinatura");
    } finally {
      setProcessing(false);
    }
  };

  const handleDowngrade = async () => {
    setProcessing(true);
    try {
      const res = await api.downgradeToFree();
      if (res.success) {
        loadSubscription();
      } else {
        setErrorDialog(res.error || "Erro ao fazer downgrade");
      }
    } catch (error) {
      setErrorDialog("Erro ao fazer downgrade");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-96 bg-muted rounded-xl animate-pulse"></div>
          <div className="h-96 bg-muted rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="bg-card rounded-xl border p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Erro ao carregar</h2>
          <p className="text-muted-foreground mb-4">{apiError}</p>
          <Button onClick={loadSubscription} className="cursor-pointer">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  const isPro = subscription?.plan === "pro";
  const currentStats = subscription?.stats || {
    wallets: { current: 0, limit: 1 },
    transactions: { current: 0, limit: 10 },
    recurrences: { current: 0, limit: 5 },
    goals: { current: 0, limit: 5 },
    installments: { current: 0, limit: 5 },
    budgets: { current: 0, limit: 5 },
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Planos</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Escolha o plano ideal para suas necessidades financeiras
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div
          className={cn(
            "bg-card rounded-xl border p-6 space-y-6",
            !isPro && "ring-2 ring-blue-500",
          )}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
              <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <h2 className="text-xl font-bold">Grátis</h2>
            <div className="mt-2">
              <span className="text-3xl font-bold">R$ 0</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Inclui:</p>
            {FREE_FEATURES.map((feature) => {
              const stat =
                currentStats?.[feature.key as keyof typeof currentStats];
              const usagePercent =
                stat && stat.limit !== Infinity
                  ? Math.round((stat.current / stat.limit) * 100)
                  : 0;

              return (
                <div
                  key={feature.key}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {stat && stat.limit !== Infinity ? (
                      <span
                        className={cn(
                          usagePercent >= 100 && "text-red-500 font-medium",
                        )}
                      >
                        {stat.current}/{feature.limit}
                      </span>
                    ) : (
                      feature.limit
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t">
            {!isPro ? (
              <div className="text-center text-sm text-muted-foreground">
                Você está no plano Grátis
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={handleDowngrade}
                disabled={processing}
              >
                {processing ? "Processando..." : "Fazer Downgrade"}
              </Button>
            )}
          </div>
        </div>

        {/* Pro Plan */}
        <div
          className={cn(
            "bg-card rounded-xl border p-6 space-y-6 relative transition-all duration-300",
            isPro
              ? "ring-2 ring-yellow-500 shadow-lg"
              : "ring-1 ring-yellow-500/50 hover:ring-yellow-500 hover:shadow-xl shadow-lg shadow-yellow-500/5 dark:shadow-yellow-500/10",
          )}
        >
          {!isPro && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                RECOMENDADO
              </span>
            </div>
          )}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-500/10 rounded-full mb-3 shadow-sm border border-yellow-500/20">
              <Crown className="w-7 h-7 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400 bg-clip-text text-transparent">
              Pro
            </h2>
            <div className="mt-2 text-center flex flex-col items-center justify-center">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-extrabold">R$ 10</span>
                <span className="text-muted-foreground font-medium">/mês</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider text-center">
              Tudo do grátis e mais:
            </p>
            <div className="space-y-3 bg-yellow-500/5 dark:bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
              {PRO_FEATURES.map((feature) => (
                <div
                  key={feature.key}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-yellow-500/20 p-1 rounded-md">
                      <Check className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span className="text-sm font-medium">{feature.label}</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                    {feature.limit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            {!isPro ? (
              <Button
                className="w-full h-12 text-base bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer font-bold border-0"
                onClick={handleUpgrade}
                disabled={processing}
              >
                {processing ? "Processando..." : "Assinar Plano Pro"}
              </Button>
            ) : (
              <div className="text-center bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl p-4 border border-yellow-500/20">
                <Crown className="w-6 h-6 mx-auto mb-2 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                  Você é um assinante Pro!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Usage */}
      <div className="max-w-4xl mx-auto bg-card rounded-xl border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Uso Atual
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {currentStats &&
            Object.entries(currentStats).map(([key, stat]) => {
              const isUnlimited = stat.limit === Infinity;
              const percentage = isUnlimited
                ? 0
                : Math.min((stat.current / stat.limit) * 100, 100);
              const isExceeded = !isUnlimited && stat.current >= stat.limit;

              const keyLabels: Record<string, string> = {
                wallets: "Carteiras",
                transactions: "Transações",
                recurrences: "Recorrências",
                goals: "Metas",
                installments: "Cartões",
                budgets: "Orçamentos",
              };

              return (
                <div key={key} className="text-center">
                  <p className="text-xs text-muted-foreground capitalize mb-1">
                    {keyLabels[key] || key}
                  </p>
                  <p
                    className={cn(
                      "text-lg font-bold",
                      isExceeded && "text-red-500",
                    )}
                  >
                    {stat.current}/{isUnlimited ? "∞" : stat.limit}
                  </p>
                  {!isUnlimited && (
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          isExceeded
                            ? "bg-red-500"
                            : stat.current / stat.limit > 0.8
                              ? "bg-yellow-500"
                              : "bg-green-500",
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl">Parabéns!</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center py-4">
            Você agora é um assinante Pro! Aproveite recursos ilimitados no
            Fintrixy.
          </DialogDescription>
          <Button
            className="w-full cursor-pointer"
            onClick={() => setShowSuccessDialog(false)}
          >
            Ótimo!
          </Button>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={!!errorDialog} onOpenChange={() => setErrorDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <DialogTitle className="text-xl">Erro</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center py-4">
            {errorDialog}
          </DialogDescription>
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            onClick={() => setErrorDialog(null)}
          >
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansPage;
