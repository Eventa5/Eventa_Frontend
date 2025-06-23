import { z } from "zod";

/**
 * 登入表單驗證 Schema
 */
export const signInSchema = z.object({
  email: z.string().email("請輸入有效的電子郵件"),
  password: z.string().min(1, "請輸入密碼"),
});

/**
 * 註冊表單驗證 Schema
 */
export const signUpSchema = z
  .object({
    email: z.string().email("請輸入有效的電子郵件"),
    password: z
      .string()
      .min(8, "密碼長度至少需要 8 個字符")
      .max(16, "密碼長度不能超過 16 個字符")
      .regex(/^[a-zA-Z0-9]+$/, "密碼只能包含英文或數字"),
    checkPassword: z.string(),
  })
  .refine((data) => data.password === data.checkPassword, {
    message: "兩次輸入的密碼不一致",
    path: ["checkPassword"],
  });

/**
 * 忘記密碼表單驗證 Schema
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email("請輸入有效的電子郵件"),
});

/**
 * 重設密碼表單驗證 Schema
 */
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "密碼長度至少需要 8 個字符")
      .max(16, "密碼長度不能超過 16 個字符")
      .regex(/^[a-zA-Z0-9]+$/, "密碼只能包含英文或數字"),
    confirmPassword: z.string().min(1, "請確認密碼"),
    resetToken: z.string().min(1, "請輸入重設密碼驗證碼"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "兩次輸入的密碼不一致",
    path: ["confirmPassword"],
  });
