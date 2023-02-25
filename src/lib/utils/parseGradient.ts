export function parseGradient(gpickr: any) {
  const angle = gpickr._angle;
  const stops = gpickr._stops;
  const mode = gpickr._mode;

  return {
    mode,
    angle,
    stops: stops.map((stop) => {
      const color: String = stop.color;
      return {
        offset: stop.loc,
        color: color.slice(0, color.lastIndexOf(",")) + ")",
        opacity: color.slice(color.lastIndexOf(",") + 1, color.length - 1),
      };
    }),
  };
}
