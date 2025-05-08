import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInForm() {
  return (
    <form className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">電子郵件</Label>
          <Input
            id="email"
            type="email"
            placeholder="請輸入電子郵件"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">密碼</Label>
          <Input
            id="password"
            type="password"
            placeholder="請輸入密碼"
          />
          <div className="text-left">
            <a
              href="/forgot-password"
              className="text-[var(--color-neutral-400)] underline text-sm"
            >
              忘記密碼？
            </a>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-[var(--color-neutral-800)] font-bold"
        >
          登入
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full border-2 font-medium flex items-center justify-center gap-2"
        >
          使用 Google 帳號登入
        </Button>
        <div className="text-center text-sm text-gray-500">
          還沒有 Eventa 帳號嗎？
          <a
            href="/signup"
            className="text-[var(--color-primary-600)] font-bold underline ml-1"
          >
            前往註冊
          </a>
        </div>
      </div>
    </form>
  );
}
