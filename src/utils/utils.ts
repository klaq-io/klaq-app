export const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ");
};

export const shortenString = (maxLen: number, str?: string): string => {
  if (!str) return "";
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen).trim() + "...";
};
