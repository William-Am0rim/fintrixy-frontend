"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { CheckCircle, Loader2, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import Link from "next/link";

interface PaymentStatus {
  status: string;
  paid: boolean;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  useEffect(() => {
    if (sessionId) {
      checkPaymentStatus();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const checkPaymentStatus = async () => {
    if (!sessionId) return;
    
    try {
      const result = await api.request<any>(`/payment/status/${sessionId}`);
      
      if (result.success && result.data) {
        const status = result.data.status;
        setPaymentStatus({
          status: status,
          paid: status === "PAID" || status === "COMPLETED" || status === "approved",
        });
      } else {
        setPaymentStatus({ status: "UNKNOWN", paid: false });
      }
    } catch (error) {
      console.error("Error checking payment:", error);
      setPaymentStatus({ status: "ERROR", paid: false });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-green-600" />
          <p className="text-green-800 dark:text-green-200">Verificando pagamento...</p>
        </div>
      </div>
    );
  }

  const isPaid = paymentStatus?.paid;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4">
      <div className="bg-white dark:bg-green-900/20 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
        <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          {isPaid ? (
            <CheckCircle className="w-10 h-10 text-green-600" />
          ) : (
            <Loader2 className="w-10 h-10 text-yellow-600" />
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-200">
            {isPaid ? "Pagamento Confirmado!" : "Aguardando Pagamento"}
          </h1>
          <p className="text-green-600 dark:text-green-300 mt-2">
            {isPaid
              ? "Seu plano Pro foi ativado com sucesso!"
              : "Seu pagamento ainda está sendo processado. Você receberá uma confirmação em breve."}
          </p>
        </div>

        {isPaid && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-center gap-2 text-yellow-700 dark:text-yellow-300">
              <Crown className="w-5 h-5" />
              <span className="font-semibold">Bem-vindo ao Plano Pro!</span>
            </div>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
              Agora você tem acesso ilimitado a todos os recursos do Fintrixy.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <Button className="w-full cursor-pointer bg-green-600 hover:bg-green-700">
              Ir para Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          
          {!isPaid && sessionId && (
            <Button 
              variant="outline" 
              onClick={checkPaymentStatus}
              className="w-full cursor-pointer"
            >
              <Loader2 className="w-4 h-4 mr-2" />
              Verificar Novamente
            </Button>
          )}
          
          <Link href="/plans">
            <Button variant="ghost" className="w-full cursor-pointer">
              Ver Meus Planos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
