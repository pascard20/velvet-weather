import "./css/style.css";
import "./css/reset.css";
import "./css/utils.css";
import global from "./utils/globals.js";
import printData from "./func/printData.js";
import initApp from "./func/initApp.js";
import getWeatherData from "./func/getWeatherData.js";
import { changeUnits, escapeHTML, sanitize } from "./utils/helpers.js";

// Handlers
const handleFormSubmit = async (event) => {
  event.preventDefault();
  const inputValue = global.header.input.value.trim();
  const place = sanitize(escapeHTML(inputValue));
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

// Init app
(async () => {
  await initApp();
})();
