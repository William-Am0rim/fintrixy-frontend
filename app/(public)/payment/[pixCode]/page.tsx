"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { QrCode, Copy, Check, Loader2, AlertCircle, Building2, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import Link from "next/link";

interface PixCodeData {
  key: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  description?: string;
  format: "static" | "dynamic";
  formattedAmount: string;
}

function PaymentPageContent() {
  const params = useParams();
  const pixCode = params.pixCode as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PixCodeData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (pixCode) {
      parsePixCode();
    }
  }, [pixCode]);

  const parsePixCode = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const decodedCode = decodeURIComponent(pixCode);
      const result = await api.parsePixCode(decodedCode);
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.message || "Código PIX inválido ou expirado");
      }
    } catch (err) {
      setError("Erro ao processar código PIX");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (pixCode) {
      navigator.clipboard.writeText(decodeURIComponent(pixCode));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-green-600" />
          <p className="text-green-800 dark:text-green-200">Processando código PIX...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950 dark:to-rose-900">
        <div className="bg-white dark:bg-red-900/20 rounded-2xl p-8 max-w-md mx-4 shadow-xl">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-red-800 dark:text-red-200">
              Código PIX Inválido
            </h1>
            <p className="text-red-600 dark:text-red-300">{error}</p>
            <Link href="/">
              <Button className="mt-4 cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-4">
      <div className="bg-white dark:bg-green-900/20 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <QrCode className="w-10 h-10 text-green-600" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-green-800 dark:text-green-200">
              Pagamento PIX
            </h1>
            <p className="text-green-600 dark:text-green-300 text-sm mt-1">
              Escaneie ou copie o código abaixo
            </p>
          </div>

          {data && (
            <>
              <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 space-y-3">
                <div className="text-center">
                  <p className="text-sm text-green-600 dark:text-green-400">Valor</p>
                  <p className="text-4xl font-bold text-green-700 dark:text-green-300">
                    {data.formattedAmount}
                  </p>
                </div>
                
                <div className="pt-3 border-t border-green-200 dark:border-green-800 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">{data.merchantName}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{data.merchantCity}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Código PIX Copia e Cola:
                </p>
                <div className="bg-muted rounded-lg p-3">
                  <code className="text-xs break-all text-center block select-all">
                    {decodeURIComponent(pixCode)}
                  </code>
                </div>
                <Button 
                  onClick={copyToClipboard}
                  variant="outline"
                  className="w-full cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Código
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200">
                <p className="text-center">
                  Após realizar o pagamento, você receberá a confirmação automaticamente.
                </p>
              </div>
            </>
          )}

          <Link href="/" className="block">
            <Button variant="ghost" className="w-full cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
