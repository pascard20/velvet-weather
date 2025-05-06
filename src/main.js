import "./reset.css";
import "./style.css";
import { convertTemperature } from "./utils.js";
import global from "./globals.js";

const getWeatherData = async (city) => {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=BKMHT9RRE3SVDCSCK5Y442MEE&contentType=json`;
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

global.elem.sunset.insertAdjacentHTML(
  "afterbegin",
  `
  <img src=${global.svg.sunset}></img>
  `
);

global.elem.sunrise.insertAdjacentHTML(
  "afterbegin",
  `
    <img src=${global.svg.sunrise}></img>
    `
);
