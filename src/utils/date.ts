/**
 * 解析 ISO 日期時間字串 => 日期時間
 */
export const parseDateTime = (isoString: string | undefined) => {
  if (!isoString) return null;

  try {
    const date = new Date(isoString);
    return {
      date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, // YYYY-MM-DD 格式
      hour: date.getHours().toString(),
      minute: date.getMinutes().toString(),
    };
  } catch {
    return null;
  }
};

/**
 * 組合日期時間 => YYYY-MM-DDTHH:mm
 */
export const combineDateTime = (date: string, hour: string, minute: string): string => {
  const dateObj = new Date(date);
  dateObj.setHours(Number.parseInt(hour), Number.parseInt(minute), 0, 0);
  return dateObj.toISOString();
};
