import { computeGrid } from './geometry.js';
import { render } from './renderer.js';
import { createPanel } from './ui.js';
import { exportSVG, exportPNG } from './export.js';

const svg = document.getElementById('canvas');
const panel = document.getElementById('panel');

const params = {
  canvasWidth: 1920,
  canvasHeight: 1080,
  cols: 5,
  rows: 5,
  baseWidth: 80,
  baseHeight: 50,
  scaleMedium: 150,
  scaleLarge: 180,
  strokeWidth: 2,
  strokeColor: '#000000',
  fillColor: '#ffffff',
  opacity: 1,
};

function update() {
  const groups = computeGrid(params);
  render(svg, groups, params);
}

const { svgBtn, pngBtn } = createPanel(panel, params, () => update());

svgBtn.addEventListener('click', () => exportSVG(svg));
pngBtn.addEventListener('click', () => exportPNG(svg, params.canvasWidth, params.canvasHeight));

update();
