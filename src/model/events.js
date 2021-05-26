import Observer from '../utils/observer.js';

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
    this._destinations = [];
    this._offers = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();

    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }

  getDestinations() {
    return this._destinations;
  }

  setOffers(offers) {
    this._offers = offers.slice();
  }

  getOffers() {
    return this._offers;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
      {},
      {
        id: event.id,
        basePrice: event.base_price,
        dateFrom: event.date_from,
        dateTo: event.date_to,
        destination: event.destination,
        isFavorite: event.is_favorite,
        offers: event.offers,
        type: event.type,
      },
    );
    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign(
      {},
      {
        'id': event.id,
        'base_price': event.basePrice,
        'date_from': event.dateFrom,
        'date_to': event.dateTo,
        'is_favorite': event.isFavorite,
        'destination': event.destination,
        'offers': event.offers,
        'type': event.type,
      },
    );
    return adaptedEvent;
  }
}

