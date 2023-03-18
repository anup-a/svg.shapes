import { writable } from "svelte/store";
import { loadSVG } from "../utils/load-svgs";
import svgSource from "./../../assets/svg.json";

let index = 42; // answer to life the universe and everything
index += 4;

export const selectedSvg = writable(
  loadSVG(Object.values(svgSource).at(index))
);

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
