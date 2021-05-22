import SiteMenuView from './view/site-menu';
import TripInfoPresenter from './presenter/trip-info';
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
const tripInfoPresenter = new TripInfoPresenter(tripElement, eventsModel);
tripInfoPresenter.init();

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

