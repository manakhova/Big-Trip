import {getDuration} from './event';

export const getMoneyStats = (events) => {
  const types = events.map((event) => event.type);
  const uniqueTypes = [...new Set(types)];

  const filteredEvents = uniqueTypes.map((type) => (events.filter((event) => event.type === type)));
  const eventsPrices = filteredEvents.map((arr) => arr.map((event) => event.basePrice));

  const sumPrices = [];
  for (let i = 0; i < eventsPrices.length; i++) {
    let x = 0;
    sumPrices.push(eventsPrices[i].map((price) => x+=price).reverse()[0]);
  }
  return {
    uniqueTypes: uniqueTypes,
    sumPrices: sumPrices,
  };
};

export const getTypeStats = (events) => {
  const types = events.map((event) => event.type);
  const uniqueTypes = [...new Set(types)];

  const filteredEvents = uniqueTypes.map((type) => (events.filter((event) => event.type === type)));

  const typesCount = [];
  for (let i = 0; i < filteredEvents.length; i++) {
    typesCount.push(filteredEvents[i].length);
  }

  return {
    uniqueTypes: uniqueTypes,
    typesCount: typesCount,
  };
};

export const getTimeStats = (events) => {
  const types = events.map((event) => event.type);
  const uniqueTypes = [...new Set(types)];

  const filteredEvents = uniqueTypes.map((type) => (events.filter((event) => event.type === type)));
  const eventsDuration = filteredEvents.map((arr) => arr.map((event) => getDuration(event.dateFrom, event.dateTo)));

  const typeDuration = [];
  for (let i = 0; i < filteredEvents.length; i++) {
    let x = 0;
    typeDuration.push(eventsDuration[i].map((duration) => x+=duration).reverse()[0]);
  }

  return {
    uniqueTypes: uniqueTypes,
    typeDuration: typeDuration,
  };
};
