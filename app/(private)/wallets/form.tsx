"use client";

import { useForm } from "react-hook-form";
import { TypeSchemas } from "./validate";
import { FormWrapper } from "@/components/FormWrapper";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/ui/button";

type WalletFormProps = {
    toggleOpen: ()=> void;
}

export const WalletForm = ({toggleOpen}: WalletFormProps) => {
  const methods = useForm<TypeSchemas>();

  const onSubmit = (data: TypeSchemas) => {
    console.log(data);
    toggleOpen()
  };
  return (
    <FormWrapper methods={methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          name="name"
          label="Nome da carteira ou conta"
          type="text"
          placeholder="Nubank"
          register={methods.register}
        />

        <FormInput
          name="type"
          label="Tipo da conta"
          type="text"
          placeholder="Conta corrente"
          register={methods.register}
        />

        <FormInput
          name="value_initial"
          label="Valor inicial"
          type="number"
          placeholder="1000,00"
          register={methods.register}
        />
        <div className="flex justify-between items-end">
          <div className="w-10">
            <FormInput
              name="color"
              label="Selecione uma cor"
              type="color"
              register={methods.register}
            />
          </div>
            <Button className="cursor-pointer w-25">Criar</Button>
        </div>
      </form>
    </FormWrapper>
  );
};
