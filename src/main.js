import SiteMenuView from './view/site-menu';
import TripInfoContainerView from './view/trip-info-container';
import TripInfoMainView from './view/trip-info-main';
import TripInfoCost from './view/trip-info-cost';
import FilterView from './view/filters';
import SortingView from './view/sorting';
import EventListView from './view/event-list';
import EventView from './view/event';
import EventEditView from './view/event-edit';
import {generatePoint} from './mock/point';
import {render, RenderPosition} from './utils/common';

const EVENT_COUNT = 15;
const events = new Array(EVENT_COUNT).fill().map(generatePoint);

const renderEvent = (eventListElement, event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EventEditView(event);

  const replaceEventToForm = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToEvent = () => {
    eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  eventComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceEventToForm();
  });

  eventEditComponent.getElement().querySelector('.event--edit').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToEvent();
  });


  render(eventListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

//контейнер инфо о поездке
const siteHeaderElement = document.querySelector('.page-header');
const tripElement = siteHeaderElement.querySelector('.trip-main');
render(tripElement, new TripInfoContainerView().getElement(), RenderPosition.AFTERBEGIN);

//инфо и стоимость
const tripInfoElement = tripElement.querySelector('.trip-info');
render(tripInfoElement, new TripInfoMainView().getElement(), RenderPosition.BEFOREEND);
render(tripInfoElement, new TripInfoCost().getElement(), RenderPosition.BEFOREEND);

//меню
const menuElement = siteHeaderElement.querySelector('.trip-controls__navigation');
render(menuElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);

//фильтры
const filtersElement = siteHeaderElement.querySelector('.trip-controls__filters');
render(filtersElement, new FilterView().getElement(), RenderPosition.BEFOREEND);

//сортировка
const siteMainElement = document.querySelector('.page-main');
const tripEventsContainerElement = siteMainElement.querySelector('.trip-events');
render(tripEventsContainerElement, new SortingView().getElement(), RenderPosition.BEFOREEND);

//список событий с формой создания
const eventListComponent = new EventListView();
render(tripEventsContainerElement, eventListComponent.getElement(), RenderPosition.BEFOREEND);

// render(eventListComponent.getElement(), new EventEditView(points[0]).getElement(), RenderPosition.BEFOREEND);
for (let i = 0; i < events.length; i++) {
  renderEvent(eventListComponent.getElement(), events[i]);
}

