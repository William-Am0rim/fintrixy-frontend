"use client";

import { UseFormRegister, FieldValues, Path } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  icon?: React.ReactNode;
  isPassword?: boolean;
};

export const FormInput = <T extends FieldValues>({
  name,
  label,
  type,
  placeholder,
  register,
  icon,
  isPassword,
}: FormInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(true);
  const [typeToggle, setTypeToggle] = useState("password");
  const Icon = showPassword ? Eye : EyeOff;

  const togglePassword = () => {
    setShowPassword(!showPassword);
    setTypeToggle(showPassword ? "text" : "password");
  };
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </span>
        )}
        <Input
          id={name}
          type={isPassword ? typeToggle : type}
          placeholder={placeholder}
          {...register(name)}
          className={`relative ${icon ? "pl-10" : ""} ${isPassword ? "pr-10" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            <Icon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
 
};

