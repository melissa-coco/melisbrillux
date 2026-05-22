export function render(svgElement, groups, params) {
  const { canvasWidth, canvasHeight, strokeWidth, strokeColor, noStroke, fillColor, noFill, opacity } = params;

  svgElement.setAttribute('width', canvasWidth);
  svgElement.setAttribute('height', canvasHeight);
  svgElement.setAttribute('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);

  while (svgElement.firstChild) svgElement.removeChild(svgElement.firstChild);

  groups.forEach(row => {
    row.forEach(group => {
      group.forEach(rhombus => {
        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const points = rhombus.vertices.map(v => `${v.x},${v.y}`).join(' ');
        poly.setAttribute('points', points);
        poly.setAttribute('stroke', noStroke ? 'none' : strokeColor);
        poly.setAttribute('stroke-width', String(strokeWidth));
        poly.setAttribute('fill', noFill ? 'none' : fillColor);
        poly.setAttribute('opacity', String(opacity));
        svgElement.appendChild(poly);
      });
    });
  });
}
