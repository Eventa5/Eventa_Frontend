"use client";

import { useChatbotStore } from "@/store/chatbot";

export default function ChatButton() {
  const toggleChat = useChatbotStore((s) => s.toggleChat);

  return (
    <button
      type="button"
      onClick={toggleChat}
      className="px-8 py-3 rounded-xl font-bold w-full text-[#262626] cursor-pointer bg-primary-500 hover:saturate-150 duration-200 active:scale-95"
    >
      開始對話
    </button>
  );
}
