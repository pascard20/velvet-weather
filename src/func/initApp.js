import global from "../utils/globals.js";
import { setWeatherElementsVisibility } from "../utils/helpers.js";
import { insertSVG, getSVG, initSVGLoader } from "./svgLoader.js";
import printData from "./printData.js";
import getWeatherData from "./getWeatherData.js";

const loadInterfaceIcons = () => {
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
    if (element) insertSVG(element, getSVG(iconName));
  });
};

const setAppVisibility = (isVisible) => {
  const elementsToActivate = [global.elem.appWrapper, global.elem.footer];
  const action = isVisible ? "add" : "remove";

  elementsToActivate.forEach((element) => {
    if (element) element.classList[action]("active");
  });
};

const selectRandomCity = () => {
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
  return cities[index];
};

const toggleLoadingVisibility = () => {
  global.elem.bodyLoadAnimation.classList.toggle("active");
};

export default async () => {
  try {
    toggleLoadingVisibility();
    await initSVGLoader();
    loadInterfaceIcons();

    const initialCity = selectRandomCity();
    const initialWeatherData = await getWeatherData(initialCity);
    if (initialWeatherData) {
      global.vars.areElementsActive = true;
      printData(initialWeatherData);
    } else {
      setWeatherElementsVisibility(false);
    }
  } catch (error) {
    console.error("Failed to initialize the app:", error);
    setWeatherElementsVisibility(false);
  }

  setAppVisibility(true);
  toggleLoadingVisibility();
};
