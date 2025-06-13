import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface ProgressStatusCardProps {
  title: string;
  current: number;
  total: number;
  unit: string;
  progressText: string;
  buttons: Array<{
    text: string;
    onClick?: () => void;
  }>;
}

export function ProgressStatusCard({
  title,
  current,
  total,
  unit,
  progressText,
  buttons,
}: ProgressStatusCardProps) {
  // 安全的百分比計算，避免 NaN
  const progressPercentage = (() => {
    if (total === 0) return 0;
    const result = (current / total) * 100;
    return Number.isNaN(result) ? 0 : Math.min(result, 100);
  })();

  return (
    <Card className="bg-card border border-border">
      <CardHeader className="space-y-0 px-8 pt-6 pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-normal">{title}</CardTitle>
          <div className="flex gap-2">
            {buttons.map((button, index) => (
              <Button
                key={button.text}
                variant="ghost"
                size="sm"
                className="text-neutral-800 hover:text-neutral-900"
                onClick={button.onClick}
              >
                {button.text}
                {index === buttons.length - 1 && <ArrowRight className="h-4 w-4 ml-1" />}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-6 pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[32px] leading-12 font-bold text-foreground">
              {current} / {total} {unit}
            </span>
          </div>
          <div>
            <p className="text-sm text-neutral-800 mb-2">
              {progressText} {Math.round(progressPercentage)} %
            </p>
            <div className="w-full bg-primary-200 rounded-full h-4">
              <div
                className="bg-primary h-4 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
