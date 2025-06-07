import { create } from "zustand";

interface DialogState {
  // 登入相關
  loginDialogOpen: boolean;
  setLoginDialogOpen: (open: boolean) => void;
  loginTab: "signin" | "signup" | "forgot" | "reset";
  setLoginTab: (tab: "signin" | "signup" | "forgot" | "reset") => void;

  // 錯誤提示相關
  errorDialogOpen: boolean;
  errorMessage: string;
  showError: (message: string) => void;
  hideError: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  // 登入相關
  loginDialogOpen: false,
  setLoginDialogOpen: (open) => set({ loginDialogOpen: open }),
  loginTab: "signin",
  setLoginTab: (tab) => set({ loginTab: tab }),

  // 錯誤提示相關
  errorDialogOpen: false,
  errorMessage: "",
  showError: (message) => set({ errorDialogOpen: true, errorMessage: message }),
  hideError: () => set({ errorDialogOpen: false, errorMessage: "" }),
}));
