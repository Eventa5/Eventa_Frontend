import { Button } from "@/components/ui/button";
import { cn } from "@/utils/transformer";
import type * as React from "react";
import { useState } from "react";

interface QuantityInputProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function QuantityInput({
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  disabled = false,
  className,
  ...props
}: QuantityInputProps) {
  const [value, setValue] = useState(defaultValue);

  const handleDecrement = () => {
    if (value > min) {
      const newValue = value - 1;
      setValue(newValue);
      onValueChange?.(newValue);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      const newValue = value + 1;
      setValue(newValue);
      onValueChange?.(newValue);
    }
  };

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
      >
        -
      </Button>
      <span className="w-8 text-center">{value}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
      >
        +
      </Button>
    </div>
  );
}
