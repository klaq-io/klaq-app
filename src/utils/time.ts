import {
  differenceInCalendarDays,
  differenceInMonths,
  isPast,
  isToday,
  isTomorrow,
  format,
  parse,
  isYesterday,
} from 'date-fns';

export const getRemainingTime = (date: Date | string) => {
  // todo: intl
  const today = new Date();

  date = new Date(date);
  const daysDifference = differenceInCalendarDays(today, date);
  const monthsDifference = differenceInMonths(today, date);
  if (isYesterday(date)) return `Hier`;
  if (isPast(date)) return `Il y a ${daysDifference} jours`;
  if (isToday(date)) return "Aujourd'hui";
  if (isTomorrow(date)) return 'Demain';
  if (daysDifference <= 7) return `dans ${-daysDifference} jours`;
  if (monthsDifference <= 1) return `dans ${-monthsDifference} mois`;
  if (monthsDifference > 1) return `dans ${-monthsDifference} mois`;
  return format(date, 'dd/MM/yyyy');
};

export const formatTime = (time: string) => {
  const t = parse(time, 'HH:mm', new Date());
  return format(t, 'HH:mm');
};
