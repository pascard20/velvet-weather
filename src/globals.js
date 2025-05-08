const select = (selector) => document.querySelector(selector);

const selectMultiple = (baseSelector, count) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(select(`${baseSelector}-${i}`));
  }
  return result;
};

const elem = {
  appWrapper: select(".app-wrapper"),
  footerLink: select(".footer__icon"),
  footer: select(".footer"),
};

const header = {
  form: select(".header__form"),
  input: select(".header__input"),
  button: select(".header__button"),
  sunrise: select(".header__sunrise"),
  sunset: select(".header__sunset"),
  descriptionString: select(".header__description-string"),
  cityName: select(".header__city-name"),
  cityInfo: select(".header__city-info"),
  unitSwitch: select(".header__unit-switch"),
  loadAnimation: select(".header__load-animation"),
};

const main = {
  weatherIcon: select(".main__weather-icon"),
  airPressure: select(".main__air-pressure"),
  windSpeed: select(".main__wind-speed"),
  humidity: select(".main__humidity"),
  cloudCover: select(".main__cloud-cover"),
  conditions: select(".main__conditions"),
  forecastItems: selectMultiple("#main__forecast-item", 7),
};

const values = {
  temperature: select("#value__temperature"),
  feelsLike: select("#value__feelslike"),
  pressure: select("#value__pressure"),
  windSpeed: select("#value__windSpeed"),
  humidity: select("#value__humidity"),
  cloudCover: select("#value__cloudCover"),
};

const vars = {
  useAmericanUnits: header.unitSwitch.checked,
  cachedData: null,
  areElementsActive: false,
  forecastHoursOffset: 3,
};

const elemToDeactivate = [
  select(".main"),
  select(".divider"),
  select(".header__city-name"),
  select(".header__city-info"),
  select(".header__description"),
];

export default {
  vars,
  header,
  main,
  values,
  elem,
  elemToDeactivate,
};
