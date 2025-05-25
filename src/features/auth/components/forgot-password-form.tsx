"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { putApiV1UsersForget } from "@/services/api/client/sdk.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { forgotPasswordSchema } from "../schemas";
import type { AuthFormProps, ForgotPasswordFormValues } from "../types";

export default function ForgotPasswordForm({
  onSuccess,
  onSwitchTab,
  isMobile = false,
}: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);

    try {
      const response = await putApiV1UsersForget({
        body: {
          email: data.email,
        },
      });

      if (response.data?.status) {
        toast.success("重設密碼郵件已寄送至您的信箱");
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response.data?.message || "發送重設密碼郵件失敗");
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
          <Label htmlFor="email">請輸入你的會員帳號電子郵件</Label>
          <Input
            id="email"
            type="email"
            placeholder="請輸入電子郵件"
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
      </div>
      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full bg-primary-500 hover:saturate-150 duration-200 active:scale-95 text-neutral-800 leading-6 cursor-pointer !py-3 h-auto mb-6"
          disabled={isLoading}
        >
          {isLoading ? "處理中..." : "寄送重設密碼郵件"}
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
