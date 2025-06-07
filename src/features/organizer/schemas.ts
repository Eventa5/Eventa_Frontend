import { z } from "zod";

/**
 * 活動基本信息頁面表單驗證 Schema
 */
export const basicInfoSchema = z
  .object({
    organizerName: z.string().min(1, { message: "請選擇主辦單位名稱" }),
    eventName: z.string().min(1, { message: "活動名稱不能為空" }),
    timezone: z.string().min(1, { message: "請選擇活動時區" }),
    startHour: z.string().min(1, { message: "請選擇開始時間(時)" }),
    startMinute: z.string().min(1, { message: "請選擇開始時間(分)" }),
    endHour: z.string().min(1, { message: "請選擇結束時間(時)" }),
    endMinute: z.string().min(1, { message: "請選擇結束時間(分)" }),
    eventTags: z.array(z.string()).optional(),
    eventUrl: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val || val.trim() === "") return true; // 空值允許
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        },
        { message: "請輸入有效的網址格式" }
      ),
    eventRegion: z.string().refine((value) => value !== "國家/地區", {
      message: "請選擇活動國家/地區",
    }),
    eventLocation: z.string().optional(),
    locationNotes: z.string().optional(),
    // 下面這些字段在表單提交前會額外添加
    startDate: z.string().min(1, { message: "請選擇開始日期" }),
    endDate: z.string().min(1, { message: "請選擇結束日期" }),
    eventTagsString: z.string().optional(),
  })
  .refine(
    (data) => {
      // 檢查所有時間相關欄位是否都已填寫
      const hasAllTimeFields =
        data.startDate &&
        data.endDate &&
        data.startHour &&
        data.startMinute &&
        data.endHour &&
        data.endMinute;

      if (!hasAllTimeFields) {
        return true; // 如果時間欄位未全部填寫，跳過時間比較驗證
      }

      try {
        // 構建開始和結束的完整時間
        const startDateTime = new Date(data.startDate);
        const endDateTime = new Date(data.endDate);

        startDateTime.setHours(
          Number.parseInt(data.startHour),
          Number.parseInt(data.startMinute),
          0,
          0
        );
        endDateTime.setHours(Number.parseInt(data.endHour), Number.parseInt(data.endMinute), 0, 0);

        // 檢查開始時間是否早於結束時間
        return startDateTime < endDateTime;
      } catch (error) {
        return false;
      }
    },
    {
      message: "開始時間必須早於結束時間",
      path: ["endDate"], // 錯誤顯示在結束日期欄位
    }
  );

/**
 * 活動介紹頁面表單驗證 Schema
 */
export const introSchema = z.object({
  summary: z
    .string()
    .min(50, { message: "活動摘最少要50個字符" })
    .max(250, { message: "活動摘要不能超過250個字符" }),
  description: z.string().refine(
    (value) => {
      if (!value) return false;
      // 去除 HTML 標籤和空白字符，檢查是否有實際內容
      const textContent = value.replace(/<[^>]*>/g, "").trim();
      return textContent.length > 0;
    },
    { message: "活動簡介不能為空" }
  ),
  notice: z.string().max(500, { message: "注意事項不能超過500個字符" }).optional(),
});

/**
 * 票券設定頁面表單驗證 Schema
 */
export const ticketSettingSchema = z
  .object({
    eventStartDate: z.string().min(1, { message: "請選擇活動開始日期" }),
    eventStartHour: z.string().min(1, { message: "請選擇活動開始時間(時)" }),
    eventStartMinute: z.string().min(1, { message: "請選擇活動開始時間(分)" }),
    eventEndDate: z.string().min(1, { message: "請選擇活動結束日期" }),
    eventEndHour: z.string().min(1, { message: "請選擇活動結束時間(時)" }),
    eventEndMinute: z.string().min(1, { message: "請選擇活動結束時間(分)" }),
    tickets: z
      .array(
        z
          .object({
            id: z.string(),
            name: z.string().min(1, { message: "請輸入票券名稱" }),
            quantity: z.number().min(1, { message: "票券數量必須大於0" }),
            price: z.number().min(0, { message: "票價不能為負數" }),
            isFree: z.boolean(),
            saleStartDate: z.string().min(1, { message: "請選擇售票開始日期" }),
            saleStartHour: z.string().min(1, { message: "請選擇售票開始時間(時)" }),
            saleStartMinute: z.string().min(1, { message: "請選擇售票開始時間(分)" }),
            saleEndDate: z.string().min(1, { message: "請選擇售票結束日期" }),
            saleEndHour: z.string().min(1, { message: "請選擇售票結束時間(時)" }),
            saleEndMinute: z.string().min(1, { message: "請選擇售票結束時間(分)" }),
          })
          .refine(
            (ticket) => {
              // 檢查個別票券的售票時間邏輯
              try {
                const saleStartDateTime = new Date(ticket.saleStartDate);
                const saleEndDateTime = new Date(ticket.saleEndDate);

                saleStartDateTime.setHours(
                  Number.parseInt(ticket.saleStartHour),
                  Number.parseInt(ticket.saleStartMinute),
                  0,
                  0
                );
                saleEndDateTime.setHours(
                  Number.parseInt(ticket.saleEndHour),
                  Number.parseInt(ticket.saleEndMinute),
                  0,
                  0
                );

                return saleStartDateTime < saleEndDateTime;
              } catch (error) {
                return false;
              }
            },
            {
              message: "售票開始時間必須早於結束時間",
              path: ["saleEndDate"], // 錯誤顯示在結束日期欄位
            }
          )
      )
      .min(1, { message: "至少需要一張票券" }),
  })
  .refine(
    (data) => {
      // 檢查所有時間相關欄位是否都已填寫 - 與 basicinfo 頁面邏輯一致
      const hasAllTimeFields =
        data.eventStartDate &&
        data.eventEndDate &&
        data.eventStartHour &&
        data.eventStartMinute &&
        data.eventEndHour &&
        data.eventEndMinute;

      if (!hasAllTimeFields) {
        return true; // 如果時間欄位未全部填寫，跳過時間比較驗證
      }

      try {
        // 構建開始和結束的完整時間
        const eventStartDateTime = new Date(data.eventStartDate);
        const eventEndDateTime = new Date(data.eventEndDate);

        eventStartDateTime.setHours(
          Number.parseInt(data.eventStartHour),
          Number.parseInt(data.eventStartMinute),
          0,
          0
        );
        eventEndDateTime.setHours(
          Number.parseInt(data.eventEndHour),
          Number.parseInt(data.eventEndMinute),
          0,
          0
        );

        // 檢查開始時間是否早於結束時間
        return eventStartDateTime < eventEndDateTime;
      } catch (error) {
        return false;
      }
    },
    {
      message: "活動開始時間必須早於結束時間",
      path: ["eventEndDate"], // 錯誤顯示在結束日期欄位
    }
  );

/**
 * 主辦單位創建表單驗證 Schema
 */
export const createOrganizerSchema = z.object({
  organizerName: z
    .string()
    .min(1, { message: "主辦單位名稱不能為空" })
    .max(60, { message: "主辦單位名稱不能超過60個字元" }),
  description: z.string().max(255, { message: "簡介不能超過255個字元" }).optional(),
  phoneNumber: z
    .string()
    .min(1, { message: "電話號碼不能為空" })
    .regex(/^[0-9]{8,15}$/, { message: "請輸入有效的電話號碼" }),
  email: z.string().email({ message: "請輸入有效的電子郵件" }),
  language: z.string().min(1, { message: "請選擇語言" }),
  currency: z.string().min(1, { message: "請選擇貨幣" }),
  countryCode: z.string().min(1, { message: "請選擇國碼" }),
});

// 導出表單數據類型
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type IntroFormData = z.infer<typeof introSchema>;
export type TicketSettingFormData = z.infer<typeof ticketSettingSchema>;
export type CreateOrganizerFormData = z.infer<typeof createOrganizerSchema>;
