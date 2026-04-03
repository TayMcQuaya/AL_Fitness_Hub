import { Platform } from "react-native";

let injected = false;

export function injectWebStyles() {
  if (Platform.OS !== "web" || injected) return;
  injected = true;

  const style = document.createElement("style");
  style.textContent = `
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 40px !important;
      height: 40px !important;
      border-radius: 50% !important;
      cursor: pointer;
    }
    input[type="range"]::-moz-range-thumb {
      width: 40px !important;
      height: 40px !important;
      border-radius: 50% !important;
      border: none;
      cursor: pointer;
    }
    input[type="range"]::-webkit-slider-runnable-track {
      height: 8px !important;
      border-radius: 4px !important;
    }
    input[type="range"]::-moz-range-track {
      height: 8px !important;
      border-radius: 4px !important;
    }
    input[type="range"] {
      height: 40px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
}
