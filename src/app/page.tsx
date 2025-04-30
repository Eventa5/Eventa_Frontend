"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { FormInput } from "@/components/ui/form-input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, EyeClosed, EyeIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [date, setDate] = useState<Date>();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="scroll-m-20 text-4xl font-black tracking-tight lg:text-5xl leading-[1.2]">
          AI 精準推薦
          <br />
          活動票券一手掌握
        </h1>
        <FormInput
          value="123"
          error
        />
        <FormInput
          value="•••"
          endAdornment={<EyeClosed className="h-4 w-4" />}
          type="password"
        />
        <FormInput
          value="123"
          endAdornment={<EyeIcon className="h-4 w-4" />}
        />
        <Button>登入</Button>
        <RadioGroup defaultValue="option-one">
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="option-one"
              id="option-one"
            />
            <Label htmlFor="option-one">Option One</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="option-two"
              id="option-two"
            />
            <Label htmlFor="option-two">Option Two</Label>
          </div>
        </RadioGroup>
        <div className="items-top flex space-x-2">
          <Checkbox id="terms1" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              我已詳閱並同意
            </label>
            <Link
              href="/"
              className="text-sm text-muted-foreground"
            >
              隱私權政策
            </Link>
          </div>
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="請選擇電話區碼" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>電話區碼</SelectLabel>
              <SelectItem value="886">台灣 +886</SelectItem>
              <SelectItem value="86">中國 +86</SelectItem>
              <SelectItem value="852">香港 +852</SelectItem>
              <SelectItem value="853">澳門 +853</SelectItem>
              <SelectItem value="81">日本 +81</SelectItem>
              <SelectItem value="82">南韓 +82</SelectItem>
              <SelectItem value="1">美國 +1</SelectItem>
              <SelectItem value="60">馬來西亞 +60</SelectItem>
              <SelectItem value="65">新加坡 +65</SelectItem>
              <SelectItem value="63">菲律賓 +63</SelectItem>
              <SelectItem value="0">其他 +0</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0"
            align="start"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
            />
          </PopoverContent>
        </Popover>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center" />
    </div>
  );
}
