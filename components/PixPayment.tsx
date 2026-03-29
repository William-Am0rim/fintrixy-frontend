"use client";

import { useState, useEffect } from "react";
import { QrCode, Copy, Check, Loader2, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PixPaymentProps {
  amount: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const PixPayment = ({ amount, onSuccess, onClose }: PixPaymentProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [paymentId, setPaymentId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    createPayment();
  }, []);

  const createPayment = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          plan: "pro",
        }),
      });

      const result = await response.json();
      console.log("Resposta do pagamento:", result);

      if (result.success && result.data) {
        console.log("Dados do pagamento:", result.data);
        setPaymentUrl(result.data.url || result.data.brCode || "");
        setPaymentId(result.data.id || "");
      } else {
        setError(result.error || "Erro ao criar pagamento");
        console.error("Erro ao criar pagamento:", result.error);
      }
    } catch (error) {
      setError("Erro ao criar pagamento");
      console.error("Erro ao criar pagamento:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (paymentId) {
      navigator.clipboard.writeText(paymentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentId) return;
    
    setChecking(true);
    try {
      const response = await fetch(`/api/payment/status/${paymentId}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        const status = result.data.status;
        if (status === "PAID" || status === "COMPLETED" || status === "approved") {
          onSuccess?.();
        } else {
          alert("Pagamento ainda não confirmado. Aguarde alguns segundos e tente novamente.");
        }
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
    } finally {
      setChecking(false);
    }
  };

  const openPaymentPage = () => {
    if (paymentUrl) {
      window.open(paymentUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Gerando pagamento PIX...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <QrCode className="w-16 h-16 mx-auto text-primary" />
        <h3 className="text-lg font-semibold">Pagamento via PIX</h3>
        <p className="text-2xl font-bold text-primary">
          R$ {amount.toFixed(2).replace(".", ",")}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
          <Button 
            onClick={createPayment} 
            variant="link" 
            className="block mx-auto mt-2 cursor-pointer text-blue-500"
          >
            Tentar novamente
          </Button>
        </div>
      )}

      <div className="bg-muted rounded-lg p-4 space-y-3">
        <p className="text-sm text-muted-foreground text-center">
          Para completar o pagamento, clique no botão abaixo para ser redirecionado à página de pagamento da AbacatePay.
        </p>

        <Button 
          onClick={openPaymentPage}
          className="w-full cursor-pointer"
          disabled={!paymentUrl}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Ir para página de pagamento
        </Button>

        {paymentId && (
          <Button 
            variant="outline"
            onClick={() => router.push(`/payment/success?session_id=${paymentId}`)}
            className="w-full cursor-pointer"
          >
            Ver status do pagamento
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {paymentId && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground text-center">
            ID da transação (para verificação):
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-muted px-3 py-2 rounded text-xs overflow-x-auto">
              {paymentId}
            </code>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={copyToClipboard}
              className="cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button 
          variant="outline" 
          onClick={onClose}
          className="flex-1 cursor-pointer"
        >
          Cancelar
        </Button>
        <Button 
          onClick={checkPaymentStatus}
          disabled={checking || !paymentId}
          className="flex-1 cursor-pointer"
        >
          {checking ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            "Confirmar Pagamento"
          )}
        </Button>
      </div>
    </div>
  );
};
