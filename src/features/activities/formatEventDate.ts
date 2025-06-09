import { format, parseISO } from "date-fns";
import { zhTW } from "date-fns/locale";

export const formatEventDate = (startTime: string, endTime: string) => {
  const start = parseISO(startTime);
  const end = parseISO(endTime);

  // 移除「週」字的星期幾格式
  const weekday = format(start, "eee", { locale: zhTW }).replace("週", "");
  const startDate = `${format(start, "yyyy.MM.dd", { locale: zhTW })} (${weekday}) ${format(start, "HH:mm", { locale: zhTW })}`;

  // 檢查是否為同一天
  const isSameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  const endDate = isSameDay
    ? format(end, "HH:mm", { locale: zhTW })
    : `${format(end, "yyyy.MM.dd", { locale: zhTW })} (${format(end, "eee", { locale: zhTW }).replace("週", "")}) ${format(end, "HH:mm", { locale: zhTW })}`;

  return `${startDate} - ${endDate}`;
};
