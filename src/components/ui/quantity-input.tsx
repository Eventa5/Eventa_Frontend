import { cn } from "@/utils/transformer";
import type * as React from "react";
import { useState } from "react";

interface QuantityInputProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function QuantityInput({
  defaultValue = 0,
  value: controlledValue,
  onValueChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  disabled = false,
  onFocus,
  onBlur,
  className,
  ...props
}: QuantityInputProps) {
  const [value, setValue] = useState(defaultValue);
  const displayValue = controlledValue !== undefined ? controlledValue : value;

  const handleDecrement = () => {
    if (displayValue > min) {
      const newValue = displayValue - 1;
      if (controlledValue === undefined) setValue(newValue);
      onValueChange?.(newValue);
    }
  };

  const handleIncrement = () => {
    if (displayValue < max) {
      const newValue = displayValue + 1;
      if (controlledValue === undefined) setValue(newValue);
      onValueChange?.(newValue);
    }
  };

  if (disabled) {
    return <span className="text-sm font-semibold text-muted-foreground">已售完</span>;
  }

  const buttonSize = "size-10";

  return (
    <div
      className={cn(
        "relative flex flex-col items-center",
        "h-10 transition-[height] duration-300 ease-in-out",
        displayValue > 0 && "h-[84px]",
        className
      )}
      {...props}
    >
      <button
        type="button"
        onClick={handleIncrement}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled || displayValue >= max}
        className={cn(
          buttonSize,
          "rounded-full bg-primary-500",
          "flex items-center justify-center transition-colors z-10"
        )}
      >
        <span className="text-2xl font-medium leading-none">+</span>
      </button>

      <div
        className={cn(
          "absolute top-0 flex flex-col items-center",
          buttonSize,
          "overflow-hidden transition-all duration-300 ease-in-out",
          displayValue === 0 ? "h-0 opacity-0" : "h-[84px] opacity-100",
          "rounded-full bg-primary-200"
        )}
      >
        <div className={buttonSize} /> {/* 空白區域給加號按鈕 */}
        <div className="h-1.5" /> {/* 增加間距 */}
        <button
          type="button"
          onClick={handleDecrement}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled || displayValue <= min}
          className={cn(buttonSize, "flex items-center justify-center rounded-full")}
        >
          <span className="text-2xl font-medium leading-none">-</span>
        </button>
      </div>
    </div>
  );
}
