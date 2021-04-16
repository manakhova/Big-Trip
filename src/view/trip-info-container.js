import AbstractView from './abstract';

const createTripInfoContainerTemplate = () => {
  return `<section class="trip-main__trip-info  trip-info">
  </section>`;
};

export default class TripInfoContainer extends AbstractView{
  getTemplate() {
    return createTripInfoContainerTemplate();
  }
}
