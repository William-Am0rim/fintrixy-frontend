"use client"

import { Button } from "@/components/ui/button";
import { Wallets } from "@/components/WalletsCards";
import { DialogForm } from "@/components/DialogForm";
import { WalletForm } from "./form";
import { Plus, Wallet } from "lucide-react";
import { useState } from "react";

const walletsArray: any[] = [
  {
    name: "Nubank",
    type: "Conta corrente",
    value_initial: 100.0,
    color: "bg-[#8427F5]",
  },
  {
    name: "Itau",
    type: "Poupança",
    value_initial: 0,
    color: "bg-[#F54927]",
  },
  {
    name: "Caixa",
    type: "Poupança",
    value_initial: 0,
    color: "bg-[#277DF5]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
  {
    name: "Bradesco",
    type: "Carteira",
    value_initial: 5000.0,
    color: "bg-[#F52765]",
  },
];

const WalletsPage = () => {
  const [open, setOpen] = useState(false)
  const toggleOpen = ()=> {
    setOpen(!open)
  }
  return (
    <div className="w-full max-w-[1200px] m-auto h-fit grid grid-rows-[auto_1fr] px-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Carteiras</h2>
          <p>Gerencie suas contas e carteiras</p>
        </div>
        <DialogForm
          title="Cadastro"
          description="Crie sua carteira ou conta"
          form={<WalletForm toggleOpen={toggleOpen}/>}
          open={open}
          onOpenChange={setOpen}
          button={
            <Button className="cursor-pointer" onClick={()=> toggleOpen()}> 
              <span className="hidden md:flex">Criar cateira</span>
              <Plus />
            </Button>
          }
        />
      </div>
      {walletsArray.length === 0 ? (
        <div className="h-full flex flex-col justify-center items-center gap-4">
          <Wallet className="w-18 h-18" />
          <h2>Crie sua primeira Carteira</h2>
          <Button className="cursor-pointer p-4">Criar carteira</Button>
        </div>
      ) : (
        <div className="w-full max-h-110 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10 overflow-y-scroll">
          {walletsArray.map((item, index) => (
            <Wallets
              key={index}
              name={item.name}
              type={item.type}
              color={item.color}
              value_initial={item.value_initial}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletsPage;
