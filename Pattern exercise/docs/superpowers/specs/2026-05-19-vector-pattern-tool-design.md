# Vector Pattern Tool — Design Spec

## Overview

A web-based interactive tool to generate vector patterns from nested rhombus groups arranged in a modular intersecting grid. Users control geometry, layout, and styling via a properties panel and can export the result as SVG.

## Architecture

Four independent modules, no framework dependencies:

### 1. `geometry.js` — Pure geometry engine

No DOM access, no side effects. Input: parameter object. Output: nested array of rhombus vertex coordinates.

A **rhombus** is defined by its center (cx, cy), semi-width (rx), and semi-height (ry). Its 4 vertices are derived from:
- Right: (cx + rx, cy)
- Bottom: (cx, cy + ry)
- Left: (cx - rx, cy)
- Top: (cx, cy - ry)

A **group** contains 3 concentric rhombuses:
- R1 (outer): base size (rx, ry)
- R2 (middle): scale factor applied to (rx, ry) — default 0.7
- R3 (inner): scale factor applied to R2 size — default 0.42
  R3 never intersects other groups.

**Grid placement logic:**
- Groups placed left-to-right in rows
- In a row: left vertex of R1[n] = right vertex of R2[n-1]; left vertex of R2[n] = right vertex of R1[n-1]
- Between rows: top vertex of R1[n] = bottom vertex of R2[above]; top vertex of R2[n] = bottom vertex of R1[above]
- Continues across canvas dimensions

### 2. `renderer.js` — SVG DOM renderer

Receives vertex data from geometry.js and updates the SVG element. Uses direct DOM manipulation:
- Clears `<g>` container
- Creates `<polygon>` elements for each rhombus
- Applies stroke, fill, opacity, stroke-width from current parameters

### 3. `ui.js` — Properties panel with reactive binding

Sidebar with controls organized in sections:
- **Canvas:** width, height (px)
- **Shape:** R1 semi-width, R1 semi-height, R2 scale (%), R3 scale (%)
- **Grid:** gap horizontal (px), gap vertical (px)
- **Margins:** top, right, bottom, left (px)
- **Style:** stroke width, stroke color, fill color, opacity
- **Actions:** Export SVG, Export PNG buttons

Each control emits an event on change. A thin reactive layer batches updates and calls geometry → renderer.

### 4. `export.js` — SVG and PNG export

- **SVG export:** Serializes the SVG DOM element content to a string, creates a Blob, and triggers download as `.svg` file.
- **PNG export:** Draws the SVG onto an offscreen `<canvas>` element via `canvg` or native `Image` + `drawImage`, then calls `canvas.toBlob()` to trigger download as `.png` file.

## Data Flow

```
ui.js (param changes) → geometry.js (computes vertices) → renderer.js (updates SVG DOM)
                                                              ↓
                                                         export.js (serializes DOM on demand)
```

## Parameters

| Parameter | Type | Default | Range |
|-----------|------|---------|-------|
| canvasWidth | px | 1920 | 100–5000 |
| canvasHeight | px | 1080 | 100–5000 |
| r1Width | px | 120 | 10–500 |
| r1Height | px | 80 | 10–500 |
| scaleR2 | % | 70 | 10–99 |
| scaleR3 | % | 42 | 10–99 |
| gapH | px | 0 | 0–200 |
| gapV | px | 0 | 0–200 |
| marginTop | px | 0 | 0–500 |
| marginRight | px | 0 | 0–500 |
| marginBottom | px | 0 | 0–500 |
| marginLeft | px | 0 | 0–500 |
| strokeWidth | px | 2 | 0–50 |
| strokeColor | hex | #000000 | — |
| fillColor | hex | #ffffff | — |
| opacity | 0–1 | 1 | 0–1 |

## UI Layout

Full viewport split: **SVG canvas (fill remaining space)** on left, **fixed-width sidebar (280px)** on right. Controls grouped and labeled. Each change instantly recomputes and redraws.

Edge cases:
- Canvas must be at least 100×100
- scaleR2 and scaleR3 must be ≤ scale of parent
- strokeWidth=0 means no stroke
- Large canvases with many groups recalculate efficiently (no throttle needed at expected scale)

## Export

Two export buttons in the Actions section:

- **Export SVG:** Serializes current SVG DOM → `Blob` → `<a download="pattern.svg">` click.
- **Export PNG:** Renders SVG to `<canvas>` at the current canvas resolution → `canvas.toBlob()` → `<a download="pattern.png">` click. Uses native `Image` + `drawImage` approach (no external libraries needed).

## Non-goals (YAGNI)

- No PDF export initially (could be added later)
- No preset/themes
- No zoom/pan controls on canvas
- No undo/redo

