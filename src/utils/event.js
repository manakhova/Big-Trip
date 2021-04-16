import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const generateDate = (date) => {
  return dayjs(date);
};

export const getDuration = (dateA, dateB) => {
  return dateB - dateA;
};

export const humanizeDuration = (time) => {
  const hours = Math.floor(dayjs.duration(time, 'm').asHours());
  const minutes = dayjs.duration((time - hours * 60), 'm').asMinutes();

  return `${hours}h ${minutes}m`;
};

export const getTypeName = (type) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};
