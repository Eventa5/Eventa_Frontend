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
      .regex(/^[a-zA-Z0-9]+$/, "密碼只能包含英文或數字"),
    checkPassword: z.string(),
  })
  .refine((data) => data.password === data.checkPassword, {
    message: "兩次輸入的密碼不一致",
    path: ["checkPassword"],
  });
