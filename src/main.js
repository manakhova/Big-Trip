import SiteMenuView from './view/site-menu';
import StatsView from './view/stats';
import TripInfoPresenter from './presenter/trip-info';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter.js';
import {generatePoint} from './mock/point';
import {render, RenderPosition, remove} from './utils/render.js';
import EventsModel from './model/events';
import FilterModel from './model/filter.js';
import {MenuItem} from './const.js';

const EVENT_COUNT = 10;
const events = new Array(EVENT_COUNT).fill().map(generatePoint);

let statsComponent = null;

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filterModel = new FilterModel();

const siteMainElement = document.querySelector('.page-main');
const statsContainer = siteMainElement.querySelector('.page-body__container');
const tripEventsContainerElement = siteMainElement.querySelector('.trip-events');

//контейнер инфо о поездке
const siteHeaderElement = document.querySelector('.page-header');
const tripElement = siteHeaderElement.querySelector('.trip-main');
const tripInfoPresenter = new TripInfoPresenter(tripElement, eventsModel);
tripInfoPresenter.init();

//меню
const menuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteMenuComponent = new SiteMenuView();
render(menuElement, siteMenuComponent, RenderPosition.BEFOREEND);


const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statsComponent);
      tripPresenter.init();
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statsComponent = new StatsView(eventsModel.getEvents());
      render(statsContainer, statsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

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

