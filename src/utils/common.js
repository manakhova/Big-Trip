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

