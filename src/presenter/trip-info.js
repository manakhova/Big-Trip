import TripInfoView from '../view/trip-info';
import {render, RenderPosition, remove} from '../utils/render';
import {sortEventUp} from '../utils/event';

export default class TripInfo {
  constructor(tripInfoContainer, eventsModel) {
    this._eventsModel = eventsModel;
    this._tripInfoContainer = tripInfoContainer;

    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    if (this._tripInfoComponent !== null) {
      return;
    }

    this._renderTripInfo();
  }

  _renderTripInfo() {
    const events = this._eventsModel.getEvents().sort(sortEventUp);

    if (this._tripInfoComponent !== null) {
      this._tripInfoComponent = null;
    }

    this._tripInfoComponent = new TripInfoView(events);
    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _clearTripInfo() {
    remove(this._tripInfoComponent);
  }

  _handleModelEvent() {
    this._clearTripInfo();
    this._renderTripInfo();
  }
}
