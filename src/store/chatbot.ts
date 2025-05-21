import { create } from "zustand";

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotState {
  isChatOpen: boolean;
  messages: ChatMessage[];
  setIsChatOpen: (open: boolean) => void;
  toggleChat: () => void;
  addMessage: (content: string, isUser: boolean) => void;
}

export const useChatbotStore = create<ChatbotState>((set) => ({
  isChatOpen: false,
  messages: [
    {
      id: "1",
      content: "哈囉！有什麼我可以協助您呢？",
      isUser: false,
      timestamp: new Date(),
    },
  ],
  setIsChatOpen: (open) => set({ isChatOpen: open }),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  addMessage: (content, isUser) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now().toString(),
          content,
          isUser,
          timestamp: new Date(),
        },
      ],
    })),
}));
