import ProfileForm from "@/features/profile/components/profile-form";
import { getApiV1UsersProfile } from "@/services/api/client/sdk.gen";
import type { UserResponse } from "@/services/api/client/types.gen";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "個人檔案 | Eventa",
  description: "管理您在 Eventa 上的個人資料",
};

async function getProfileData(): Promise<UserResponse> {
  try {
    const response = await getApiV1UsersProfile();

    if (response.data?.data) {
      return response.data.data;
    }

    throw new Error(response.error?.message || "無法獲取個人檔案");
  } catch (error) {
    console.error("獲取用戶檔案失敗:", error);
    // 如果是認證錯誤，重定向到登入頁面
    redirect("/?redirect=/attendee/profile");
  }
}

export default async function ProfilePage() {
  const profileData = await getProfileData();

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

          <Suspense fallback={<div>載入中...</div>}>
            <ProfileForm initialData={profileData} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
