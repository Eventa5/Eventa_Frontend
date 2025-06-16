"use client";

import { cn } from "@/utils/transformer";

interface CircularProgressProps {
  percentage: number;
  size?: number;
  thickness?: number; // 圓環厚度
  className?: string;
}

export function CircularProgress({
  percentage,
  size = 120,
  thickness = 8,
  className,
}: CircularProgressProps) {
  const clamped = Math.max(0, Math.min(percentage, 100)); // 限制 0~100

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size }}
    >
      {/* 背景圓環 */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(#FFD56B ${clamped * 3.6}deg, #E5E5E5 0deg)`,
        }}
      />

      {/* 中心遮蓋圓環（產生圓環效果） */}
      <div
        className="absolute inset-0 m-auto bg-white rounded-full"
        style={{
          width: size - thickness * 2,
          height: size - thickness * 2,
        }}
      />

      {/* 百分比文字 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-[#262626]">{clamped}%</span>
      </div>
    </div>
  );
}
