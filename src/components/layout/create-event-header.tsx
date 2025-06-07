"use client";
import { CircleChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
// 路由匹配表
const headerMap = [
  {
    match: /^\/create-event\/organizer$/,
    step: "步驟一：活動資訊",
    title: "活動資訊",
    subtitle: "選擇主辦單位",
  },
  {
    match: /^\/create-event\/[^/]+\/eventplacetype$/,
    step: "步驟一：活動資訊",
    title: "活動資訊",
    subtitle: "活動形式",
  },
  {
    match: /^\/create-event\/[^/]+\/category$/,
    step: "步驟一：活動資訊",
    title: "活動資訊",
    subtitle: "活動主題",
  },
  {
    match: /^\/create-event\/[^/]+\/basicinfo$/,
    step: "步驟一：活動資訊",
    title: "活動資訊",
    subtitle: "活動基本資訊",
  },
  {
    match: /^\/create-event\/[^/]+\/intro$/,
    step: "步驟一：活動資訊",
    title: "活動資訊",
    subtitle: "活動內容",
  },
  {
    match: /^\/create-event\/[^/]+\/tickets\/setting$/,
    step: "步驟二：票券設定",
    title: "票券設定",
    subtitle: "票券設定",
  },
  {
    match: /^\/create-event\/[^/]+\/tickets\/advanced$/,
    step: "步驟二：票券設定",
    title: "票券設定",
    subtitle: "進階設定",
  },
  {
    match: /^\/create-event\/[^/]+\/progress$/,
    step: "活動進度",
    title: "活動進度",
    subtitle: "",
  },
];

function getHeader(path: string) {
  for (const h of headerMap) {
    if (h.match.test(path)) return h;
  }
  return { step: "", title: "", subtitle: "" };
}

const CreateEventHeader = () => {
  const pathname = usePathname();
  const { step, subtitle } = getHeader(pathname);

  // 檢查是否為步驟二，並從路徑中提取 eventId
  const isStepTwo = step.includes("步驟二");
  const eventId = pathname.split("/")[2]; // 從 /create-event/[eventId]/... 中提取 eventId

  const backLink = isStepTwo ? `/create-event/${eventId}/progress` : "/";
  const backText = isStepTwo ? "返回活動編輯選單" : "返回首頁";

  return (
    <div className="bg-primary-500 text-neutral-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <Image
          src="/eventa-logo-white.svg"
          alt="Eventa Logo Balloon and Ticket"
          width={80}
          height={80}
          className="w-7 h-7 mr-2 invert hidden md:block"
        />
        {step && <span className="font-bold text-lg">{step}</span>}
        {subtitle && <span className="text-base">（{subtitle}）</span>}
      </div>
      <Link
        href={backLink}
        className="text-neutral-800 hover:opacity-80 flex items-center gap-1 hover:text-primary-700 duration-100"
      >
        <CircleChevronLeft className="inline mr-1 w-6 h-6 md:w-[18px] md:h-[18px]" />
        <span className="hidden md:block">{backText}</span>
      </Link>
    </div>
  );
};

export default CreateEventHeader;
