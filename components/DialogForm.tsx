import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

type DialogProps = {
    title: string,
    description: string,
    form: React.ReactNode,
    button: React.ReactNode
    open: boolean
    onOpenChange?: (open: boolean) => void
}

export const DialogForm = ({title, description, form, button, open, onOpenChange}: DialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>{button}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {form}
      </DialogContent>
    </Dialog>
  );
};
