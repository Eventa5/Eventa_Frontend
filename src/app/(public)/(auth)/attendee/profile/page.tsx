import ProfileForm from "@/features/profile/components/profile-form";
import type { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "個人檔案 | Eventa",
  description: "管理您在 Eventa 上的個人資料",
};

export default function ProfilePage() {
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
            <ProfileForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
