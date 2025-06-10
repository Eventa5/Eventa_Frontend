import CategorySwiper from "@/components/ui/category-swiper";
import { EventCard, EventCarousel, ServiceCard } from "@/components/ui/event-cards";
import HotEventsSection from "@/components/ui/hot-events-section";
import Link from "next/link";
import "@/styles/pages/home.css";
import CategoriesProvider from "@/features/activities/categories-provider";
import OtherEventsSection from "@/features/activities/components/other-events-section";
import { formatEventDate } from "@/features/activities/formatEventDate";
import ChatButton from "@/features/chatbot/components/chat-button";
import SearchContainer from "@/features/search/components/search-container";
import Image from "next/image";

const newEvents = [
  {
    id: "n1",
    title: "風格時尚：夏日之最秀",
    location: "台北市",
    date: {
      isSameDay: false,
      startDateString: "2025.05.01 (一)",
      timeString: "10:00 - 12:00",
      endDateString: "2025.05.15 (一)",
    },
    imageUrl: "/images/carousel-image1.jpg",
  },
  {
    id: "n2",
    title: "創意工作坊：當代藝術解析",
    location: "高雄市",
    date: {
      isSameDay: false,
      startDateString: "2025.06.05 (四)",
      timeString: "14:00 - 16:00",
      endDateString: "2025.06.05 (四)",
    },
    imageUrl: "/images/carousel-image2.jpg",
  },
  {
    id: "n3",
    title: "電影放映會：奧斯卡精選",
    location: "台南市",
    date: {
      isSameDay: false,
      startDateString: "2025.05.25 (日)",
      timeString: "13:30 - 17:00",
      endDateString: "2025.05.25 (日)",
    },
    imageUrl: "/images/carousel-image3.jpg",
  },
  {
    id: "n4",
    title: "美食饗宴：世界小吃巡禮",
    location: "台中市",
    date: {
      isSameDay: false,
      startDateString: "2025.07.12 (六)",
      timeString: "11:00 - 15:00",
      endDateString: "2025.07.12 (六)",
    },
    imageUrl: "/images/carousel-image4.jpg",
  },
  {
    id: "n5",
    title: "健康生活工作坊：身心平衡之道",
    location: "新北市",
    date: {
      isSameDay: false,
      startDateString: "2025.08.18 (日)",
      timeString: "09:30 - 12:30",
      endDateString: "2025.08.18 (日)",
    },
    imageUrl: "/images/carousel-image5.jpg",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col w-full min-h-screen bg-[#FDFBF5] pt-10 -mt-10">
      <CategoriesProvider>
        {/* 首頁橫幅 */}
        <section className="relative w-full px-4 md:px-8  flex items-center justify-center overflow-x-clip">
          <div className="max-w-[1680px] w-full h-[638px] lg:h-[840px]  flex items-center justify-center z-10 bg-banner rounded-[40px]">
            <div className="w-full px-8 md:w-[400px] md:px-0 lg:w-[532px] flex flex-col items-center justify-center  gap-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif-tc font-bold tracking-wide text-center text-[#262626] leading-tight">
                AI 精準推薦
                <br />
                活動票券一手掌握
              </h1>
              <p className="text-lg text-center text-[#525252] max-w-2xl">
                無論何時何地，輕鬆找到最佳選擇，讓每場活動都值得期待
              </p>
              <ChatButton />
              {/* 搜尋容器 */}
              <div className="w-full">
                <SearchContainer />
              </div>
            </div>
          </div>
        </section>
        {/* 最新強檔 */}
        <section className="py-20 md:py-32 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center mb-3 md:mb-8">
              <div className="flex items-center gap-6 mb-6 font-serif-tc">
                <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">最新強檔</h2>
                <Image
                  src="/images/balloon.png"
                  width={50}
                  height={100}
                  className="w-6 h-12 md:w-10 md:h-20"
                  alt="氣球"
                />
                <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">話題不斷</h2>
              </div>
              <p className="text-[14px] md:text-[18px] text-[#525252] text-center max-w-3xl">
                不只是活動，更是讓生活亮起來的機會，錯過這波話題活動，就真的只能看別人打卡了！
              </p>
            </div>

            <EventCarousel events={newEvents} />
          </div>
        </section>
        {/* 熱門活動 */}
        <section className="pt-[116px] pb-[116px] md:pt-[200px] md:pb-[173px] px-4 md:px-8 bg-hot-activity">
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
        {/* 活動分類 */}
        <section className="py-20 md:py-32 px-4 md:px-8">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center mb-8 md:mb-[64px]">
              <div className="flex items-end gap-6 font-serif-tc">
                <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">活動</h2>
                <Image
                  src="/images/balloon.png"
                  width={50}
                  height={100}
                  className="w-6 h-12 md:w-10 md:h-20"
                  alt="氣球"
                />
                <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">分類</h2>
              </div>
            </div>

            <div className="w-full flex justify-center">
              <CategorySwiper />
            </div>
          </div>
        </section>
      </CategoriesProvider>
      {/* 服務介紹 */}
      <section className="py-20 md:py-32 px-4 md:px-8 bg-service">
        <div className="flex flex-col  items-center md:flex-row md:justify-center gap-6">
          <ServiceCard
            title={
              <p>
                不確定週末去哪？
                <br /> 讓 AI 幫你選！
              </p>
            }
            description={[
              "根據興趣、參加紀錄與熱門趨勢",
              "AI 每天推薦最適合你的活動",
              "從手作課、音樂節到講座論壇，一鍵探索靈感生活！",
            ]}
            imageUrl="/images/service-image1.jpg"
            imageAlt="AI推薦活動"
            buttonText="開啟專屬你的活動清單"
            linkUrl="/events"
          />

          <ServiceCard
            title={
              <p>
                參加喜歡的活動
                <br />
                也能舉辦你喜歡的樣子
              </p>
            }
            description={[
              "從 10 人沙龍到千人講座，一站式搞定！",
              "完整工具幫你搞定票種設定、金流處理、參加者管理",
              "想辦活動用 Eventa 就對了",
            ]}
            imageUrl="/images/service-image2.jpg"
            imageAlt="舉辦活動"
            buttonText="建立你的第 1 場活動"
            linkUrl="/create-event/organizer"
          />
        </div>
      </section>
      <OtherEventsSection />
    </main>
  );
}
