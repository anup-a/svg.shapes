import { writable } from "svelte/store";

export const selectedSvg = writable(null);

export const fill = writable({
  color: "#fff",
  type: "gradient" as "gradient" | "solid",
  gradient: {
    _raw: "linear-gradient(rgba(255, 0, 109, 1), rgba(255, 136, 230, 1))",
    _mode: "linear",
    _angle: 0,
    _stops: [
      {
        loc: 0,
        color: "rgba(255, 0, 109, 1)",
      },
      {
        loc: 1,
        color: "rgba(255, 136, 230, 1)",
      },
    ],
  },
});
