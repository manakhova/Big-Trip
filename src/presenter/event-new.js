import EventEditView from '../view/event-edit';
import {render, RenderPosition, remove} from '../utils/render';
import {UserAction, UpdateType} from '../const';

export default class EventNew {
  constructor(eventListContainer, eventsModel, changeData) {
    this._eventListContainer = eventListContainer;
    this._eventsModel = eventsModel;
    this._changeData = changeData;

    this._eventEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseEditClick = this._handleCloseEditClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init() {
    if (this._eventEditComponent !== null) {
      return;
    }
    this._eventEditComponent = new EventEditView(undefined, this._eventsModel);

    const addNewEventButton = document.querySelector('.trip-main__event-add-btn');
    addNewEventButton.disabled = true;

    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setCloseEditClickHandler(this._handleCloseEditClick);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._eventListContainer, this._eventEditComponent, RenderPosition.AFTERBEGIN);
    const cancelButton = this._eventEditComponent.getElement().querySelector('.event__reset-btn');
    cancelButton.innerHTML = 'Cancel';

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);

    const addNewEventButton = document.querySelector('.trip-main__event-add-btn');
    addNewEventButton.disabled = false;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleCloseEditClick() {
    this.destroy();
  }

  setSaving() {
    this._eventEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._eventEditComponent.shake(resetFormState);
  }

  _handleFormSubmit(event) {
    this._changeData(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      event,
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }
}
