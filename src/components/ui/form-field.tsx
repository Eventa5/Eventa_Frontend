"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagsInput } from "@/components/ui/tags-input";
import { memo } from "react";
import type React from "react";
import { type Control, Controller, type UseFormTrigger } from "react-hook-form";

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormFieldProps {
  control: Control<any>;
  name: string;
  type?: "input" | "select" | "date" | "textarea" | "tags";
  inputType?: string;
  placeholder?: string;
  options?: FormFieldOption[];
  className?: string;
  footerText?: string;
  disabled?: boolean;
  // Tags 專用屬性
  maxTags?: number;
  tagClassName?: string;
  inputClassName?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled";
  helperText?: string;
  // 新增：觸發其他欄位驗證的函數
  trigger?: UseFormTrigger<any>;
  // 新增：當此欄位變化時需要重新驗證的其他欄位
  triggerFields?: string[];
  [key: string]: any;
}

export interface FormSectionProps {
  children: React.ReactNode;
  title: string;
  required?: boolean;
  description?: string;
}

// FormSection 組件
export const FormSection = memo<FormSectionProps>(
  ({ children, title, required = false, description }) => (
    <div className="space-y-2">
      <p className="text-sm font-medium flex items-center">
        {required && <span className="text-red-500 mr-1">*</span>}
        {title}
      </p>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      {children}
    </div>
  )
);

FormSection.displayName = "FormSection";

// FormField 組件
export const FormField = ({
  control,
  name,
  type = "input",
  inputType,
  placeholder,
  options = [],
  className = "",
  footerText = "",
  disabled = false,
  // Tags 專用屬性
  maxTags = 5,
  tagClassName,
  inputClassName,
  size = "md",
  variant = "default",
  helperText,
  trigger,
  triggerFields,
  ...props
}: FormFieldProps) => {
  const handleFieldChange = async (value: any) => {
    if (trigger && triggerFields && triggerFields.length > 0) {
      trigger(triggerFields);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, isTouched, isDirty } }) => {
        const baseClassName =
          "w-full bg-white border-gray-300 hover:border-[#FFD56B] focus:border-[#FFD56B]";

        const showError = error && (isDirty || isTouched);

        switch (type) {
          case "select":
            return (
              <div className={className}>
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => {
                    if (value) {
                      field.onChange(value);
                    }
                    handleFieldChange(value);
                  }}
                  onOpenChange={(open) => {
                    if (!open) {
                      field.onBlur();
                    }
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger className={baseClassName}>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {showError && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
              </div>
            );

          case "date":
            return (
              <div className={className}>
                <DatePicker
                  date={field.value ? new Date(field.value) : new Date()}
                  setDate={(date) => {
                    const dateValue = date ? date.toISOString() : "";
                    field.onChange(dateValue);
                    handleFieldChange(dateValue);
                  }}
                  disabledDates={(date) => {
                    return date < new Date(new Date().setHours(0, 0, 0, 0));
                  }}
                  placeholder={placeholder}
                  className={baseClassName}
                  footerText={footerText}
                />
                {showError && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
              </div>
            );

          case "textarea":
            return (
              <div className={className}>
                <textarea
                  {...field}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={`${baseClassName} p-2 border rounded-md min-h-[80px] focus:outline-none resize-y`}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleFieldChange(e.target.value);
                  }}
                  {...props}
                />
                {showError && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
              </div>
            );

          case "tags":
            return (
              <div className={className}>
                <TagsInput
                  value={field.value || []}
                  onChange={(value) => {
                    field.onChange(value);
                    handleFieldChange(value);
                  }}
                  placeholder={placeholder}
                  maxTags={maxTags}
                  disabled={disabled}
                  tagClassName={tagClassName}
                  inputClassName={inputClassName}
                  size={size}
                  variant={variant}
                  helperText={helperText}
                  error={showError ? error?.message : undefined}
                  {...props}
                />
              </div>
            );

          default: // input
            return (
              <div className={className}>
                <Input
                  {...field}
                  type={inputType || "text"}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={baseClassName}
                  onChange={(e) => {
                    let value: string | number;
                    // 對於數字類型，確保正確轉換
                    if (inputType === "number") {
                      const inputValue = e.target.value;
                      value = inputValue === "" ? 0 : Number(inputValue);
                    } else {
                      value = e.target.value;
                    }
                    field.onChange(value);
                  }}
                  {...props}
                />
                {showError && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
              </div>
            );
        }
      }}
    />
  );
};

FormField.displayName = "FormField";
