"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapse } from "@/components/ui/collapse";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/store/auth";
import Image from "next/image";

export default function CheckoutPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-[1180px] mx-auto">
        <div className="flex flex-col md:flex-row gap-12 justify-center">
          {/* 左側活動資訊 */}
          <div className="w-full md:w-[440px] space-y-6 shrink-0">
            <div className="relative h-[280px] w-full overflow-hidden rounded-lg">
              <Image
                src="/Eventa_logo.svg"
                alt="Eventa Logo Balloon and Ticket"
                width={80}
                height={80}
                className="w-14 h-14 sm:w-20 sm:h-20"
                priority
              />
              <Image
                src="/images/single_activity_cover.png"
                alt="2025 心樂山林星光夜祭・初夏閃耀夢樂園"
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-2xl font-bold mb-10">2025 心樂山林星光夜祭・初夏閃耀夢樂園</h1>
                <div className="space-y-4">
                  <span className="text-lg font-semibold">活動時間</span>
                  <p className="text-sm text-muted-foreground">
                    2025.04.19 (六) 14:30 - 05.10 (六)20:30 (GMT+8)
                  </p>
                </div>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <span className="text-lg font-semibold">活動地點</span>
                  <p className="text-sm text-muted-foreground">
                    苗栗縣大埔獅興正路 121 巷 8 弄 20 號
                  </p>
                </div>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <span className="text-lg font-semibold">退票規則</span>
                  <p className="text-sm text-muted-foreground">
                    本活動委託 Eventa 代為處理退款事宜，依退款規則辦理。如需申請退款請於「購買成功
                    24 小時後，並於活動票券有效開始日前 8 日」辦理，並將酌收票價 10%
                    退票手續費，逾期恕不受理。
                  </p>
                  <Button
                    variant="link"
                    className="flex items-center gap-2 text-[#b39340] p-0 h-auto font-bold"
                  >
                    如何辦理退款
                  </Button>
                </div>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <span className="text-lg font-semibold">購票須知</span>
                  <p className="text-sm text-muted-foreground">
                    請注意，你應該先報名完成一筆訂單後再報名下一筆。為保障消費者權益及杜絕非法囤票，同一使用者同時間只能報名一筆訂單，透過多開視窗同時報名、購買多筆訂單，系統將只保留最後一筆訂單，取消先前尚未報名完成之訂單，敬請理解與配合。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 右側票券選擇 */}
          <div className="w-full md:w-[640px] space-y-6 shrink-0">
            <div className="text-md font-bold">請選擇票種</div>
            <div className="w-full">
              <Select defaultValue="1">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">場次一：04/19（六）</SelectItem>
                  <SelectItem value="2">場次二：04/20（日）</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-md font-bold">請選擇票券</div>
            <Card className="relative p-6 bg-[var(--color-neutral-100)]">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">早鳥票</h3>
                      <span className="text-sm font-semibold text-muted-foreground ml-4">
                        已售完
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">NT$ 1,400</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">0</span>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-4">
                    <Collapse title="更多資訊">
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">售票時間</p>
                          <p className="text-sm text-muted-foreground">
                            2025.04.05 (六) - 04.19 (六)
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">票券可使用時間</p>
                          <p className="text-sm text-muted-foreground">
                            2025.04.19 (六) 14:30 - 20:00
                          </p>
                        </div>
                      </div>
                    </Collapse>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-md font-semibold">名額釋出通知我</span>
                        <Switch />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        開啟通知後，當名額釋出時，你會收到候補通知 Email，提醒你第一時間搶票
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">全票</h3>
                    <p className="text-sm text-muted-foreground">NT$ 1,800</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">0</span>
                      <Button
                        variant="outline"
                        size="icon"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-4">
                    <Collapse title="更多資訊">
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">售票時間</p>
                          <p className="text-sm text-muted-foreground">
                            2025.04.19 (六) - 05.10 (六)
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">票券可使用時間</p>
                          <p className="text-sm text-muted-foreground">
                            2025.04.19 (六) 14:30 - 20:00
                          </p>
                        </div>
                      </div>
                    </Collapse>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">雙人成行套票</h3>
                    <p className="text-sm text-muted-foreground">NT$ 3,200</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">0</span>
                      <Button
                        variant="outline"
                        size="icon"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-4">
                    <Collapse title="更多資訊">
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">售票時間</p>
                          <p className="text-sm text-muted-foreground">
                            2025.04.19 (六) - 05.10 (六)
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">票券可使用時間</p>
                          <p className="text-sm text-muted-foreground">
                            2025.04.19 (六) 14:30 - 20:00
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">套票說明</p>
                          <p className="text-sm text-muted-foreground">
                            此票種適用於2人同行，購買後將獲得2張票券。
                          </p>
                        </div>
                      </div>
                    </Collapse>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">小家庭套票</h3>
                    <p className="text-sm text-muted-foreground">NT$ 4,000</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">0</span>
                      <Button
                        variant="outline"
                        size="icon"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-4">
                    <Collapse title="更多資訊">
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">售票時間</p>
                          <p className="text-sm text-muted-foreground">
                            2025.04.19 (六) - 05.10 (六)
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">票券可使用時間</p>
                          <p className="text-sm text-muted-foreground">
                            2025.04.19 (六) 14:30 - 20:00
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">套票說明</p>
                          <p className="text-sm text-muted-foreground">
                            此票種適用於3-4人家庭，購買後將獲得4張票券。
                          </p>
                        </div>
                      </div>
                    </Collapse>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <span className="block text-right text-lg font-semibold">0 張票，總計 NT$ 0</span>
              <Button
                className="w-full font-semibold"
                size="lg"
              >
                前往結帳
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
