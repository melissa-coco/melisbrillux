export function computeRhombusVertices(cx, cy, rx, ry) {
  return [
    { x: cx + rx, y: cy },
    { x: cx, y: cy + ry },
    { x: cx - rx, y: cy },
    { x: cx, y: cy - ry },
  ];
}

export function computeGroup(cx, cy, rx, ry, scaleR2, scaleR3) {
  const s2 = scaleR2 / 100;
  const s3 = scaleR3 / 100;
  return [
    { vertices: computeRhombusVertices(cx, cy, rx, ry), level: 0 },
    { vertices: computeRhombusVertices(cx, cy, rx * s2, ry * s2), level: 1 },
    { vertices: computeRhombusVertices(cx, cy, rx * s2 * s3, ry * s2 * s3), level: 2 },
  ];
}

export function computeGrid(params) {
  const { canvasWidth, canvasHeight, r1Width, r1Height, scaleR2, scaleR3, gapH, gapV, marginTop, marginRight, marginBottom, marginLeft } = params;
  const s2 = scaleR2 / 100;

  const hStep = r1Width * (1 + s2) + gapH;
  const vStep = r1Height * (1 + s2) + gapV;
  const rightBound = canvasWidth - marginRight + r1Width * 4;
  const bottomBound = canvasHeight - marginBottom + r1Height * 4;

  const rows = [];
  let rowOrigin = { x: marginLeft + r1Width, y: marginTop + r1Height };

  while (rowOrigin.y < bottomBound) {
    const row = [];
    let cx = rowOrigin.x;

    while (cx < rightBound) {
      const group = computeGroup(cx, rowOrigin.y, r1Width, r1Height, scaleR2, scaleR3);
      row.push(group);
      cx += hStep;
    }

    if (row.length > 0) rows.push(row);
    rowOrigin.y += vStep;
  }

  return rows;
}
