import AbstractView from './abstract';
import {generateTripEventsTemplate, generateTripDateTemplate, generateTripCost} from '../utils/trip-info';

const createTripCitiesInfoTemplate = (events) => {
  return `<div class="trip-info__main">
  <h1 class="trip-info__title">${generateTripEventsTemplate(events)}</h1>

  <p class="trip-info__dates">${generateTripDateTemplate(events)}</p>
</div>`;
};

const createTripInfoTemplate = (events) => {
  return `<section class="trip-main__trip-info  trip-info">
  ${createTripCitiesInfoTemplate(events)}
  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${generateTripCost(events)}</span>
  </p>
</section>`;
};

export default class TripInfo extends AbstractView{
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}
