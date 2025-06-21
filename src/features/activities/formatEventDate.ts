import { format, isValid, parseISO } from "date-fns";
import { zhTW } from "date-fns/locale";

export const formatEventDate = (startTime: string, endTime: string) => {
  // 驗證輸入參數
  if (!startTime || !endTime || startTime.trim() === "" || endTime.trim() === "") {
    return {
      isSameDay: false,
      startDateString: "日期未設定",
      endDateString: "日期未設定",
    };
  }

  try {
    const start = parseISO(startTime);
    const end = parseISO(endTime);

    // 驗證解析後的日期是否有效
    if (!isValid(start) || !isValid(end)) {
      return {
        isSameDay: false,
        startDateString: "日期格式錯誤",
        endDateString: "日期格式錯誤",
      };
    }

    // 移除「週」字的星期幾格式
    const weekdayStart = format(start, "eee", { locale: zhTW }).replace("週", "");
    const weekdayEnd = format(end, "eee", { locale: zhTW }).replace("週", "");
    const startDate = `${format(start, "yyyy.MM.dd", { locale: zhTW })} (${weekdayStart})`;
    const startTimeStr = format(start, "HH:mm", { locale: zhTW });
    const endDate = `${format(end, "yyyy.MM.dd", { locale: zhTW })} (${weekdayEnd})`;
    const endTimeStr = format(end, "HH:mm", { locale: zhTW });

    // 檢查是否為同一天
    const isSameDay =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate();

    if (isSameDay) {
      return {
        isSameDay: true,
        startDateString: `${startDate}`,
        timeString: `${startTimeStr} - ${endTimeStr}`,
      };
    }
    return {
      isSameDay: false,
      startDateString: `${startDate} ${startTimeStr}`,
      endDateString: `${endDate} ${endTimeStr}`,
    };
  } catch (error) {
    // 如果解析過程中發生任何錯誤，返回預設值
    console.error("日期格式化錯誤:", error);
    return {
      isSameDay: false,
      startDateString: "日期格式錯誤",
      endDateString: "日期格式錯誤",
    };
  }
};
