"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Image, RefreshCw, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { FormField, FormSection } from "@/components/ui/form-field";
import { type CreateOrganizerFormData, createOrganizerSchema } from "@/features/organizer/schemas";
import {
  postApiV1OrganizationsByOrganizationIdImages,
  putApiV1Organizations,
} from "@/services/api/client/sdk.gen";
import type { OrganizationResponse } from "@/services/api/client/types.gen";
import { useDialogStore } from "@/store/dialog";
import { useOrganizerStore } from "@/store/organizer";
import { useErrorHandler } from "@/utils/error-handler";
import { cn } from "@/utils/transformer";
import { Toaster, toast } from "sonner";

export default function OrganizerHomePage() {
  const router = useRouter();
  const { showError } = useDialogStore();
  const { handleError } = useErrorHandler();
  const { fetchCurrentOrganizerInfo } = useOrganizerStore();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [organizerInfo, setOrganizerInfo] = useState<OrganizationResponse | null>(null);

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

  const fetchOrganizerDetail = useCallback(async () => {
    const currentOrganizer = await fetchCurrentOrganizerInfo();
    if (!currentOrganizer) {
      setIsLoading(false);
      return;
    }

    setOrganizerInfo(currentOrganizer);
    reset({
      organizerName: currentOrganizer.name || "",
      description: currentOrganizer.introduction || "",
      phoneNumber: currentOrganizer.phoneNumber || "",
      email: currentOrganizer.email || "",
      language: "繁體中文",
      currency: currentOrganizer.currency || "TWD",
      countryCode: `台灣 ${currentOrganizer.countryCode || "+886"}`,
    });

    if (currentOrganizer.avatar) {
      setAvatarPreview(currentOrganizer.avatar);
    }
    if (currentOrganizer.cover) {
      setCoverImagePreview(currentOrganizer.cover);
    }
    setIsLoading(false);
  }, [fetchCurrentOrganizerInfo, reset]);

  useEffect(() => {
    fetchOrganizerDetail();
  }, [fetchOrganizerDetail]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // 檔案大小驗證 (4MB)
      if (file.size > 4 * 1024 * 1024) {
        showError("檔案大小不能超過 4MB");
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
        showError("檔案大小不能超過 4MB");
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
    if (isSubmitting || !organizerInfo) return;

    setIsSubmitting(true);

    try {
      // 更新主辦單位
      const response = await putApiV1Organizations({
        body: {
          id: organizerInfo.id as number,
          name: data.organizerName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          countryCode: data.countryCode.split(" ")[1], // 提取國碼部分，例如 "+886"
          introduction: data.description || "",
          avatar: avatarPreview === null ? "" : undefined,
          cover: coverImagePreview === null ? "" : undefined,
        },
      });

      if (response.error?.status === false) {
        showError(response.error.message || "更新主辦單位失敗，請稍後再試");
      }

      // 如果有上傳頭像或封面圖片，則進行圖片上傳
      if (avatarFile || coverImageFile) {
        try {
          const imageResponse = await postApiV1OrganizationsByOrganizationIdImages({
            path: {
              organizationId: organizerInfo.id as number,
            },
            body: {
              avatar: avatarFile || undefined,
              cover: coverImageFile || undefined,
            },
          });

          if (imageResponse.error?.status === false) {
            showError(imageResponse.error.message || "上傳主辦單位圖片失敗，請稍後再試");
          }
        } catch (imageError: unknown) {
          handleError(imageError);
          // 圖片上傳失敗不阻止主辦單位更新成功的流程
        }
      }
      const newOrganizerInfo = await fetchCurrentOrganizerInfo();
      setOrganizerInfo(newOrganizerInfo as OrganizationResponse);
      toast.success("主辦單位資料更新成功");
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    if (organizerInfo) {
      reset({
        organizerName: organizerInfo.name || "",
        description: organizerInfo.introduction || "",
        phoneNumber: organizerInfo.phoneNumber || "",
        email: organizerInfo.email || "",
        language: "繁體中文",
        currency: organizerInfo.currency || "TWD",
        countryCode: `台灣 ${organizerInfo.countryCode || "+886"}`,
      });
      setAvatarPreview(organizerInfo.avatar || null);
      setCoverImagePreview(organizerInfo.cover || null);
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!organizerInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-4">尚未建立主辦單位</h1>
          <p className="text-gray-600">請先建立主辦單位以開始使用主辦者中心功能</p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/create")}
          className="px-6 py-3 bg-primary-500 text-neutral-800 rounded-full font-medium shadow-sm text-sm duration-200 hover:saturate-150 transition-colors active:scale-95"
        >
          建立主辦單位
        </button>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="p-6 md:py-0">
        <h1 className="text-2xl font-bold mb-6">主辦者中心總覽</h1>
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
                <div className="absolute top-5 right-5 flex items-center gap-2">
                  <label className="px-4 py-1.5 bg-primary-500 rounded-md text-xs text-neutral-800 border border-primary-400 hover:saturate-150 cursor-pointer flex items-center gap-1 duration-200 active:scale-95">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleCoverImageChange}
                      accept="image/*"
                    />
                    <Upload size={12} />
                    上傳封面圖片
                  </label>
                  <button
                    type="button"
                    onClick={handleResetCoverImage}
                    className="px-4 py-1.5 bg-gray-200 rounded-md text-xs text-gray-700 border border-gray-300 hover:bg-gray-300 cursor-pointer flex items-center gap-1 duration-200 active:scale-95"
                  >
                    <RefreshCw size={12} />
                    重設
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
                取消
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
                {isSubmitting ? "更新中..." : "更新"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
