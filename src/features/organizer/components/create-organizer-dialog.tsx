"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Image, Plus, RefreshCw, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormField, FormSection } from "@/components/ui/form-field";
import {
  postApiV1Organizations,
  postApiV1OrganizationsByOrganizationIdImages,
} from "@/services/api/client/sdk.gen";
import { useOrganizerStore } from "@/store/organizer";
import { useErrorHandler } from "@/utils/error-handler";
import { cn } from "@/utils/transformer";
import { type CreateOrganizerFormData, createOrganizerSchema } from "../schemas";

interface CreateOrganizerDialogProps {
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export function CreateOrganizerDialog({ onSuccess, children }: CreateOrganizerDialogProps) {
  const { handleError } = useErrorHandler();
  const { setCurrentOrganizerId, fetchCurrentOrganizerInfo } = useOrganizerStore();

  const [open, setOpen] = useState(false);
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
        setCurrentOrganizerId(organizationId);
        await fetchCurrentOrganizerInfo();

        onSuccess?.();

        setOpen(false);
        resetForm();
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

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setOpen(open);
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
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        {children || (
          <button
            type="button"
            className="flex items-center gap-3 bg-primary-50 rounded-full px-6 py-4 text-lg font-medium text-primary-700 hover:bg-primary-100 transition cursor-pointer"
          >
            <span className="bg-white rounded-full w-10 h-10 flex items-center justify-center border border-primary-200">
              <Plus size={20} />
            </span>
            新增主辦
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="p-0 w-full h-full max-w-auto sm:max-w-auto lg:h-auto lg:max-w-[900px] xl:max-w-[1024px] border-none rounded-none lg:rounded-lg shadow-lg z-[999]">
        <DialogHeader className="p-3 border-b bg-white rounded-t-none lg:rounded-t-lg flex flex-row items-start justify-between">
          <div>
            <DialogTitle className="text-xl text-left font-medium text-gray-800">
              建立主辦
            </DialogTitle>
            <p className="text-sm text-start text-gray-500 mt-1">
              開始舉辦活動前先建立個主辦單位，讓參加者更認識你吧！
            </p>
          </div>
        </DialogHeader>

        <div className="lg:p-3 h-full lg:max-h-[80vh] overflow-hidden">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-b-lg h-full overflow-y-auto"
          >
            {/* 封面和頭像上傳 */}
            <div className="p-3 md:p-5 mb-[35px] lg:mb-[70px]">
              {/* 封面圖片 */}
              <div className="relative bg-primary-100 h-60 rounded-lg">
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
            <div className="px-3 py-2 md:px-6 md:py-5 bg-white rounded-md mb-4">
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
            <div className="px-3 py-2  md:px-6 md:py-5 bg-white rounded-md mb-4">
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
            <div className="px-3 py-2 md:px-6 md:py-5 mb-5 bg-white rounded-md">
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

            <DialogFooter className="p-3 md:p-5 bg-white rounded-b-none lg:rounded-b-lg flex justify-center">
              <button
                type="submit"
                disabled={!isValid}
                className={cn(
                  "w-full h-10 bg-primary-500 text-neutral-800 rounded-full font-medium shadow-sm text-sm duration-200",
                  !isValid
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:saturate-150 transition-colors active:scale-95"
                )}
              >
                建立
              </button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateOrganizerDialog;
