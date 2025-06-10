"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useChatbotStore } from "@/store/chatbot";
import { BotMessageSquare, Send, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Chatbot() {
  const isChatOpen = useChatbotStore((s) => s.isChatOpen);
  const toggleChat = useChatbotStore((s) => s.toggleChat);
  const messages = useChatbotStore((s) => s.messages);
  const addMessage = useChatbotStore((s) => s.addMessage);
  const isMobile = useIsMobile();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // 自動滾動到最新消息
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 送出訊息
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();

    // 添加用戶訊息
    addMessage(userMessage, true);

    // 清空輸入框
    setMessage("");

    // 顯示打字指示器
    setIsTyping(true);

    setTimeout(() => {
      // 添加機器人回應
      addMessage("謝謝您的訊息！我們將盡快回覆您。", false);

      // 關閉打字指示器
      setIsTyping(false);
    }, 800);
  };

  // 渲染聊天按鈕
  const renderChatButton = () => (
    <Button
      onClick={toggleChat}
      className="w-12 h-12 md:w-16 md:h-16 bg-[#FFD56B] rounded-full flex items-center justify-center shadow-lg hover:bg-[#FFCA28] transition-colors cursor-pointer"
      aria-label="開啟聊天機器人"
    >
      {isChatOpen ? (
        <X
          className="!w-6 !h-6 md:!w-8 md:!h-8"
          strokeWidth={2}
        />
      ) : (
        <BotMessageSquare
          className="!w-6 !h-6 md:!w-8 md:!h-8"
          strokeWidth={1.5}
        />
      )}
    </Button>
  );

  // 渲染手機版全屏對話視窗
  const renderMobileChat = () => {
    if (!isChatOpen || !isMobile) return null;

    return (
      <div className="fixed top-0 inset-0 bg-white z-50 flex flex-col">
        {/* 頂部導航 */}
        <div className="w-full px-4 py-2 h-[56px] flex justify-between items-center relative">
          <Button
            variant="ghost"
            onClick={toggleChat}
            className="p-2 flex items-center cursor-pointer"
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="rounded-full bg-white p-7 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-10">
            <Image
              src="/eventa-logo.svg"
              alt="Eventa Logo"
              width={56}
              height={56}
            />
          </div>
          <div className="w-8" /> {/* 為了平衡布局 */}
        </div>

        {/* 聊天窗口標題 */}
        <div className="flex items-center bg-[#262626] text-white py-4 px-4">
          <h2 className="font-bold">Eventa 小幫手</h2>
        </div>

        {/* 聊天內容 */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          {messages.map((msg) =>
            msg.isUser ? (
              // 用戶訊息
              <div
                key={msg.id}
                className="flex justify-end mb-4"
              >
                <div className="bg-[#FFE6A6] rounded-lg px-4 py-2 max-w-[80%]">
                  <p>{msg.content}</p>
                </div>
              </div>
            ) : (
              // 機器人訊息
              <div
                key={msg.id}
                className="flex items-start mb-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#FFD56B] flex items-center justify-center mr-2 mt-2">
                  <BotMessageSquare
                    className="w-5 h-5"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex flex-col max-w-[80%]">
                  <span className="text-xs text-gray-400">Eventa</span>
                  <div className="bg-[#E5E5E5] rounded-lg px-4 py-2 mt-1">
                    <p>{msg.content}</p>
                  </div>
                </div>
              </div>
            )
          )}

          {/* 打字指示器 */}
          {isTyping && (
            <div className="flex items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FFD56B] flex items-center justify-center mr-2 mt-2">
                <BotMessageSquare
                  className="w-5 h-5"
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex flex-col max-w-[80%]">
                <span className="text-xs text-gray-400">Eventa</span>
                <div className="bg-[#E5E5E5] rounded-lg px-4 py-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messageEndRef} />
        </div>

        {/* 輸入框 */}
        <div className="border-t border-gray-200 p-4">
          <form
            onSubmit={handleSubmit}
            className="flex items-center"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="輸入您的訊息..."
              className="flex-1 outline-none text-gray-600 text-sm"
            />
            <Button
              type="submit"
              className="p-2 bg-[#FFD56B] rounded-full ml-2 cursor-pointer"
              disabled={!message.trim()}
            >
              <Send
                className="w-5 h-5"
                strokeWidth={2}
              />
            </Button>
          </form>
        </div>
      </div>
    );
  };

  // 渲染桌面版小視窗
  const renderDesktopChat = () => {
    if (!isChatOpen || isMobile) return null;

    return (
      <div className="fixed bottom-26 right-8 z-50 w-[411px] h-[344px] bg-white rounded-[20px] shadow-md overflow-hidden flex flex-col">
        {/* 聊天窗口標題 */}
        <div className="flex items-center bg-[#262626] text-white py-2 px-6">
          <h2 className="font-bold">Eventa 小幫手</h2>
        </div>

        {/* 聊天內容 */}
        <div className="flex-1 flex flex-col p-6 h-[400px] overflow-y-auto">
          {messages.map((msg) =>
            msg.isUser ? (
              // 用戶訊息
              <div
                key={msg.id}
                className="flex justify-end mb-4"
              >
                <div className="bg-[#FFE6A6] rounded-lg px-4 py-2 max-w-[80%]">
                  <p>{msg.content}</p>
                </div>
              </div>
            ) : (
              // 機器人訊息
              <div
                key={msg.id}
                className="flex items-start mb-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#FFD56B] flex items-center justify-center mr-2 mt-2">
                  <BotMessageSquare
                    className="w-5 h-5"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex flex-col max-w-[80%]">
                  <span className="text-xs text-gray-400">Eventa</span>
                  <div className="bg-[#E5E5E5] rounded-lg px-4 py-2 mt-1">
                    <p>{msg.content}</p>
                  </div>
                </div>
              </div>
            )
          )}

          {/* 打字指示器 */}
          {isTyping && (
            <div className="flex items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FFD56B] flex items-center justify-center mr-2 mt-2">
                <BotMessageSquare
                  className="w-5 h-5"
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex flex-col max-w-[80%]">
                <span className="text-xs text-gray-400">Eventa</span>
                <div className="bg-[#E5E5E5] rounded-lg px-4 py-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messageEndRef} />
        </div>

        {/* 輸入框 */}
        <div className="border-t border-gray-200 p-4">
          <form
            onSubmit={handleSubmit}
            className="flex items-center"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="輸入您的訊息..."
              className="flex-1 outline-none text-gray-600 text-sm"
            />
            <Button
              type="submit"
              className="p-2 bg-[#FFD56B] rounded-full ml-2 cursor-pointer"
            >
              <Send
                className="w-5 h-5"
                strokeWidth={2}
              />
            </Button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-8 right-8 z-[999]">
      {renderChatButton()}
      {renderMobileChat()}
      {renderDesktopChat()}
    </div>
  );
}
