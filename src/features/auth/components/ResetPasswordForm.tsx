"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { resetPasswordSchema } from "../schemas";
import type { AuthFormProps, ResetPasswordFormValues } from "../types";

export default function ResetPasswordForm({
  onSuccess,
  onSwitchTab,
  isMobile = false,
}: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      verificationCode: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);

    try {
      // 目前模擬 API 呼叫
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 實際應用時可替換為真實 API
      // await 重設密碼 API

      toast.success("密碼重設成功，請使用新密碼登入");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "發生錯誤，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="verificationCode">驗證碼</Label>
          <Input
            id="verificationCode"
            type="text"
            placeholder="請輸入電子郵件收到的驗證碼"
            {...register("verificationCode")}
          />
          {errors.verificationCode && (
            <p className="text-sm text-red-500">{errors.verificationCode.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">新密碼</Label>
          <Input
            id="password"
            type="password"
            placeholder="請輸入新密碼"
            {...register("password")}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">確認新密碼</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="請再次輸入新密碼"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full bg-primary-500 hover:saturate-150 duration-200 active:scale-95 text-neutral-800 leading-6 cursor-pointer !py-3 h-auto mb-6"
          disabled={isLoading}
        >
          {isLoading ? "處理中..." : "設定新密碼"}
        </Button>

        {onSwitchTab && (
          <div className="text-center text-sm">
            <button
              className="text-primary-600 font-bold underline ml-1 cursor-pointer"
              type="button"
              onClick={() => onSwitchTab("signin")}
            >
              返回登入
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
