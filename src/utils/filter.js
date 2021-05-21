import {FilterType, curretnDate} from '../const';


export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events
    .filter((event) => event.dateFrom >= curretnDate.toISOString() ||
    (event.dateFrom < curretnDate.toISOString() && event.dateTo > curretnDate.toISOString())),
  [FilterType.PAST]: (events) => events
    .filter((event) => event.dateTo < curretnDate.toISOString() ||
    (event.dateFrom < curretnDate.toISOString() && event.dateTo > curretnDate.toISOString())),
};
