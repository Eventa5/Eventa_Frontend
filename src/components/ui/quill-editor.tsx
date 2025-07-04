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
import { postApiV1ActivitiesByActivityIdContentImage } from "@/services/api/client/sdk.gen";
import { useErrorHandler } from "@/utils/error-handler";
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
  activityId?: number;
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
      activityId,
    },
    ref
  ) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const [isReady, setIsReady] = useState(false);
    const isInitializingRef = useRef(false);
    const { handleError } = useErrorHandler();

    // 圖片上傳處理函數
    const imageHandler = useCallback(async () => {
      if (!activityId || !quillRef.current) {
        console.warn("無法上傳圖片：缺少活動 ID 或編輯器實例");
        return;
      }

      // 創建文件選擇器
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file || !quillRef.current) return;

        // 檢查文件大小 (4MB 限制)
        const maxSize = 4 * 1024 * 1024; // 4MB
        if (file.size > maxSize) {
          handleError(new Error("圖片大小不能超過 4MB"), { updateStoreError: false });
          return;
        }

        // 檢查文件類型
        if (!file.type.startsWith("image/")) {
          handleError(new Error("請選擇圖片"), { updateStoreError: false });
          return;
        }

        try {
          // 獲取當前游標位置
          const range = quillRef.current.getSelection(true);
          const index = range ? range.index : quillRef.current.getLength();

          // 插入載入佔位符
          quillRef.current.insertText(index, "圖片上傳中...", "user");

          // 上傳圖片
          const response = await postApiV1ActivitiesByActivityIdContentImage({
            path: { activityId },
            body: { image: file },
          });

          // 檢查回傳是否成功
          if (response.error) {
            throw new Error(response.error.message || "圖片上傳失敗");
          }

          const imageUrl = response.data?.data?.url;
          if (!imageUrl) {
            throw new Error("圖片上傳成功但未獲得圖片網址");
          }

          // 移除載入佔位符並插入圖片
          quillRef.current.deleteText(index, "圖片上傳中...".length);
          quillRef.current.insertEmbed(index, "image", imageUrl, "user");

          // 將游標移到圖片後面
          quillRef.current.setSelection(index + 1);
        } catch (error) {
          console.error("圖片上傳失敗:", error);

          // 移除載入佔位符
          const currentText = quillRef.current.getText();
          const loadingTextIndex = currentText.indexOf("圖片上傳中...");
          if (loadingTextIndex !== -1) {
            quillRef.current.deleteText(loadingTextIndex, "圖片上傳中...".length);
          }

          // 顯示錯誤訊息
          let errorMessage = "圖片上傳失敗";
          if (error instanceof Error) {
            if (error.message.includes("413") || error.message.includes("Payload Too Large")) {
              errorMessage = "圖片檔案過大，請選擇較小的圖片";
            } else if (error.message.includes("CORS")) {
              errorMessage = "網路連線問題，請稍後再試";
            } else {
              errorMessage = error.message;
            }
          }
          handleError(new Error(errorMessage), { updateStoreError: false });
        }
      };
    }, [activityId, handleError]);

    // 合併配置
    const mergedConfig: QuillOptions = useMemo(() => {
      const baseModules = {
        ...defaultConfig.modules,
        ...config.modules,
      };

      // 如果有活動ID，設置自定義圖片處理器
      if (activityId) {
        const toolbarHandlers = {
          image: imageHandler,
        };

        return {
          ...defaultConfig,
          ...config,
          placeholder: config.placeholder || placeholder,
          modules: {
            ...baseModules,
            toolbar: {
              container: baseModules.toolbar,
              handlers: toolbarHandlers,
            },
          },
        };
      }

      return {
        ...defaultConfig,
        ...config,
        placeholder: config.placeholder || placeholder,
        modules: baseModules,
      };
    }, [config, placeholder, activityId, imageHandler]);

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
