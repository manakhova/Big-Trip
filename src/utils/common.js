import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const getRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max + 1 - min) + min);
};

export const shuffleArray = (array) => {
  const items = array.slice();
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};

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
