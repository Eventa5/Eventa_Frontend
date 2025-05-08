"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/api/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const signUpSchema = z
  .object({
    email: z.string().email("請輸入有效的電子郵件"),
    password: z
      .string()
      .min(8, "密碼長度至少需要 8 個字符")
      .regex(/^[a-zA-Z0-9]+$/, "密碼只能包含英文或數字"),
    checkPassword: z.string(),
  })
  .refine((data) => data.password === data.checkPassword, {
    message: "兩次輸入的密碼不一致",
    path: ["checkPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;
type SignUpFormProps = {
  onSuccess?: () => void;
};

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      checkPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    if (!termsAccepted) {
      toast.error("請同意隱私權政策");
      return;
    }

    setIsLoading(true);

    try {
      const response = await signup(data);
      if (response.status) {
        toast.success("註冊成功");
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/signin");
        }
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "註冊失敗，請稍後再試");
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
            placeholder="請設定密碼"
            {...register("password")}
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="checkPassword">確認密碼</Label>
          <Input
            id="checkPassword"
            type="password"
            placeholder="請再次輸入密碼"
            {...register("checkPassword")}
          />
          {errors.checkPassword && (
            <p className="text-sm text-red-500">{errors.checkPassword.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(v) => setTermsAccepted(!!v)}
          />
          <label
            htmlFor="terms"
            className="text-sm text-gray-600"
          >
            我已詳閱並同意{" "}
            <a
              href="/privacy-policy"
              className="underline font-bold"
            >
              隱私權政策
            </a>
          </label>
        </div>
        <Button
          type="submit"
          className="w-full bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-[var(--color-neutral-800)] font-bold"
          disabled={isLoading}
        >
          {isLoading ? "註冊中..." : "註冊"}
        </Button>
      </div>
    </form>
  );
}
