import { isAfter, isBefore, parse } from 'date-fns';

export const greetingByTime = () => {
  const currentDateTime = new Date();
  const morningStart = parse('06:00:00', 'HH:mm:ss', new Date());
  const eveningStart = parse('17:00:00', 'HH:mm:ss', new Date());

  if (
    isBefore(currentDateTime, eveningStart) &&
    isAfter(currentDateTime, morningStart)
  ) {
    return 'Bonjour';
  } else {
    return 'Bonsoir';
  }
};
