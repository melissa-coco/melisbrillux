export function computeRhombusVertices(cx, cy, rx, ry) {
  return [
    { x: cx + rx, y: cy },
    { x: cx, y: cy + ry },
    { x: cx - rx, y: cy },
    { x: cx, y: cy - ry },
  ];
}

export function computeGroup(cx, cy, baseRx, baseRy, scaleMedium, scaleLarge) {
  const sm = scaleMedium / 100;
  const sl = scaleLarge / 100;
  return [
    { vertices: computeRhombusVertices(cx, cy, baseRx * sl, baseRy * sl), level: 0 },
    { vertices: computeRhombusVertices(cx, cy, baseRx * sm, baseRy * sm), level: 1 },
    { vertices: computeRhombusVertices(cx, cy, baseRx, baseRy), level: 2 },
  ];
}

export function computeGrid(params) {
  const { cols, rows, canvasWidth, canvasHeight, baseWidth, baseHeight, scaleMedium, scaleLarge } = params;
  const sm = scaleMedium / 100;
  const sl = scaleLarge / 100;

  const rxLarge = baseWidth * sl;
  const ryLarge = baseHeight * sl;

  const hStep = cols > 1 ? (canvasWidth - 2 * rxLarge) / (cols - 1) : 0;
  const vStep = rows > 1 ? (canvasHeight - 2 * ryLarge) / (rows - 1) : 0;

  const groups = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const cx = rxLarge + c * hStep;
      const cy = ryLarge + r * vStep;
      row.push(computeGroup(cx, cy, baseWidth, baseHeight, scaleMedium, scaleLarge));
    }
    groups.push(row);
  }

  return groups;
}
