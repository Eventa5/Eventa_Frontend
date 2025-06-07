import { cn } from "@/utils/transformer";
import { CheckIcon } from "lucide-react";

interface StepTagProps {
  children: React.ReactNode;
  completed?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

export function StepTag({
  children,
  completed = false,
  clickable = false,
  onClick,
  className,
}: StepTagProps) {
  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center shrink-0 gap-2 mx-5 px-3 py-2 text-sm font-medium transition-colors",
        completed ? "bg-primary-500 text-neutral-800" : "bg-gray-300 text-gray-600",
        clickable && "cursor-pointer hover:opacity-80 active:scale-95",
        className
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          "absolute -left-10 top-0 w-10 h-full",
          completed ? "bg-primary-500" : "bg-gray-300"
        )}
        style={{
          clipPath: "polygon(100% 0, 100% 100%, 50% 100%, 85% 50%, 50% 0)",
        }}
      />
      <div
        className={cn(
          "absolute -right-10 top-0 w-10 h-full",
          completed ? "bg-primary-500" : "bg-gray-300"
        )}
        style={{
          clipPath: "polygon(0 0, 0% 100%, 35% 50%)",
        }}
      />
      <span className="relative z-20">{children}</span>
      {completed && <CheckIcon className="w-4 h-4 relative z-20" />}
    </div>
  );
}
