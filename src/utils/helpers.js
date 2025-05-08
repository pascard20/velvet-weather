import global from "./globals.js";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { convertTemperature, convertSpeed } from "./utils.js";

export const formatDateInTimezone = (date, timeZone) => {
  const dateString = date.toLocaleString("en-GB", {
    timeZone,
    dateStyle: "short",
    timeStyle: "medium",
    hour12: false,
  });

  const [datePart, timePart] = dateString.split(", ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes, seconds);
};

export const getFormattedWeatherDate = (date = new Date()) => {
  const dayWithOrdinal = format(date, "do", { locale: enUS }); // e.g., "7th"
  const weekday = format(date, "EEEE"); // e.g., "Wednesday"
  const month = format(date, "MMMM"); // e.g., "May"
  const year = format(date, "yyyy");
  const time = format(date, "HH:mm"); // e.g., "12:35 PM"

  const output = global.vars.useAmericanUnits
    ? `Weather for ${weekday}, ${month} ${dayWithOrdinal}, ${year} at ${time}`
    : `Weather for ${weekday}, ${dayWithOrdinal} ${month}, ${year} at ${time}`;

  return output;
};

export const setWeatherElementsVisibility = (isVisible) => {
  const action = isVisible ? "remove" : "add";
  global.elemToDeactivate?.forEach((element) => {
    element.classList[action]("inactive");
  });
};

export const changeUnits = () => {
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

  return data;
};
