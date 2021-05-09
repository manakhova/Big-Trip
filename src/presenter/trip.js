import SortingView from '../view/sorting';
import EventListView from '../view/event-list';
import NoEventView from '../view/no-event';
import EventPresenter from './event';
import {render, RenderPosition} from '../utils/render';
import {updateItem} from '../utils/common';
import {sortEventUp, sortEventByPrice, sortEventByTime} from '../utils/event';
import {SortType} from '../const';

export default class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._eventPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._eventListComponent = new EventListView();
    this._sortComponent = new SortingView();
    this._noEventComponent = new NoEventView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._sourcedEvents= events.sort(sortEventUp);

    render(this._tripEventsContainer, this._eventListComponent, RenderPosition.BEFOREEND);
    this._renderTrip();
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._sourcedEvents = updateItem(this._sourcedEvents, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this._events.sort(sortEventByPrice);
        break;
      case SortType.TIME:
        this._events.sort(sortEventByTime);
        break;
      case SortType.DEFAULT:
        this._events = this._sourcedEvents.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortEvents(sortType);
    this._clearEventList();
    this._renderEventList(this._events);
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventListComponent, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEventList(events) {
    events.slice().forEach((event) => this._renderEvent(event));
  }

  _clearEventList() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
  }

  _renderNoEvents() {
    render(this._tripEventsContainer, this._noEventComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTrip() {
    if (this._events.length !== 0) {
      this._renderSort();
    } else {
      this._renderNoEvents();
    }

    this._renderEventList(this._sourcedEvents);
  }
}
