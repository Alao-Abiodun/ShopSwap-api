/* eslint-disable @typescript-eslint/explicit-function-return-type */
import dayjs from 'dayjs';

export const timeDifference = (fromDate: number, toDate: number, type: 'd' | 'h' | 'm' | 's') => { 
  const startDate = dayjs(fromDate);
  return startDate.diff(dayjs(toDate), type, true);
};
