"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TicketGuideDialog from "@/features/activities/components/ticket-guide-dialog";
import {
  deleteApiV1ActivitiesByActivityIdFavorite,
  getApiV1ActivitiesByActivityId,
  postApiV1ActivitiesByActivityIdFavorite,
} from "@/services/api/client/sdk.gen";
import type { ActivityResponse } from "@/services/api/client/types.gen";
import { useAuthStore } from "@/store/auth";
import { useDialogStore } from "@/store/dialog";
import { useSearchStore } from "@/store/search";
import { format, parseISO } from "date-fns";
import { zhTW } from "date-fns/locale";
import DOMPurify from "dompurify";
import { Loader } from "lucide-react";
import {
  Calendar,
  Cone,
  EyeIcon,
  Facebook,
  HeartIcon,
  InfoIcon,
  LinkIcon,
  Mail,
  MapPin,
  PlusIcon,
  VideoIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.eventId;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setLoginDialogOpen = useDialogStore((s) => s.setLoginDialogOpen);
  const setLoginTab = useDialogStore((s) => s.setLoginTab);
  const router = useRouter();
  const [eventData, setEventData] = useState<ActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setSearchValue = useSearchStore((s) => s.setSearchValue);
  const [showTicketGuide, setShowTicketGuide] = useState(false);
  const [liked, setLiked] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    getApiV1ActivitiesByActivityId({
      path: { activityId: Number(eventId) },
    })
      .then((res) => {
        setEventData(res.data?.data ?? null);
        setLiked(res.data?.data?.userStatus?.isFavorite ?? false);
        if (!res.data?.data) setError("查無此活動");
      })
      .catch(() => setError("載入活動資料失敗"))
      .finally(() => setLoading(false));
  }, [eventId]);

  // 活動地點變數
  const eventLocation = eventData?.location || "";

  // 從活動資料中取得主辦單位資訊
  const organization = eventData?.organization;

  const handleCheckout = () => {
    if (isAuthenticated) {
      router.push(`/events/${eventId}/checkout`);
    } else {
      setLoginTab("signin");
      setLoginDialogOpen(true);
      toast.error("請先登入才能購票");
    }
  };

  // 處理收藏/取消收藏
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      setLoginTab("signin");
      setLoginDialogOpen(true);
      toast.error("請先登入才能收藏活動");
      return;
    }

    if (!eventId) return;

    setFavoriteLoading(true);
    try {
      if (liked) {
        // 取消收藏
        await deleteApiV1ActivitiesByActivityIdFavorite({
          path: { activityId: Number(eventId) },
        });
        setLiked(false);
        toast.success("已取消收藏");
        setEventData((prev) => (prev ? { ...prev, likeCount: (prev.likeCount || 0) - 1 } : prev));
      } else {
        // 新增收藏
        await postApiV1ActivitiesByActivityIdFavorite({
          path: { activityId: Number(eventId) },
        });
        setLiked(true);
        toast.success("已加入收藏");
        setEventData((prev) => (prev ? { ...prev, likeCount: (prev.likeCount || 0) + 1 } : prev));
      }
    } catch (error) {
      toast.error(liked ? "取消收藏失敗" : "收藏失敗");
    } finally {
      setFavoriteLoading(false);
    }
  };

  function formatEventDate(start?: string, end?: string) {
    if (!start || !end) return "--";
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    const startStr = `${format(startDate, "yyyy.MM.dd", {
      locale: zhTW,
    })}（${format(startDate, "EEEE", { locale: zhTW }).replace(
      "星期",
      ""
    )}）${format(startDate, "HH:mm")}`;
    const endStr = `${format(endDate, "yyyy.MM.dd", {
      locale: zhTW,
    })}（${format(endDate, "EEEE", { locale: zhTW }).replace(
      "星期",
      ""
    )}）${format(endDate, "HH:mm")}`;
    return `${startStr} - ${endStr} (GMT+8)`;
  }

  function formatGoogleDate(dateStr?: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d+Z$/, "Z");
  }

  return loading ? (
    // 載入中
    <div className="min-h-screen flex items-center justify-center bg-primary-50 -mt-10">
      <Loader className="animate-spin w-10 h-10 text-primary-500" />
    </div>
  ) : error ? (
    // 錯誤頁面顯示
    <div className="min-h-screen flex flex-col items-center justify-center text-2xl font-bold text-neutral-500 bg-primary-50 -mt-10">
      {error}
      <Image
        src="/images/error.png"
        alt="error"
        width={400}
        height={400}
      />
    </div>
  ) : (
    <div className="min-h-screen flex flex-col bg-primary-50 px-4 pt-4 pb-24 relative -mt-10 overflow-x-hidden">
      {/* Banner區塊：手機滿版，桌機維持原本寬度 */}
      <div className="relative">
        {/* 手機版滿版 Banner */}
        <div className="block md:hidden relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <Image
            src={eventData?.cover ? eventData.cover : "/images/no_single_activity_cover.png"}
            alt="活動 Banner"
            width={1680}
            height={840}
            className="w-full h-auto object-cover rounded-none aspect-[2/1]"
            priority
          />
        </div>
        {/* 桌機版 Banner */}
        <div className="hidden md:block w-full max-w-[1680px] mx-auto rounded-2xl overflow-hidden">
          <Image
            src={eventData?.cover ? eventData.cover : "/images/no_single_activity_cover.png"}
            alt="活動 Banner"
            width={1680}
            height={840}
            className="object-cover w-full aspect-[2/1]"
          />
        </div>
      </div>
      {/* 手機版感興趣/喜歡區塊（Banner下方，非覆蓋，滿版） */}
      <div className="flex justify-center items-center bg-[#FFD56B] md:hidden w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] relative">
        <div className="flex items-center gap-1 justify-center w-1/2">
          <EyeIcon className="w-5 h-5 text-neutral-700" />
          <span className="text-neutral-700 text-sm font-bold">{eventData?.viewCount ?? 0} 人</span>
        </div>
        <div className="h-8 w-px bg-neutral-700 mx-2" />
        <div className="flex items-center gap-1 justify-center w-1/2">
          <HeartIcon className="w-5 h-5 text-neutral-700" />
          <span className="text-neutral-700 text-sm font-bold">{eventData?.likeCount ?? 0} 人</span>
        </div>
      </div>
      {/* 標題與標籤區塊 */}
      <div className="w-full max-w-[1280px] mx-auto px-4 pt-10 lg:pt-10 lg:pb-6">
        <div className="flex gap-4 mb-4">
          {eventData?.categories?.map((category) => (
            <Link
              key={category.id}
              href={`/events?categoryId=${category.id}`}
              className="bg-secondary-100 text-secondary-500 rounded-lg py-2 px-3 lg:px-6 font-bold text-sm lg:text-base"
            >
              {category.name}
            </Link>
          ))}
        </div>
        <h1 className="font-black text-3xl font-serif-tc lg:text-5xl text-[#000] leading-tight">
          {eventData?.title ?? "無標題"}
        </h1>
      </div>
      {/* 主內容與右側資訊欄雙欄排版 */}
      <div className="flex flex-col lg:flex-row lg:items-start w-full max-w-[1280px] mx-auto px-4 py-0 lg:py-10 mb-16 gap-8">
        {/* 左側主內容（flex-1） */}
        <div className="flex-1 flex flex-col gap-20">
          {/* 內容區塊 */}
          <section className="flex flex-col lg:flex-row gap-8">
            {/* 左側主內容 */}
            <div className="flex flex-col items-start">
              <div className="hidden lg:flex flex-col items-center gap-4">
                <Image
                  src="/images/balloon.png"
                  alt="Ballon Yellow"
                  width={24}
                  height={48}
                />
                <h2 className="font-bold font-serif-tc [writing-mode:vertical-lr] tracking-[6px] text-[20px] text-neutral-800">
                  關於活動
                </h2>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-10">
              {/* 關於活動 */}
              <p className="text-neutral-800 leading-relaxed mt-0 lg:mt-16 whitespace-pre-line">
                {eventData?.summary ?? ""}
              </p>
              <div className="flex flex-wrap gap-2">
                {eventData?.tags?.length &&
                  eventData.tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        router.push(`/events?search=${tag}`);
                        setSearchValue(tag);
                      }}
                      className="border border-neutral-500 rounded-full px-4 py-1 text-neutral-500 text-base lg:text-sm cursor-pointer"
                    >
                      #{tag}
                    </button>
                  ))}
              </div>
              <Separator />
              {/* 活動資訊表格 */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 pl-0 lg:pl-8">
                <span className="inline-flex items-center gap-2 text-neutral-800 font-bold text-lg lg:text-base text-nowrap">
                  <Calendar className="w-5 h-5" />
                  活動時間
                </span>
                <span className="text-neutral-800">
                  {eventData?.startTime && eventData?.endTime
                    ? formatEventDate(eventData.startTime, eventData.endTime)
                    : "--"}
                </span>
                <a
                  href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                    eventData?.title ?? ""
                  )}&dates=${formatGoogleDate(eventData?.startTime)}/${formatGoogleDate(
                    eventData?.endTime
                  )}&details=${encodeURIComponent(
                    eventData?.summary ?? ""
                  )}&location=${encodeURIComponent(eventData?.location ?? "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary-700 font-bold cursor-pointer text-nowrap"
                >
                  <PlusIcon className="w-4 h-4" />
                  加入行事曆
                </a>
              </div>
              <Separator />
              {/* 只有線下活動才顯示活動地點 */}
              {!eventData?.isOnline && (
                <>
                  <div className="flex flex-col lg:flex-row items-start gap-3 pl-0 lg:pl-8">
                    <span className="inline-flex items-center gap-2 text-neutral-800 font-bold text-lg lg:text-base">
                      <MapPin className="w-5 h-5" />
                      活動地點
                    </span>
                    <span className="text-neutral-800">{eventLocation}</span>
                  </div>
                  <Separator />
                </>
              )}
              <div className="flex flex-col lg:flex-row items-start gap-3 pl-0 lg:pl-8">
                <span className="inline-flex items-center gap-2 text-neutral-800 font-bold text-lg lg:text-base">
                  <LinkIcon className="w-5 h-5" />
                  相關連結
                </span>
                <a
                  href={organization?.officialSiteUrl ? organization.officialSiteUrl : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-neutral-800 underline ${
                    organization?.officialSiteUrl ? "" : "opacity-50 pointer-events-none"
                  }`}
                  aria-label="主辦單位官方網站"
                  aria-disabled={!organization?.officialSiteUrl}
                >
                  {organization?.name}
                </a>
              </div>
              {/* 手機版主辦單位資訊 */}
              <div className="w-full bg-neutral-800 rounded-lg p-8 flex gap-4 items-center justify-between lg:hidden">
                <div className="flex flex-col items-start gap-4 ">
                  <span className="font-bold text-lg text-white">{organization?.name}</span>
                  <div className="flex gap-10 mt-2">
                    <button
                      type="button"
                      className={`text-white cursor-pointer ${favoriteLoading ? "opacity-50 pointer-events-none" : ""}`}
                      onClick={handleToggleFavorite}
                      disabled={favoriteLoading}
                    >
                      {favoriteLoading ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <HeartIcon
                          fill={liked ? "currentColor" : "none"}
                          className={`${liked ? "text-red-500" : ""}`}
                        />
                      )}
                    </button>
                    <a
                      href={organization?.officialSiteUrl ? organization.officialSiteUrl : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-white cursor-pointer ${
                        organization?.officialSiteUrl ? "" : "opacity-50 pointer-events-none"
                      }`}
                      aria-label="主辦單位官方網站"
                      aria-disabled={!organization?.officialSiteUrl}
                    >
                      <Facebook />
                    </a>
                    <a
                      href={organization?.email ? `mailto:${organization.email}` : "#"}
                      className={`text-white cursor-pointer ${
                        organization?.email ? "" : "opacity-50 pointer-events-none"
                      }`}
                    >
                      <Mail />
                    </a>
                  </div>
                </div>
                <Image
                  src={
                    organization?.avatar
                      ? organization.avatar
                      : "/images/single_activity_avatar.png"
                  }
                  alt="主辦單位頭貼"
                  width={90}
                  height={90}
                  className="rounded-full w-24 sm:w-32 md:w-36"
                />
              </div>
              {/* 注意事項 */}
              <div
                className={`rounded-[24px] p-6 flex flex-col gap-4 lg:rounded-full lg:flex-row lg:items-center lg:gap-8 lg:px-8 lg:py-6 ${
                  eventData?.isOnline ? "bg-[#FCE3DA]" : "bg-[#FFF0CA]"
                }`}
              >
                <span className="inline-flex items-center gap-2 text-neutral-800 font-bold text-lg md:text-base">
                  {eventData?.isOnline ? (
                    <>
                      <VideoIcon className="w-5 h-5" />
                      線上活動
                    </>
                  ) : (
                    <>
                      <Cone className="w-5 h-5" />
                      線下活動
                    </>
                  )}
                </span>
                <div className="flex flex-col gap-2">
                  <span className="text-neutral-800">
                    {eventData?.isOnline
                      ? "此為線上活動，不受地點限制，輕鬆享受活動樂趣！"
                      : "報名完成後，活動當天抵達現場出示 Eventa 電子票券即可快速入場"}
                  </span>
                  <span className="text-neutral-500 text-sm">
                    {eventData?.isOnline
                      ? "購票後可於票券頁進入直播連結"
                      : "實際入場相關規定以活動主辦方為主"}
                  </span>
                </div>
                {/* 線下活動才顯示如何取票 */}
                {!eventData?.isOnline && (
                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm text-primary-700 font-bold cursor-pointer mt-2 md:mt-0"
                    onClick={() => {
                      setShowTicketGuide(true);
                    }}
                  >
                    <InfoIcon className="w-5 h-5" />
                    如何取票
                  </button>
                )}
                <TicketGuideDialog
                  open={showTicketGuide}
                  onClose={() => {
                    setShowTicketGuide(false);
                  }}
                />
              </div>
            </div>
          </section>

          {/* 活動地圖區塊 */}
          <section className="flex lg:flex-row flex-col gap-0 lg:gap-8">
            <div className="hidden lg:flex flex-col items-start">
              <div className="flex flex-col items-center gap-4">
                <Image
                  src="/images/balloon.png"
                  alt="Ballon Yellow"
                  width={24}
                  height={48}
                />
                <h2 className="font-bold font-serif-tc [writing-mode:vertical-lr] tracking-[6px] text-[20px] text-neutral-800">
                  活動地圖
                </h2>
              </div>
            </div>
            {/* 手機版活動地圖標題 */}
            <div className="flex items-end justify-center gap-8 mb-6 lg:hidden">
              <span className="font-bold font-serif-tc text-3xl lg:text-2xl text-neutral-800">
                活動
              </span>
              <Image
                src="/images/balloon.png"
                alt="Ballon Yellow"
                width={32}
                height={32}
                className="mx-2"
              />
              <span className="font-bold font-serif-tc text-3xl lg:text-2xl text-neutral-800">
                地圖
              </span>
            </div>
            <div className="w-full max-w-[845px] rounded-[16px] overflow-hidden mt-0 lg:mt-16">
              <iframe
                title="活動地圖"
                width="100%"
                height="309"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  eventLocation
                )}&output=embed`}
              />
            </div>
          </section>

          {/* 活動簡介區塊 */}
          <section className="flex flex-col lg:flex-row gap-0 lg:gap-8">
            <div className="hidden lg:flex flex-col items-start">
              <div className="flex flex-col items-center gap-4">
                <Image
                  src="/images/balloon.png"
                  alt="Ballon Yellow"
                  width={24}
                  height={48}
                />
                <h2 className="font-bold font-serif-tc [writing-mode:vertical-lr] tracking-[6px] text-[20px] text-neutral-800">
                  活動簡介
                </h2>
              </div>
            </div>
            {/* 手機版活動簡介標題 */}
            <div className="flex items-end  justify-center gap-8 mb-6 lg:hidden">
              <span className="font-bold font-serif-tc text-3xl lg:text-2xl text-neutral-800">
                活動
              </span>
              <Image
                src="/images/balloon.png"
                alt="Ballon Yellow"
                width={32}
                height={32}
                className="mx-2"
              />
              <span className="font-bold font-serif-tc text-3xl lg:text-2xl text-neutral-800">
                簡介
              </span>
            </div>
            <div className="flex flex-col gap-2 mt-0 lg:mt-16">
              <div
                className="text-base text-[#525252] markdown-content"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: 已用 DOMPurify 處理
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    const rawHtml = eventData?.descriptionMd ?? "";
                    if (!rawHtml) return "";

                    // 創建臨時 DOM 元素來處理連結
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = rawHtml;

                    // 為所有連結添加 target="_blank" 和 rel="noopener noreferrer"
                    const links = tempDiv.querySelectorAll("a");
                    for (const link of links) {
                      link.setAttribute("target", "_blank");
                      link.setAttribute("rel", "noopener noreferrer");
                    }

                    // 使用 DOMPurify 清理 HTML，並允許 target 和 rel 屬性
                    return DOMPurify.sanitize(tempDiv.innerHTML, {
                      ALLOWED_ATTR: ["href", "target", "rel", "class", "id", "style"],
                      ALLOWED_TAGS: [
                        "a",
                        "p",
                        "br",
                        "strong",
                        "em",
                        "u",
                        "h1",
                        "h2",
                        "h3",
                        "h4",
                        "h5",
                        "h6",
                        "ul",
                        "ol",
                        "li",
                        "blockquote",
                        "code",
                        "pre",
                        "table",
                        "thead",
                        "tbody",
                        "tr",
                        "th",
                        "td",
                        "img",
                        "div",
                        "span",
                      ],
                    });
                  })(),
                }}
              />
            </div>
          </section>
        </div>
        {/* 右側主辦單位資訊 */}
        <aside className="w-full hidden lg:flex lg:w-[320px] flex-col gap-8 mt-0 lg:mt-16">
          <div className="bg-neutral-800 rounded-lg p-6 flex flex-col gap-4 items-center">
            <div className="flex items-center gap-4">
              <Image
                src={
                  organization?.avatar ? organization.avatar : "/images/single_activity_avatar.png"
                }
                alt="主辦單位頭貼"
                width={48}
                height={48}
                className="rounded-full"
              />

              <span className="font-bold text-lg text-white">{organization?.name}</span>
            </div>

            <Button
              type="button"
              size="lg"
              className="w-full bg-primary-500 hover:bg-[#FFCA28] transition-colors text-neutral-800 text-base font-bold rounded-lg mt-2 cursor-pointer
                "
              onClick={handleCheckout}
            >
              {eventData?.userStatus?.isRegistered ? "已報名" : "立即報名"}
            </Button>
            <div className="flex gap-10 mt-2">
              <button
                type="button"
                className={`text-white cursor-pointer ${favoriteLoading ? "opacity-50 pointer-events-none" : ""}`}
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
              >
                {favoriteLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <HeartIcon
                    fill={liked ? "currentColor" : "none"}
                    className={`${liked ? "text-red-500" : ""}`}
                  />
                )}
              </button>
              <a
                href={organization?.officialSiteUrl ? organization.officialSiteUrl : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-white cursor-pointer ${
                  organization?.officialSiteUrl ? "" : "opacity-50 pointer-events-none"
                }`}
                aria-label="主辦單位官方網站"
                aria-disabled={!organization?.officialSiteUrl}
              >
                <Facebook />
              </a>
              <a
                href={organization?.email ? `mailto:${organization.email}` : "#"}
                className={`text-white cursor-pointer ${
                  organization?.email ? "" : "opacity-50 pointer-events-none"
                }`}
                aria-label="寄信給主辦單位"
                aria-disabled={!organization?.email}
              >
                <Mail />
              </a>
            </div>
          </div>
          {/* 活動熱度 */}
          <div className="hidden md:flex rounded-lg px-6 gap-4 items-center justify-between">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <EyeIcon className="w-5 h-5 text-neutral-500" />
                <span className="text-neutral-500 font-bold">{eventData?.viewCount ?? 0} 次</span>
              </div>
              <span className="text-neutral-500">瀏覽</span>
            </div>
            {/* 垂直分隔線 */}
            <div className="w-0.5 h-14 bg-neutral-400" />
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <HeartIcon className="w-5 h-5 text-neutral-500" />
                <span className="text-neutral-500 font-bold"> {eventData?.likeCount ?? 0} 人</span>
              </div>
              <span className="text-neutral-500">喜歡這場活動</span>
            </div>
          </div>
        </aside>
      </div>
      {/* 手機版底部固定報名 bar */}
      <div className="fixed bottom-0 left-0 w-full bg-transparent z-50 lg:hidden px-8 pb-8 pointer-events-none">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="bg-primary-500 hover:bg-[#FFCA28] transition-colors cursor-pointer rounded-[12px] h-12 md:h-16 flex items-center justify-center text-base font-bold shadow-lg text-neutral-800 pointer-events-auto w-[80%]"
            onClick={handleCheckout}
          >
            {eventData?.userStatus?.isRegistered ? "已報名" : "立即報名"}
          </button>
        </div>
      </div>
    </div>
  );
}
