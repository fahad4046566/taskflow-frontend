"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

interface PasswordInputProps<T extends FieldValues> {
  field: ControllerRenderProps<T, Path<T>>;  // ✅ Generic
  placeholder?: string;
}

export function PasswordInput<T extends FieldValues>({
  field,
  placeholder = "••••••••",
}: PasswordInputProps<T>) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        {...field}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}