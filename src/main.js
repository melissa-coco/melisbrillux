import { computeGrid } from './geometry.js';
import { render } from './renderer.js';
import { createPanel } from './ui.js';
import { exportSVG, exportPNG } from './export.js';

const svg = document.getElementById('canvas');
const panel = document.getElementById('panel');

const params = {
  canvasWidth: 1920,
  canvasHeight: 1080,
  r1Width: 120,
  r1Height: 80,
  scaleR2: 70,
  scaleR3: 42,
  gapH: 0,
  gapV: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
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
