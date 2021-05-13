import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const generateDate = (date) => {
  return dayjs(date);
};

export const getDuration = (dateA, dateB) => {
  return (dateB - dateA);
};

const formatDuration = (time) => {
  return time <= 9 ? `0${time}` : `${time}`;
};

export const humanizeDuration = (time) => {
  const days = Math.floor(dayjs.duration(time).days());
  const hours = Math.floor(dayjs.duration(time).hours());
  const minutes = dayjs.duration((time)).minutes();

  if (days === 0 && hours === 0) {
    return `${formatDuration(minutes)}m`;
  } else if (days === 0 && hours !== 0) {
    return `${formatDuration(hours)}h ${formatDuration(minutes)}m`;
  } else {
    return  `${formatDuration(days)}d ${formatDuration(hours)}h ${formatDuration(minutes)}m`;
  }
};

export const getTypeName = (type) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortEventUp = (eventA, eventB) => {
  const weight = getWeightForNullDate(eventA.dateFrom, eventB.dateFrom);

  if (weight !== null) {
    return weight;
  }

  return dayjs(eventA.dateFrom).diff(dayjs(eventB.dateFrom));
};

export const sortEventByPrice = (filmA, filmB) => {
  return filmB.basePrice - filmA.basePrice;
};

export const sortEventByTime = (filmA, filmB) => {
  return getDuration(filmB.dateFrom, filmB.dateTo) - getDuration(filmA.dateFrom, filmA.dateTo);
};

export const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YY HH:mm');
};
