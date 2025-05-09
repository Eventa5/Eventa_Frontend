import { getToken, removeToken as removeTokenUtil, setToken as setTokenUtil } from "@/lib/auth";
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!getToken(),
  setAuthenticated: (v) => set({ isAuthenticated: v }),
  login: (token: string) => {
    setTokenUtil(token);
    set({ isAuthenticated: true });
  },
  logout: () => {
    removeTokenUtil();
    set({ isAuthenticated: false });
  },
}));
