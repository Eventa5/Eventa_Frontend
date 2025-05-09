"use client";

import { useEffect, useState } from "react";

const TOKEN_KEY = "auth_token";

// 只在客戶端執行的函數
const clientOnly = {
  getToken(): string | null {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith(`${TOKEN_KEY}=`));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  },

  setToken(token: string): void {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    document.cookie = `${TOKEN_KEY}=${token};expires=${expires.toUTCString()};path=/`;
  },

  removeToken(): void {
    document.cookie = `${TOKEN_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  },
};

// 安全包裝的函數，可以在任何地方使用
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return clientOnly.getToken();
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  clientOnly.setToken(token);
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  clientOnly.removeToken();
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(!!getToken());
    setIsLoading(false);
  }, []);

  return { isAuthenticated, isLoading };
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!clientOnly.getToken();
}
