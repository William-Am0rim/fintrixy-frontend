"use client"

import { EllipsisVertical } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type WalletsProps = {
  name: string;
  type: string;
  value_initial: number;
  color: string;
};

export const Wallets = ({ name, type, value_initial, color }: WalletsProps) => {
  return (
    <div className="w-full md:max-w-87 h-32 flex flex-col border gap-4 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex flex-col px-4 gap-2">
          <Badge className={`${color}`}>{type}</Badge>
          {name}
        </div>
        <div className="flex gap-2 items-center">
          <Button className="cursor-pointer" variant={"ghost"}>
            <EllipsisVertical />
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center px-4">
        <span className="text-xl font-semibold">
          R$ {value_initial.toFixed(2)}
        </span>
      </div>
    </div>
  );
};
