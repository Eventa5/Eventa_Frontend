import { create } from "zustand";

interface DialogState {
  loginDialogOpen: boolean;
  setLoginDialogOpen: (open: boolean) => void;
  loginTab: "signin" | "signup" | "forgot" | "reset";
  setLoginTab: (tab: "signin" | "signup" | "forgot" | "reset") => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  loginDialogOpen: false,
  setLoginDialogOpen: (open) => set({ loginDialogOpen: open }),
  loginTab: "signin",
  setLoginTab: (tab) => set({ loginTab: tab }),
}));
