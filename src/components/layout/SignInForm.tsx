"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api/user";
import { setToken, useAuth } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("請輸入有效的電子郵件"),
  password: z.string().min(1, "請輸入密碼"),
});

type SignInFormValues = z.infer<typeof signInSchema>;
type SignInFormProps = {
  onSuccess?: () => void;
};

export default function SignInForm({ onSuccess }: SignInFormProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
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
      const response = await login(data);
      if (response.status && response.data) {
        setToken(response.data);
        toast.success("登入成功");
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/attendee/profile");
        }
      } else {
        toast.error(response.message);
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
