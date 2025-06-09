"use client";

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
import { profileFormSchema } from "@/features/profile/schemas";
import { postApiV1UsersProfileAvatar, putApiV1UsersProfile } from "@/services/api/client/sdk.gen";
import type { UserResponse } from "@/services/api/client/types.gen";
import { useAuthStore } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAfter, isBefore, subYears } from "date-fns";
import { User } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  initialData: UserResponse;
}

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

const cities = [
  "南投縣",
  "嘉義市",
  "嘉義縣",
  "基隆市",
  "宜蘭縣",
  "屏東縣",
  "彰化縣",
  "新北市",
  "新竹市",
  "新竹縣",
  "桃園市",
  "澎湖縣",
  "臺中市",
  "臺北市",
  "臺南市",
  "臺東縣",
  "花蓮縣",
  "苗栗縣",
  "連江縣",
  "金門縣",
  "雲林縣",
  "高雄市",
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
      <SelectContent className="border border-neutral-300">
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

export default function ProfileForm() {
  const userProfile = useAuthStore((s) => s.userProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const today = new Date();
  const minBirthDate = subYears(today, 120);
  const maxBirthDate = subYears(today, 13);
  const defaultBirthDate = subYears(today, 20);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userProfile?.name || "",
      displayName: userProfile?.displayName || "",
      email: userProfile?.email || "",
      countryCode: userProfile?.countryCode || "+886",
      phoneNumber: userProfile?.phoneNumber || "",
      birthday: userProfile?.birthday ? toLocalDateOnly(userProfile.birthday) : defaultBirthDate,
      gender: (userProfile?.gender as "male" | "female" | "nonBinary") || "male",
      region: userProfile?.region || "",
      address: userProfile?.address || "",
      identity: (userProfile?.identity as "general" | "student" | "retiree") || "general",
      avatar: userProfile?.avatar || "",
    },
  });

  const resetForm = useCallback(() => {
    form.reset();
  }, [form]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const isDateDisabled = (date: Date) => {
    return !isAfter(date, minBirthDate) || !isBefore(date, maxBirthDate);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // 檢查檔案類型
    if (!file.type.startsWith("image/")) {
      toast.error("請上傳圖片檔案");
      return;
    }

    // 檢查檔案大小（限制為 4MB）
    if (file.size > 4 * 1024 * 1024) {
      toast.error("圖片大小不能超過 4MB");
      return;
    }

    // 建立預覽 URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setSelectedAvatarFile(file);

    // 清空檔案輸入框，允許重複上傳相同檔案
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 在元件移除時清理預覽 URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsSubmitting(true);
      let newAvatarUrl = data.avatar;

      // 如果有選擇新的頭貼，先上傳頭貼
      if (selectedAvatarFile) {
        setIsUploading(true);
        const avatarResponse = await postApiV1UsersProfileAvatar({
          body: {
            avatar: selectedAvatarFile,
          },
        });

        if (!avatarResponse.data?.status) {
          setIsUploading(false);
          throw new Error(avatarResponse.error?.message || "上傳頭貼失敗");
        }

        // 從回應中獲取新的頭貼 URL
        if (avatarResponse.data?.data) {
          newAvatarUrl = avatarResponse.data.data;
        }
        setIsUploading(false);
      }

      // 更新個人資料
      const response = await putApiV1UsersProfile({
        body: {
          ...data,
          avatar: newAvatarUrl,
          birthday: data.birthday.toLocaleDateString("zh-TW", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }),
        },
      });

      if (response.data?.status) {
        await useAuthStore.getState().fetchUserProfile();
        setSelectedAvatarFile(null);
        setPreviewUrl(""); // 清除預覽 URL
        toast.success("個人檔案更新成功");
      } else {
        throw new Error(response.error?.message || "更新失敗");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error("更新失敗詳情:", error);
      } else {
        toast.error("更新個人檔案失敗");
        console.error("未知錯誤:", error);
      }
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  }

  const photoUrl = userProfile?.avatar || "";

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="flex flex-col items-center space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div
              className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={handleAvatarClick}
            >
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt="Profile"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-500 bg-opacity-50">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">{userProfile?.memberId}</p>
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
                      value={userProfile?.email || ""}
                      placeholder="請輸入您的電子郵件地址"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="rounded-md bg-secondary-100 p-3">
              <p className="text-sm text-secondary-800">
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
                        field.value
                          ? new Date(field.value.getFullYear(), field.value.getMonth())
                          : new Date(defaultBirthDate.getFullYear(), defaultBirthDate.getMonth())
                      }
                      disabledDates={isDateDisabled}
                      components={{ Dropdown: CustomSelectDropdown }}
                      className="border-neutral-300"
                      popoverContentClassName="border border-neutral-300"
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
                      className="border-neutral-300"
                    >
                      男性
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "female" ? "default" : "outline"}
                      onClick={() => form.setValue("gender", "female")}
                      className="border-neutral-300"
                    >
                      女性
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "nonBinary" ? "default" : "outline"}
                      onClick={() => form.setValue("gender", "nonBinary")}
                      className="border-neutral-300"
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
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="國家/地區" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border border-neutral-300">
                            {cities.map((city) => (
                              <SelectItem
                                key={city}
                                value={city}
                              >
                                {city}
                              </SelectItem>
                            ))}
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
                      className="border-neutral-300"
                    >
                      社會人士
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "student" ? "default" : "outline"}
                      onClick={() => form.setValue("identity", "student")}
                      className="border-neutral-300"
                    >
                      學生
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "retiree" ? "default" : "outline"}
                      onClick={() => form.setValue("identity", "retiree")}
                      className="border-neutral-300"
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
              onClick={resetForm}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "處理中..." : "儲存"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
