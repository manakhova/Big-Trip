import SmartView from './smart';
import {getTypeName, formatDate} from '../utils/event';
import {types, curretnDate} from '../const';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const BLANK_EVENT = {
  basePrice: '',
  dateFrom: curretnDate.toISOString(),
  dateTo: curretnDate.toISOString(),
  destination: {},
  id: null,
  isFavorite: false,
  type: 'taxi',
  offers: [],
};

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

const checkIsOfferChecked = (offer, typeOffers) => {
  let isChecked = false;

  typeOffers.forEach((typeOffer) => {
    if (offer.title === typeOffer.title && offer.price === typeOffer.price) {
      isChecked = true;
    }
  });

  return isChecked;
};

const createOffersTemplate = (offers, typeOffers, loadedOffers, isDisabled) => {
  if (typeOffers) {
    return `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
  ${typeOffers.map((typeOffer, i) => `<div class="event__offer-selector">
  <input class="event__offer-checkbox visually-hidden" data-title="${typeOffer.title}" id="event-offer-${i}" type="checkbox" name="event-offer-luggage" ${checkIsOfferChecked(typeOffer, offers) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="event__offer-label" for="event-offer-${i}">
      <span class="event__offer-title">${typeOffer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${typeOffer.price}</span>
    </label>
   </div>`).join('')}
  </div>
  </section>`;
  } else {
    return `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
  ${loadedOffers.map((typeOffer, i) => `<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" data-title="${typeOffer.title}" id="event-offer-${i}" type="checkbox" name="event-offer-luggage" ${checkIsOfferChecked(typeOffer, offers) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="event__offer-label" for="event-offer-${i}">
      <span class="event__offer-title">${typeOffer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${typeOffer.price}</span>
    </label>
   </div>`).join('')}
  </div>
  </section>`;
  }
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

const getCloseButton = (data) => {
  if (data.id) {
    return 'Delete';
  } else {
    return 'Cancel';
  }
};

const createEventEditTemplate = (data, cities, loadedOffers) => {
  const {basePrice,
    dateFrom,
    dateTo,
    destination,
    offers,
    type,
    typeOffers,
    isDisabled,
    isSaving,
    isDeleting} = data;

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name? destination.name : ''}" list="destination-list-1" required ${isDisabled ? 'disabled' : ''}>
          ${createDestinationCityTemplate(cities)}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo)}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" min="1" name="event-price" value="${basePrice}" required ${isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : getCloseButton(data)}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
         ${(loadedOffers.offers.length === 0 || (typeOffers.offers && typeOffers.offers.length === 0)) ? '' : createOffersTemplate(offers, typeOffers.offers, loadedOffers.offers, isDisabled)}
         ${destination.pictures ? createDestinationInfoTemplate(destination) : ''}
      </section>
    </form>
  </li>`;
};

const getCityList = (destinations) => {
  return destinations.map((destination) => destination.name);
};

export default class EventEdit extends SmartView{
  constructor(event = BLANK_EVENT, eventsModel) {
    super();
    this._data = EventEdit.parseEventToData(event);

    this._destinations = eventsModel.getDestinations();
    this._offers = eventsModel.getOffers();

    this._typeOffers = this._offers.find((item) => item.type === event.type);
    this._cities = getCityList(this._destinations);

    this._datepickerDateFrom = null;
    this._datepickerDateTo = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeEditClickHandler = this._closeEditClickHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._checkedOfferChangeHandler = this._checkedOfferChangeHandler.bind(this);
    this._setInnerHandlers();
    this._setDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  reset(event) {
    this.updateData(
      EventEdit.parseEventToData(event),
    );
  }

  getTemplate() {
    return createEventEditTemplate(this._data, this._cities, this._typeOffers);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    if(this._data.dateTo < this._data.dateFrom) {
      alert('Дата окончания события не может быть меньше даты начала');
    } else {
      this._callback.formSubmit(EventEdit.parseDataToEvent(this._data));
    }
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
      typeOffers: this._offers.find((offer) => offer.type === evt.target.value),
      offers: [],
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    if (this._cities.some((city) => city === evt.target.value)) {
      this.updateData({
        destination: this._destinations.find((destination) => destination.name === evt.target.value),
      });
    } else {
      evt.target.setCustomValidity('Выберите значение из списка');
    }
  }

  _priceInputHandler(evt) {
    evt.preventDefault();

    this.updateData({
      basePrice: Number(evt.target.value),
    });
  }

  _checkedOfferChangeHandler(evt) {
    evt.preventDefault();

    const getNewAddedOffer = () => {
      if (this._data.typeOffers.length === 0) {
        return this._typeOffers.offers.find((offer) => offer.title === evt.target.dataset.title);
      } else {
        return this._data.typeOffers.offers.find((offer) => offer.title === evt.target.dataset.title);
      }
    };

    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    if (evt.target.checked) {
      this.updateData({
        offers: [...this._data.offers, getNewAddedOffer()],
      });
    } else {
      this.updateData({
        offers: this._data.offers.filter((offer) => offer.title !== getNewAddedOffer().title),
      });
    }
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventEdit.parseDataToEvent(this._data));
  }

  _setDatepicker() {
    if (this._datepickerDateFrom || this._datepickerDateTo) {
      this._datepickerDateFrom.destroy();
      this._datepickerDateTo.destroy();
      this._datepickerDateFrom = null;
      this._datepickerDateTo = null;
    }

    this._datepickerDateFrom = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        onChange: this._dateFromChangeHandler,
      },
    );

    this._datepickerDateTo = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        minDate: this._data.dateFrom,
        enableTime: true,
        onChange: this._dateToChangeHandler,
      },
    );
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate,
    });
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      dateTo: userDate,
    });
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('.event--edit').addEventListener('submit', this._formSubmitHandler);
  }

  setCloseEditClickHandler(callback) {
    this._callback.closeEditClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._closeEditClickHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
    this.getElement().querySelector('#event-destination-1').addEventListener('input', this._destinationChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceInputHandler);
    if (this.getElement().querySelector('.event__available-offers')) {
      this.getElement().querySelector('.event__available-offers').addEventListener('change', this._checkedOfferChangeHandler);
    }
  }


  static parseEventToData(event) {
    return Object.assign(
      {},
      event,
      {
        typeOffers: [],
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.typeOffers;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseEditClickHandler(this._callback.closeEditClick);
    this._setDatepicker();
    this.setDeleteClickHandler(this._callback.deleteClick);
  }
}
