"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Camera, X } from "lucide-react";
import { useState } from "react";

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
  title?: string;
  description?: string;
}

export function QRScanner({
  isOpen,
  onClose,
  onScan,
  title = "掃描 QR Code",
  description = "將 QR Code 對準攝影機進行掃描",
}: QRScannerProps) {
  const [error, setError] = useState<string>("");
  const [isScanning, setIsScanning] = useState(true);
  const [manualInput, setManualInput] = useState("");

  // 處理掃描結果
  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const ticketId = detectedCodes[0].rawValue;
      if (ticketId) {
        setIsScanning(false);
        onScan(ticketId);
        onClose();
      } else {
        setError("請掃描正確的票券 QR Code");
      }
    }
  };

  // 處理掃描錯誤
  const handleError = (error: unknown) => {
    let errorMessage = "無法開啟攝影機";

    // 根據錯誤類型提供用戶友善的訊息
    if (error instanceof Error) {
      if (error.name === "NotAllowedError") {
        errorMessage = "需要攝影機權限才能掃描";
      } else if (error.name === "NotFoundError") {
        errorMessage = "找不到攝影機";
      } else if (error.name === "NotReadableError") {
        errorMessage = "攝影機正在被使用中";
      } else {
        errorMessage = "攝影機無法使用";
      }
    }

    setError(errorMessage);
    setIsScanning(false);
  };

  // 重新開始掃描
  const restartScanning = () => {
    setError("");
    setIsScanning(true);
  };

  // 手動輸入提交
  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      setManualInput("");
      onClose();
    }
  };

  // 處理對話框關閉
  const handleClose = () => {
    setIsScanning(false);
    setError("");
    setManualInput("");
    onClose();
  };

  // 當對話框打開時重置狀態
  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      // 對話框打開時重置狀態
      setError("");
      setIsScanning(true);
      setManualInput("");
    } else {
      // 對話框關閉時清理狀態
      handleClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleDialogOpenChange}
    >
      <DialogContent className="max-w-lg mx-auto w-[95vw] p-0">
        <DialogHeader className="p-3 pb-0">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Camera className="w-6 h-6 text-blue-600" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">{description}</DialogDescription>
        </DialogHeader>

        <div className="p-3 space-y-3">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-700 text-sm font-medium mb-4">{error}</p>

              <Button
                onClick={restartScanning}
                variant="outline"
                className="text-red-700 border-red-300 hover:bg-red-100 transition-colors duration-200"
              >
                重試掃描
              </Button>
            </div>
          ) : isScanning ? (
            <>
              {/* QR Code 掃描器 */}
              <div className="relative bg-gray-900 rounded-xl overflow-hidden">
                {/* 掃描器容器 - 響應式高度 */}
                <div className="aspect-[4/3] sm:aspect-video relative">
                  <Scanner
                    onScan={handleScan}
                    onError={handleError}
                    styles={{
                      container: {
                        width: "100%",
                        height: "100%",
                        borderRadius: "0.75rem",
                      },
                    }}
                    constraints={{
                      facingMode: "environment",
                    }}
                  />

                  {/* 掃描框覆層 */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* 掃描區域指示 */}
                    <div className="relative">
                      {/* 外圍虛線框 */}
                      <div className="w-64 h-64 sm:w-72 sm:h-72 border-2 border-white/30 border-dashed rounded-2xl" />

                      {/* 內部掃描框 */}
                      <div className="absolute inset-6 border-2 border-blue-500 rounded-xl">
                        {/* 四個角落的掃描指示器 */}
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />

                        {/* 掃描線動畫 */}
                        <div className="absolute inset-0 overflow-hidden rounded-lg">
                          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 狀態指示 */}
                  <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-medium shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      掃描中...
                    </div>
                  </div>

                  {/* 使用提示 */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs sm:text-sm text-center max-w-xs">
                    將 QR Code 對準中央掃描框
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-gray-600 text-sm font-medium mb-4">掃描器未啟動</p>
              <Button
                onClick={restartScanning}
                variant="outline"
                className="text-gray-700 border-gray-300 hover:bg-gray-100 transition-colors duration-200"
              >
                開始掃描
              </Button>
            </div>
          )}

          {/* 手動輸入選項 */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-500 px-3">或</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <p className="text-sm text-gray-600 mb-3 text-center">手動輸入票券編號</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="請輸入票券編號"
                className="text-sm md:text-base shrink-0 sm:flex-1"
              />
              <Button
                onClick={handleManualSubmit}
                disabled={!manualInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed min-w-[80px]"
              >
                確認
              </Button>
            </div>
          </div>

          {/* 控制按鈕 */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 py-3 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              取消
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
