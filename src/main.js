import SiteMenuView from './view/site-menu';
import StatsView from './view/stats';
import TripInfoPresenter from './presenter/trip-info';
import TripPresenter from './presenter/trip';
import FilterPresenter from './presenter/filter.js';
import {render, RenderPosition, remove} from './utils/render.js';
import EventsModel from './model/events';
import FilterModel from './model/filter.js';
import {MenuItem, UpdateType} from './const.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic dkjwrbhiwgib77932bfiqr';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const api = new Api(END_POINT, AUTHORIZATION);

let statsComponent = null;

const eventsModel = new EventsModel();

const filterModel = new FilterModel();

const siteMainElement = document.querySelector('.page-main');
const statsContainer = siteMainElement.querySelector('.page-body__container');
const tripEventsContainerElement = siteMainElement.querySelector('.trip-events');
const addNewEventButton = document.querySelector('.trip-main__event-add-btn');

//контейнер инфо о поездке
const siteHeaderElement = document.querySelector('.page-header');
const tripElement = siteHeaderElement.querySelector('.trip-main');
const tripInfoPresenter = new TripInfoPresenter(tripElement, eventsModel);

//меню
const menuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
const siteMenuComponent = new SiteMenuView();

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statsComponent);
      tripPresenter.init();
      addNewEventButton.disabled = false;
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statsComponent = new StatsView(eventsModel.getEvents());
      render(statsContainer, statsComponent, RenderPosition.BEFOREEND);
      addNewEventButton.disabled = true;
      break;
  }
};


//фильтры
const filtersElement = siteHeaderElement.querySelector('.trip-controls__filters');

const tripPresenter = new TripPresenter(tripEventsContainerElement, eventsModel, filterModel, api);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, eventsModel);

tripPresenter.init();

api.getDestinations()
  .then((destinations) => {
    eventsModel.setDestinations(destinations);
  });

api.getOffers()
  .then((offers) => {
    eventsModel.setOffers(offers);
  });

api.getEvents()
  .then((events) => {
    eventsModel.setEvents(UpdateType.INIT, events);
    render(menuElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    tripInfoPresenter.init();
    filterPresenter.init();
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
    render(menuElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    filterPresenter.destroy();
  });

addNewEventButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});

