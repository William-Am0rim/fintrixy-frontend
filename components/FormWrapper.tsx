"use client";

import { FormProvider, UseFormReturn, FieldValues } from "react-hook-form";

type FormWrapperProps<T extends FieldValues = FieldValues> = {
  children: React.ReactNode;
  methods: UseFormReturn<T>;
};

export const FormWrapper = <T extends FieldValues>({
  children,
  methods,
}: FormWrapperProps<T>) => {
  return <FormProvider {...methods}>{children}</FormProvider>;
};
