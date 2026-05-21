# Tipografia Cinetica Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a vanilla JS web tool for kinetic typography with a melt animation effect.

**Architecture:** Single-page app with 2-panel layout (canvas left, controls right). Text rendered to offscreen canvas → pixel manipulation per effect → drawn to visible canvas via `requestAnimationFrame` loop. Effects registered via plugin pattern.

**Tech Stack:** HTML, CSS, vanilla JS, Canvas 2D API, Google Fonts Web Font Loader

**Files:**
- `index.html` — HTML skeleton
- `style.css` — All styles
- `app.js` — All JavaScript: state, controls, canvas, effects, animation loop

---

### Task 1: HTML/CSS Layout Skeleton

**Files:**
- Create: `index.html`
- Create: `style.css`

- [ ] **Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tipografia Cinetica</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
</head>
<body>
  <div id="app">
    <header>
      <h1>Tipografia Cinetica</h1>
    </header>
    <main>
      <section id="canvas-container">
        <canvas id="main-canvas"></canvas>
      </section>
      <aside id="controls">
        <!-- controls will be populated by JS -->
      </aside>
    </main>
  </div>
  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `style.css`**

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  font-family: system-ui, -apple-system, sans-serif;
  background: #1a1a2e;
  color: #eee;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  padding: 12px 24px;
  background: #16213e;
  border-bottom: 1px solid #0f3460;
}

header h1 {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

#canvas-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: #0f0f23;
}

#main-canvas {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  background: #fff;
}

#controls {
  width: 320px;
  padding: 20px;
  background: #16213e;
  border-left: 1px solid #0f3460;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.control-group label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8899aa;
}

.control-group input[type="text"],
.control-group select {
  padding: 8px 12px;
  border: 1px solid #0f3460;
  border-radius: 6px;
  background: #1a1a2e;
  color: #eee;
  font-size: 0.95rem;
}

.control-group input[type="range"] {
  width: 100%;
  accent-color: #e94560;
}

.color-picker-group {
  display: flex;
  gap: 8px;
}

.color-picker-group input[type="color"] {
  width: 40px;
  height: 40px;
  border: 2px solid #0f3460;
  border-radius: 6px;
  cursor: pointer;
}

.effects-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.effect-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: #1a1a2e;
  border-radius: 6px;
  cursor: grab;
}

.effect-item.active {
  border-left: 3px solid #e94560;
}

.effect-item label {
  font-size: 0.9rem;
  text-transform: none;
  letter-spacing: normal;
  color: #eee;
  flex: 1;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary {
  background: #e94560;
  color: #fff;
}

.btn-primary:hover {
  background: #d63851;
}

.btn-secondary {
  background: #0f3460;
  color: #eee;
}

.btn-secondary:hover {
  background: #1a4a80;
}

.controls-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.controls-actions .btn {
  flex: 1;
}
```

- [ ] **Step 3: Verify layout in browser**

Open `index.html` in a browser. Expected: dark-themed layout with header, empty white canvas area on left, empty controls panel on right.

---

### Task 2: State Object + Canvas Text Rendering

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Write state and canvas setup in `app.js`**

```js
// === State ===
const state = {
  word: 'GELEATO',
  font: 'Fredoka One',
  weight: 700,
  colors: ['#FF6B6B', '#FFD93D', '#6BCB77'],
  animationType: 'melt',
  effects: [
    { id: 'deformazione', name: 'Deformazione', active: true, order: 0 },
    { id: 'gocciolamento', name: 'Gocciolamento', active: true, order: 1 },
    { id: 'pozzanghera', name: 'Pozzanghera', active: false, order: 2 }
  ],
  intensity: 0.5,
  speed: 1.0,
  playing: false,
  loop: true
}

// === Canvas Setup ===
const canvas = document.getElementById('main-canvas')
const ctx = canvas.getContext('2d')
const offscreen = document.createElement('canvas')
const offCtx = offscreen.getContext('2d')

function resizeCanvas() {
  const container = document.getElementById('canvas-container')
  const dpr = window.devicePixelRatio || 1
  const w = container.clientWidth - 32
  const h = container.clientHeight - 32
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  offscreen.width = canvas.width
  offscreen.height = canvas.height
  drawText()
}

window.addEventListener('resize', resizeCanvas)
```

- [ ] **Step 2: Write text rendering function**

```js
// === Text Rendering ===
function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function drawText() {
  const w = canvas.width
  const h = canvas.height
  offCtx.clearRect(0, 0, w, h)
  
  const fontSize = Math.min(w / state.word.length * 1.5, h * 0.5)
  offCtx.font = `${state.weight} ${fontSize}px "${state.font}"`
  offCtx.textAlign = 'center'
  offCtx.textBaseline = 'middle'
  
  const metrics = offCtx.measureText(state.word)
  const textWidth = metrics.width
  const x = w / 2
  const y = h / 2
  
  if (state.colors.length >= 2) {
    const gradient = offCtx.createLinearGradient(x - textWidth / 2, y, x + textWidth / 2, y)
    const colors = state.colors
    colors.forEach((c, i) => {
      gradient.addColorStop(i / (colors.length - 1 || 1), c)
    })
    offCtx.fillStyle = gradient
  } else {
    offCtx.fillStyle = state.colors[0] || '#FF6B6B'
  }
  
  offCtx.fillText(state.word, x, y)
}

// Load font then render
WebFont.load({
  google: { families: [state.font + ':' + state.weight] },
  active: drawText
})
```

- [ ] **Step 3: Wire `resizeCanvas` to load event**

```js
resizeCanvas()
```

- [ ] **Step 4: Open in browser**

Open `index.html`. Expected: "GELEATO" rendered in Fredoka One at 700 weight with a gradient (pink → yellow → green) centered on the canvas.

---

### Task 3: Wire Up Controls to State

**Files:**
- Modify: `index.html` (add controls div structure)
- Modify: `app.js`

- [ ] **Step 1: Replace the static controls aside with JS-generated controls**

```js
// === Controls ===
const controlsEl = document.getElementById('controls')

function buildControls() {
  controlsEl.innerHTML = `
    <div class="control-group">
      <label for="word-input">Parola</label>
      <input type="text" id="word-input" value="${state.word}">
    </div>
    <div class="control-group">
      <label for="font-select">Font</label>
      <select id="font-select">
        <option value="Fredoka One" ${state.font === 'Fredoka One' ? 'selected' : ''}>Fredoka One</option>
        <option value="Chewy" ${state.font === 'Chewy' ? 'selected' : ''}>Chewy</option>
        <option value="Bubblegum Sans" ${state.font === 'Bubblegum Sans' ? 'selected' : ''}>Bubblegum Sans</option>
        <option value="Baloo 2" ${state.font === 'Baloo 2' ? 'selected' : ''}>Baloo 2</option>
        <option value="Lilita One" ${state.font === 'Lilita One' ? 'selected' : ''}>Lilita One</option>
      </select>
    </div>
    <div class="control-group">
      <label for="weight-slider">Peso: <span id="weight-value">${state.weight}</span></label>
      <input type="range" id="weight-slider" min="300" max="900" step="100" value="${state.weight}">
    </div>
    <div class="control-group">
      <label>Colori</label>
      <div class="color-picker-group" id="color-pickers">
        ${state.colors.map((c, i) => `<input type="color" id="color-${i}" value="${c}">`).join('')}
      </div>
    </div>
    <div class="control-group">
      <label for="anim-select">Animazione</label>
      <select id="anim-select">
        <option value="melt" selected>Melt (Scioglimento)</option>
      </select>
    </div>
    <div class="controls-actions">
      <button class="btn btn-primary" id="play-btn">▶ Play</button>
      <button class="btn btn-secondary" id="loop-btn">↺ Loop</button>
    </div>
    <div class="control-group">
      <label>Effetti</label>
      <div class="effects-list" id="effects-list">
        ${state.effects
          .sort((a, b) => a.order - b.order)
          .map(e => `
            <div class="effect-item ${e.active ? 'active' : ''}" data-effect-id="${e.id}">
              <input type="checkbox" ${e.active ? 'checked' : ''}>
              <label>${e.name}</label>
              <span class="drag-handle">⠿</span>
            </div>
          `).join('')}
      </div>
    </div>
    <div class="control-group">
      <label for="intensity-slider">Intensità: <span id="intensity-value">${state.intensity}</span></label>
      <input type="range" id="intensity-slider" min="0" max="1" step="0.05" value="${state.intensity}">
    </div>
    <div class="control-group">
      <label for="speed-slider">Velocità: <span id="speed-value">${state.speed}</span></label>
      <input type="range" id="speed-slider" min="0.1" max="3" step="0.1" value="${state.speed}">
    </div>
  `
}
buildControls()
```

- [ ] **Step 2: Add event listeners to controls**

```js
function setupControls() {
  document.getElementById('word-input').addEventListener('input', e => {
    state.word = e.target.value || ' '
    stopAnimation()
    drawText()
  })

  document.getElementById('font-select').addEventListener('change', e => {
    state.font = e.target.value
    WebFont.load({
      google: { families: [state.font] },
      active: () => { stopAnimation(); drawText() }
    })
  })

  document.getElementById('weight-slider').addEventListener('input', e => {
    state.weight = Number(e.target.value)
    document.getElementById('weight-value').textContent = state.weight
    stopAnimation()
    drawText()
  })

  document.getElementById('color-pickers').addEventListener('input', e => {
    if (e.target.type === 'color') {
      const idx = Number(e.target.id.replace('color-', ''))
      state.colors[idx] = e.target.value
      stopAnimation()
      drawText()
    }
  })

  // checkbox events on effects list
  document.getElementById('effects-list').addEventListener('change', e => {
    if (e.target.type === 'checkbox') {
      const item = e.target.closest('.effect-item')
      const id = item.dataset.effectId
      const effect = state.effects.find(ef => ef.id === id)
      if (effect) {
        effect.active = e.target.checked
        item.classList.toggle('active', e.target.checked)
      }
    }
  })
}
setupControls()
```

- [ ] **Step 3: Add `stopAnimation` stub**

```js
function stopAnimation() {
  if (state.playing) {
    state.playing = false
    const btn = document.getElementById('play-btn')
    if (btn) btn.textContent = '▶ Play'
  }
}
```

- [ ] **Step 4: Test in browser**

Every control should update the state and re-render the text. Try changing font, weight, colors, and typing a different word.

---

### Task 4: Animation Loop + Effect Engine

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Write effect registry**

```js
// === Effect Engine ===
const effectRegistry = {}

function registerEffect(id, impl) {
  effectRegistry[id] = impl
}

function getActiveEffects() {
  return state.effects
    .filter(e => e.active)
    .sort((a, b) => a.order - b.order)
    .map(e => ({ config: e, impl: effectRegistry[e.id] }))
}
```

- [ ] **Step 2: Write the animation loop**

```js
let animFrameId = null
let animStartTime = 0
let pausedProgress = 0
const ANIM_DURATION = 4000

function playAnimation() {
  if (state.playing) return
  state.playing = true
  document.getElementById('play-btn').textContent = '⏸ Pause'
  if (!pausedProgress || !state.loop) pausedProgress = 0
  animStartTime = performance.now() - pausedProgress * ANIM_DURATION
  animFrameId = requestAnimationFrame(animLoop)
}

function stopAnimation() {
  state.playing = false
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }
  const btn = document.getElementById('play-btn')
  if (btn) btn.textContent = '▶ Play'
}

function animLoop(time) {
  if (!state.playing) return
  
  const elapsed = (time - animStartTime) * state.speed
  const duration = ANIM_DURATION / state.speed
  pausedProgress = Math.min(elapsed / ANIM_DURATION, 1)
  
  if (elapsed >= duration) {
    if (state.loop) {
      animStartTime = time
      pausedProgress = 0
      drawText()  // Reset to clean text for new loop
    } else {
      pausedProgress = 1
      renderFrame(1)
      stopAnimation()
      return
    }
  }
  
  const progress = Math.min(elapsed / duration, 1)
  renderFrame(progress)
  animFrameId = requestAnimationFrame(animLoop)
}

function renderFrame(progress) {
  const w = offscreen.width
  const h = offscreen.height
  
  // Apply active effects in order to accumulated offscreen
  const imageData = offCtx.getImageData(0, 0, w, h)
  
  for (const { config, impl } of getActiveEffects()) {
    if (impl && impl.process) {
      impl.process(imageData, w, h, progress, state, config)
    }
  }
  
  offCtx.putImageData(imageData, 0, 0)
  
  // Copy to visible canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(offscreen, 0, 0)
}

// Wire play button
document.getElementById('play-btn').addEventListener('click', () => {
  if (state.playing) stopAnimation()
  else playAnimation()
})

document.getElementById('loop-btn').addEventListener('click', () => {
  state.loop = !state.loop
  document.getElementById('loop-btn').classList.toggle('active', state.loop)
})
```

- [ ] **Step 3: Test in browser**

Click Play. The canvas should show the text (no effects yet = no visible change). Click again to stop. Toggle loop.

---

### Task 5: Deformazione Effect

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Write simplex noise implementation**

```js
// === Simplex Noise (simplified 2D) ===
// Based on open source implementation by Stefan Gustavson
const SimplexNoise = (function() {
  const grad3 = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ]
  const p = [], perm = []
  for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256)
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
  
  function dot(g, x, y) { return g[0] * x + g[1] * y }
  
  function noise2D(xin, yin) {
    const F2 = 0.5 * (Math.sqrt(3) - 1)
    const G2 = (3 - Math.sqrt(3)) / 6
    let s = (xin + yin) * F2
    let i = Math.floor(xin + s)
    let j = Math.floor(yin + s)
    let t = (i + j) * G2
    let X0 = i - t, Y0 = j - t
    let x0 = xin - X0, y0 = yin - Y0
    let i1, j1
    if (x0 > y0) { i1 = 1; j1 = 0 } else { i1 = 0; j1 = 1 }
    let x1 = x0 - i1 + G2, y1 = y0 - j1 + G2
    let x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2
    let ii = i & 255, jj = j & 255
    let gi0 = perm[ii + perm[jj]] % 12
    let gi1 = perm[ii + i1 + perm[jj + j1]] % 12
    let gi2 = perm[ii + 1 + perm[jj + 1]] % 12
    let n0 = 0, n1 = 0, n2 = 0
    let t0 = 0.5 - x0*x0 - y0*y0
    if (t0 >= 0) { t0 *= t0; n0 = t0 * t0 * dot(grad3[gi0], x0, y0) }
    let t1 = 0.5 - x1*x1 - y1*y1
    if (t1 >= 0) { t1 *= t1; n1 = t1 * t1 * dot(grad3[gi1], x1, y1) }
    let t2 = 0.5 - x2*x2 - y2*y2
    if (t2 >= 0) { t2 *= t2; n2 = t2 * t2 * dot(grad3[gi2], x2, y2) }
    return 70 * (n0 + n1 + n2)
  }
  
  return { noise2D }
})()
```

- [ ] **Step 2: Write deformazione effect**

```js
registerEffect('deformazione', {
  process(imageData, w, h, progress, state, config) {
    const data = imageData.data
    const copy = new Uint8ClampedArray(data)
    const intensity = state.intensity
    const amplitude = progress * 30 * intensity
    
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4
        if (copy[idx + 3] === 0) continue
        
        const dx = SimplexNoise.noise2D(x * 0.01, y * 0.01 + progress * 2) * amplitude
        const dy = SimplexNoise.noise2D(x * 0.01 + 100, y * 0.01 + progress * 2) * amplitude
        
        const sx = Math.round(x + dx)
        const sy = Math.round(y + dy)
        
        if (sx < 0 || sx >= w || sy < 0 || sy >= h) continue
        
        const sidx = (sy * w + sx) * 4
        data[idx] = copy[sidx]
        data[idx + 1] = copy[sidx + 1]
        data[idx + 2] = copy[sidx + 2]
        data[idx + 3] = copy[sidx + 3]
      }
    }
  }
})
```

- [ ] **Step 3: Test deformazione**

Click Play. Expected: text warps and distorts over time using noise displacement. The effect grows stronger as progress increases. Intensity slider should control magnitude.

---

### Task 6: Gocciolamento Effect

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Write gocciolamento effect**

```js
registerEffect('gocciolamento', {
  droplets: [],
  processed: false,
  lastProgress: 0,
  
  reset() {
    this.droplets = []
    this.processed = false
    this.lastProgress = 0
  },
  
  process(imageData, w, h, progress, state, config) {
    const data = imageData.data
    const intensity = state.intensity
    
    // Find bottom edge pixels on first frame
    if (!this.processed || progress < this.lastProgress) {
      this.droplets = []
      this.processed = true
      
      for (let x = 0; x < w; x++) {
        let bottomY = -1
        for (let y = h - 1; y >= 0; y--) {
          const idx = (y * w + x) * 4
          if (data[idx + 3] > 128) {
            if (bottomY === -1) bottomY = y
          }
        }
        if (bottomY >= 0) {
          // Check if this is truly the bottom (no pixels below)
          let isBottom = true
          for (let y = bottomY + 1; y < h && y < bottomY + 5; y++) {
            const idx = (y * w + x) * 4
            if (data[idx + 3] > 128) { isBottom = false; break }
          }
          if (isBottom) {
            const idx = (bottomY * w + x) * 4
            this.droplets.push({
              x, y: bottomY,
              r: data[idx], g: data[idx + 1], b: data[idx + 2],
              speed: 1 + Math.random() * 2,
              offset: Math.random() * progress
            })
          }
        }
      }
    }
    this.lastProgress = progress
    
    // Clear original bottom pixels where drips form
    for (const d of this.droplets) {
      const idx = (d.y * w + d.x) * 4
      if (progress > 0.1) {
        data[idx + 3] = 0
      }
    }
    
    // Draw falling droplets
    const dripProgress = Math.max(0, (progress - 0.1) / 0.9)
    for (const d of this.droplets) {
      const fallDistance = dripProgress * d.speed * intensity * h * 0.3
      const sy = Math.min(Math.round(d.y + fallDistance), h - 1)
      
      if (sy > d.y && sy < h) {
        const idx = (sy * w + d.x) * 4
        const alpha = Math.max(0, 1 - fallDistance / (h * 0.5))
        data[idx] = d.r
        data[idx + 1] = d.g
        data[idx + 2] = d.b
        data[idx + 3] = Math.round(255 * alpha)
        
        // Trail: mark pixel below
        if (sy + 1 < h) {
          const tidx = ((sy + 1) * w + d.x) * 4
          data[tidx] = d.r
          data[tidx + 1] = d.g
          data[tidx + 2] = d.b
          data[tidx + 3] = Math.round(180 * alpha)
        }
      }
    }
  }
})
```

- [ ] **Step 2: Test gocciolamento**

Ensure deformazione is off, gocciolamento is on. Click Play. Expected: droplets fall from the bottom edge of each letter. More droplets with higher intensity.

---

### Task 7: Pozzanghera Effect

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Write pozzanghera effect**

```js
registerEffect('pozzanghera', {
  poolData: null,
  
  process(imageData, w, h, progress, state, config) {
    const data = imageData.data
    const intensity = state.intensity
    
    // Initialize pool buffer
    if (!this.poolData || this.poolData.length !== data.length) {
      this.poolData = new Uint8ClampedArray(data.length)
    }
    
    const pool = this.poolData
    const poolProgress = Math.max(0, (progress - 0.3) / 0.7)
    if (poolProgress <= 0) return
    
    // Copy dripping pixels into pool
    for (let y = Math.floor(h * 0.6); y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4
        if (data[idx + 3] > 0 && data[idx + 3] < 255) {
          // This is a drip pixel — add to pool
          const poolIdx = (Math.min(Math.floor(h * 0.85), h - 1) * w + x) * 4
          pool[poolIdx] = data[idx]
          pool[poolIdx + 1] = data[idx + 1]
          pool[poolIdx + 2] = data[idx + 2]
          pool[poolIdx + 3] = Math.min(255, pool[poolIdx + 3] + 40)
        }
      }
    }
    
    // Spread pool horizontally
    const spreadAmount = poolProgress * intensity * w * 0.15
    for (let y = Math.floor(h * 0.85); y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4
        if (pool[idx + 3] > 0) {
          // Spread left and right
          for (let s = 1; s <= Math.round(spreadAmount); s++) {
            if (x - s >= 0) {
              const li = (y * w + (x - s)) * 4
              if (pool[li + 3] === 0) {
                pool[li] = pool[idx]
                pool[li + 1] = pool[idx + 1]
                pool[li + 2] = pool[idx + 2]
                pool[li + 3] = Math.max(1, pool[idx + 3] - s * 20)
              }
            }
            if (x + s < w) {
              const ri = (y * w + (x + s)) * 4
              if (pool[ri + 3] === 0) {
                pool[ri] = pool[idx]
                pool[ri + 1] = pool[idx + 1]
                pool[ri + 2] = pool[idx + 2]
                pool[ri + 3] = Math.max(1, pool[idx + 3] - s * 20)
              }
            }
          }
        }
      }
    }
    
    // Composite pool onto image
    for (let i = 0; i < data.length; i += 4) {
      if (pool[i + 3] > 0) {
        data[i] = pool[i]
        data[i + 1] = pool[i + 1]
        data[i + 2] = pool[i + 2]
        data[i + 3] = Math.min(255, data[i + 3] + pool[i + 3])
      }
    }
  }
})
```

- [ ] **Step 2: Test pozzanghera**

Enable gocciolamento + pozzanghera. Click Play. Expected: as drips fall, they accumulate at the bottom and spread into a pool.

---

### Task 8: Play/Pause/Loop + Speed Control + Integration

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Refine play/pause/stop to handle effect reset**

```js
function playAnimation() {
  if (state.playing) return
  state.playing = true
  document.getElementById('play-btn').textContent = '⏸ Pause'
  
  // Reset effects
  for (const e of state.effects) {
    if (effectRegistry[e.id] && effectRegistry[e.id].reset) {
      effectRegistry[e.id].reset()
    }
  }
  
  // Draw initial text frame (effects will accumulate from here)
  drawText()
  
  if (!pausedProgress || !state.loop) pausedProgress = 0
  animStartTime = performance.now() - pausedProgress * ANIM_DURATION
  animFrameId = requestAnimationFrame(animLoop)
}
```

- [ ] **Step 2: Wire loop button toggle**

```js
document.getElementById('loop-btn').addEventListener('click', () => {
  state.loop = !state.loop
  const btn = document.getElementById('loop-btn')
  btn.classList.toggle('active', state.loop)
  btn.textContent = state.loop ? '↺ Loop: ON' : '↺ Loop: OFF'
})

// Initialize loop button
document.getElementById('loop-btn').classList.add('active')
document.getElementById('loop-btn').textContent = '↺ Loop: ON'
```

- [ ] **Step 3: Complete integration — reset effects when settings change**

Modify the `stopAnimation` function:

```js
function stopAnimation() {
  state.playing = false
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }
  const btn = document.getElementById('play-btn')
  if (btn) btn.textContent = '▶ Play'
  
  // Reset effects for clean next play
  for (const e of state.effects) {
    if (effectRegistry[e.id] && effectRegistry[e.id].reset) {
      effectRegistry[e.id].reset()
    }
  }
  
  drawText()
}
```

- [ ] **Step 4: Wire speed slider**

```js
document.getElementById('speed-slider').addEventListener('input', e => {
  state.speed = Number(e.target.value)
  document.getElementById('speed-value').textContent = state.speed.toFixed(1)
})
```

- [ ] **Step 5: Wire intensity slider**

```js
document.getElementById('intensity-slider').addEventListener('input', e => {
  state.intensity = Number(e.target.value)
  document.getElementById('intensity-value').textContent = state.intensity.toFixed(2)
})
```

- [ ] **Step 6: Test full flow**

Toggle all three effects. Change speed and intensity while playing. Toggle loop. Play/pause. All should work smoothly.

---

### Task 9: Effect Ordering UI

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Implement drag-to-reorder for effects**

```js
// === Drag & Drop Reorder for Effects ===
let dragSrc = null

document.getElementById('effects-list').addEventListener('dragstart', e => {
  dragSrc = e.target.closest('.effect-item')
  if (dragSrc) e.dataTransfer.effectAllowed = 'move'
})

document.getElementById('effects-list').addEventListener('dragover', e => {
  e.preventDefault()
  const target = e.target.closest('.effect-item')
  if (target && target !== dragSrc) {
    const rect = target.getBoundingClientRect()
    const mid = rect.top + rect.height / 2
    if (e.clientY < mid) {
      target.parentNode.insertBefore(dragSrc, target)
    } else {
      target.parentNode.insertBefore(dragSrc, target.nextSibling)
    }
  }
})

document.getElementById('effects-list').addEventListener('drop', e => {
  e.preventDefault()
  const items = document.querySelectorAll('.effect-item')
  items.forEach((item, idx) => {
    const id = item.dataset.effectId
    const effect = state.effects.find(ef => ef.id === id)
    if (effect) effect.order = idx
  })
})

document.getElementById('effects-list').addEventListener('dragend', () => {
  dragSrc = null
})
```

- [ ] **Step 2: Make effect items draggable**

Add `draggable="true"` to effect items in `buildControls()`:

Update the template string in `buildControls`:

```js
.map(e => `
  <div class="effect-item ${e.active ? 'active' : ''}" data-effect-id="${e.id}" draggable="true">
    <input type="checkbox" ${e.active ? 'checked' : ''}>
    <label>${e.name}</label>
    <span class="drag-handle">⠿</span>
  </div>
`).join('')}
```

- [ ] **Step 3: Test reordering**

Drag effects up/down. The order should update in state. Play animation to verify effects apply in the new order.

---

### Task 10: Final Polish

**Files:**
- Modify: `style.css`
- Modify: `app.js`

- [ ] **Step 1: Add active/playing state styling**

```css
#loop-btn.active {
  background: #e94560;
  color: #fff;
}
```

- [ ] **Step 2: Improve text rendering for long words**

In `drawText`, add padding and better sizing:

```js
function drawText() {
  const w = offscreen.width
  const h = offscreen.height
  offCtx.clearRect(0, 0, w, h)
  
  const maxWidth = w * 0.85
  let fontSize = Math.min(w / Math.max(state.word.length, 1) * 1.5, h * 0.5)
  
  offCtx.font = `${state.weight} ${fontSize}px "${state.font}"`
  
  // Reduce font size if text is too wide
  while (offCtx.measureText(state.word).width > maxWidth && fontSize > 20) {
    fontSize *= 0.9
    offCtx.font = `${state.weight} ${fontSize}px "${state.font}"`
  }
  
  offCtx.textAlign = 'center'
  offCtx.textBaseline = 'middle'
  
  const x = w / 2
  const y = h / 2
  
  // Build gradient
  if (state.colors.length >= 2) {
    const textWidth = offCtx.measureText(state.word).width
    const gradient = offCtx.createLinearGradient(x - textWidth / 2, y, x + textWidth / 2, y)
    state.colors.forEach((c, i) => {
      gradient.addColorStop(i / (state.colors.length - 1 || 1), c)
    })
    offCtx.fillStyle = gradient
  } else {
    offCtx.fillStyle = state.colors[0] || '#FF6B6B'
  }
  
  offCtx.fillText(state.word, x, y)
}
```

- [ ] **Step 3: Add empty state styling to canvas background**

```css
#main-canvas {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  background: linear-gradient(135deg, #fff8f0 0%, #fff 50%, #f0f8ff 100%);
}
```

- [ ] **Step 4: Final manual test**

Test all controls, play/pause, loop, effect ordering, and all three effects. Verify smooth animation at different speeds and intensities.
