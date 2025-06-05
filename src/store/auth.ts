import { getApiV1UsersProfile } from "@/services/api/client/sdk.gen";
import type { UserResponse } from "@/services/api/client/types.gen";
import { isAuthenticated, removeAuthToken, setAuthToken } from "@/services/auth";
import { TOKEN_KEY, isClient } from "@/services/authConstants";
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  userProfile: UserResponse | null;
  setAuthenticated: (v: boolean) => void;
  setUserProfile: (profile: UserResponse | null) => void;
  login: (token: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  initAuth: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  // 初始狀態為未認證，將通過 initAuth 進行異步初始化
  isAuthenticated: false,
  userProfile: null,

  setAuthenticated: (v) => set({ isAuthenticated: v }),
  setUserProfile: (profile) => set({ userProfile: profile }),

  login: async (token: string) => {
    try {
      // 使用統一認證服務設置 token
      const success = await setAuthToken(token);
      if (success) {
        set({ isAuthenticated: true });
        // 登入成功後立即獲取使用者資料
        const response = await getApiV1UsersProfile();
        if (response.data?.data) {
          set({ userProfile: response.data.data });
        }
      }
      return success;
    } catch (error) {
      console.error("登入失敗:", error);
      set({ isAuthenticated: false, userProfile: null });
      return false;
    }
  },

  logout: async () => {
    try {
      // 使用統一認證服務移除 token
      const success = await removeAuthToken();
      set({ isAuthenticated: false, userProfile: null });
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
        // 如果已認證，獲取使用者資料
        if (authStatus) {
          const response = await getApiV1UsersProfile();
          if (response.data?.data) {
            set({ userProfile: response.data.data });
          }
        }
      } catch (error) {
        console.error("初始化認證狀態失敗:", error);
        set({ isAuthenticated: false, userProfile: null });
      }
    }
  },

  // 獲取使用者資料的方法
  fetchUserProfile: async () => {
    try {
      const response = await getApiV1UsersProfile();
      if (response.data?.data) {
        set({ userProfile: response.data.data });
      }
    } catch (error) {
      console.error("獲取使用者資料失敗:", error);
      set({ userProfile: null });
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
        userProfile: null, // 清除使用者資料
      });
      // 如果有 token，重新獲取使用者資料
      if (event.newValue) {
        useAuthStore.getState().fetchUserProfile();
      }
    }
  });
}
