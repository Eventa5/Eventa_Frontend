"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAfter, isBefore, subYears } from "date-fns";
import { User } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type ProfileData, getProfile, updateProfile } from "@/lib/api/user";

const birthdaySchema = z
  .date({
    required_error: "請選擇生日",
  })
  .refine((date) => isBefore(date, subYears(new Date(), 13)), {
    message: "您必須年滿 13 歲才能註冊",
  })
  .refine((date) => isAfter(date, subYears(new Date(), 120)), {
    message: "請輸入有效的生日日期",
  });

const profileFormSchema = z.object({
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
    z.string().min(1, { message: "請輸入詳細地址" })
  ) as z.ZodType<string>,
  identity: z.preprocess(
    (val) => (val === null || val === undefined ? "" : val),
    z.enum(["general", "student", "retiree"], { required_error: "請選擇身分" })
  ) as z.ZodType<"general" | "student" | "retiree">,
  avatar: z.preprocess((val) => (val === null ? "" : val), z.string().optional()) as z.ZodType<
    string | undefined
  >,
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface DropdownProps {
  options?: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;
  value?: string | number;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
}

function CustomSelectDropdown(props: DropdownProps) {
  const { options, value, onChange } = props;

  const handleValueChange = (newValue: string) => {
    if (onChange) {
      const syntheticEvent = {
        target: {
          value: newValue,
        },
      } as ChangeEvent<HTMLSelectElement>;

      onChange(syntheticEvent);
    }
  };

  return (
    <Select
      value={value?.toString()}
      onValueChange={handleValueChange}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options?.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value.toString()}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

const countryOptions = [
  { label: "台灣 +886", value: "+886" },
  { label: "日本 +81", value: "+81" },
  { label: "美國 +1", value: "+1" },
  { label: "馬來西亞 +60", value: "+60" },
  { label: "新加坡 +65", value: "+65" },
  { label: "菲律賓 +63", value: "+63" },
  { label: "南韓 +82", value: "+82" },
  { label: "香港 +852", value: "+852" },
  { label: "澳門 +853", value: "+853" },
  { label: "中國 +86", value: "+86" },
  { label: "其他 +0", value: "+0" },
];

function toLocalDateOnly(dateStr: string | Date | null): Date {
  if (!dateStr) {
    return subYears(new Date(), 20); // 預設 20 歲
  }
  if (dateStr instanceof Date) {
    return new Date(dateStr.getFullYear(), dateStr.getMonth(), dateStr.getDate());
  }
  const [year, month, day] = dateStr.split(/[-\/]/).map(Number);
  return new Date(year, month - 1, day); // JS 月份從 0 開始
}

function CountryCodeSelect({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="w-full px-3">
        <SelectValue placeholder="選擇國碼" />
      </SelectTrigger>
      <SelectContent>
        {countryOptions.map((country) => (
          <SelectItem
            key={country.value}
            value={country.value}
          >
            {country.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function ProfilePage() {
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      displayName: "",
      email: "",
      countryCode: "+886",
      phoneNumber: "",
      birthday: subYears(new Date(), 20),
      gender: "male",
      region: "",
      address: "",
      identity: "general",
      avatar: "",
    },
  });

  const today = new Date();
  const minBirthDate = subYears(today, 120);
  const maxBirthDate = subYears(today, 13);
  const defaultBirthDate = subYears(today, 20);

  const isDateDisabled = (date: Date) => {
    return !isAfter(date, minBirthDate) || !isBefore(date, maxBirthDate);
  };

  const loadProfile = useCallback(async () => {
    try {
      const response = await getProfile();
      setProfile(response);
      form.reset({
        name: response.name ?? "",
        displayName: response.displayName ?? "",
        email: response.email ?? "",
        countryCode: response.countryCode ?? "+886",
        phoneNumber: response.phoneNumber ?? "",
        birthday: response.birthday ? toLocalDateOnly(response.birthday) : subYears(new Date(), 20),
        gender: response.gender ?? "male",
        region: response.region ?? "",
        address: response.address ?? "",
        identity: response.identity ?? "general",
        avatar: response.avatar ?? "",
      });
      if (response.avatar) {
        setPhotoUrl(response.avatar);
      } else {
        setPhotoUrl("");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("載入個人檔案失敗");
      }
    }
  }, [form.reset]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function onSubmit(data: ProfileFormValues) {
    console.log(
      data.birthday.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    );
    try {
      const response = await updateProfile({
        ...data,
        birthday: data.birthday.toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      });
      setProfile(response);
      loadProfile();
      toast.success("個人檔案更新成功");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("更新個人檔案失敗");
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <h1 className="text-xl font-bold">個人檔案</h1>
            <p className="text-sm text-gray-500">
              歡迎來到 Eventa，為了提供更優質且專屬於你的生活圈，讓我們更加了解你吧！
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-200">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">{profile?.memberId}</p>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        姓名 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <FormInput
                          {...field}
                          placeholder="請輸入您的姓名"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        顯示名稱 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <FormInput
                          {...field}
                          placeholder="你希望怎麼被稱呼"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>帳號 / Email</FormLabel>
                      <FormControl>
                        <FormInput
                          {...field}
                          type="email"
                          className="bg-gray-100"
                          disabled
                          readOnly
                          value={profile?.email || ""}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="rounded-md bg-blue-100 p-3">
                  <p className="text-sm text-blue-800">
                    為了確保您的帳戶安全，電子郵件地址無法更改
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        生日 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          setDate={(date) => {
                            if (date) {
                              field.onChange(date);
                            } else {
                              field.onChange(defaultBirthDate);
                            }
                          }}
                          placeholder="請選擇生日"
                          minDate={minBirthDate}
                          maxDate={maxBirthDate}
                          captionLayout="dropdown"
                          startMonth={new Date(1900, 0)}
                          endMonth={new Date(new Date().getFullYear(), 11)}
                          defaultMonth={
                            new Date(defaultBirthDate.getFullYear(), defaultBirthDate.getMonth())
                          }
                          disabledDates={isDateDisabled}
                          components={{ Dropdown: CustomSelectDropdown }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        性別 <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={field.value === "male" ? "default" : "outline"}
                          onClick={() => form.setValue("gender", "male")}
                        >
                          男性
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "female" ? "default" : "outline"}
                          onClick={() => form.setValue("gender", "female")}
                        >
                          女性
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "nonBinary" ? "default" : "outline"}
                          onClick={() => form.setValue("gender", "nonBinary")}
                        >
                          多元
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>
                    手機號碼 <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="flex gap-2">
                    <div className="w-1/3">
                      <FormField
                        control={form.control}
                        name="countryCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <CountryCodeSelect
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-2/3">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FormInput
                                {...field}
                                type="tel"
                                maxLength={10}
                                placeholder="請輸入手機號碼"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </FormItem>

                <FormItem>
                  <FormLabel>
                    居住地 <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="flex gap-2">
                    <div className="w-1/3">
                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="國家/地區" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="台北市">台北市</SelectItem>
                                <SelectItem value="新北市">新北市</SelectItem>
                                <SelectItem value="台中市">台中市</SelectItem>
                                <SelectItem value="高雄市">高雄市</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-2/3">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <FormInput
                                {...field}
                                placeholder="詳細地址"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </FormItem>

                <FormField
                  control={form.control}
                  name="identity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        身分 <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={field.value === "general" ? "default" : "outline"}
                          onClick={() => form.setValue("identity", "general")}
                        >
                          社會人士
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "student" ? "default" : "outline"}
                          onClick={() => form.setValue("identity", "student")}
                        >
                          學生
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === "retiree" ? "default" : "outline"}
                          onClick={() => form.setValue("identity", "retiree")}
                        >
                          退休人士
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                >
                  取消
                </Button>
                <Button type="submit">儲存</Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
