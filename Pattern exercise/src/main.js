import { computeGrid } from './geometry.js';
import { render } from './renderer.js';
import { createPanel } from './ui.js';
import { exportSVG, exportPNG } from './export.js';

const svg = document.getElementById('canvas');
const panel = document.getElementById('panel');

const params = {
  canvasWidth: 1400,
  canvasHeight: 900,
  cols: 6,
  rows: 5,
  baseWidth: 65,
  baseHeight: 56,
  scaleSmall: 38,
  scaleMedium: 131,
  scaleLarge: 180,
  gapH: 0,
  gapV: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  strokeWidth: 2,
  strokeColor: '#000000',
  noStroke: false,
  fillColor: '#ffffff',
  noFill: false,
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

// === Navbar ===
const langBtn = document.getElementById('lang-toggle')
let lang = localStorage.getItem('lang') || 'it'

function applyLang(l) {
  lang = l
  localStorage.setItem('lang', l)
  document.querySelectorAll('[data-it],[data-en]').forEach(el => {
    if (el.dataset[l]) el.textContent = el.dataset[l]
  })
  langBtn.textContent = l === 'it' ? 'EN' : 'IT'
}

langBtn.addEventListener('click', () => {
  applyLang(lang === 'it' ? 'en' : 'it')
})

applyLang(lang)
