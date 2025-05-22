"use client";

import { useChatbotStore } from "@/store/chatbot";

export default function HelpButton() {
  const toggleChat = useChatbotStore((s) => s.toggleChat);

  return (
    <button
      type="button"
      onClick={toggleChat}
      className="w-full bg-primary-500 hover:saturate-150 duration-200 active:scale-95 text-neutral-800 font-bold py-2 rounded-xl cursor-pointer"
    >
      詢問小幫手
    </button>
  );
}
