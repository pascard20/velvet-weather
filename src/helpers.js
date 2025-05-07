import global from "./globals.js";
import { importFileAsText } from "./utils";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

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
