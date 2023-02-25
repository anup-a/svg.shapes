import { writable } from "svelte/store";

export const selectedIndex = writable(0);

export const fill = writable({
  color: "#fff",
  gradient: {
    _mode: "linear",
    _angle: 0,
    _stops: [
      {
        loc: 0,
        color: "rgba(255, 132, 109, 1)",
      },
      {
        loc: 1,
        color: "rgba(255, 136, 230, 1)",
      },
    ],
  },
});
