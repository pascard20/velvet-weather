import DOMPurify from "dompurify";

export const capitalizeString = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const generateID = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
};

export const escapeHTML = (baseText) => {
  if (typeof baseText !== "string") {
    return baseText;
  }

  return baseText
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const sanitize = (baseHTML) => {
  return DOMPurify.sanitize(baseHTML);
};

export const convertSpeed = (speed, inputUnit, targetUnit) => {
  const conversionMultiplier = 1.60934;
  const conversionRates = {
    mph: { kph: 1 * conversionMultiplier },
    kph: { mph: 1 / conversionMultiplier },
  };

  if (inputUnit === targetUnit) return speed;

  const rate = conversionRates[inputUnit]?.[targetUnit];
  return rate ? Math.round(speed * rate) : speed;
};

export const convertTemperature = (degrees, inputUnit, targetUnit) => {
  const units = ["C", "F", "K"];
  if (!units.includes(inputUnit) || !units.includes(targetUnit)) {
    console.warn("convertTemperature: Unknown unit, returning original value.");
    return degrees;
  }

  if (inputUnit === targetUnit) return degrees;

  const toKelvin = (value, unit) => {
    switch (unit) {
      case "C":
        return value + 273.15;
      case "F":
        return (value - 32) * (5 / 9) + 273.15;
      case "K":
        return value;
    }
  };

  const fromKelvin = (kelvin, unit) => {
    switch (unit) {
      case "C":
        return kelvin - 273.15;
      case "F":
        return kelvin * (9 / 5) - 459.67;
      case "K":
        return kelvin;
    }
  };

  const kelvin = toKelvin(degrees, inputUnit);
  const result = fromKelvin(kelvin, targetUnit);

  return Math.round(result * 100) / 100;
};

export const importFileAsText = async (url) => {
  const response = await fetch(url);
  return await response.text();
};
