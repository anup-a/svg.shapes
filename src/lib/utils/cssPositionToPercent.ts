export function cssPositionToPercent(cssPosition: String): {
  cx: number;
  cy: number;
} {
  const cssPostionArr = cssPosition.split(" ");

  let cx = 25,
    cy = 25;

  if (cssPostionArr.length === 3) cy = 50;
  if (cssPostionArr.at(-1) === "bottom") cy = 75;
  if (cssPostionArr.at(2) === "right") cx = 75;
  if (cssPostionArr.at(2) === "center") cx = 50;

  return { cx, cy };
}
