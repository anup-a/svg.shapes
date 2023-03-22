import { writable } from "svelte/store";
import { loadSVG } from "../utils/load-svgs";

const defaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="none" viewBox="0 0 200 200"><path fill="url(&quot;#a&quot;)" d="M165.963 134.037c-5.467 5.467-14.332 5.467-19.799 0l-24.137-24.138c-5.468-5.467-5.468-14.331 0-19.799l24.137-24.137c5.467-5.467 14.332-5.467 19.799 0L190.101 90.1c5.467 5.468 5.467 14.332 0 19.799l-24.138 24.138Zm-112.127 0c-5.467 5.467-14.332 5.467-19.8 0L9.9 109.899c-5.468-5.467-5.468-14.331 0-19.799l24.137-24.137c5.467-5.467 14.332-5.467 19.799 0L77.973 90.1c5.468 5.468 5.468 14.332 0 19.799l-24.137 24.138ZM109.9 190.1c-5.468 5.468-14.332 5.468-19.8 0l-24.137-24.137c-5.467-5.467-5.467-14.332 0-19.799l24.138-24.137c5.467-5.468 14.331-5.468 19.799 0l24.137 24.137c5.467 5.467 5.467 14.332 0 19.799L109.9 190.1Zm0-112.127c-5.468 5.468-14.332 5.468-19.8 0L65.963 53.836c-5.467-5.468-5.467-14.332 0-19.8L90.101 9.9c5.467-5.467 14.331-5.467 19.799 0l24.137 24.138c5.467 5.467 5.467 14.331 0 19.799L109.9 77.973Z"/><defs><linearGradient id="a"><stop stop-color="rgba(105, 234, 203)" offset="0"/><stop stop-color="rgba(234, 204, 248)" offset=".48"/><stop stop-color="rgba(102, 84, 241)" offset="1"/></linearGradient></defs></svg>`;

export const selectedSvg = writable(loadSVG(defaultSVG));

export const stroke = writable({
  enabled: false,
  strokeData: {
    _width: 2,
    _color: "#FFFFFF",
  },
});

export const fill = writable({
  color: "#fff",
  type: "gradient" as "gradient" | "solid",
  gradient: {
    _raw: "linear-gradient(#69eacb 0%, #eaccf8 48%, #6654f1 100%)",
    _mode: "linear",
    _angle: 0,
    _stops: [
      {
        loc: 0,
        color: "rgba(105, 234, 203, 1)",
      },
      {
        loc: 0.48,
        color: "rgba(234, 204, 248, 1)",
      },
      {
        loc: 1,
        color: "rgba(102, 84, 241, 1)",
      },
    ],
  },
});
