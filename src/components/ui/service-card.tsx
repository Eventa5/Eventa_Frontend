import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";

// 服務卡片
interface ServiceCardProps {
  title: JSX.Element;
  description: string[];
  imageUrl: string;
  imageAlt: string;
  buttonText: string;
  linkUrl: string;
}

export const ServiceCard = ({
  title,
  description,
  imageUrl,
  imageAlt,
  buttonText,
  linkUrl,
}: ServiceCardProps) => {
  return (
    <div className="flex flex-col-reverse items-center justify-start  2xl:flex-row bg-white rounded-[30px] rounded-tl-[160px] overflow-hidden shadow-md px-8 md:px-[45px] w-[343px] h-[405px]  2xl:w-auto  2xl:h-[374px]">
      <div className="pr-4 relative shrink-0 flex items-center justify-center w-[144px] h-[144px]  2xl:w-[200px]  2xl:h-[200px]">
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={200}
          height={200}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col shrink-0  2xl:w-[322px]">
        <div className="space-y-4 flex flex-col items-center  2xl:items-start w-[276px]  2xl:w-full">
          <h3 className="font-bold text-center whitespace-nowrap  2xl:text-start text-[24px]  2xl:text-[30px] text-black leading-tight font-serif-tc">
            {title}
          </h3>
          <div className="text-center  2xl:text-start">
            {description.map((item, i) => (
              <p
                key={`desc-${item}`}
                className="text-[#2E2E2E] text-[12px]  2xl:text-[14px] whitespace-nowrap"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
        <Link
          href={linkUrl}
          className="mt-6 inline-flex items-center gap-2 bg-[#F07348] text-white px-6 py-3 rounded-xl font-bold  2xl:self-start"
        >
          <span className="ml-2">→</span>
          {buttonText}
        </Link>
      </div>
    </div>
  );
};
