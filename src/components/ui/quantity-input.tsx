import { cn } from "@/utils/transformer";
import type * as React from "react";
import { useState } from "react";

interface QuantityInputProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function QuantityInput({
  defaultValue = 0,
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

  if (disabled) {
    return <span className="text-sm font-semibold text-muted-foreground">已售完</span>;
  }

  const buttonSize = "size-10";

  return (
    <div
      className={cn(
        "relative flex flex-col items-center",
        "h-10 transition-[height] duration-300 ease-in-out",
        value > 0 && "h-[84px]",
        className
      )}
      {...props}
    >
      <button
        type="button"
        onClick={handleIncrement}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled || value >= max}
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
          value === 0 ? "h-0 opacity-0" : "h-[84px] opacity-100",
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
          disabled={disabled || value <= min}
          className={cn(buttonSize, "flex items-center justify-center rounded-full")}
        >
          <span className="text-2xl font-medium leading-none">-</span>
        </button>
      </div>
    </div>
  );
}
