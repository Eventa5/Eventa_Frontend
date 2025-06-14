import { Collapse } from "@/components/ui/collapse";
import { QuantityInput } from "@/components/ui/quantity-input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/utils/transformer";
import { useState } from "react";

interface TicketCardProps {
  ticketTitle: string;
  price: number;
  booking_time: string;
  available_time: string;
  description?: string;
  isSoldOut?: boolean;
  isFocused?: boolean;
  onQuantityFocus?: () => void;
  onQuantityBlur?: () => void;
  onQuantityChange: (quantity: number) => void;
}

export function TicketCard({
  ticketTitle,
  price,
  booking_time,
  available_time,
  description,
  isSoldOut = false,
  isFocused = false,
  onQuantityFocus,
  onQuantityBlur,
  onQuantityChange,
}: TicketCardProps) {
  const [quantity, setQuantity] = useState(0);

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
    onQuantityChange(value);
  };

  return (
    <div
      className={cn(
        "relative flex items-stretch border border-gray-200 rounded-sm overflow-hidden",
        isSoldOut && "bg-[var(--color-neutral-100)]",
        isFocused && quantity > 0 && "border-l-8 border-l-primary-500 bg-[#FDFBF6]"
      )}
    >
      {/* 主要內容 */}
      <div className="flex-1 px-6 py-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-wide">{ticketTitle}</span>
            {isSoldOut && <span className="text-sm font-semibold text-neutral-400">已售完</span>}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-bold text-xl tracking-wide">NT$ {price.toLocaleString()}</span>
            {quantity > 0 && <span className="text-[#C9A13B] font-bold text-xl">x {quantity}</span>}
          </div>
        </div>
        <Collapse className="text-sm mt-6">
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">售票時間</p>
              <p className="text-sm text-muted-foreground">{booking_time}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">票券可使用時間</p>
              <p className="text-sm text-muted-foreground">{available_time}</p>
            </div>
            {description && (
              <div className="space-y-2">
                <p className="text-sm font-medium">套票說明</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            )}
          </div>
        </Collapse>
        {isSoldOut && (
          <>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-700 mb-1">名額釋出通知我</div>
                <div className="text-sm text-muted-foreground">
                  開啟通知後，當名額釋出時，你會收到候補通知 Email，提醒你第一時間搶票
                </div>
              </div>
              <Switch className="ml-4" />
            </div>
          </>
        )}
      </div>
      {/* 右側數量調整 */}
      {!isSoldOut && (
        <div className={cn("flex flex-col justify-center items-center px-6")}>
          <QuantityInput
            defaultValue={0}
            onValueChange={handleQuantityChange}
            disabled={isSoldOut}
            onFocus={onQuantityFocus}
            onBlur={onQuantityBlur}
          />
        </div>
      )}
    </div>
  );
}
