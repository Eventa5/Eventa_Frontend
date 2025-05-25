"use client";

import { EventCard, EventCarousel } from "@/components/ui/event-cards";
import HotEventsSection from "@/components/ui/hot-events-section";
import SearchContainer from "@/features/search/components/search-container";
import { useSearchStore } from "@/store/search";
import Image from "next/image";
import Link from "next/link";

const hotEvents = [
  {
    id: "1",
    title: "玩樂本就是人之天性，這樣辦活動真好玩！",
    location: "高雄市",
    date: "2025.04.01 (二) 14:00 - 17:00",
    imageUrl: "/images/hot-event1.jpg",
  },
  {
    id: "2",
    title: "文化漫遊：探訪古蹟與美食的奇幻旅程",
    location: "台北市",
    date: "2025.05.05 (一) 10:00 - 12:00",
    imageUrl: "/images/hot-event2.jpg",
  },
  {
    id: "3",
    title: "音樂之夜：搖滾與流行交織的狂歡",
    location: "台中市",
    date: "2025.06.15 (日) 16:00 - 19:00",
    imageUrl: "/images/hot-event3.jpg",
  },
  {
    id: "4",
    title: "星空下的浪漫：露營與燒烤的夏日派對",
    location: "新竹縣",
    date: "2025.07.20 (日) 18:00 - 21:00",
    imageUrl: "/images/hot-event4.jpg",
  },
  {
    id: "5",
    title: "戶外運動嘉年華：挑戰極限體能賽",
    location: "桃園市",
    date: "2025.08.30 (六) 09:00 - 12:00",
    imageUrl: "/images/hot-event5.jpg",
  },
  {
    id: "6",
    title: "藝術市集：創意手作與在地文創展覽",
    location: "台南市",
    date: "2025.09.10 (三) 13:00 - 15:00",
    imageUrl: "/images/hot-event6.jpg",
  },
];

const newEvents = [
  {
    id: "n1",
    title: "風格時尚：夏日之最秀",
    location: "台北市",
    date: "2025.05.20 (二) 19:00 - 21:30",
    imageUrl: "/images/carousel-image1.jpg",
  },
  {
    id: "n2",
    title: "創意工作坊：當代藝術解析",
    location: "高雄市",
    date: "2025.06.05 (四) 14:00 - 16:00",
    imageUrl: "/images/carousel-image2.jpg",
  },
  {
    id: "n3",
    title: "電影放映會：奧斯卡精選",
    location: "台南市",
    date: "2025.05.25 (日) 13:30 - 17:00",
    imageUrl: "/images/carousel-image3.jpg",
  },
  {
    id: "n4",
    title: "美食饗宴：世界小吃巡禮",
    location: "台中市",
    date: "2025.07.12 (六) 11:00 - 15:00",
    imageUrl: "/images/carousel-image4.jpg",
  },
  {
    id: "n5",
    title: "健康生活工作坊：身心平衡之道",
    location: "新北市",
    date: "2025.08.18 (日) 09:30 - 12:30",
    imageUrl: "/images/carousel-image5.jpg",
  },
];

const otherEvents = [
  {
    id: "o1",
    title: "大自然的味道 金柑草莓蛋糕裝飾課",
    location: "台北市",
    date: "2025.04.10 (四) 14:00 - 16:00",
    imageUrl: "/images/other-event1.jpg",
  },
  {
    id: "o2",
    title: "歡樂島音樂大冒險：烏克麗麗 × 手風琴 × 小小DJ",
    location: "台北市",
    date: "2025.04.05 (六) 13:00 - 2025.04.06 (日) 17:00",
    imageUrl: "/images/other-event2.jpg",
  },
  {
    id: "o3",
    title: "型動美學 | 街頭時尚攝影展覽",
    location: "新北市",
    date: "2025.04.05 (六) 13:00 - 2025.04.06 (日) 17:00",
    imageUrl: "/images/other-event3.jpg",
  },
  {
    id: "o4",
    title: "春嚐製和菓．品茶會",
    location: "桃園市",
    date: "2025.03.29 (六) 14:00 - 2025.04.12 (六) 16:00",
    imageUrl: "/images/other-event4.jpg",
  },
  {
    id: "o5",
    title: "復古黑膠派對之夜",
    location: "台北市",
    date: "2025.05.10 (六) 20:00 - 23:30",
    imageUrl: "/images/other-event5.jpg",
  },
  {
    id: "o6",
    title: "春季野餐派對 Aroma Spring Party",
    location: "台中市",
    date: "2025.04.12 (六) 16:00 - 18:00",
    imageUrl: "/images/other-event6.jpg",
  },
  {
    id: "o7",
    title: "未來藝術家｜跨界表演藝術節",
    location: "新北市",
    date: "2025.05.10 (六) 18:00 - 21:00",
    imageUrl: "/images/other-event7.jpg",
  },
  {
    id: "o8",
    title: "魯凱神話藝術村 青葉部落小旅行",
    location: "屏東縣",
    date: "2025.06.02 (六) 09:00 - 2025.06.06 (日) 17:00",
    imageUrl: "/images/other-event8.jpg",
  },
];

export default function EventsPage() {
  const searchValue = useSearchStore((s) => s.searchValue);
  const filteredEvents = searchValue
    ? otherEvents.filter(
        (event) => event.title.includes(searchValue) || event.location.includes(searchValue)
      )
    : otherEvents;

  return (
    <main className="flex flex-col w-full min-h-screen bg-primary-50">
      {/* 搜尋容器 */}
      <section className="flex justify-center">
        <div className="w-full max-w-[1280px] px-8 py-10">
          <SearchContainer />
        </div>
      </section>
      {/* 其他活動（搜尋時搬到最上面） */}
      {searchValue && (
        <section className="py-20 md:py-32 px-4 md:px-8">
          <div className="flex flex-col items-center">
            {filteredEvents.length > 0 ? (
              <>
                <div className="flex flex-col items-center mb-12">
                  <div className="flex items-end gap-6 mb-6 font-serif-tc">
                    <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">搜尋</h2>
                    <Image
                      src="/images/balloon-red.png"
                      width={50}
                      height={100}
                      className="w-6 h-12 md:w-10 md:h-20"
                      alt="氣球"
                    />
                    <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">結果</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[repeat(2,_302px)] lg:grid-cols-[repeat(3,_302px)] 2xl:grid-cols-[repeat(4,_302px)] gap-6 justify-items-center mx-auto">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      {...event}
                      size="sm"
                    />
                  ))}
                </div>
                <div className="mt-12 flex justify-center">
                  <Link
                    href="/events"
                    className="px-8 py-3 border border-[#525252] rounded-xl text-[#525252] hover:bg-[#F5F5F5] transition-colors"
                  >
                    查看更多
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-gray-400 text-xl py-24">目前沒有相符的搜尋結果</div>
            )}
          </div>
        </section>
      )}
      {/* 最新強檔（搜尋時隱藏） */}
      {!searchValue && (
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
      )}
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
          <HotEventsSection events={hotEvents} />
        </div>
      </section>
      {/* 其他活動（搜尋時以外才顯示） */}
      {!searchValue && (
        <section className="py-20 md:py-32 px-4 md:px-8">
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center mb-12">
              <div className="flex items-end gap-6 mb-6 font-serif-tc">
                <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">其他</h2>
                <Image
                  src="/images/balloon-red.png"
                  width={50}
                  height={100}
                  className="w-6 h-12 md:w-10 md:h-20"
                  alt="氣球"
                />
                <h2 className="text-[24px] md:text-[48px] font-bold text-[#262626]">活動</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[repeat(2,_302px)] lg:grid-cols-[repeat(3,_302px)] 2xl:grid-cols-[repeat(4,_302px)] gap-6 justify-items-center mx-auto">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  {...event}
                  size="sm"
                />
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <Link
                href="/events"
                className="px-8 py-3 border border-[#525252] rounded-xl text-[#525252] hover:bg-[#F5F5F5] transition-colors"
              >
                查看更多
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
