import {FilterType, CURRENT_DATE} from '../const';


export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events
    .filter((event) => event.dateFrom >= CURRENT_DATE.toISOString() ||
    (event.dateFrom < CURRENT_DATE.toISOString() && event.dateTo > CURRENT_DATE.toISOString())),
  [FilterType.PAST]: (events) => events
    .filter((event) => event.dateTo < CURRENT_DATE.toISOString() ||
    (event.dateFrom < CURRENT_DATE.toISOString() && event.dateTo > CURRENT_DATE.toISOString())),
};
