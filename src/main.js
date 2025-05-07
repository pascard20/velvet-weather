import "./reset.css";
import "./style.css";
import { convertTemperature } from "./utils.js";
import global from "./globals.js";
import { initSVGLoader, insertSVG } from "./svgLoader.js";

const getWeatherData = async (city) => {
  const apiKey = "BKMHT9RRE3SVDCSCK5Y442MEE";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`;
  const response = await fetch(url, { mode: "cors" });
  const data = await response.json();
  // const { conditions, feelslike, humidity, pressure, temp, windspeed } =
  data.currentConditions;

  return {
    location: data.resolvedAddress,
    current: data.currentConditions,
    nextWeek: data.days.slice(0, 7),
  };
};

const handleFormSubmit = async (event) => {
  event.preventDefault();
  const place = event.target.querySelector(".form__input")?.value;
  const weatherData = await getWeatherData(place);
  console.log(weatherData);
};

global.elem.form.addEventListener("submit", handleFormSubmit);

// Load SVGs
(async () => {
  const svgLoader = await initSVGLoader();

  const iconMap = new Map([
    [global.elem.headerSunset, "sunset"],
    [global.elem.headerSunrise, "sunrise"],
    [global.elem.formButton, "magnifying-glass"],
    [global.elem.mainWeatherIcon, "clear-day"],
    [global.elem.mainAirPressure, "barometer"],
    [global.elem.mainWindSpeed, "windsock"],
    [global.elem.mainHumidity, "humidity"],
    [global.elem.mainRainChance, "umbrella"],
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
      insertSVG(element, svgLoader.getSVG(mainForecastMap[index]));
    });

  iconMap.forEach((iconName, element) => {
    insertSVG(element, svgLoader.getSVG(iconName));
  });
})();
