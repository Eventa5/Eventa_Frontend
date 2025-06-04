"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth";
import { useDialogStore } from "@/store/dialog";
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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params?.eventId;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setLoginDialogOpen = useDialogStore((s) => s.setLoginDialogOpen);
  const setLoginTab = useDialogStore((s) => s.setLoginTab);
  const router = useRouter();

  // 活動地點變數
  const eventLocation = "苗栗縣大埔鄉興正路 121 巷 8 弄 20 號";

  const handleCheckout = () => {
    if (isAuthenticated) {
      router.push(`/events/${eventId}/checkout`);
    } else {
      setLoginTab("signin");
      setLoginDialogOpen(true);
      toast.error("請先登入才能購票");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary-50 px-4 pt-4 pb-24 relative -mt-10 overflow-x-hidden">
      {/* Banner區塊：手機滿版，桌機維持原本寬度 */}
      <div className="relative">
        {/* 手機版滿版 Banner */}
        <div className="block md:hidden relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <Image
            src="/images/single_activity_cover.png"
            alt="活動 Banner"
            width={1680}
            height={840}
            className="w-full h-auto object-cover rounded-none aspect-[2/1]"
            priority
          />
        </div>
        {/* 桌機版 Banner */}
        <div className="hidden md:block w-full rounded-2xl overflow-hidden">
          <Image
            src="/images/single_activity_cover.png"
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
          <span className="text-neutral-700 text-sm font-bold">1,473 人</span>
        </div>
        <div className="h-6 w-px bg-neutral-700 mx-2" />
        <div className="flex items-center gap-1 justify-center w-1/2">
          <HeartIcon className="w-5 h-5 text-neutral-700" />
          <span className="text-neutral-700 text-sm font-bold">66 人</span>
        </div>
      </div>
      {/* 標題與標籤區塊 */}
      <div className="w-full max-w-[1280px] mx-auto px-4 pt-10 sm:pt-10 sm:pb-6">
        <div className="flex gap-4 mb-4">
          <Link
            href="/events"
            className="bg-secondary-100 text-secondary-500 rounded-lg px-6 py-2 font-bold text-sm md:text-base"
          >
            精選
          </Link>
          <Link
            href="/events"
            className="bg-secondary-100 text-secondary-500 rounded-lg px-6 py-2 font-bold text-sm md:text-base"
          >
            線下活動
          </Link>
        </div>
        <h1 className="font-black text-3xl font-serif-tc md:text-5xl text-[#000] leading-tight">
          2025 心樂山林星光夜祭 · 初夏閃耀夢樂園
        </h1>
      </div>
      {/* 主內容與右側資訊欄雙欄排版 */}
      <div className="flex flex-col md:flex-row md:items-start w-full max-w-[1280px] mx-auto px-4 py-0 sm:py-10 mb-16 gap-8">
        {/* 左側主內容（flex-1） */}
        <div className="flex-1 flex flex-col gap-32">
          {/* 內容區塊 */}
          <section className="flex flex-col md:flex-row gap-8">
            {/* 左側主內容 */}
            <div className="flex flex-col items-start">
              <div className="hidden md:flex flex-col items-center gap-4">
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
              <p className="text-neutral-800 leading-relaxed mt-0 sm:mt-16">
                非集團同仁也可報名本年度心樂山林螢火蟲季初夏螢光遊樂園，開放喜愛大自然的您入園夜觀賞如同星空閃耀的流螢！還有美味餐食及滿滿親子活動：繪本故事屋、兒童手作、蟲舞燈光秀，一起和孩子度過難忘的螢火蟲時光吧✨
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="border border-neutral-500 rounded-full px-4 py-1 text-neutral-500 text-base sm:text-sm">
                  #螢火蟲
                </span>
                <span className="border border-neutral-500 rounded-full px-4 py-1 text-neutral-500 text-base sm:text-sm">
                  #生態導覽
                </span>
                <span className="border border-neutral-500 rounded-full px-4 py-1 text-neutral-500 text-base sm:text-sm">
                  #賞螢
                </span>
                <span className="border border-neutral-500 rounded-full px-4 py-1 text-neutral-500 text-base sm:text-sm">
                  #親子活動
                </span>
              </div>
              <Separator />
              {/* 活動資訊表格 */}
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <span className="inline-flex items-center gap-2 text-neutral-800 font-bold">
                  <Calendar className="w-5 h-5" />
                  活動時間
                </span>
                <span className="text-neutral-800">
                  2025.04.19 (六) 14:30 - 05.10 (六)20:30 (GMT+8)
                </span>
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm text-primary-700 font-bold cursor-pointer"
                >
                  <PlusIcon className="w-4 h-4" />
                  加入行事曆
                </button>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <span className="inline-flex items-center gap-2 text-neutral-800 font-bold">
                  <MapPin className="w-5 h-5" />
                  活動地點
                </span>
                <span className="text-neutral-800">{eventLocation}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <span className="inline-flex items-center gap-2 text-neutral-800 font-bold">
                  <LinkIcon className="w-5 h-5" />
                  相關連結
                </span>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-800 underline"
                >
                  心樂山螢火蟲保護園區粉絲專頁
                </a>
                {/* 手機版主辦單位資訊 */}
                <div className="w-full bg-neutral-800 rounded-lg p-8 flex gap-4 items-center md:hidden">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-lg text-white">心樂山螢火蟲保護園區</span>
                      <span className="text-sm text-[#E5E5E5]">Xinyue Firefly Reserve</span>
                    </div>
                    <div className="flex gap-10 mt-2">
                      <button
                        type="button"
                        className="text-white cursor-pointer"
                      >
                        <HeartIcon />
                      </button>
                      <button
                        type="button"
                        className="text-white cursor-pointer"
                      >
                        <Facebook />
                      </button>
                      <button
                        type="button"
                        className="text-white cursor-pointer"
                      >
                        <Mail />
                      </button>
                    </div>
                  </div>
                  <Image
                    src="/images/single_activity_avatar.png"
                    alt="主辦單位頭貼"
                    width={90}
                    height={90}
                    className="rounded-full w-full"
                  />
                </div>
              </div>
              <Separator />
              {/* 注意事項 */}
              <div className="bg-[#FFF7E1] rounded-[24px] p-6 flex flex-col gap-4 md:rounded-full md:flex-row md:items-center md:gap-8 md:px-8 md:py-6">
                <span className="inline-flex items-center gap-2 text-neutral-800 font-bold text-lg md:text-base">
                  <Cone className="w-5 h-5" />
                  線下活動
                </span>
                <div className="flex flex-col gap-2">
                  <span className="text-neutral-800">
                    報名完成後，活動當天抵達現場出示 Eventa 電子票券即可快速入場
                  </span>
                  <span className="text-neutral-500 text-sm">實際入場相關規定以活動主辦方為主</span>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-1 text-base text-primary-700 font-bold cursor-pointer mt-2 md:mt-0"
                >
                  <InfoIcon className="w-5 h-5" />
                  如何取票
                </button>
              </div>
            </div>
          </section>

          {/* 活動地圖區塊 */}
          <section className="flex sm:flex-row flex-col gap-0 sm:gap-8">
            <div className="hidden sm:flex flex-col items-start">
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
            <div className="flex items-end  justify-center gap-8 mb-6 sm:hidden">
              <span className="font-bold font-serif-tc text-3xl sm:text-2xl text-neutral-800">
                活動
              </span>
              <Image
                src="/images/balloon.png"
                alt="Ballon Yellow"
                width={32}
                height={32}
                className="mx-2"
              />
              <span className="font-bold font-serif-tc text-3xl sm:text-2xl text-neutral-800">
                地圖
              </span>
            </div>
            <div className="w-full max-w-[845px] rounded-[16px] overflow-hidden mt-0 sm:mt-16">
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
          <section className="flex flex-col md:flex-row gap-0 sm:gap-8">
            <div className="hidden sm:flex flex-col items-start">
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
            <div className="flex items-end  justify-center gap-8 mb-6 sm:hidden">
              <span className="font-bold font-serif-tc text-3xl sm:text-2xl text-neutral-800">
                活動
              </span>
              <Image
                src="/images/balloon.png"
                alt="Ballon Yellow"
                width={32}
                height={32}
                className="mx-2"
              />
              <span className="font-bold font-serif-tc text-3xl sm:text-2xl text-neutral-800">
                簡介
              </span>
            </div>
            <div className="flex flex-col gap-2 mt-0 sm:mt-16">
              <h2 className="font-bold text-lg text-neutral-800">
                2025 心樂山林親子螢火蟲季 ✧ 初夏星夜夢樂園
              </h2>
              <p className="text-base text-[#525252]">
                ❚ ❚ ❚ ❚ ❚ 單日賞螢門票開賣中 .ᐟ.ᐟ
                在星光閃爍的夏夜裡，和寶貝牽著手，一起走進被山林擁抱的心樂園歡迎喜愛大自然的您，一同漫步於山林間與萬點閃爍螢光共舞✨
                螢火蟲悄悄飛舞，點亮孩子的笑容，也照亮你的童年記憶我們準備了溫馨的親子繪本共讀、自然探索體驗，還有最夢幻的蟲舞燈✨
              </p>
              <h3 className="font-bold text-base text-neutral-800 mt-2">
                ✸ 初夏星夜夢樂園 — 主題活動日 ✸
              </h3>
              <ul className="list-none pl-6 text-base text-[#525252]">
                <li>
                  ⊛ 自然教育—繪本故事屋
                  渺小的亮亮，最後是否能像大大的月亮，讓其他動物注意到牠的與眾不同呢？一起來聽精彩的故事《亮亮想要當月亮》。
                </li>
                <li>⊛ 兒童手作—閃閃螢光翼 陪著寶貝一起動手做，把夏夜記憶變成閃閃發亮的火金姑！</li>
                <li>
                  ⊛ 活力搖擺—蟲舞燈光秀
                  閃亮亮集合囉！牽著小手，在星空下奔跑、發光，一起點亮屬於家的螢光派對🌙
                </li>
                <li>
                  ⊛ 達人帶路—夜觀賞流螢
                  當夜空輕輕蓋上山林，螢火蟲便點亮他們的魔法燈籠，引領大小朋友踏上奇幻旅程。跟著森林導師，一起解開螢光的奧祕咒語。途中還有機會遇見神出鬼沒的穿山甲、唱情歌的樹蛙與樹頂守夜的貓頭鷹，一場夏夜森林的奇幻派對，就等你加入！
                </li>
              </ul>
              <Image
                src="/images/single_activity_img.png"
                alt="Ballon Yellow"
                width={845}
                height={400}
                className="rounded-[16px] my-10"
              />
              <p className="text-base text-[#525252]">⌒⌒⌒⍋⍋⌒⌒⌒⍋⍋⌒⌒⌒⍋⍋⌒⌒⌒⍋⍋⌒⌒⌒​</p>
              <h3 className="font-bold text-base text-neutral-800 mt-2">
                ✸ 初夏螢光遊樂園 — 主題活動日 ✸
              </h3>
              <ul className="list-none pl-6 text-base text-[#525252]">
                <li>⊛ 地點：心樂山螢火蟲保護園區（苗栗縣大埔鄉興正路121巷8弄20號）</li>
                <li>⊛ 主題活動梯次&時程表：04/19 ㊅、04/26 ㊅、05/03 ㊅、05/10 ㊅</li>
                <li>⊛ 活動時間：下午 15:00 至晚間 20:20</li>
                <li>⊛ 入園時間：下午 14:30 後，不開放提前入園。</li>
              </ul>
            </div>
          </section>
        </div>
        {/* 右側主辦單位資訊 */}
        <aside className="w-full hidden md:flex md:w-[320px] flex-col gap-8">
          <div className="bg-neutral-800 rounded-lg p-6 flex flex-col gap-4 items-center">
            <div className="flex items-center gap-4">
              <Image
                src="/images/single_activity_avatar.png"
                alt="主辦單位頭貼"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="flex flex-col items-start">
                <span className="font-bold text-lg text-white">心樂山螢火蟲保護園區</span>
                <span className="text-sm text-[#E5E5E5]">Xinyue Firefly Reserve</span>
              </div>
            </div>

            <Button
              type="button"
              size="lg"
              className="w-full bg-[#FFD56B] text-neutral-800 text-base font-bold rounded-lg mt-2
                "
              onClick={handleCheckout}
            >
              立即報名
            </Button>
            <div className="flex gap-10 mt-2">
              <button
                type="button"
                className="text-white cursor-pointer"
              >
                <HeartIcon />
              </button>
              <button
                type="button"
                className="text-white cursor-pointer"
              >
                <Facebook />
              </button>
              <button
                type="button"
                className="text-white cursor-pointer"
              >
                <Mail />
              </button>
            </div>
          </div>
          {/* 活動熱度 */}
          <div className="hidden md:flex rounded-lg px-6 gap-4 items-center justify-between">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <EyeIcon className="w-5 h-5 text-neutral-500" />
                <span className="text-neutral-500 font-bold">1,473 人</span>
              </div>
              <span className="text-neutral-500">正在關注活動</span>
            </div>
            {/* 垂直分隔線 */}
            <div className="w-0.5 h-14 bg-neutral-400" />
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <HeartIcon className="w-5 h-5 text-neutral-500" />
                <span className="text-neutral-500 font-bold">66 人</span>
              </div>
              <span className="text-neutral-500">喜歡這場活動</span>
            </div>
          </div>
        </aside>
      </div>
      {/* 手機版底部固定報名 bar */}
      <div className="fixed bottom-0 left-0 w-full bg-transparent z-50 sm:hidden px-8 pb-8 pointer-events-none">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="bg-primary-500 hover:bg-[#FFCA28] transition-colors cursor-pointer rounded-[12px] h-12 flex items-center justify-center text-base font-bold shadow-lg text-neutral-800 pointer-events-auto w-[80%]"
            onClick={handleCheckout}
          >
            立即報名
          </button>
        </div>
      </div>
    </div>
  );
}
