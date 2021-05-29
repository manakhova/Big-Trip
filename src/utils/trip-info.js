import dayjs from 'dayjs';

export const generateTripEventsTemplate = (events) => {
  if (events.length === 1) {
    return `${events[0].destination.name}`;
  } else if (events.length === 2) {
    return `${events[0].destination.name} &mdash; ${events[events.length - 1].destination.name}`;
  } else if (events.length === 3) {
    return `${events[0].destination.name} &mdash; ${events[1].destination.name} &mdash; ${events[2].destination.name}`;
  } else {
    return `${events[0].destination.name} &mdash; &hellip; &mdash; ${events[events.length - 1].destination.name}`;
  }
};

export const generateTripDateTemplate = (events) => {
  return `${dayjs(events[0].dateFrom).format('D MMM')} &nbsp; &mdash; &nbsp; ${dayjs(events[events.length - 1].dateTo).format('D MMM')}`;
};

export const generateTripCost = (events) => {
  const prices = events.map((event) => event.basePrice);
  const offersPrices = events.map((event) => event.offers.map((offer) => offer.price)).flat();

  let x = 0;
  return `${prices.map((i) => x+=i).reverse()[0] + offersPrices.map((i) => x+=i).reverse()[0]}`;
};
