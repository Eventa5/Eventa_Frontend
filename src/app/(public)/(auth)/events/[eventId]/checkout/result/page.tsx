"use client";
import { Button } from "@/components/ui/button";
import HotEventsSection from "@/components/ui/hot-events-section";
import { getApiV1OrdersByOrderIdCheckoutResult } from "@/services/api/client/sdk.gen";
import type { GetApiV1OrdersByOrderIdCheckoutResultResponse } from "@/services/api/client/types.gen";
import { ThumbsUp, X } from "lucide-react";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutResultPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const orderId = searchParams?.get("orderId");
  const eventId = params.eventId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unpaidError, setUnpaidError] = useState(false);
  const [resultData, setResultData] =
    useState<GetApiV1OrdersByOrderIdCheckoutResultResponse | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("找不到訂單編號");
      setLoading(false);
      return;
    }
    getApiV1OrdersByOrderIdCheckoutResult({
      path: { orderId },
    })
      .then((res) => {
        if (res.error) {
          // 處理 API 錯誤回應
          const status = res.response?.status;
          const errorMessage = res.error.message || "載入訂單結果失敗";
          switch (status) {
            case 409:
              setError("此訂單尚未進行結帳");
              setUnpaidError(true);
              break;
            case 404:
              setError("訂單不存在");
              break;
            case 400:
              setError("付款資料格式錯誤，請聯繫管理員");
              break;
            case 401:
              setError("未提供授權令牌，請重新登入");
              break;
            default:
              setError(errorMessage);
          }
        } else {
          setResultData(res.data ?? null);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("載入訂單結果失敗");
        setLoading(false);
      });
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 -mt-10">
      {loading ? (
        <div className="min-h-screen bg-primary-50 flex items-center justify-center px-4 -mt-10">
          <Loader className="animate-spin w-10 h-10 text-primary-500" />
        </div>
      ) : error ? (
        <div className="max-w-md w-full text-center py-10 mt-16">
          <h1 className="text-2xl font-bold text-neutral-700 mb-4">
            {resultData?.data?.result ? "報名成功" : "報名失敗"}
          </h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Image
            src="/images/error.png"
            alt="error"
            width={400}
            height={400}
          />
          {unpaidError && (
            <Link href={`/attendee/orders/${orderId}`}>
              <Button
                size="lg"
                className="flex-1 font-semibold bg-neutral-700 text-white hover:bg-neutral-800 rounded-md py-2 px-4 text-center text-sm mt-4"
              >
                前往訂單管理查看票券
              </Button>
            </Link>
          )}
        </div>
      ) : !resultData?.data?.result ? (
        // 付款失敗，顯示取消頁面
        <div className="max-w-lg w-full text-center bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">此訂單已取消，請重新報名</h1>
          {/* 錯誤訊息 */}
          {resultData?.data?.resultMessage && (
            <h2 className="text-sm text-gray-500 mt-4">{resultData.data.resultMessage}</h2>
          )}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-gray-800 rounded-2xl flex items-center justify-center">
              <X
                className="text-white w-12 h-12"
                strokeWidth={3}
              />
            </div>
          </div>
          {/* 取消原因 */}
          <div className="mb-8">
            <p className="text-gray-600 mb-4 text-left">取消的原因可能有：</p>
            <ul className="text-gray-600 text-left space-y-2">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                沒有在時限內填完報名資料
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                沒有在付款期限以前完成繳費
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                user或主辦單位手動取消
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                不符合報名資格，未通過審核
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                有其他進行中的訂單
              </li>
            </ul>
          </div>
          {/* 重新報名按鈕 */}
          <Link
            href={`/events/${eventId}`}
            className="w-full font-semibold bg-gray-700 text-white hover:bg-gray-800 rounded-md py-3 px-6"
          >
            重新報名
          </Link>
        </div>
      ) : (
        // 付款成功頁面
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="mx-auto w-32 h-32 bg-primary-500 rounded-full flex items-center justify-center">
              <ThumbsUp className="text-white w-16 h-16" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-8">報名成功！</h1>
          <Link href={`/attendee/orders/${orderId}`}>
            <Button
              size="lg"
              className="flex-1 font-semibold bg-neutral-700 text-white hover:bg-neutral-800 rounded-md py-2 px-4 text-center text-sm"
            >
              前往訂單管理查看票券
            </Button>
          </Link>
        </div>
      )}
      {/* 熱門活動 */}
      <section className="pt-[116px] pb-[116px] md:pt-[120px] md:pb-[173px] px-4 md:px-8 bg-hot-activity">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center mb-8 md:mb-[64px]">
            <div className="flex items-center gap-6 mb-6 font-serif-tc">
              <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">熱門</h2>
              <Image
                src="/images/balloon-red.png"
                width={50}
                height={100}
                className="w-6 h-12 md:w-10 md:h-20"
                alt="氣球"
              />
              <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">活動</h2>
            </div>
            <p className="text-[14px] md:text-[18px] text-[#525252] text-center max-w-3xl">
              大家最近都在參加<span className="hidden md:inline-block">、</span>
              <br className="md:hidden" />
              討論度最高的熱門活動都在這裡！
            </p>
          </div>
          <HotEventsSection />
        </div>
      </section>
    </div>
  );
}
