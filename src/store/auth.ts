import { isAuthenticated, removeAuthToken, setAuthToken } from "@/services/auth";
import { TOKEN_KEY, isClient } from "@/services/authConstants";
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;
  login: (token: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  // 初始狀態為未認證，將通過 initAuth 進行異步初始化
  isAuthenticated: false,

  setAuthenticated: (v) => set({ isAuthenticated: v }),

  login: async (token: string) => {
    try {
      // 使用統一認證服務設置 token
      const success = await setAuthToken(token);
      set({ isAuthenticated: true });
      return success;
    } catch (error) {
      console.error("登入失敗:", error);
      set({ isAuthenticated: false });
      return false;
    }
  },

  logout: async () => {
    try {
      // 使用統一認證服務移除 token
      const success = await removeAuthToken();
      set({ isAuthenticated: false });
      return success;
    } catch (error) {
      console.error("登出失敗:", error);
      return false;
    }
  },

  // 異步初始化認證狀態
  initAuth: async () => {
    if (isClient) {
      try {
        const authStatus = await isAuthenticated();
        set({ isAuthenticated: authStatus });
      } catch (error) {
        console.error("初始化認證狀態失敗:", error);
        set({ isAuthenticated: false });
      }
    }
  },
}));

// 如果在客戶端環境，添加監聽器來同步多個標籤頁的驗證狀態
if (isClient) {
  // 立即初始化認證狀態
  useAuthStore.getState().initAuth();

  window.addEventListener("storage", (event) => {
    if (event.key === TOKEN_KEY) {
      useAuthStore.setState({
        isAuthenticated: !!event.newValue,
      });
    }
  });
}
