import SortingView from '../view/sorting';
import EventListView from '../view/event-list';
import NoEventView from '../view/no-event';
import LoadingView from '../view/loading';
import EventPresenter from './event';
import EventNewPresenter from './event-new';
import {filter} from '../utils/filter';
import {render, RenderPosition, remove} from '../utils/render';
import {sortEventUp, sortEventByPrice, sortEventByTime} from '../utils/event';
import {SortType, UpdateType, UserAction, FilterType} from '../const';

export default class Trip {
  constructor(tripEventsContainer, eventsModel, filterModel) {
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;

    this._tripEventsContainer = tripEventsContainer;
    this._eventPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._sortComponent = null;

    this._eventListComponent = new EventListView();
    this._noEventComponent = new NoEventView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventNewPresenter = new EventNewPresenter(this._eventListComponent, this._handleViewAction);
  }

  init() {
    render(this._tripEventsContainer, this._eventListComponent, RenderPosition.BEFOREEND);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  destroy() {
    this._clearTrip({resetSortType: true});

    remove(this._eventListComponent);

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createEvent() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init();
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents().sort(sortEventUp);
    const filtredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.PRICE:
        filtredEvents.sort(sortEventByPrice);
        break;
      case SortType.TIME:
        filtredEvents.sort(sortEventByTime);
        break;
    }

    return filtredEvents;
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortingView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripEventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventListComponent, this._eventsModel, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEventList(events) {
    events.forEach((event) => this._renderEvent(event));
  }

  _renderLoading() {
    render(this._tripEventsContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoEvents() {
    render(this._tripEventsContainer, this._noEventComponent, RenderPosition.BEFOREEND);
  }

  _clearTrip({resetSortType = false} = {}) {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};

    remove(this._sortComponent);
    remove(this._noEventComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const events = this._getEvents();

    if (events.length !== 0) {
      this._renderSort();
      this._renderEventList(events);
    } else {
      this._renderNoEvents();
    }
  }
}
