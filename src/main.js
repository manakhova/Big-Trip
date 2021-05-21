import SiteMenuView from './view/site-menu';
import TripInfoContainerView from './view/trip-info-container';
import TripInfoMainView from './view/trip-info-main';
import TripInfoCost from './view/trip-info-cost';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter.js';
import {generatePoint} from './mock/point';
import {render, RenderPosition} from './utils/render.js';
import EventsModel from './model/events';
import FilterModel from './model/filter.js';

const EVENT_COUNT = 12;
const events = new Array(EVENT_COUNT).fill().map(generatePoint);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

const siteMainElement = document.querySelector('.page-main');
const tripEventsContainerElement = siteMainElement.querySelector('.trip-events');

//контейнер инфо о поездке
const siteHeaderElement = document.querySelector('.page-header');
const tripElement = siteHeaderElement.querySelector('.trip-main');
render(tripElement, new TripInfoContainerView(), RenderPosition.AFTERBEGIN);

//инфо и стоимость
const tripInfoElement = tripElement.querySelector('.trip-info');
render(tripInfoElement, new TripInfoMainView(), RenderPosition.BEFOREEND);
render(tripInfoElement, new TripInfoCost(), RenderPosition.BEFOREEND);

//меню
const menuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
render(menuElement, new SiteMenuView(), RenderPosition.BEFOREEND);

//фильтры
const filtersElement = siteHeaderElement.querySelector('.trip-controls__filters');

const tripPresenter = new TripPresenter(tripEventsContainerElement, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, eventsModel);

filterPresenter.init();
tripPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});

