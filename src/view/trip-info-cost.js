import AbstractView from './abstract';

const createTripInfoCostTemplate = () => {
  return `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
</p>`;
};

export default class TripInfoCost extends AbstractView{
  getTemplate() {
    return createTripInfoCostTemplate();
  }
}

