"use client";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type FormInputProps = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  register?: any;
  icon?: React.ReactNode;
  isPassword?: boolean;
  error?: any;
};

export const FormInput = ({
  name,
  label,
  type,
  placeholder,
  register,
  icon,
  isPassword,
  error,
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(true);
  const [typeToggle, setTypeToggle] = useState("password");
  const Icon = showPassword ? Eye : EyeOff;

  const togglePassword = () => {
    setShowPassword(!showPassword);
    setTypeToggle(showPassword ? "text" : "password");
  };

  const registerProps = typeof register === 'function' ? register(name) : register;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
            {icon}
          </div>
        )}
        <Input
          id={name}
          type={isPassword ? typeToggle : type}
          placeholder={placeholder}
          {...registerProps}
          className={`pl-4 ${isPassword ? "pr-10" : ""} ${error ? "border-red-500 focus:ring-red-500" : ""}`}
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
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          {error.message}
        </p>
      )}
    </div>
  );
};

