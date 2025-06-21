"use client";

import { cn } from "@/utils/transformer";
import { X } from "lucide-react";
import type React from "react";
import { forwardRef, useState } from "react";

export interface TagsInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  className?: string;
  tagClassName?: string;
  inputClassName?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled";
  helperText?: string;
  error?: string;
}

const TagsInput = forwardRef<HTMLDivElement, TagsInputProps>(
  (
    {
      value = [],
      onChange,
      placeholder = "輸入標籤",
      maxTags = 5,
      disabled = false,
      className,
      tagClassName,
      inputClassName,
      size = "md",
      variant = "default",
      helperText,
      error,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");
    const tags = value || [];

    const sizeClasses = {
      sm: "text-xs px-2 py-1 min-h-[32px]",
      md: "text-sm px-3 py-2 min-h-[42px]",
      lg: "text-base px-4 py-3 min-h-[48px]",
    };

    const variantClasses = {
      default: "bg-white border-gray-300",
      filled: "bg-gray-100 border-gray-300",
    };

    const tagSizeClasses = {
      sm: "text-xs px-2 py-0.5",
      md: "text-sm px-3 py-1",
      lg: "text-base px-4 py-1.5",
    };

    const addTag = (tagText: string) => {
      if (!tagText.trim() || tags.length >= maxTags || disabled) return;

      const newTag = tagText.trim();
      if (!tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        onChange?.(newTags);
      }
    };

    const addMultipleTags = () => {
      if (!inputValue.trim() || disabled) return;

      if (inputValue.includes(",")) {
        const tagsToAdd = inputValue
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "" && !tags.includes(tag));

        const availableSlots = maxTags - tags.length;
        const finalTags = [...tags, ...tagsToAdd.slice(0, availableSlots)];

        if (finalTags.length > tags.length) {
          onChange?.(finalTags);
        }
      } else {
        addTag(inputValue);
      }

      setInputValue("");
    };

    const removeTag = (indexToRemove: number) => {
      if (disabled) return;

      const newTags = tags.filter((_, index) => index !== indexToRemove);
      onChange?.(newTags);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.nativeEvent.isComposing) {
        return;
      }

      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addMultipleTags();
      } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
        removeTag(tags.length - 1);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    const canAddMoreTags = tags.length < maxTags && !disabled;

    return (
      <div className="space-y-2">
        <div
          ref={ref}
          className={cn(
            "relative border rounded-md flex flex-wrap gap-2 transition-colors",
            sizeClasses[size],
            variantClasses[variant],
            error
              ? "border-red-500 focus-within:border-red-500"
              : "hover:border-[#FFD56B] focus-within:border-[#FFD56B]",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          {...props}
        >
          {tags.map((tag, index) => (
            <div
              key={tag}
              className={cn(
                "bg-[#FFD56B] text-[#262626] rounded-md flex items-center gap-1 font-medium transition-colors",
                tagSizeClasses[size],
                disabled && "opacity-70",
                tagClassName
              )}
            >
              <span className="select-none">{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-[#262626] hover:text-gray-900 focus:outline-none transition-colors cursor-pointer"
                  aria-label={`移除標籤 ${tag}`}
                >
                  <X size={size === "sm" ? 12 : size === "lg" ? 18 : 14} />
                </button>
              )}
            </div>
          ))}

          {canAddMoreTags && (
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={addMultipleTags}
              placeholder={tags.length === 0 ? placeholder : ""}
              disabled={disabled}
              className={cn(
                "flex-1 min-w-[120px] border-0 bg-transparent outline-none text-sm placeholder:text-gray-500",
                inputClassName
              )}
            />
          )}
        </div>

        {/* 輔助文字和錯誤信息 */}
        <div className="space-y-1">
          {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}

          {error && <p className="text-xs text-red-500">{error}</p>}

          {tags.length >= maxTags && (
            <p className="text-xs text-amber-600">已達到標籤上限 ({maxTags})</p>
          )}

          {tags.length > 0 && tags.length < maxTags && (
            <p className="text-xs text-gray-400">{maxTags - tags.length} 個標籤可用</p>
          )}
        </div>
      </div>
    );
  }
);

TagsInput.displayName = "TagsInput";

export { TagsInput };
