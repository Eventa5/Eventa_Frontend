import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpForm() {
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
            placeholder="請設定密碼"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">確認密碼</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="請再次輸入密碼"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="terms"
            className="rounded border-gray-300"
          />
          <label
            htmlFor="terms"
            className="text-sm text-gray-600"
          >
            我已詳閱並同意{" "}
            <a
              href="/privacy-policy"
              className="underline font-bold"
            >
              隱私權政策
            </a>
          </label>
        </div>
        <Button
          type="submit"
          className="w-full bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-[var(--color-neutral-800)] font-bold"
        >
          註冊
        </Button>
        <div className="text-center text-sm text-gray-500">
          已經有 Eventa 帳號了嗎？
          <a
            href="/signin"
            className="text-[var(--color-primary-600)] font-bold underline ml-1"
          >
            前往登入
          </a>
        </div>
      </div>
    </form>
  );
}
