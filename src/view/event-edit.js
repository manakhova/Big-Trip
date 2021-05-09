import dayjs from 'dayjs';
import SmartView from './smart';
import {getTypeName} from '../utils/event';
import {shuffleArray} from '../utils/common';
import {types, cities} from '../const';
import {generateOffers} from '../mock/point';

const createEventTypeTemplate = (types) => {
  return `${types.map((type) => `<div class="event__type-item">
  <input id="event-type-${type}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
  <label class="event__type-label event__type-label--${type}" for="event-type-${type}">${getTypeName(type)}</label>
</div>`).join('')}`;
};

const createDestinationCityTemplate = (cities) => {
  return `<datalist id="destination-list-1">
  ${cities.map((city) => `<option value="${city}"></option>`).join('')}
  </datalist>`;
};

const getCheckedOffer = (typeOffer, offers) => {
  return offers.some((item) => item.title === typeOffer.title);
};

const createOffersTemplate = (offers, typeOffers) => {
  return `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
  ${typeOffers.map((typeOffer, i) => `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${i}" type="checkbox" name="event-offer-luggage" ${getCheckedOffer(typeOffer, offers) ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${i}">
      <span class="event__offer-title">${typeOffer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${typeOffer.price}</span>
    </label>
   </div>`).join('')}
  </div>
  </section>`;
};

const createDestinationInfoTemplate = (destination) => {
  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">${destination.pictures.map((pic) =>
    `<img class="event__photo" src="${pic.src}" alt="${pic.description}">`).join('')}</div>
    </div>
  </section>`;
};

const createEventEditTemplate = (data) => {
  const {basePrice,
    dateFrom,
    dateTo,
    destination,
    offers,
    type,
    typeOffers} = data;


  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${type}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${type}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
                ${createEventTypeTemplate(types)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${getTypeName(type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          ${createDestinationCityTemplate(cities)}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format('DD/MM/YY HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format('DD/MM/YY HH:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
         ${typeOffers.offers.length === 0 ? '' : createOffersTemplate(offers, typeOffers.offers)}
         ${destination === {} ? '' : createDestinationInfoTemplate(destination)}
      </section>
    </form>
  </li>`;
};

export default class EventEdit extends SmartView{
  constructor(event) {
    super();
    this._data = EventEdit.parseEventToData(event);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeEditClickHandler = this._closeEditClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    // this._checkedOfferChangeHandler = this._checkedOfferChangeHandler.bind(this);
    this._setInnerHandlers();
  }

  reset(event) {
    this.updateData(
      EventEdit.parseEventToData(event),
    );
  }

  getTemplate() {
    return createEventEditTemplate(this._data);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventEdit.parseDataToTask(this._data));
  }

  _closeEditClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeEditClick();
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this.updateData({
      type: evt.target.value,
      typeOffers: {
        type: this.type,
        offers: shuffleArray(this._data.typeOffers.offers),
      },
      // перемешивает массив, но почему-то не перерисовывает блок с офферами
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    if (cities.some((city) => city === evt.target.value)) {
      this.updateData({
        destination: {
          description: shuffleArray(this._data.destination.description),
          name: evt.target.value,
          pictures: shuffleArray(this._data.destination.pictures),
        },
      });
    }
  }

  // тут будет обработчик для выбора оффера, пока не придумала до конца, какой он должен быть
  // _checkedOfferChangeHandler(evt) {
  //   evt.preventDefault();

  //   if (evt.target.tagName !== 'INPUT') {
  //     return;
  //   }

  //   if (evt.target.checked) {
  //     this.updateData({
  //       offers: {
  //         offers: this._data.offers.offers.push(evt.target) ???
  //       },
  //     });
  //   }
  // }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('.event--edit').addEventListener('submit', this._formSubmitHandler);
  }

  setCloseEditClickHandler(callback) {
    this._callback.closeEditClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeEditClickHandler);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
    this.getElement().querySelector('.event__input').addEventListener('input', this._destinationChangeHandler);
    // this.getElement().querySelector('.event__available-offers').addEventListener('change', this._checkedOfferChangeHandler);
  }

  static parseEventToData(event) {
    return Object.assign(
      {},
      event,
      {
        typeOffers: generateOffers(event.type),
      },
    );
  }

  static parseDataToTask(data) {
    data = Object.assign({}, data);

    delete data.typeOffers;

    return data;
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseEditClickHandler(this._callback.closeEditClick);
  }
}
