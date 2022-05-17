export const polarToCartesian = (centerX: number, centerY: number, radius: number, deg: number) => {
  const rad = (deg - 90) * Math.PI / 180.0;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: centerX + (radius * cos),
    y: centerY + (radius * sin)
  };
}