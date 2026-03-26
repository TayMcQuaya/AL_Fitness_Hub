import { Platform } from "react-native";

const GA_MEASUREMENT_ID = "G-SSY0Z6QS58";

let initialized = false;

export function initAnalytics() {
  if (Platform.OS !== "web" || initialized) return;
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

export function trackScreen(screenName) {
  if (Platform.OS !== "web" || !window.gtag) return;
  window.gtag("event", "screen_view", {
    screen_name: screenName,
  });
}
