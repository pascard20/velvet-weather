import "./reset.css";
import "./style.css";
import global from "./globals.js";
import printData from "./printData.js";
import initApp from "./initApp.js";
import getWeatherData from "./getWeatherData.js";
import { changeUnits } from "./helpers";

// Handlers
const handleFormSubmit = async (event) => {
  event.preventDefault();
  const place = global.header.input.value.trim();
  const weatherData = await getWeatherData(place);
  printData(weatherData);
};

const handleUnitSwitch = (event) => {
  global.vars.useAmericanUnits = event.target.checked;
  const data = changeUnits();
  printData(data);
};

// Events
global.header.form.addEventListener("submit", handleFormSubmit);
global.header.unitSwitch.addEventListener("click", handleUnitSwitch);

// Init
(async () => {
  await initApp();
})();
