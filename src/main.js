import "./reset.css";
import "./style.css";
import { convertTemperature, convertSpeed } from "./utils.js";
import global from "./globals.js";
import { initSVGLoader, insertSVG, getSVG } from "./svgLoader.js";
import { getFormattedWeatherDate, formatDateInTimezone } from "./helpers.js";
import printData from "./printData.js";

const getWeatherData = async (city) => {
  if (!city?.trim()) {
    return Promise.reject(new Error("City name is required"));
  }

  global.header.loadAnimation.classList.add("active");

  try {
    const url = new URL(
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline",
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
        response.status === 400 ? "Invalid location" : `API error (${response.status})`,
      );
    }

    const data = await response.json();

    // Location data
    const addressParts = data.resolvedAddress.split(", ");

    const weatherData = {
      city: addressParts[0],
      description: addressParts.slice(1, 3).join(", "),
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
    if (!global.vars.areElementsActive) {
      global.elemToDeactivate.forEach((element) => {
        element.classList.remove("inactive");
      });
    }
    return weatherData;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return null;
  } finally {
    global.header.loadAnimation.classList.remove("active");
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
    units.temperature.output,
  );
  data.temperature = convertTemperature(
    data.temperature,
    units.temperature.input,
    units.temperature.output,
  );
  data.hours.forEach((hour) => {
    hour.temp = convertTemperature(
      hour.temp,
      units.temperature.input,
      units.temperature.output,
    );
  });
  data.windSpeed = convertSpeed(data.windSpeed, units.speed.input, units.speed.output);

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
    [global.main.airPressure, "barometer"],
    [global.main.windSpeed, "windsock"],
    [global.main.humidity, "humidity"],
    [global.main.cloudCover, "cloudy"],
    [global.elem.footerLink, "github"],
  ]);

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
  if (initData) {
    global.vars.areElementsActive = true;
    printData(initData);
  } else {
    global.elemToDeactivate.forEach((element) => {
      element.classList.add("inactive");
    });
  }
  [global.elem.appWrapper, global.elem.footer].forEach((element) => {
    element.classList.add("active");
  });
})();
