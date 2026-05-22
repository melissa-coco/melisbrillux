export function computeRhombusVertices(cx, cy, rx, ry) {
  return [
    { x: cx + rx, y: cy },
    { x: cx, y: cy + ry },
    { x: cx - rx, y: cy },
    { x: cx, y: cy - ry },
  ];
}

export function computeGroup(cx, cy, baseRx, baseRy, scaleSmall, scaleMedium, scaleLarge) {
  const ss = scaleSmall / 100;
  const sm = scaleMedium / 100;
  const sl = scaleLarge / 100;
  return [
    { vertices: computeRhombusVertices(cx, cy, baseRx * sl, baseRy * sl), level: 0 },
    { vertices: computeRhombusVertices(cx, cy, baseRx * sm, baseRy * sm), level: 1 },
    { vertices: computeRhombusVertices(cx, cy, baseRx * ss, baseRy * ss), level: 2 },
  ];
}

export function computeGrid(params) {
  const {
    cols, rows, canvasWidth, canvasHeight,
    baseWidth, baseHeight, scaleSmall, scaleMedium, scaleLarge,
    gapH, gapV,
    marginTop, marginRight, marginBottom, marginLeft,
  } = params;
  const sl = scaleLarge / 100;

  const rxLarge = baseWidth * sl;
  const ryLarge = baseHeight * sl;

  const hStep = cols > 1 ? (canvasWidth - marginLeft - marginRight - 2 * rxLarge) / (cols - 1) + gapH : 0;
  const vStep = rows > 1 ? (canvasHeight - marginTop - marginBottom - 2 * ryLarge) / (rows - 1) + gapV : 0;
  const startX = marginLeft + rxLarge;
  const startY = marginTop + ryLarge;

  const groups = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const cx = startX + c * hStep;
      const cy = startY + r * vStep;
      row.push(computeGroup(cx, cy, baseWidth, baseHeight, scaleSmall, scaleMedium, scaleLarge));
    }
    groups.push(row);
  }

  return groups;
}
