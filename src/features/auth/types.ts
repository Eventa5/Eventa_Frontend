import type { z } from "zod";
import type { forgotPasswordSchema, signInSchema, signUpSchema } from "./schemas";

/**
 * 登入表單的值類型
 */
export type SignInFormValues = z.infer<typeof signInSchema>;

/**
 * 註冊表單的值類型
 */
export type SignUpFormValues = z.infer<typeof signUpSchema>;

/**
 * 忘記密碼表單的值類型
 */
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/**
 * 表單元件通用的屬性類型
 */
export type AuthFormProps = {
  onSuccess?: () => void;
  onSwitchTab?: (tab: "signin" | "signup" | "forgot") => void;
  isMobile?: boolean;
};
