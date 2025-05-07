const TOKEN_KEY = "auth_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith(`${TOKEN_KEY}=`));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  // 設置 cookie，有效期為 7 天
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `${TOKEN_KEY}=${token};expires=${expires.toUTCString()};path=/`;
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  document.cookie = `${TOKEN_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
