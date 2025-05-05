const TOKEN_KEY = "token";

export function setToken(token: string) {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); // 7 天後過期

  document.cookie = `${TOKEN_KEY}=${token};expires=${expires.toUTCString()};path=/;sameSite=lax${
    process.env.NODE_ENV === "production" ? ";secure" : ""
  }`;
}

export function getToken(): string | undefined {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === TOKEN_KEY) {
      return value;
    }
  }
  return undefined;
}

export function removeToken() {
  document.cookie = `${TOKEN_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}
