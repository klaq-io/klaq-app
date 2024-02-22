export const concatDateAndTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map((t) => parseInt(t, 10));
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes
  );
};
