import { EventCard } from "@/components/ui/event-cards";
import Link from "next/link";

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
  return (
    <main className="w-full max-w-[1280px] mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-[repeat(2,_302px)] lg:grid-cols-[repeat(3,_302px)] 2xl:grid-cols-[repeat(4,_302px)] gap-6 justify-items-center mx-auto">
        {otherEvents.map((event) => (
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
    </main>
  );
}
