import global from "./globals.js";
import { importFileAsText } from "./utils";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

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
