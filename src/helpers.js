import global from "./globals.js";
import { importFileAsText } from "./utils";

export const importSVGs = async () => {
  for (const key in global.svgURLs) {
    global.svgContents[key] = await importFileAsText(global.svgURLs[key]);
  }
};
