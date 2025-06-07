"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Image, Plus, RefreshCw, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormField, FormSection } from "@/components/ui/form-field";
import { type CreateOrganizerFormData, createOrganizerSchema } from "@/features/organizer/schemas";
import {
  postApiV1Organizations,
  postApiV1OrganizationsByOrganizationIdImages,
} from "@/services/api/client/sdk.gen";
import { useDialogStore } from "@/store/dialog";
import { useOrganizerStore } from "@/store/organizer";
import { useErrorHandler } from "@/utils/error-handler";
import { cn } from "@/utils/transformer";

interface CreateOrganizerPageProps {
  onSuccess?: (
    data: CreateOrganizerFormData & {
      avatar?: File | null;
      coverImage?: File | null;
    }
  ) => void;
}

export default function CreateOrganizerPage({ onSuccess }: CreateOrganizerPageProps) {
  const router = useRouter();
  const { showError } = useDialogStore();
  const { handleError } = useErrorHandler();
  const { setCurrentOrganizer } = useOrganizerStore();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { isValid },
  } = useForm<CreateOrganizerFormData>({
    resolver: zodResolver(createOrganizerSchema),
    mode: "onChange",
    defaultValues: {
      organizerName: "",
      description: "",
      phoneNumber: "",
      email: "",
      language: "繁體中文",
      currency: "TWD",
      countryCode: "台灣 +886",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // 檔案大小驗證 (4MB)
      if (file.size > 4 * 1024 * 1024) {
        alert("檔案大小不能超過 4MB");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // 檔案大小驗證 (4MB)
      if (file.size > 4 * 1024 * 1024) {
        alert("檔案大小不能超過 4MB");
        return;
      }

      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CreateOrganizerFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 建立主辦單位
      const response = await postApiV1Organizations({
        body: {
          name: data.organizerName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          countryCode: data.countryCode.split(" ")[1], // 提取國碼部分，例如 "+886"
          introduction: data.description || "",
        },
      });

      if (response.error?.status === false) {
        throw new Error(response.error.message || "建立主辦單位失敗，請稍後再試");
      }

      if (response.data?.data) {
        // 獲取建立的主辦單位 ID
        const organizationId = response.data.data;

        // 如果有上傳頭像或封面圖片，則進行圖片上傳
        if (avatarFile || coverImageFile) {
          try {
            const imageResponse = await postApiV1OrganizationsByOrganizationIdImages({
              path: {
                organizationId,
              },
              body: {
                avatar: avatarFile || undefined,
                cover: coverImageFile || undefined,
              },
            });

            if (imageResponse.error?.status === false) {
              throw new Error(imageResponse.error.message || "上傳主辦單位圖片失敗，請稍後再試");
            }
          } catch (imageError: unknown) {
            handleError(imageError);
            // 圖片上傳失敗不阻止主辦單位建立成功的流程
          }
        }

        // 設定為當前主辦單位
        setCurrentOrganizer(organizationId, data.organizerName);

        // 呼叫 onSuccess 回調（如果有提供）
        onSuccess?.({
          ...data,
          avatar: avatarFile,
          coverImage: coverImageFile,
        });

        // 導航回主辦者中心
        router.push("/organizer");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset();
    setAvatarPreview(null);
    setCoverImagePreview(null);
    setAvatarFile(null);
    setCoverImageFile(null);
  };

  const handleResetAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleResetCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
  };

  // 語言選項
  const languageOptions = [{ value: "繁體中文", label: "繁體中文" }];

  // 貨幣選項
  const currencyOptions = [{ value: "TWD", label: "TWD" }];

  // 國碼選項
  const countryCodeOptions = [{ value: "台灣 +886", label: "台灣 +886" }];

  return (
    <div className="min-h-screen">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">建立主辦</h1>
          <p className="text-lg text-gray-600 mt-2">
            開始舉辦活動前先建立個主辦單位，讓參加者更認識你吧！
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* 封面和頭像上傳 */}
            <div className="p-6 mb-[35px] lg:mb-[70px]">
              {/* 封面圖片 */}
              <div className="relative bg-primary-100 h-60 lg:h-[380px] rounded-lg">
                <div className="w-full h-full flex items-center justify-center">
                  {coverImagePreview ? (
                    <div
                      className="w-full h-full bg-cover bg-center rounded-lg"
                      style={{ backgroundImage: `url(${coverImagePreview})` }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-primary-600">
                      <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center mb-3">
                        <Image
                          className="opacity-60"
                          size={32}
                          stroke="currentColor"
                          strokeWidth={1.5}
                        />
                      </div>
                      <label className="px-4 py-1.5 bg-primary-500 rounded-md text-xs text-neutral-800 border border-primary-400 hover:saturate-150 cursor-pointer absolute top-5 right-5 flex items-center gap-1 duration-200 active:scale-95">
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleCoverImageChange}
                          accept="image/*"
                        />
                        <Upload size={12} />
                        上傳封面圖片
                      </label>
                    </div>
                  )}
                </div>

                {coverImagePreview && (
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      type="button"
                      onClick={handleResetCoverImage}
                      className="w-8 h-8 bg-white/90 rounded-md flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    >
                      <RefreshCw
                        size={16}
                        className="text-gray-600"
                      />
                    </button>
                  </div>
                )}

                <div className="text-xs w-[150px] md:w-auto text-primary-600 text-center absolute -bottom-10 right-2 bg-white/90 py-1 px-2 rounded-md">
                  建議上傳 1200 × 400 的封面照片，檔案大小不超過 4 MB
                </div>

                {/* 頭像上傳 */}
                <div className="absolute bottom-0 translate-y-1/2 left-6">
                  <div className="relative">
                    <div
                      className={`w-24 h-24 lg:w-40 lg:h-40 ${
                        avatarPreview ? "bg-cover bg-center" : "bg-white"
                      } rounded-full flex items-center justify-center border-4 border-white shadow-md`}
                      style={avatarPreview ? { backgroundImage: `url(${avatarPreview})` } : {}}
                    >
                      {!avatarPreview && (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleAvatarChange}
                            accept="image/*"
                          />
                          <Camera
                            className="opacity-40 text-primary-600"
                            size={24}
                          />
                        </label>
                      )}
                    </div>

                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={handleResetAvatar}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow border border-gray-200"
                      >
                        <X
                          size={14}
                          className="text-gray-500"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 基本資訊 */}
            <div className="px-6 py-5 bg-gray-50 rounded-md mx-6">
              <h3 className="text-base font-medium mb-4 text-gray-800">基本資訊</h3>
              <div className="space-y-5">
                <FormSection
                  title="主辦單位名稱"
                  required
                >
                  <FormField
                    control={control}
                    name="organizerName"
                    type="input"
                    placeholder="Ex: Eventa"
                    trigger={trigger}
                  />
                </FormSection>

                <FormSection
                  title="主辦單位簡介"
                  required
                >
                  <FormField
                    control={control}
                    name="description"
                    type="textarea"
                    placeholder="簡單介紹主辦單位..."
                    trigger={trigger}
                  />
                </FormSection>
              </div>
            </div>

            {/* 聯絡資訊 */}
            <div className="px-6 py-5 bg-gray-50 rounded-md mx-6">
              <h3 className="text-base font-medium mb-4 text-gray-800">聯絡資訊</h3>
              <div className="space-y-5">
                <FormSection
                  title="電話號碼"
                  required
                >
                  <div className="grid grid-cols-3 gap-3">
                    <FormField
                      control={control}
                      name="countryCode"
                      type="select"
                      options={countryCodeOptions}
                      placeholder="國碼"
                      trigger={trigger}
                    />
                    <div className="col-span-2">
                      <FormField
                        control={control}
                        name="phoneNumber"
                        type="input"
                        placeholder="Ex: 0900000000"
                        trigger={trigger}
                      />
                    </div>
                  </div>
                </FormSection>

                <FormSection
                  title="電子郵件"
                  required
                >
                  <FormField
                    control={control}
                    name="email"
                    type="input"
                    inputType="email"
                    placeholder="Ex: eventa@gmail.com"
                    trigger={trigger}
                  />
                </FormSection>
              </div>
            </div>

            {/* 語系/幣別 */}
            <div className="px-6 py-5 bg-gray-50 rounded-md mx-6">
              <h3 className="text-base font-medium mb-4 text-gray-800">語系/幣別</h3>
              <div className="space-y-5">
                <FormSection
                  title="語言"
                  required
                  description="系統僅提供此語系發送"
                >
                  <FormField
                    control={control}
                    name="language"
                    type="select"
                    options={languageOptions}
                    placeholder="請選擇語言"
                    trigger={trigger}
                  />
                </FormSection>

                <FormSection
                  title="幣別"
                  required
                  description="幣別綁定主辦單位，日後無法變更，僅能舉辦同一幣別之收費活動"
                >
                  <FormField
                    control={control}
                    name="currency"
                    type="select"
                    options={currencyOptions}
                    placeholder="請選擇幣別"
                    trigger={trigger}
                  />
                </FormSection>
              </div>
            </div>

            {/* 提交按鈕 */}
            <div className="px-6 pb-6 flex justify-center">
              <div className="flex gap-4 w-full max-w-md">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-gray-200 text-gray-700 rounded-full font-medium shadow-sm text-sm duration-200 hover:bg-gray-300 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  重設
                </button>
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={cn(
                    "flex-1 h-12 bg-primary-500 text-neutral-800 rounded-full font-medium shadow-sm text-sm duration-200",
                    !isValid || isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:saturate-150 transition-colors active:scale-95"
                  )}
                >
                  {isSubmitting ? "建立中..." : "建立"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
