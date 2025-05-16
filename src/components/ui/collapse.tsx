import { cn } from "@/utils/transformer";
import { ChevronDown } from "lucide-react";
import * as React from "react";

interface CollapseProps {
  title: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Collapse({
  title,
  defaultOpen = false,
  children,
  className,
  ...props
}: CollapseProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div
      className={cn("space-y-1.5", className)}
      {...props}
    >
      <button
        type="button"
        className="flex w-full items-center text-left text-[#b39340] font-bold"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronDown
          className={cn("mr-1 h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")}
        />
        {isOpen ? "收合資訊" : "更多資訊"}
      </button>
      <div className={cn("grid transition-all", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
