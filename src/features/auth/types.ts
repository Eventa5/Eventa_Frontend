import type { z } from "zod";
import type { signInSchema, signUpSchema } from "./schemas";

/**
 * 登入表單的值類型
 */
export type SignInFormValues = z.infer<typeof signInSchema>;

/**
 * 註冊表單的值類型
 */
export type SignUpFormValues = z.infer<typeof signUpSchema>;

/**
 * 表單元件通用的屬性類型
 */
export type AuthFormProps = {
  onSuccess?: () => void;
};
