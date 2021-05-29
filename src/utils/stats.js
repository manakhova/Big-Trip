import {getDuration} from './event';

const getObjKeys = (obj) => {
  return Object.keys(obj).sort((a,b) => {return obj[b]-obj[a];});
};

const getObjValues = (obj) => {
  return Object.values(obj).sort((a,b) => {return b - a;});
};

const getUniqueTypes = (events) => {
  const types = events.map((event) => event.type);
  return [...new Set(types)];
};

const getFilteredEvents = (uniqueTypes, events) => {
  return uniqueTypes.map((type) => (events.filter((event) => event.type === type)));
};

const getSum = (arr) => {
  const sumPrices = [];
  for (let i = 0; i < arr.length; i++) {
    let x = 0;
    sumPrices.push(arr[i].map((item) => x+=item).reverse()[0]);
  }
  return sumPrices;
};

export const getMoneyStats = (events) => {
  const uniqueTypes = getUniqueTypes(events);
  const filteredEvents = getFilteredEvents(uniqueTypes, events);
  const eventsPrices = filteredEvents.map((arr) => arr.map((event) => event.basePrice));

  const sumPrices = getSum(eventsPrices);
  const moneyStatsObj = Object.assign(...uniqueTypes.map((n, i) => ({ [n]: sumPrices[i] })));

  return {
    uniqueTypes: getObjKeys(moneyStatsObj),
    sumPrices: getObjValues(moneyStatsObj),
  };
};

export const getTypeStats = (events) => {
  const uniqueTypes = getUniqueTypes(events);
  const filteredEvents = getFilteredEvents(uniqueTypes, events);

  const typesCount = [];
  for (let i = 0; i < filteredEvents.length; i++) {
    typesCount.push(filteredEvents[i].length);
  }

  const typeStatsObj = Object.assign(...uniqueTypes.map((n, i) => ({ [n]: typesCount[i] })));

  return {
    uniqueTypes: getObjKeys(typeStatsObj),
    typesCount: getObjValues(typeStatsObj),
  };
};

export const getTimeStats = (events) => {
  const uniqueTypes = getUniqueTypes(events);
  const filteredEvents = getFilteredEvents(uniqueTypes, events);
  const eventsDuration = filteredEvents.map((arr) => arr.map((event) => getDuration(event.dateFrom, event.dateTo)));

  const typeDuration = getSum(eventsDuration);
  const timeStatsObj = Object.assign(...uniqueTypes.map((n, i) => ({ [n]: typeDuration[i] })));

  return {
    uniqueTypes: getObjKeys(timeStatsObj),
    typeDuration: getObjValues(timeStatsObj),
  };
};
