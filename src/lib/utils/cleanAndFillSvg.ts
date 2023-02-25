import { Svg, SVG } from "@svgdotjs/svg.js";
import { cssPositionToPercent } from "./cssPositionToPercent";

export function cleanAndFillSvg(
  svgString: string,
  fillType: "solid" | "gradient",
  fill: any
) {
  const svg = SVG(svgString) as unknown as Svg;
  const children = svg.children();
  let selectedFill: any = fill;

  const defs = children.filter((child) => {
    return child.type === "defs";
  });

  if (defs.length) {
    defs?.at(0)?.remove();
  }

  const elements = children.filter((child) => {
    return child.type !== "defs";
  });

  if (fillType === "gradient") {
    const gradient = svg.gradient(fill.mode, function (add) {
      fill.stops.forEach((stop) => {
        add.stop({ ...stop });
      });
    });

    if (fill.mode === "radial") {
      const position = cssPositionToPercent(fill.direction);
      gradient.attr("cx", position.cx + "%");
      gradient.attr("cy", position.cy + "%");
    } else {
      gradient.attr("gradientTransform", `rotate(${fill.angle} 0.5 0.5)`);
    }

    selectedFill = gradient;
  }

  for (const element of elements) {
    if (element.type === "g") {
      element.children().forEach((child) => {
        if (typeof child.fill === "function") child.fill(selectedFill);
      });
    } else if (element.type === "path") {
      element.fill(selectedFill);
    }
  }

  return svg;
}
