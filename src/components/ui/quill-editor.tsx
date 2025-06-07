"use client";

import Quill from "quill";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import "quill/dist/quill.snow.css";
import { cn } from "@/utils/transformer";
import type { Delta, EmitterSource, QuillOptions, Range } from "quill";

// 組件 Props 介面
export interface QuillEditorProps {
  value?: string;
  onChange?: (content: string, delta: Delta, source: EmitterSource, editor: Quill) => void;
  onSelectionChange?: (range: Range, source: EmitterSource, editor: Quill) => void;
  onFocus?: (range: Range, source: EmitterSource, editor: Quill) => void;
  onBlur?: (previousRange: Range, source: EmitterSource, editor: Quill) => void;
  config?: QuillOptions;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  height?: string | number;
  placeholder?: string;
}

// 編輯器實例方法介面
export interface QuillEditorRef {
  getEditor: () => Quill | null;
  getContent: () => string;
  setContent: (content: string) => void;
  focus: () => void;
  blur: () => void;
  getSelection: () => Range | null;
  setSelection: (index: number, length?: number) => void;
  getText: (index?: number, length?: number) => string;
  getLength: () => number;
  insertText: (index: number, text: string, source?: EmitterSource) => void;
  insertEmbed: (index: number, type: string, value: unknown) => void;
  deleteText: (index: number, length: number) => void;
  formatText: (index: number, length: number, format: Record<string, unknown>) => void;
  formatLine: (index: number, length: number, format: Record<string, unknown>) => void;
}

// 預設配置
const defaultConfig: QuillOptions = {
  theme: "snow",
  placeholder: "請輸入內容...",
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["blockquote", "code-block"],
      ["clean"],
    ],
  },
  formats: [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background",
    "align",
    "script",
    "direction",
    "code-block",
  ],
};

const QuillEditor = forwardRef<QuillEditorRef, QuillEditorProps>(
  (
    {
      value = "",
      onChange,
      onSelectionChange,
      onFocus,
      onBlur,
      config = {},
      className,
      style,
      disabled = false,
      height = "300px",
      placeholder = "請輸入內容...",
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const [isReady, setIsReady] = useState(false);
    const isInitializingRef = useRef(false);

    // 合併配置
    const mergedConfig: QuillOptions = useMemo(() => {
      return {
        ...defaultConfig,
        ...config,
        placeholder: config.placeholder || placeholder,
        modules: {
          ...defaultConfig.modules,
          ...config.modules,
        },
      };
    }, [config, placeholder]);

    // 清理函數
    const cleanupQuill = useCallback(() => {
      if (quillRef.current) {
        try {
          // 移除所有事件監聽器
          quillRef.current.off("text-change");
          quillRef.current.off("selection-change");

          // 清空編輯器內容
          quillRef.current.setText("");

          // 設置為 null
          quillRef.current = null;
        } catch (error) {
          console.warn("清理 Quill 編輯器時發生錯誤:", error);
          quillRef.current = null;
        }
      }
      setIsReady(false);
      isInitializingRef.current = false;
    }, []);

    // 檢查是否已經有 Quill 實例存在
    const hasExistingQuill = useCallback(() => {
      if (!editorRef.current) return false;

      // 檢查 DOM 節點是否已經被 Quill 初始化
      return (
        editorRef.current.classList.contains("ql-container") ||
        editorRef.current.querySelector(".ql-editor") !== null ||
        quillRef.current !== null
      );
    }, []);

    // 初始化 Quill 實例
    const initializeQuill = useCallback(() => {
      // 防止重複初始化
      if (isInitializingRef.current) {
        console.warn("Quill 正在初始化中，跳過重複初始化");
        return;
      }

      if (!editorRef.current) {
        console.warn("編輯器 DOM 節點不存在");
        return;
      }

      if (hasExistingQuill()) {
        console.warn("Quill 實例已存在，跳過重複初始化");
        return;
      }

      try {
        isInitializingRef.current = true;

        // 確保 DOM 節點是空的
        editorRef.current.innerHTML = "";

        // 創建 Quill 實例
        quillRef.current = new Quill(editorRef.current, {
          ...mergedConfig,
          readOnly: disabled,
        });

        // 設置初始內容
        if (value) {
          quillRef.current.clipboard.dangerouslyPasteHTML(value);
        }

        // 綁定事件監聽器
        quillRef.current.on("text-change", (delta, oldDelta, source) => {
          if (onChange && quillRef.current) {
            const content = quillRef.current.root.innerHTML || "";
            onChange(content, delta, source, quillRef.current);
          }
        });

        quillRef.current.on("selection-change", (range, oldRange, source) => {
          if (onSelectionChange && quillRef.current) {
            onSelectionChange(range, source, quillRef.current);
          }

          if (!quillRef.current) return;

          if (range && onFocus) {
            onFocus(range, source, quillRef.current);
          } else if (!range && onBlur) {
            onBlur(oldRange, source, quillRef.current);
          }
        });

        setIsReady(true);
        isInitializingRef.current = false;
      } catch (error) {
        console.error("初始化 Quill 編輯器失敗:", error);
        isInitializingRef.current = false;
        cleanupQuill();
      }
    }, [
      mergedConfig,
      disabled,
      value,
      onChange,
      onSelectionChange,
      onFocus,
      onBlur,
      hasExistingQuill,
      cleanupQuill,
    ]);

    // 初始化編輯器
    useEffect(() => {
      if (editorRef.current && !quillRef.current && !isInitializingRef.current) {
        // 使用 setTimeout 確保 DOM 已經完全掛載
        const timer = setTimeout(() => {
          initializeQuill();
        }, 0);

        return () => {
          clearTimeout(timer);
        };
      }
    }, [initializeQuill]);

    // 清理函數
    useEffect(() => {
      return () => {
        cleanupQuill();
      };
    }, [cleanupQuill]);

    // 監聽 value 變化
    useEffect(() => {
      if (quillRef.current && isReady && !isInitializingRef.current) {
        const currentContent = quillRef.current.root.innerHTML;
        const normalizedValue = value || "";

        // 只有當內容真的不同時才更新
        if (currentContent !== normalizedValue) {
          try {
            quillRef.current.clipboard.dangerouslyPasteHTML(normalizedValue);
          } catch (error) {
            console.warn("更新 Quill 內容時發生錯誤:", error);
          }
        }
      }
    }, [value, isReady]);

    // 監聽 disabled 狀態變化
    useEffect(() => {
      if (quillRef.current && isReady) {
        try {
          quillRef.current.enable(!disabled);
        } catch (error) {
          console.warn("設置 Quill 禁用狀態時發生錯誤:", error);
        }
      }
    }, [disabled, isReady]);

    // 暴露方法給父組件
    useImperativeHandle(
      ref,
      () => ({
        getEditor: () => quillRef.current,
        getContent: () => quillRef.current?.root.innerHTML || "",
        setContent: (content: string) => {
          if (quillRef.current && !isInitializingRef.current) {
            try {
              quillRef.current.clipboard.dangerouslyPasteHTML(content);
            } catch (error) {
              console.warn("設置 Quill 內容時發生錯誤:", error);
            }
          }
        },
        focus: () => {
          if (quillRef.current && !isInitializingRef.current) {
            try {
              quillRef.current.focus();
            } catch (error) {
              console.warn("聚焦 Quill 編輯器時發生錯誤:", error);
            }
          }
        },
        blur: () => {
          if (quillRef.current && !isInitializingRef.current) {
            try {
              quillRef.current.blur();
            } catch (error) {
              console.warn("失焦 Quill 編輯器時發生錯誤:", error);
            }
          }
        },
        getSelection: () => quillRef.current?.getSelection() || null,
        setSelection: (index: number, length?: number) => {
          if (quillRef.current && !isInitializingRef.current) {
            try {
              quillRef.current.setSelection(index, length);
            } catch (error) {
              console.warn("設置 Quill 選擇範圍時發生錯誤:", error);
            }
          }
        },
        getText: (index?: number, length?: number) => {
          return quillRef.current?.getText(index, length) || "";
        },
        getLength: () => quillRef.current?.getLength() || 0,
        insertText: (index: number, text: string, source?: EmitterSource) => {
          if (quillRef.current && !isInitializingRef.current) {
            try {
              quillRef.current.insertText(index, text, source);
            } catch (error) {
              console.warn("插入文字時發生錯誤:", error);
            }
          }
        },
        insertEmbed: (index: number, type: string, value: unknown) => {
          if (quillRef.current && !isInitializingRef.current) {
            try {
              quillRef.current.insertEmbed(index, type, value);
            } catch (error) {
              console.warn("插入嵌入內容時發生錯誤:", error);
            }
          }
        },
        deleteText: (index: number, length: number) => {
          if (quillRef.current && !isInitializingRef.current) {
            try {
              quillRef.current.deleteText(index, length);
            } catch (error) {
              console.warn("刪除文字時發生錯誤:", error);
            }
          }
        },
        formatText: (index: number, length: number, format: Record<string, unknown>) => {
          if (quillRef.current && !isInitializingRef.current) {
            try {
              quillRef.current.formatText(index, length, format);
            } catch (error) {
              console.warn("格式化文字時發生錯誤:", error);
            }
          }
        },
        formatLine: (index: number, length: number, format: Record<string, unknown>) => {
          if (quillRef.current && !isInitializingRef.current) {
            try {
              quillRef.current.formatLine(index, length, format);
            } catch (error) {
              console.warn("格式化行時發生錯誤:", error);
            }
          }
        },
      }),
      []
    );

    return (
      <div
        className={cn(
          "quill-editor-container border border-gray-300 rounded-md overflow-hidden",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        style={{
          ...style,
          height: typeof height === "number" ? `${height}px` : height,
        }}
      >
        <div ref={editorRef} />
      </div>
    );
  }
);

QuillEditor.displayName = "QuillEditor";

export default QuillEditor;
