import { Input } from "@/components/ui/input";
import { cn } from "@/utils/transformer";
import type { InputHTMLAttributes, ReactNode } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  endAdornment?: ReactNode;
}

export function FormInput({
  error,
  disabled,
  value,
  onChange,
  endAdornment,
  className,
  ...props
}: FormInputProps) {
  const hasValue = typeof value === "string" && value.length > 0;

  return (
    <div className="relative w-full">
      <Input
        value={value}
        disabled={disabled}
        aria-invalid={error}
        className={cn(hasValue && "bg-input/10 text-foreground", endAdornment && "pr-8", className)}
        onChange={onChange}
        readOnly={value !== undefined && !onChange}
        {...props}
      />
      {endAdornment && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
          {endAdornment}
        </div>
      )}
    </div>
  );
}
