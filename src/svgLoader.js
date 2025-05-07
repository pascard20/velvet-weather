const svgContents = {};
const svgCache = {};

// Dynamic webpack import contexts
const svgImportContexts = [
  // eslint-disable-next-line no-undef
  require.context("../svg/weather", false, /\.svg$/),
  // eslint-disable-next-line no-undef
  require.context("../svg/ui", false, /\.svg$/),
];

const getFilenameFromPath = (path) => {
  const parts = path.split("/");
  const filename = parts[parts.length - 1];
  return filename.replace(/\.[^/.]+$/, ""); // Remove file extension
};

const importAllSVGs = async () => {
  svgImportContexts.forEach((context) => {
    const paths = context.keys();
    paths.forEach((path) => {
      const iconName = getFilenameFromPath(path);
      try {
        const svgContent = context(path);
        svgContents[iconName] =
          typeof svgContent === "string"
            ? svgContent
            : svgContent.default || "";
      } catch (error) {
        console.error(`Error loading SVG ${iconName}:`, error);
      }
    });
  });
  return svgContents;
};

// Fetch actual SVG content from URL
const fetchSVG = async (url) => {
  if (url.startsWith("<svg")) return url;
  if (svgCache[url]) return svgCache[url];

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.status}`);
    }
    const svgText = await response.text();
    svgCache[url] = svgText;
    return svgText;
  } catch (error) {
    console.error(`Error fetching SVG from ${url}:`, error);
    return null;
  }
};

const disableAnimations = (svgElement) => {
  if (!svgElement) return;

  const animations = svgElement.querySelectorAll("animate, animateTransform");
  animations.forEach((anim) => {
    anim.remove();
  });
};

const insertSVG = async (element, svgURL) => {
  const iconContainer = element?.querySelector(".svg-icon");
  if (!iconContainer) {
    console.warn("insertSVG: no container found");
    return;
  }

  const svgContent = await fetchSVG(svgURL);
  if (!svgContent) {
    console.error("Failed to fetch SVG content");
    return;
  }

  iconContainer.innerHTML = svgContent;

  if (!iconContainer.classList.contains("animated")) {
    const svgElement = iconContainer.querySelector("svg");
    disableAnimations(svgElement);
  }
};

const getSVG = (iconName) => {
  return svgContents[iconName] || null;
};

const initSVGLoader = async () => {
  await importAllSVGs();
  return {
    getSVG,
    insertSVG,
    getAll: () => svgContents,
  };
};

export { getSVG, initSVGLoader, insertSVG };
