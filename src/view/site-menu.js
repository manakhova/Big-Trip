import AbstractView from './abstract';
import {MenuItem} from '../const.js';

const createSiteMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-filter="${MenuItem.TABLE}">${MenuItem.TABLE}</a>
  <a class="trip-tabs__btn" href="#" data-filter="${MenuItem.STATS}">${MenuItem.STATS}</a>
</nav>`;
};

export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'A') {
      return;
    }

    this._callback.menuClick(evt.target.dataset.filter);

    if (evt.target.dataset.filter === 'stats') {
      this.getElement().querySelectorAll('.trip-tabs__btn').forEach((a) => {
        a.classList.remove('trip-tabs__btn--active');
      });
      evt.target.classList.add('trip-tabs__btn--active');
    } else {
      this.getElement().querySelectorAll('.trip-tabs__btn').forEach((a) => {
        a.classList.remove('trip-tabs__btn--active');
      });
      evt.target.classList.add('trip-tabs__btn--active');
    }
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }
}
