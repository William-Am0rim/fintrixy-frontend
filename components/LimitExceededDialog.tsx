"use client";

import { Crown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Link from "next/link";

interface LimitExceededDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemType: string;
  message?: string;
  onClose?: () => void;
}

export const LimitExceededDialog = ({
  open,
  onOpenChange,
  itemType,
  message,
  onClose,
}: LimitExceededDialogProps) => {
  const handleClose = () => {
    onOpenChange(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <DialogTitle className="text-xl">Limite do Plano Atingido</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center py-4">
          {message || `Você atingiu o limite do plano Grátis para ${itemType}.`}
          <br />
          <span className="text-muted-foreground text-sm">
            Assine o plano Pro para criar itens ilimitados!
          </span>
        </DialogDescription>
        <div className="flex flex-col gap-3 pt-2">
          <Link href="/plans">
            <Button 
              className="w-full cursor-pointer gap-2 bg-purple-600 hover:bg-purple-700" 
              onClick={handleClose}
            >
              <Crown className="w-4 h-4" />
              Assinar Plano Pro
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full cursor-pointer"
            onClick={handleClose}
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
