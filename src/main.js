import {createSiteMenuTemplate} from './view/site-menu';
import {createTripInfoContainerTemplate} from './view/trip-info-container';
import {createTripInfoMainTemplate} from './view/trip-info-main';
import {createTripInfoCostTemplate} from './view/trip-info-cost';
import {createFiltersTemplate} from './view/filters';
import {createSortingTemplate} from './view/sorting';
import {createEventListTemplate} from './view/event-list';
import {createNewEventFormTemplate} from './view/new-event-form';
import {createEventTemplate} from './view/event';
import {createEventEditTemplate} from './view/event-edit';

const EVENT_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

//контейнер инфо о поездке
const siteHeaderElement = document.querySelector('.page-header');
const tripElement = siteHeaderElement.querySelector('.trip-main');
render(tripElement, createTripInfoContainerTemplate(), 'afterbegin');

//инфо и стоимость
const tripInfoElement = tripElement.querySelector('.trip-info');
render(tripInfoElement, createTripInfoMainTemplate(), 'beforeend');
render(tripInfoElement, createTripInfoCostTemplate(), 'beforeend');

//меню
const menuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
render(menuElement, createSiteMenuTemplate(), 'beforeend');

//фильтры
const filtersElement = siteHeaderElement.querySelector('.trip-controls__filters');
render(filtersElement, createFiltersTemplate(), 'beforeend');

//сортировка
const siteMainElement = document.querySelector('.page-main');
const tripEventsContainerElement = siteMainElement.querySelector('.trip-events');
render(tripEventsContainerElement, createSortingTemplate(), 'beforeend');

//список событий с формой создания
render(tripEventsContainerElement, createEventListTemplate(), 'beforeend');
const eventListElement = tripEventsContainerElement.querySelector('.trip-events__list');
render(eventListElement, createNewEventFormTemplate(), 'beforeend');

render(eventListElement, createEventEditTemplate(), 'beforeend');
for (let i = 0; i < EVENT_COUNT; i++) {
  render(eventListElement, createEventTemplate(), 'beforeend');
}

