import "./reset.css";
import "./style.css";
import { convertTemperature, convertSpeed } from "./utils.js";
import global from "./globals.js";
import { initSVGLoader, insertSVG, getSVG } from "./svgLoader.js";
import { getFormattedWeatherDate, formatDateInTimezone } from "./helpers.js";

const getWeatherData = async (city) => {
  if (!city) {
    throw new Error("City required");
  }

  try {
    const url = new URL(
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline"
    );
    url.pathname += `/${encodeURIComponent(city)}`;
    url.search = new URLSearchParams({
      unitGroup: global.vars.useAmericanUnits ? "us" : "metric",
      key: "BKMHT9RRE3SVDCSCK5Y442MEE",
      contentType: "json",
    }).toString();

    const response = await fetch(url, { mode: "cors" });

    if (!response.ok) {
      throw new Error(
        response.status === 400
          ? "Invalid location"
          : `API error (${response.status})`
      );
    }

    const data = await response.json();

    // Location data
    const addressParts = data.resolvedAddress.split(", ");
    const cityName = addressParts[0];
    const cityDescription = addressParts.slice(1, 3).join(", ");

    console.log(data);

    const weatherData = {
      city: cityName,
      description: cityDescription,
      sunrise: data.currentConditions.sunrise,
      sunset: data.currentConditions.sunset,
      date: new Date(data.currentConditions.datetimeEpoch * 1000),
      timezone: data.timezone,
      feelsLike: data.currentConditions.feelslike,
      cloudCover: data.currentConditions.cloudcover,
      humidity: data.currentConditions.humidity,
      pressure: data.currentConditions.pressure,
      temperature: data.currentConditions.temp,
      windSpeed: data.currentConditions.windspeed,
      icon: data.currentConditions.icon,
      conditions: data.currentConditions.conditions,
      hours: [...data.days[0].hours, ...data.days[1].hours],
    };

    global.vars.cachedData = weatherData;
    return weatherData;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return null;
  }
};

const printData = (data) => {
  if (data) {
    const offsetDate = formatDateInTimezone(data.date, data.timezone);

    global.header.descriptionString.textContent =
      getFormattedWeatherDate(offsetDate);
    const startHour = offsetDate.getHours() + 1;

    const dataMap = new Map([
      ["temperature", data.temperature],
      ["feelsLike", data.feelsLike],
      ["pressure", data.pressure],
      ["windSpeed", data.windSpeed],
      ["humidity", data.humidity],
      ["cloudCover", data.cloudCover],
    ]);

    insertSVG(global.main.weatherIcon, getSVG(data.icon));

    dataMap.forEach((dataValue, elementName) => {
      global.values[elementName].textContent = Math.round(dataValue);
    });

    // Sunrise and sunset time
    const findSuntimeElement = (suntimeType) => {
      return global.header[suntimeType].querySelector(".header__suntime-time");
    };

    const suntimeElements = new Map([
      [data.sunrise, findSuntimeElement("sunrise")],
      [data.sunset, findSuntimeElement("sunset")],
    ]);

    suntimeElements.forEach((element, value) => {
      element.textContent = value.split(":").slice(0, 2).join(":");
    });

    const units = new Map([
      [["F", "C"], document.querySelectorAll(".temperature-unit")],
      [["mph", "km/h"], document.querySelectorAll(".speed-unit")],
    ]);
    const isAmerican = global.vars.useAmericanUnits;

    units.forEach((elements, unitChoice) => {
      elements.forEach((element) => {
        element.textContent = isAmerican ? unitChoice[0] : unitChoice[1];
      });
    });

    global.header.cityName.textContent = data.city;
    global.header.cityInfo.textContent = data.description;

    global.main.conditions.textContent = data.conditions;
    global.main.forecastItems.forEach((item, index) => {
      const currentHour = startHour + 3 + 3 * index;
      const temperatureElement = item.querySelector(
        ".value__forecast-temperature"
      );
      const timeElement = item.querySelector(".value__forecast-time");

      temperatureElement.textContent = Math.round(data.hours[currentHour].temp);
      timeElement.textContent = data.hours[currentHour].datetime
        .split(":")
        .splice(0, 2)
        .join(":");
      insertSVG(item, getSVG(data.hours[currentHour].icon));
    });
  }
};

const handleUnitChange = () => {
  global.vars.useAmericanUnits = global.header.unitSwitch.checked;

  const units = global.vars.useAmericanUnits
    ? {
        temperature: { input: "C", output: "F" },
        speed: { input: "kph", output: "mph" },
      }
    : {
        temperature: { input: "F", output: "C" },
        speed: { input: "mph", output: "kph" },
      };
  const data = global.vars.cachedData;

  data.feelsLike = convertTemperature(
    data.feelsLike,
    units.temperature.input,
    units.temperature.output
  );
  data.temperature = convertTemperature(
    data.temperature,
    units.temperature.input,
    units.temperature.output
  );
  data.hours.forEach((hour) => {
    hour.temp = convertTemperature(
      hour.temp,
      units.temperature.input,
      units.temperature.output
    );
  });
  data.windSpeed = convertSpeed(
    data.windSpeed,
    units.speed.input,
    units.speed.output
  );

  printData(data);
};

const handleFormSubmit = async (event) => {
  event.preventDefault();
  const place = global.header.input.value;
  const weatherData = await getWeatherData(place);
  printData(weatherData);
};

global.header.form.addEventListener("submit", handleFormSubmit);
global.header.unitSwitch.addEventListener("click", handleUnitChange);

// Load SVGs
(async () => {
  await initSVGLoader();

  const iconMap = new Map([
    [global.header.sunset, "sunset"],
    [global.header.sunrise, "sunrise"],
    [global.header.button, "magnifying-glass"],
    [global.main.weatherIcon, "clear-day"],
    [global.main.airPressure, "barometer"],
    [global.main.windSpeed, "windsock"],
    [global.main.humidity, "humidity"],
    [global.main.cloudCover, "cloudy"],
  ]);

  const mainForecastMap = [
    "clear-day",
    "clear-day",
    "clear-day",
    "partly-cloudy-day",
    "partly-cloudy-night",
    "clear-night",
    "clear-night",
  ];

  document
    .querySelectorAll(".main__forecast-item")
    .forEach((element, index) => {
      insertSVG(element, getSVG(mainForecastMap[index]));
    });

  iconMap.forEach((iconName, element) => {
    insertSVG(element, getSVG(iconName));
  });

  const cities = [
    "Tokyo",
    "New York",
    "Paris",
    "London",
    "Sydney",
    "Rio de Janeiro",
    "Cape Town",
    "Istanbul",
    "Warszawa",
    "Madrid",
    "Rome",
    "Singapore",
    "Berlin",
    "Buenos Aires",
  ];

  const index = Math.floor(Math.random() * cities.length);

  const initData = await getWeatherData(cities[index]);
  printData(initData);
  global.elem.appWrapper.classList.add("active");
})();
