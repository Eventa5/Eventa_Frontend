import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapse } from "@/components/ui/collapse";
import { cn } from "@/utils/transformer";

interface TicketCardProps {
  ticketTitle: string;
  price: number;
  booking_time: string;
  available_time: string;
  description?: string;
  isSoldOut?: boolean;
}

export function TicketCard({
  ticketTitle,
  price,
  booking_time,
  available_time,
  description,
  isSoldOut = false,
}: TicketCardProps) {
  return (
    <Card className={cn("p-6", isSoldOut && "bg-[var(--color-neutral-100)]")}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{ticketTitle}</h3>
              {isSoldOut && (
                <span className="text-sm font-semibold text-muted-foreground ml-4">已售完</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">NT$ {price.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={isSoldOut}
              >
                -
              </Button>
              <span className="w-8 text-center">0</span>
              <Button
                variant="outline"
                size="icon"
                disabled={isSoldOut}
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
          </div>
        </div>
      </div>
    </Card>
  );
}
