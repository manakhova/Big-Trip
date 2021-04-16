import SiteMenuView from './view/site-menu';
import TripInfoContainerView from './view/trip-info-container';
import TripInfoMainView from './view/trip-info-main';
import TripInfoCost from './view/trip-info-cost';
import FilterView from './view/filters';
import SortingView from './view/sorting';
import EventListView from './view/event-list';
import EventView from './view/event';
import EventEditView from './view/event-edit';
import NoEventView from './view/no-event';
import {generatePoint} from './mock/point';
import {render, RenderPosition, replace} from './utils/render.js';

const EVENT_COUNT = 12;
const events = new Array(EVENT_COUNT).fill().map(generatePoint);

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
render(filtersElement, new FilterView(), RenderPosition.BEFOREEND);

const renderEvent = (eventListElement, event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EventEditView(event);

  const replaceEventToForm = () => {
    replace(eventEditComponent, eventComponent);
  };

  const replaceFormToEvent = () => {
    replace(eventComponent, eventEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  eventComponent.setEditClickHandler(() => {
    replaceEventToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  eventEditComponent.setFormSubmitHandler(() => {
    replaceFormToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  eventEditComponent.setCloseEditClickHandler(() => {
    replaceFormToEvent();
    document.removeEventListener('keydown', onEscKeyDown);
  });


  render(eventListElement, eventComponent, RenderPosition.BEFOREEND);
};

const renderEventList = (tripEventsContainerElement, events) => {
  const eventListComponent = new EventListView();

  render(tripEventsContainerElement, eventListComponent, RenderPosition.BEFOREEND);

  if (events.length !== 0) {
    render(tripEventsContainerElement, new SortingView(), RenderPosition.AFTERBEGIN);
  } else {
    render(tripEventsContainerElement, new NoEventView(), RenderPosition.AFTERBEGIN);
  }

  events.forEach((event) => {
    renderEvent(eventListComponent.getElement(), event);
  });
};

renderEventList(tripEventsContainerElement, events);

