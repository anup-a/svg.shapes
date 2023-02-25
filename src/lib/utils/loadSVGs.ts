import { Svg, SVG } from "@svgdotjs/svg.js";
import presets from "./../../assets/presets.json";
import svgSource from "./../../assets/svg.json";

export function initSVGs(flushDefinitions: boolean = true) {
  return Object.entries(svgSource).map(([name, string]) => {
    const svg = SVG(string) as unknown as Svg;
    const children = svg.children();

    const defs = children.filter((child) => {
      return child.type === "defs";
    });

    flushDefinitions && defs?.at(0)?.remove();

    if (flushDefinitions || !defs.length) {
      const elements = children.filter((child) => {
        return child.type !== "defs";
      });

      const randomGradient =
        presets[Math.floor(Math.random() * presets.length)];

      const gradient = svg.gradient("linear", function (add) {
        randomGradient.forEach((c) => {
          add.stop(c.pos / 100, c.color);
        });
      });

      for (const element of elements) {
        if (element.type === "g") {
          element.children().forEach((child) => {
            if (typeof child.fill === "function") child.fill(gradient);
          });
        } else if (element.type === "path") {
          element.fill(gradient);
        }
      }
    }

    return svg;
  });
}
