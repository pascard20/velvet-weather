import sunrise from "../svg/weather-icons/sunrise.svg";
import sunset from "../svg/weather-icons/sunset.svg";

export default {
  elem: {
    form: document.querySelector(".header__form"),
    formInput: document.querySelector(".header__input"),
    formButton: document.querySelector(".header__button"),
    sunrise: document.querySelector(".header__sunrise"),
    sunset: document.querySelector(".header__sunset"),
  },

  svg: {
    sunrise: sunrise,
    sunset: sunset,
  },
};
