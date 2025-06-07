"use client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { ClassNames, CustomComponents } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utils/transformer";

interface DatePickerProps {
  date: Date;
  setDate: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: (date: Date) => boolean;
  captionLayout?: "dropdown" | "label" | "dropdown-months" | "dropdown-years";
  startMonth?: Date;
  endMonth?: Date;
  defaultMonth?: Date;
  components?: Partial<CustomComponents>;
  classNames?: ClassNames;
  popoverContentClassName?: string;
  footerText?: string;
}

export function DatePicker({
  date,
  setDate,
  className,
  placeholder = "選擇日期",
  minDate,
  maxDate,
  disabledDates,
  captionLayout,
  startMonth,
  endMonth,
  defaultMonth,
  components,
  classNames,
  popoverContentClassName,
  footerText,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date instanceof Date && !Number.isNaN(date.getTime()) ? (
            format(date, "yyyy/MM/dd")
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`w-auto p-0 ${popoverContentClassName}`}
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={disabledDates}
          captionLayout={captionLayout}
          startMonth={startMonth}
          endMonth={endMonth}
          defaultMonth={defaultMonth}
          components={components}
          classNames={{
            month_caption: "flex items-center gap-2",
            caption_label: "text-sm font-medium",
            dropdowns: "flex gap-2",
            ...classNames,
          }}
          footer={
            footerText && (
              <div className="px-4 pt-0 pb-4">
                <p className="text-xs text-muted-foreground">{footerText}</p>
              </div>
            )
          }
        />
      </PopoverContent>
    </Popover>
  );
}
