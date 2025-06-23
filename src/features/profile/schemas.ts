import { isAfter, isBefore, subYears } from "date-fns";
import { z } from "zod";

/**
 * 生日驗證 Schema
 */
export const birthdaySchema = z
  .date({
    required_error: "請選擇生日",
  })
  .refine((date) => isBefore(date, subYears(new Date(), 13)), {
    message: "您必須年滿 13 歲才能註冊",
  })
  .refine((date) => isAfter(date, subYears(new Date(), 120)), {
    message: "請輸入有效的生日日期",
  });

/**
 * 地址驗證 Schema
 */
export const addressSchema = z
  .string()
  .min(5, { message: "地址至少需要5個字符" })
  .max(200, { message: "地址不能超過200個字符" })
  .refine(
    (address) => {
      // 檢查是否包含縣市區
      const hasCityDistrict = /[縣|市|區]/.test(address);
      return hasCityDistrict;
    },
    {
      message: "請包含縣市區資訊",
    }
  )
  .refine(
    (address) => {
      // 檢查是否包含路街巷弄
      const hasRoad = /[路|街|巷|弄]/.test(address);
      return hasRoad;
    },
    {
      message: "請包含路、街、巷、弄等道路資訊",
    }
  )
  .refine(
    (address) => {
      // 檢查是否為有效的地址格式（不能只填關鍵字）
      const onlyKeywords = /^[縣市區路街巷弄號\s]+$/.test(address);
      return !onlyKeywords;
    },
    {
      message: "請輸入完整的地址內容",
    }
  )
  .refine(
    (address) => {
      // 檢查是否為純數字或特殊字符
      const isOnlyNumbersOrSpecialChars = /^[\d\s\-\_\.]+$/.test(address);
      return !isOnlyNumbersOrSpecialChars;
    },
    {
      message: "請輸入包含實際地名或建築物的完整地址",
    }
  );

/**
 * 個人檔案表單 Schema
 */
export const profileFormSchema = z.object({
  name: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z.string().min(2, { message: "姓名至少需要2個字符" })
  ) as z.ZodType<string>,
  displayName: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z.string().min(2, { message: "顯示名稱至少需要2個字符" })
  ) as z.ZodType<string>,
  email: z.string(),
  countryCode: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z.string().nonempty("請選擇國碼")
  ) as z.ZodType<string>,
  phoneNumber: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z.string().regex(/^09\d{8}$/, "手機號碼格式錯誤")
  ) as z.ZodType<string>,
  birthday: birthdaySchema,
  gender: z.enum(["male", "female", "nonBinary"]),
  region: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z.string().nonempty("請選擇居住地")
  ) as z.ZodType<string>,
  address: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    addressSchema
  ) as z.ZodType<string>,
  identity: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z.enum(["general", "student", "retiree"], { required_error: "請選擇身分" })
  ) as z.ZodType<"general" | "student" | "retiree">,
  avatar: z.preprocess((val) => (val === null ? "" : val), z.string().optional()) as z.ZodType<
    string | undefined
  >,
});
