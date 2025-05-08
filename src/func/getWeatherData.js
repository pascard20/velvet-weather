import global from "../utils/globals.js";
import { setWeatherElementsVisibility } from "../utils/helpers.js";

const setLoadingState = (isLoading) => {
  const action = isLoading ? "add" : "remove";
  global.header.loadAnimation?.classList[action]("active");
};

const getURL = (config) => {
  const url = new URL(config.baseUrl);
  url.pathname += `/${encodeURIComponent(config.searchTerm)}`;
  url.search = new URLSearchParams({
    unitGroup: config.unitGroup,
    key: config.key,
    contentType: config.contentType,
  }).toString();
  return url;
};

const fetchWeatherData = async (city) => {
  const urlConfig = {
    baseUrl:
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline",
    key: "BKMHT9RRE3SVDCSCK5Y442MEE",
    contentType: "json",
    unitGroup: global.vars.useAmericanUnits ? "us" : "metric",
    searchTerm: city,
  };

  const url = getURL(urlConfig);
  const response = await fetch(url, { mode: "cors" });

  if (!response.ok) {
    throw new Error(
      response.status === 400 ? "Invalid location" : `API error (${response.status})`,
    );
  }

  return response.json();
};

export default async (city) => {
  if (!city?.trim()) {
    console.warn("City name is required");
    return false;
  }

  setLoadingState(true);

  try {
    const data = await fetchWeatherData(city);

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
    if (!global.vars.areElementsActive) setWeatherElementsVisibility(true);

    return weatherData;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return null;
  } finally {
    global.header.loadAnimation.classList.remove("active");
  }
};
