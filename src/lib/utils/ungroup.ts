import type { Element } from "@svgdotjs/svg.js";

export const ungroup = (element: Element) => {
  if (element.type !== "g")
    return {
      done: false,
    };

  const children = [];
  const node = element;
  const current = [...node.children()];

  while (current.length) {
    const child = current.shift();
    if (child.type === "g") {
      const gChildren = child.children();
      current.push(...gChildren);
    } else {
      children.push(child);
    }
  }

  return {
    done: true,
    children,
  };
};
