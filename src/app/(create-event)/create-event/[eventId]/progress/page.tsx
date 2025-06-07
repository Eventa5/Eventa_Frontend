"use client";

import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { StepTag } from "@/components/ui/step-tag";
import {
  canAccessStep,
  getCurrentStep,
  getNextIncompleteStep,
  useCreateEventStore,
} from "@/store/create-event";
import { CircleCheck } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

export default function ProgressPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;
  const isHydrated = useHydration();

  const {
    completionStatus,
    getOverallProgress,
    getStepOneProgress,
    getStepTwoProgress,
    setCurrentEventId,
  } = useCreateEventStore();

  useEffect(() => {
    if (getCurrentStep() === "eventplacetype") {
      router.push("/create-event/organizer");
    }
  }, [router]);

  // 設置當前編輯的活動ID
  useEffect(() => {
    if (eventId) {
      setCurrentEventId(Number.parseInt(eventId));
    }
  }, [eventId, setCurrentEventId]);

  const overallProgress = isHydrated ? getOverallProgress() : 0;
  const stepOneCompleted = isHydrated ? getStepOneProgress() : false;
  const stepTwoCompleted = isHydrated ? getStepTwoProgress() : false;

  const stepOneItems = [
    {
      name: "活動形式",
      completed: isHydrated ? completionStatus.eventplacetype : false,
      path: "eventplacetype",
    },
    {
      name: "活動主題",
      completed: isHydrated ? completionStatus.category : false,
      path: "category",
    },
    {
      name: "活動基本資訊",
      completed: isHydrated ? completionStatus.basicinfo : false,
      path: "basicinfo",
    },
    {
      name: "活動內容",
      completed: isHydrated ? completionStatus.intro : false,
      path: "intro",
    },
  ];

  const stepTwoItems = [
    {
      name: "票券設定",
      completed: isHydrated ? completionStatus.ticketsSetting : false,
      path: "tickets/setting",
    },
  ];

  // 處理步驟標籤點擊
  const handleStepClick = (path: string) => {
    if (canAccessStep(path)) {
      router.push(`/create-event/${eventId}/${path}`);
    }
  };

  const handleContinueEdit = () => {
    const nextStep = getNextIncompleteStep(Number.parseInt(eventId));
    router.push(nextStep);
  };

  return (
    <div className="w-full h-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-4 mb-4">
          <Image
            src="/images/service-image1.jpg"
            alt="logo"
            width={128}
            height={128}
          />
          <div className="text-left">
            <h2 className="text-2xl font-bold text-[#262626] mb-1">
              {overallProgress === 100 ? "太棒了！" : "加油！"}
            </h2>
            <p className="text-gray-600">
              {overallProgress === 100
                ? "您已完成所有設定，可以發佈活動了"
                : "還差一點就可以發佈活動了"}
            </p>
          </div>
        </div>
      </div>

      {/* 主要內容區域 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        {/* 步驟一：活動資訊 */}
        <div className="mb-8 relative pr-[100px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base md:text-xl font-medium text-[#262626] flex items-center gap-2">
              步驟一：活動資訊
              {stepOneCompleted && (
                <span className="text-green-500 text-sm flex items-center">
                  <CircleCheck className="w-6 h-6" />
                </span>
              )}
            </h3>
          </div>

          {/* 活動資訊標籤 */}
          <div className="flex items-center flex-wrap gap-y-3">
            {stepOneItems.map((item, index) => (
              <StepTag
                key={item.name}
                completed={item.completed}
                clickable={canAccessStep(item.path)}
                onClick={() => handleStepClick(item.path)}
              >
                {item.name}
              </StepTag>
            ))}
          </div>

          <CircularProgress
            className="absolute right-0 top-5"
            percentage={overallProgress}
            size={90}
            strokeWidth={6}
          />
        </div>

        {/* 步驟二：票券設定 */}
        <div className="mb-8">
          <h3 className="text-base md:text-xl font-medium text-[#262626] mb-6 flex items-center gap-2">
            步驟二：票券設定
            {stepTwoCompleted && (
              <span className="text-green-500 text-sm flex items-center">
                <CircleCheck className="w-6 h-6" />
              </span>
            )}
          </h3>
          <div className="flex items-center -space-x-2">
            {stepTwoItems.map((item, index) => (
              <StepTag
                key={item.name}
                completed={item.completed}
                clickable={canAccessStep(item.path)}
                onClick={() => handleStepClick(item.path)}
              >
                {item.name}
              </StepTag>
            ))}
          </div>
        </div>

        {/* 繼續編輯按鈕 */}
        <div className="flex justify-between border-t border-gray-200 pt-6">
          <Button
            onClick={handleContinueEdit}
            className="bg-[#FFD56B] hover:bg-[#FFCA28] text-[#262626] rounded-lg w-[120px] md:w-[160px] py-2 md:py-4 text-base font-normal transition-colors cursor-pointer h-auto"
          >
            {overallProgress === 100 ? "發佈活動" : "繼續編輯"}
          </Button>
        </div>
      </div>
    </div>
  );
}
