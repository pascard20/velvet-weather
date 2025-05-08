import global from "./globals.js";
import { insertSVG, getSVG } from "./svgLoader";
import { formatDateInTimezone, getFormattedWeatherDate } from "./helpers";

const updatePrimaryWeatherInfo = (data) => {
  insertSVG(global.main.weatherIcon, getSVG(data.icon));

  const dataMap = {
    temperature: data.temperature,
    feelsLike: data.feelsLike,
    pressure: data.pressure,
    windSpeed: data.windSpeed,
    humidity: data.humidity,
    cloudCover: data.cloudCover,
  };

  Object.entries(dataMap).forEach(([key, value]) => {
    if (global.values[key]) global.values[key].textContent = Math.round(value);
  });
};

const updateSuntimeDisplay = (timeString, type) => {
  const element = global.header[type]?.querySelector(".header__suntime-time");
  if (element && timeString) element.textContent = formatTimeHHMM(timeString);
};

const updateSuntimeElements = (data) => {
  const suntimeElements = {
    sunrise: data.sunrise,
    sunset: data.sunset,
  };

  Object.entries(suntimeElements).forEach(([key, value]) => {
    updateSuntimeDisplay(value, key);
  });
};

const updateUnitsDisplay = () => {
  const unitMappings = [
    { selector: ".temperature-unit", american: "F", metric: "C" },
    { selector: ".speed-unit", american: "mph", metric: "km/h" },
  ];

  unitMappings.forEach(({ selector, american, metric }) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = global.vars.useAmericanUnits ? american : metric;
    });
  });
};

export default (data) => {
  if (!data) return false;

  const offsetDate = formatDateInTimezone(data.date, data.timezone);

  // Update text values
  global.header.descriptionString.textContent = getFormattedWeatherDate(offsetDate);
  global.header.cityName.textContent = data.city;
  global.header.cityInfo.textContent = data.description;
  global.main.conditions.textContent = data.conditions;

  updatePrimaryWeatherInfo(data);

  updateSuntimeElements(data);

  updateUnitsDisplay();

  updateForecastItems(data);
};

const formatTimeHHMM = (timeString) => {
  return timeString?.split(":").slice(0, 2).join(":") || "";
};

const updateForecastItems = (data) => {
  const offsetDate = formatDateInTimezone(data.date, data.timezone);
  const startHour = offsetDate.getHours() + 1;

  global.main.forecastItems.forEach((item, index) => {
    const hoursOffset = global.vars.forecastHoursOffset;
    const hourIndex = startHour + hoursOffset + hoursOffset * index;
    const hourData = data.hours[hourIndex];

    if (!hourData) return;

    const temperatureElement = item.querySelector(".value__forecast-temperature");
    const timeElement = item.querySelector(".value__forecast-time");

    if (temperatureElement) temperatureElement.textContent = Math.round(hourData.temp);
    if (timeElement) timeElement.textContent = formatTimeHHMM(hourData.datetime);

    insertSVG(item, getSVG(hourData.icon));
  });
};
