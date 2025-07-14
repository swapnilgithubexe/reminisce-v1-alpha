import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme-preference") || "forest",
  setTheme: (theme) => {
    localStorage.setItem("theme-preference", theme);
    set({ theme })
  }
}));

