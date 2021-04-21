import SortingView from '../view/sorting';
import EventListView from '../view/event-list';
import NoEventView from '../view/no-event';
import EventPresenter from './event';
import {render, RenderPosition} from '../utils/render';
import {updateItem} from '../utils/common';

export default class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._eventPresenter = {};

    this._eventListComponent = new EventListView();
    this._sortComponent = new SortingView();
    this._noEventComponent = new NoEventView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();

    render(this._tripEventsContainer, this._eventListComponent, RenderPosition.BEFOREEND);
    this._renderTrip();
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventListComponent, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEventList() {
    this._events.slice().forEach((event) => this._renderEvent(event));
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

    this._renderEventList();
  }
}
