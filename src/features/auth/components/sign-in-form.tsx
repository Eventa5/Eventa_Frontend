"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postApiV1UsersLogin } from "@/services/api/client/sdk.gen";
import { useAuthStore } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signInSchema } from "../schemas";
import type { AuthFormProps, SignInFormValues } from "../types";

export default function SignInForm({ onSuccess, onSwitchTab, isMobile = false }: AuthFormProps) {
  const router = useRouter();
  const loginStore = useAuthStore((s) => s.login);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const width = 500;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      const loginUrl = new URL(
        "/api/v1/users/google/login",
        process.env.NEXT_PUBLIC_API_BASE_URL
      ).toString();

      const loginWindow = window.open(
        loginUrl,
        "Google 登入",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // 監聽 postMessage
      const messageHandler = (event: MessageEvent) => {
        if (event.data?.type === "google-callback") {
          const token = event.data.token;
          if (token) {
            loginStore(token).then((success) => {
              if (success) {
                loginWindow?.close();
                toast.success("登入成功");
                if (onSuccess) {
                  onSuccess();
                } else {
                  router.push("/");
                }
              } else {
                toast.error("設置認證 token 失敗，請重試");
              }
            });
          } else {
            loginWindow?.close();
            toast.error("登入未完成，請重新嘗試登入", {
              action: {
                label: "重新登入",
                onClick: () => handleGoogleLogin(),
              },
            });
          }
          window.removeEventListener("message", messageHandler);
        }
      };
      window.addEventListener("message", messageHandler);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Google 登入失敗，請稍後再試");
    } finally {
      setIsGoogleLoading(false);
    }
  };

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
            router.push("/");
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
      <div className="space-y-6">
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
        </div>
        {onSwitchTab && (
          <div className="flex justify-end">
            <button
              className="text-neutral-400 text-right text-[14px] hover:text-neutral-500 underline cursor-pointer"
              type="button"
              onClick={() => onSwitchTab("forgot")}
            >
              忘記密碼？
            </button>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full bg-primary-500 hover:saturate-150 duration-200 active:scale-95 text-neutral-800 leading-6 cursor-pointer !py-3 h-auto"
          disabled={isLoading}
        >
          {isLoading ? "登入中..." : "登入"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full border-2 border-neutral-300 font-medium flex items-center justify-center gap-2 cursor-pointer !py-3 h-auto mb-6"
          disabled={isGoogleLoading}
          onClick={handleGoogleLogin}
        >
          <Image
            src="/icons/google.svg"
            width={24}
            height={24}
            alt="Google Login"
          />
          {isGoogleLoading ? "處理中..." : "以 Google 登入"}
        </Button>

        {onSwitchTab && (
          <div
            className={`flex ${
              isMobile ? "flex-col items-center gap-2" : "flex-col sm:flex-row sm:justify-between"
            } text-sm`}
          >
            <div>
              <span className="text-neutral-400">還沒有 Eventa 帳號嗎？</span>
              <button
                className="text-primary-600 font-bold underline ml-1 cursor-pointer"
                type="button"
                onClick={() => onSwitchTab("signup")}
              >
                前往註冊
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
