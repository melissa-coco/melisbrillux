# Vector Pattern Tool — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive web tool that generates vector patterns from nested rhombus groups in an intersecting modular grid, with live parameter control and SVG/PNG export.

**Architecture:** Single-page HTML app with 4 independent vanilla JS modules — geometry (pure computation), renderer (SVG DOM), UI (reactive panel), export (Blob/canvas). No frameworks.

**Tech Stack:** Vanilla JS, SVG, HTML/CSS. Test framework: Vitest (for geometry module).

**File Structure:**
```
index.html
src/
  style.css
  main.js         — wiring / init
  geometry.js     — pure geometry engine
  renderer.js     — SVG DOM renderer
  ui.js           — properties panel
  export.js       — SVG + PNG export
vitest.config.js
tests/
  geometry.test.js
```

---

### Task 1: Project scaffolding

**Files:**
- Create: `index.html`
- Create: `src/style.css`
- Create: `src/main.js` (skeleton)
- Create: `src/geometry.js` (skeleton)
- Create: `src/renderer.js` (skeleton)
- Create: `src/ui.js` (skeleton)
- Create: `src/export.js` (skeleton)
- Create: `vitest.config.js`
- Create: `tests/geometry.test.js` (empty test file)

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vector Pattern Tool</title>
  <link rel="stylesheet" href="src/style.css">
</head>
<body>
  <div id="app">
    <div id="canvas-container">
      <svg id="canvas" xmlns="http://www.w3.org/2000/svg"></svg>
    </div>
    <aside id="panel"></aside>
  </div>
  <script type="module" src="src/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `src/style.css`**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
#app { display: flex; height: 100vh; }
#canvas-container { flex: 1; overflow: auto; background: #f5f5f5; display: flex; align-items: flex-start; justify-content: flex-start; padding: 20px; }
#canvas { background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
#panel { width: 280px; min-width: 280px; border-left: 1px solid #ddd; padding: 16px; overflow-y: auto; background: #fff; }
#panel h2 { font-size: 14px; font-weight: 600; margin: 16px 0 8px; text-transform: uppercase; letter-spacing: 0.5px; color: #555; }
#panel h2:first-child { margin-top: 0; }
.control { margin-bottom: 10px; }
.control label { display: block; font-size: 12px; color: #666; margin-bottom: 2px; }
.control input[type="range"] { width: 100%; }
.control input[type="number"] { width: 100%; padding: 4px 6px; border: 1px solid #ccc; border-radius: 4px; font-size: 13px; }
.control input[type="color"] { width: 100%; height: 32px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; }
.btn { display: block; width: 100%; padding: 8px; border: 1px solid #aaa; border-radius: 4px; background: #fff; cursor: pointer; font-size: 13px; margin-bottom: 6px; }
.btn:hover { background: #eee; }
```

- [ ] **Step 3: Create skeleton modules**

`src/geometry.js`:
```js
export function computeRhombusVertices(cx, cy, rx, ry, rotationDeg) {}
export function computeGroup(cx, cy, rx, ry, scaleR2, scaleR3, rotationDeg) {}
export function computeGrid(params) {}
```

`src/renderer.js`:
```js
export function render(svgElement, groups, params) {}
```

`src/ui.js`:
```js
export function createPanel(container, params, onChange) {}
```

`src/export.js`:
```js
export function exportSVG(svgElement) {}
export function exportPNG(svgElement, width, height) {}
```

`src/main.js`:
```js
import { computeGrid } from './geometry.js';
import { render } from './renderer.js';
import { createPanel } from './ui.js';
import { exportSVG, exportPNG } from './export.js';

const svg = document.getElementById('canvas');
const panel = document.getElementById('panel');

const params = {
  canvasWidth: 1920, canvasHeight: 1080,
  r1Width: 120, r1Height: 80,
  scaleR2: 70, scaleR3: 42,
  rotation: 0, gapH: 0, gapV: 0,
  strokeWidth: 2, strokeColor: '#000000', fillColor: '#ffffff', opacity: 1,
};

function update() {
  const groups = computeGrid(params);
  render(svg, groups, params);
}

createPanel(panel, params, () => update());
update();
```

- [ ] **Step 4: Create `vitest.config.js`**

```js
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['tests/**/*.test.js'] } });
```

- [ ] **Step 5: Create `tests/geometry.test.js`**

```js
import { describe, it, expect } from 'vitest';
import { computeRhombusVertices, computeGroup, computeGrid } from '../src/geometry.js';
```

- [ ] **Step 6: Verify scaffolding works**

Run: `npx vitest run`
Expected: "0 tests" or "No test files found"

---

### Task 2: Rhombus vertex computation

**Files:**
- Modify: `src/geometry.js`
- Modify: `tests/geometry.test.js`

- [ ] **Step 1: Write the failing test**

```js
// append to tests/geometry.test.js
describe('computeRhombusVertices', () => {
  it('returns 4 vertices for a centered rhombus', () => {
    const verts = computeRhombusVertices(0, 0, 100, 60, 0);
    expect(verts).toHaveLength(4);
  });
  it('returns symmetric vertices with no rotation', () => {
    const verts = computeRhombusVertices(0, 0, 100, 60, 0);
    expect(verts[0]).toEqual({ x: 100, y: 0 });
    expect(verts[1]).toEqual({ x: 0, y: 60 });
    expect(verts[2]).toEqual({ x: -100, y: 0 });
    expect(verts[3]).toEqual({ x: 0, y: -60 });
  });
  it('rotates vertices correctly by 90 degrees', () => {
    const verts = computeRhombusVertices(0, 0, 100, 60, 90);
    expect(verts[0].x).toBeCloseTo(0);
    expect(verts[0].y).toBeCloseTo(-100);
  });
  it('handles non-zero center', () => {
    const verts = computeRhombusVertices(200, 300, 100, 60, 0);
    expect(verts[0]).toEqual({ x: 300, y: 300 });
    expect(verts[2]).toEqual({ x: 100, y: 300 });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run`
Expected: FAIL — computeRhombusVertices returns undefined

- [ ] **Step 3: Write minimal implementation in `src/geometry.js`**

```js
export function computeRhombusVertices(cx, cy, rx, ry, rotationDeg) {
  const rad = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const offsets = [
    { x: rx, y: 0 },
    { x: 0, y: ry },
    { x: -rx, y: 0 },
    { x: 0, y: -ry },
  ];
  return offsets.map(o => ({
    x: cx + o.x * cos - o.y * sin,
    y: cy + o.x * sin + o.y * cos,
  }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```
git add src/geometry.js tests/geometry.test.js vitest.config.js
git commit -m "feat: add rhombus vertex computation with rotation"
```

---

### Task 3: Group computation (nested rhombuses)

**Files:**
- Modify: `src/geometry.js`
- Modify: `tests/geometry.test.js`

- [ ] **Step 1: Write the failing test**

```js
// append to tests/geometry.test.js
describe('computeGroup', () => {
  it('returns 3 rhombuses', () => {
    const group = computeGroup(0, 0, 100, 60, 70, 42, 0);
    expect(group).toHaveLength(3);
  });
  it('first rhombus is full size', () => {
    const group = computeGroup(0, 0, 100, 60, 70, 42, 0);
    expect(group[0].vertices[0].x).toBe(100);
  });
  it('scales R2 correctly', () => {
    const group = computeGroup(0, 0, 100, 60, 70, 42, 0);
    expect(group[1].vertices[0].x).toBeCloseTo(70);
  });
  it('scales R3 correctly (scale of scale)', () => {
    const group = computeGroup(0, 0, 100, 60, 70, 42, 0);
    expect(group[2].vertices[0].x).toBeCloseTo(42);
  });
  it('all rhombuses share the same center', () => {
    const group = computeGroup(200, 300, 100, 60, 70, 42, 0);
    group.forEach(r => {
      const cx = r.vertices.reduce((s, v) => s + v.x, 0) / 4;
      const cy = r.vertices.reduce((s, v) => s + v.y, 0) / 4;
      expect(cx).toBeCloseTo(200);
      expect(cy).toBeCloseTo(300);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run`
Expected: FAIL — computeGroup not found

- [ ] **Step 3: Write implementation in `src/geometry.js`**

```js
export function computeGroup(cx, cy, rx, ry, scaleR2, scaleR3, rotationDeg) {
  const s2 = scaleR2 / 100;
  const s3 = scaleR3 / 100;
  return [
    { vertices: computeRhombusVertices(cx, cy, rx, ry, rotationDeg), level: 0 },
    { vertices: computeRhombusVertices(cx, cy, rx * s2, ry * s2, rotationDeg), level: 1 },
    { vertices: computeRhombusVertices(cx, cy, rx * s2 * s3, ry * s2 * s3, rotationDeg), level: 2 },
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 5: Commit**

```
git add src/geometry.js tests/geometry.test.js
git commit -m "feat: add group computation with nested scaled rhombuses"
```

---

### Task 4: Grid placement with intersection logic

**Files:**
- Modify: `src/geometry.js`
- Modify: `tests/geometry.test.js`

- [ ] **Step 1: Write the failing test**

```js
// append to tests/geometry.test.js
describe('computeGrid', () => {
  const params = {
    canvasWidth: 500, canvasHeight: 400,
    r1Width: 80, r1Height: 50,
    scaleR2: 70, scaleR3: 42,
    rotation: 0, gapH: 0, gapV: 0,
  };
  it('returns an array of rows', () => {
    const grid = computeGrid(params);
    expect(Array.isArray(grid)).toBe(true);
    expect(grid.length).toBeGreaterThan(0);
  });
  it('each row contains groups', () => {
    const grid = computeGrid(params);
    grid.forEach(row => {
      expect(Array.isArray(row)).toBe(true);
      expect(row.length).toBeGreaterThan(0);
    });
  });
  it('each group has 3 rhombuses with correct levels', () => {
    const grid = computeGrid(params);
    grid.forEach(row => {
      row.forEach(group => {
        expect(group).toHaveLength(3);
        expect(group[0].level).toBe(0);
        expect(group[1].level).toBe(1);
        expect(group[2].level).toBe(2);
      });
    });
  });
  it('R1 and R2 intersect horizontally (no gap)', () => {
    const grid = computeGrid(params);
    const firstRow = grid[0];
    for (let i = 1; i < firstRow.length; i++) {
      const prev = firstRow[i - 1];
      const curr = firstRow[i];
      expect(curr[0].vertices[2]).toEqual(prev[1].vertices[0]);
      expect(curr[1].vertices[2]).toEqual(prev[0].vertices[0]);
    }
  });
  it('R1 and R2 intersect vertically (no gap)', () => {
    const grid = computeGrid(params);
    for (let i = 1; i < grid.length; i++) {
      const above = grid[i - 1][0];
      const curr = grid[i][0];
      expect(curr[0].vertices[3]).toEqual(above[1].vertices[1]);
      expect(curr[1].vertices[3]).toEqual(above[0].vertices[1]);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run`
Expected: FAIL — computeGrid not yet implemented

- [ ] **Step 3: Write implementation in `src/geometry.js`**

```js
export function computeGrid(params) {
  const { canvasWidth, canvasHeight, r1Width, r1Height, scaleR2, scaleR3, rotation, gapH, gapV } = params;
  const s2 = scaleR2 / 100;

  // Offset from a group center to the right vertex of its R1
  const r1Right = computeRhombusVertices(0, 0, r1Width, r1Height, rotation)[0];
  // Offset from a group center to the right vertex of its R2
  const r2Right = computeRhombusVertices(0, 0, r1Width * s2, r1Height * s2, rotation)[0];
  // Offset from a group center to the top vertex of its R1
  const r1Top = computeRhombusVertices(0, 0, r1Width, r1Height, rotation)[3];
  // Offset from a group center to the bottom vertex of its R2
  const r2Bottom = computeRhombusVertices(0, 0, r1Width * s2, r1Height * s2, rotation)[1];

  // For row neighbors: prev center → next center offset (R2_right - R1_left)
  // R1_left = -r1Right, so offset = r2Right - (-r1Right) = r2Right + r1Right
  const hOff = { x: r2Right.x + r1Right.x, y: r2Right.y + r1Right.y };
  const hLen = Math.sqrt(hOff.x ** 2 + hOff.y ** 2) || 1;
  const hDir = { x: hOff.x / hLen, y: hOff.y / hLen };
  const hStep = { x: hOff.x + gapH * hDir.x, y: hOff.y + gapH * hDir.y };

  // For row below: above center → below center offset (R2_bottom - R1_top)
  const vOff = { x: r2Bottom.x - r1Top.x, y: r2Bottom.y - r1Top.y };
  const vLen = Math.sqrt(vOff.x ** 2 + vOff.y ** 2) || 1;
  const vDir = { x: vOff.x / vLen, y: vOff.y / vLen };
  const vStep = { x: vOff.x + gapV * vDir.x, y: vOff.y + gapV * vDir.y };

  const rows = [];
  let rowOrigin = { x: 0, y: 0 };

  while (rowOrigin.y < canvasHeight + r1Height * 4) {
    const row = [];
    let center = { x: rowOrigin.x, y: rowOrigin.y };

    while (center.x < canvasWidth + r1Width * 4) {
      const group = computeGroup(center.x, center.y, r1Width, r1Height, scaleR2, scaleR3, rotation);
      row.push(group);
      center.x += hStep.x;
      center.y += hStep.y;
    }

    if (row.length > 0) rows.push(row);
    rowOrigin.x += vStep.x;
    rowOrigin.y += vStep.y;
    if (rowOrigin.y > canvasHeight + r1Height * 4) break;
  }

  return rows;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 5: Commit**

```
git add src/geometry.js tests/geometry.test.js
git commit -m "feat: add grid placement with intersection logic"
```

---

### Task 5: SVG renderer

**Files:**
- Modify: `src/renderer.js`

- [ ] **Step 1: Implement `renderer.js`**

```js
export function render(svgElement, groups, params) {
  const { canvasWidth, canvasHeight, strokeWidth, strokeColor, fillColor, opacity } = params;

  svgElement.setAttribute('width', canvasWidth);
  svgElement.setAttribute('height', canvasHeight);
  svgElement.setAttribute('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);

  // Remove existing content
  while (svgElement.firstChild) svgElement.removeChild(svgElement.firstChild);

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  svgElement.appendChild(defs);

  groups.forEach(row => {
    row.forEach(group => {
      group.forEach(rhombus => {
        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const points = rhombus.vertices.map(v => `${v.x},${v.y}`).join(' ');
        poly.setAttribute('points', points);
        poly.setAttribute('stroke', strokeColor);
        poly.setAttribute('stroke-width', String(strokeWidth));
        poly.setAttribute('fill', fillColor);
        poly.setAttribute('opacity', String(opacity));
        svgElement.appendChild(poly);
      });
    });
  });
}
```

- [ ] **Step 2: Verify it works**

Run: `npx vitest run`
Expected: PASS (geometry tests still pass, no renderer tests needed — it's pure DOM)

- [ ] **Step 3: Commit**

```
git add src/renderer.js
git commit -m "feat: add SVG renderer"
```

---

### Task 6: Properties panel (UI)

**Files:**
- Modify: `src/ui.js`

- [ ] **Step 1: Implement `ui.js`**

```js
function createControl(section, label, name, type, min, max, step) {
  const div = document.createElement('div');
  div.className = 'control';
  const lbl = document.createElement('label');
  lbl.textContent = label;
  div.appendChild(lbl);

  let input;
  if (type === 'color') {
    input = document.createElement('input');
    input.type = 'color';
  } else if (type === 'number') {
    input = document.createElement('input');
    input.type = 'number';
    input.min = min;
    input.max = max;
    if (step !== undefined) input.step = step;
  } else {
    input = document.createElement('input');
    input.type = 'range';
    input.min = min;
    input.max = max;
    if (step !== undefined) input.step = step;
  }

  input.name = name;
  input.dataset.name = name;
  div.appendChild(input);
  section.appendChild(div);
  return input;
}

export function createPanel(container, params, onChange) {
  // Canvas section
  const canvasTitle = document.createElement('h2');
  canvasTitle.textContent = 'Canvas';
  container.appendChild(canvasTitle);
  createControl(container, 'Larghezza', 'canvasWidth', 'number', 100, 5000);
  createControl(container, 'Altezza', 'canvasHeight', 'number', 100, 5000);

  // Shape section
  const shapeTitle = document.createElement('h2');
  shapeTitle.textContent = 'Forma';
  container.appendChild(shapeTitle);
  createControl(container, 'R1 Semi-larghezza', 'r1Width', 'number', 10, 500);
  createControl(container, 'R1 Semi-altezza', 'r1Height', 'number', 10, 500);
  createControl(container, 'Scala R2 (%)', 'scaleR2', 'number', 10, 99);
  createControl(container, 'Scala R3 (%)', 'scaleR3', 'number', 10, 99);

  // Grid section
  const gridTitle = document.createElement('h2');
  gridTitle.textContent = 'Griglia';
  container.appendChild(gridTitle);
  createControl(container, 'Gap Orizzontale', 'gapH', 'number', 0, 200);
  createControl(container, 'Gap Verticale', 'gapV', 'number', 0, 200);
  createControl(container, 'Rotazione', 'rotation', 'number', 0, 360);

  // Style section
  const styleTitle = document.createElement('h2');
  styleTitle.textContent = 'Stile';
  container.appendChild(styleTitle);
  createControl(container, 'Spessore linee', 'strokeWidth', 'number', 0, 50);
  createControl(container, 'Colore linee', 'strokeColor', 'color');
  createControl(container, 'Colore riempimento', 'fillColor', 'color');
  createControl(container, 'Opacità', 'opacity', 'range', 0, 1, 0.01);

  // Actions section
  const actionsTitle = document.createElement('h2');
  actionsTitle.textContent = 'Azioni';
  container.appendChild(actionsTitle);

  const svgBtn = document.createElement('button');
  svgBtn.className = 'btn';
  svgBtn.textContent = 'Esporta SVG';
  container.appendChild(svgBtn);

  const pngBtn = document.createElement('button');
  pngBtn.className = 'btn';
  pngBtn.textContent = 'Esporta PNG';
  container.appendChild(pngBtn);

  // Wire change events — update params and call onChange
  const inputs = container.querySelectorAll('input[data-name]');
  inputs.forEach(input => {
    const sync = () => {
      let val = input.type === 'color' ? input.value : parseFloat(input.value);
      if (input.name === 'opacity') val = parseFloat(input.value);
      params[input.name] = val;
      onChange();
    };
    input.addEventListener('input', sync);
    input.addEventListener('change', sync);
    // Set initial value from params
    if (input.type === 'color') input.value = params[input.name];
    else input.value = params[input.name];
  });

  // Export handlers (wired later by main.js)
  return { svgBtn, pngBtn };
}
```

- [ ] **Step 2: Commit**

```
git add src/ui.js
git commit -m "feat: add properties panel UI"
```

---

### Task 7: Wire everything together

**Files:**
- Modify: `src/main.js`

- [ ] **Step 1: Implement main.js wiring**

```js
import { computeGrid } from './geometry.js';
import { render } from './renderer.js';
import { createPanel } from './ui.js';
import { exportSVG, exportPNG } from './export.js';

const svg = document.getElementById('canvas');
const panel = document.getElementById('panel');

const params = {
  canvasWidth: 1920, canvasHeight: 1080,
  r1Width: 120, r1Height: 80,
  scaleR2: 70, scaleR3: 42,
  rotation: 0, gapH: 0, gapV: 0,
  strokeWidth: 2, strokeColor: '#000000', fillColor: '#ffffff', opacity: 1,
};

function update() {
  const groups = computeGrid(params);
  render(svg, groups, params);
}

const { svgBtn, pngBtn } = createPanel(panel, params, () => update());

svgBtn.addEventListener('click', () => exportSVG(svg));
pngBtn.addEventListener('click', () => exportPNG(svg, params.canvasWidth, params.canvasHeight));

update();
```

- [ ] **Step 2: Commit**

```
git add src/main.js
git commit -m "feat: wire main.js with all modules"
```

---

### Task 8: SVG and PNG export

**Files:**
- Modify: `src/export.js`

- [ ] **Step 1: Implement `export.js`**

```js
export function exportSVG(svgElement) {
  const clone = svgElement.cloneNode(true);
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(clone);
  const blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + source], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pattern.svg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportPNG(svgElement, width, height) {
  const clone = svgElement.cloneNode(true);
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(clone);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const img = new Image();
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  img.onload = () => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    canvas.toBlob(pngBlob => {
      const pngUrl = URL.createObjectURL(pngBlob);
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = 'pattern.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(pngUrl);
    }, 'image/png');
  };
  img.src = url;
}
```

- [ ] **Step 2: Verify it works**

Open `index.html` in a browser. Confirm:
- The canvas renders pattern groups
- Changing parameters updates the preview
- Export SVG downloads a valid SVG
- Export PNG downloads a valid PNG

- [ ] **Step 3: Commit**

```
git add src/export.js
git commit -m "feat: add SVG and PNG export"
```

---

### Task 9: Final integration test

**Files:** (no changes — just manual verification)

- [ ] **Step 1: Open `index.html` in browser**

Verify:
- Canvas shows rhombus grid pattern at default params
- Rows and columns fill the canvas
- Groups intersect correctly (R1↔R2 horizontally and vertically)
- R3 (smallest) never intersects and is centered

- [ ] **Step 2: Test parameter changes**

Adjust each parameter and verify:
- Canvas dimensions resize the SVG
- R1 width/height change rhombus proportions
- ScaleR2 / ScaleR3 change nested sizes
- Rotation rotates all rhombuses uniformly
- Gaps add space at intersection points
- Stroke, fill, opacity apply to all polygons

- [ ] **Step 3: Test export**

Click "Esporta SVG" and open the downloaded file in a browser/vector editor — verify correct.
Click "Esporta PNG" and verify the raster output matches.
