"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postApiV1UsersLogin } from "@/services/api/client/sdk.gen";
import { useAuthStore } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signInSchema } from "../schemas";
import type { AuthFormProps, SignInFormValues } from "../types";

export default function SignInForm({ onSuccess }: AuthFormProps) {
  const router = useRouter();
  const loginStore = useAuthStore((s) => s.login);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);

    try {
      // 1. 呼叫登入 API 獲取 token
      const response = await postApiV1UsersLogin({
        body: {
          email: data.email,
          password: data.password,
        },
      });

      if (response.data?.status && response.data.data) {
        const token = response.data.data;

        // 2. 使用 useAuthStore 保存 token 到 localStorage 和 cookie
        const success = await loginStore(token);

        if (success) {
          toast.success("登入成功");
          if (onSuccess) {
            onSuccess();
          } else {
            router.push("/attendee/profile");
          }
        } else {
          toast.error("設置認證 token 失敗，請重試");
        }
      } else {
        toast.error(response.error?.message || "登入失敗");
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "登入失敗，請稍後再試");
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
          <Label htmlFor="email">電子郵件</Label>
          <Input
            id="email"
            type="email"
            placeholder="請輸入電子郵件"
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">密碼</Label>
          <Input
            id="password"
            type="password"
            placeholder="請輸入密碼"
            {...register("password")}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          <div className="text-left">
            <a
              href="/forgot-password"
              className="text-[var(--color-neutral-400)] underline text-sm"
            >
              忘記密碼？
            </a>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-[var(--color-neutral-800)] font-bold"
          disabled={isLoading}
        >
          {isLoading ? "登入中..." : "登入"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full border-2 font-medium flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          使用 Google 帳號登入
        </Button>
      </div>
    </form>
  );
}
