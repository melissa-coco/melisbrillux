# Girandola Sonora — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Single HTML page that animates an SVG pinwheel using microphone sound input.

**Architecture:** Single self-contained `index.html` with vanilla HTML/CSS/JS. SVG inlined. Web Audio API for sound detection. CSS transforms + JS color lerping for animation.

**Tech Stack:** Vanilla JS, Web Audio API, no external dependencies.

---

### Task 1: HTML scaffold and inline SVGs

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write the HTML scaffold with inlined SVG content**

Read `no suono.svg` to extract the SVG element and all its groups (`#centro`, `#stecca`, `#ali_arancioni`, `#ali_ciliegia`). The SVG will be inlined directly in the HTML.

Structure:
```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Girandola Sonora</title>
  <style>
    /* CSS will be added in Task 2 */
  </style>
</head>
<body>
  <div id="app">
    <div id="pinwheel-container">
      <svg id="girandola" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 595.28 841.89">
        <defs>
          <style>
            .cls-1 { fill: #7d4e24; }
            .cls-1, .cls-2, .cls-3, .cls-4 { stroke: #1d1d1b; stroke-miterlimit: 10; stroke-width: .5px; }
            .cls-2 { fill: #f39200; }
            .cls-3 { fill: #009fe3; }
            .cls-4 { fill: #d60b52; }
          </style>
        </defs>
        <g id="centro">
          <circle class="cls-3" id="centro-circle" cx="298.95" cy="307.43" r="30.24"/>
        </g>
        <g id="stecca">
          <rect class="cls-1" x="283.2" y="403.6" width="33.68" height="208.82"/>
        </g>
        <g id="blades-wrapper">
          <g id="ali_arancioni">
            <path class="cls-2" id="ala-arancione-1" d="M161.01,163.65h115.91l80.39,80.39-29.91,29.91c-3.03-2.49-12.86-9.94-27.48-10.42-16.48-.54-27.69,8.13-30.48,10.42-36.14-36.77-72.29-73.53-108.43-110.3Z"/>
            <path class="cls-2" id="ala-arancione-2" d="M437.16,452.17h-115.91l-80.39-80.39,29.91-29.91c3.03,2.49,12.86,9.94,27.48,10.42,16.48.54,27.69-8.13,30.48-10.42,36.14,36.77,72.29,73.53,108.43,110.3Z"/>
          </g>
          <g id="ali_ciliegia">
            <path class="cls-4" id="ala-ciliegia-1" d="M440.23,167.05v117.71s-79.16,81.64-79.16,81.64l-29.45-30.38c2.46-3.08,9.78-13.06,10.26-27.9.53-16.73-8-28.12-10.26-30.95,36.2-36.71,72.41-73.41,108.61-110.12Z"/>
            <path class="cls-4" id="ala-ciliegia-2" d="M156.42,446.32v-115.91l80.39-80.39,29.91,29.91c-2.49,3.03-9.94,12.86-10.42,27.48-.54,16.48,8.13,27.69,10.42,30.48-36.77,36.14-73.53,72.29-110.3,108.43Z"/>
          </g>
        </g>
      </svg>
    </div>
    <div id="controls">
      <!-- controls will be added in Task 4 -->
    </div>
  </div>
  <script>
    /* JS will be added in Task 3 */
  </script>
</body>
</html>
```

Note the structural change: `#centro` and `#blades-wrapper` are separate groups. `#stecca` stays outside `#blades-wrapper` so it won't rotate. `#blades-wrapper` wraps the four blade paths plus `#centro`.

- [ ] **Step 2: Verify the file was created**

Run: `ls -la index.html`
Expected: file exists, non-empty

---

### Task 2: CSS styles and animations

**Files:**
- Modify: `index.html` (add `<style>` block)

- [ ] **Step 1: Add CSS reset, layout, and base styles**

Insert before the closing `</style>` tag:

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 100%; height: 100%; overflow: hidden; }
body {
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

#pinwheel-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

#girandola {
  width: 80vmin;
  height: auto;
}

#blades-wrapper {
  transform-origin: 298.95px 307.43px;
  transition: transform 0.4s ease;
}

#blades-wrapper.spinning {
  animation: spin var(--speed, 2s) linear infinite;
}

#blades-wrapper.growing {
  transform: scale(1.5);
}

@keyframes spin {
  from { transform: rotate(0deg) scale(var(--scale, 1)); }
  to { transform: rotate(360deg) scale(var(--scale, 1)); }
}
```

Wait — the `@keyframes spin` approach needs refinement. Rotation and scaling shouldn't fight. Use a wrapper hierarchy:

```css
#blades-wrapper {
  transform-origin: 298.95px 307.43px;
  transition: transform 0.4s ease;
}

#blades-wrapper.growing {
  transform: scale(1.5);
}

#spin-layer {
  transform-origin: 298.95px 307.43px;
}

#spin-layer.spinning {
  animation: spin var(--speed, 2s) linear infinite;
}

@keyframes spin {
  from { rotate: 0deg; }
  to { rotate: 360deg; }
}
```

HTML structure becomes:
```html
<g id="blades-wrapper">
  <g id="spin-layer">
    ...blade paths and centro...
  </g>
</g>
```

- [ ] **Step 2: Add controls bar styles**

```css
#controls {
  background: #2a2a2a;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ccc;
  font-size: 14px;
}

.control-group label {
  white-space: nowrap;
  min-width: 40px;
}

#mic-btn {
  background: #444;
  border: 2px solid #666;
  color: #fff;
  padding: 8px 16px;
  border-radius: 24px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

#mic-btn:hover { background: #555; }
#mic-btn.active { border-color: #4caf50; background: #2e7d32; }

#sound-level {
  flex: 1;
  min-width: 120px;
  height: 8px;
  background: #444;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

#sound-level-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #4caf50, #ffeb3b, #f44336);
  transition: width 0.05s linear;
}

#sound-level-threshold {
  position: absolute;
  top: -2px;
  bottom: -2px;
  width: 2px;
  background: #fff;
  border-radius: 1px;
}

input[type="range"] {
  width: 100px;
  accent-color: #f39200;
  cursor: pointer;
}

#level-display, #speed-display {
  min-width: 30px;
  text-align: center;
}
```

---

### Task 3: Audio engine and sound detection

**Files:**
- Modify: `index.html` (add `<script>` block)

- [ ] **Step 1: Initialize Web Audio API**

Add inside the `<script>` tag:

```javascript
let audioCtx = null;
let analyser = null;
let dataArray = null;
let source = null;
let stream = null;
let isListening = false;
let isSoundActive = false;

async function startAudio() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    isListening = true;
    document.getElementById('mic-btn').classList.add('active');
    document.getElementById('mic-btn').textContent = '🟢 In ascolto';
    analyzeLoop();
  } catch (err) {
    console.error('Microfono non disponibile:', err);
    alert('Impossibile accedere al microfono. Verifica i permessi.');
  }
}

function stopAudio() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
  }
  if (audioCtx) {
    audioCtx.close();
  }
  audioCtx = null;
  analyser = null;
  source = null;
  stream = null;
  isListening = false;
  document.getElementById('mic-btn').classList.remove('active');
  document.getElementById('mic-btn').textContent = '🎤 Avvia microfono';
  setNoSound();
}
```

- [ ] **Step 2: Write the analysis loop**

```javascript
const SENSITIVITY_DEFAULT = 30;
const SILENCE_FRAMES = 8;
let silenceCounter = 0;
let sensitivity = SENSITIVITY_DEFAULT;
let speedMs = 2000;

function analyzeLoop() {
  if (!isListening) return;

  analyser.getByteFrequencyData(dataArray);
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }
  const level = sum / dataArray.length;

  const fill = document.getElementById('sound-level-fill');
  fill.style.width = Math.min(100, (level / 255) * 100) + '%';

  const thresholdLine = document.getElementById('sound-level-threshold');
  thresholdLine.style.left = sensitivity + '%';

  if (level > (sensitivity / 100) * 255) {
    silenceCounter = 0;
    if (!isSoundActive) {
      isSoundActive = true;
      setSound();
    }
  } else {
    silenceCounter++;
    if (silenceCounter >= SILENCE_FRAMES && isSoundActive) {
      isSoundActive = false;
      setNoSound();
    }
  }

  requestAnimationFrame(analyzeLoop);
}
```

---

### Task 4: Animation logic and state management

**Files:**
- Modify: `index.html` (add to `<script>`)

- [ ] **Step 1: Color state definitions**

Define start and target colors for each group:

```javascript
const COLORS = {
  centro: { start: '#009fe3', target: '#e6332a' },
  ali_arancioni: { start: '#f39200', target: '#662483' },
  ali_ciliegia: { start: '#d60b52', target: '#009640' },
};
```

- [ ] **Step 2: Color interpolation helpers**

```javascript
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(c => Math.round(c).toString(16).padStart(2, '0')).join('');
}

function lerpColor(c1, c2, t) {
  return rgbToHex(
    c1.r + (c2.r - c1.r) * t,
    c1.g + (c2.g - c1.g) * t,
    c1.b + (c2.b - c1.b) * t
  );
}
```

- [ ] **Step 3: Element references**

```javascript
const svgElement = document.getElementById('girandola');
const wrapper = document.getElementById('blades-wrapper');
const spinLayer = document.getElementById('spin-layer');

const elements = {
  centro: document.querySelector('#centro .cls-3'),
  ali_arancioni: document.querySelectorAll('#ali_arancioni .cls-2'),
  ali_ciliegia: document.querySelectorAll('#ali_ciliegia .cls-4'),
};
```

Wait — centro uses `.cls-3` but in sound state the center becomes red (which would be cls-2 in suono.svg). The color classes don't match between states. Better to select by ID:

```javascript
const elements = {
  centro: document.getElementById('centro-circle'),
  ali_arancioni: [
    document.getElementById('ala-arancione-1'),
    document.getElementById('ala-arancione-2'),
  ],
  ali_ciliegia: [
    document.getElementById('ala-ciliegia-1'),
    document.getElementById('ala-ciliegia-2'),
  ],
};
```

And give each path an id attribute in the HTML (already done in Task 1).

- [ ] **Step 4: Color lerping animation**

```javascript
let colorAnimId = null;

function lerpToTarget(targetColors, duration = 400) {
  if (colorAnimId) cancelAnimationFrame(colorAnimId);

  const startColors = {};
  for (const [key, ids] of Object.entries(elements)) {
    const el = Array.isArray(ids) ? ids[0] : ids;
    const computedStyle = getComputedStyle(el);
    startColors[key] = hexToRgb(computedStyle.fill || COLORS[key].start);
  }

  const targetRgb = {};
  for (const [key, val] of Object.entries(targetColors)) {
    targetRgb[key] = hexToRgb(val);
  }

  const startTime = performance.now();

  function animateColor(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);

    for (const [key, ids] of Object.entries(elements)) {
      const color = lerpColor(startColors[key], targetRgb[key], ease);
      if (Array.isArray(ids)) {
        ids.forEach(el => el.style.fill = color);
      } else {
        ids.style.fill = color;
      }
    }

    if (t < 1) {
      colorAnimId = requestAnimationFrame(animateColor);
    }
  }

  colorAnimId = requestAnimationFrame(animateColor);
}
```

- [ ] **Step 5: State switching functions**

```javascript
function setSound() {
  wrapper.classList.add('growing');
  spinLayer.classList.add('spinning');
  spinLayer.style.animationDuration = speedMs + 'ms';
  lerpToTarget({
    centro: COLORS.centro.target,
    ali_arancioni: COLORS.ali_arancioni.target,
    ali_ciliegia: COLORS.ali_ciliegia.target,
  });
}

function setNoSound() {
  wrapper.classList.remove('growing');
  spinLayer.classList.remove('spinning');
  lerpToTarget({
    centro: COLORS.centro.start,
    ali_arancioni: COLORS.ali_arancioni.start,
    ali_ciliegia: COLORS.ali_ciliegia.start,
  });
}
```

---

### Task 5: UI controls and bindings

**Files:**
- Modify: `index.html` (controls HTML + JS bindings)

- [ ] **Step 1: Add controls HTML**

Replace the placeholder `#controls` div:

```html
<div id="controls">
  <div class="control-group">
    <button id="mic-btn">🎤 Avvia microfono</button>
  </div>
  <div class="control-group">
    <label>📊</label>
    <div id="sound-level">
      <div id="sound-level-fill"></div>
      <div id="sound-level-threshold"></div>
    </div>
    <span id="level-display">0</span>
  </div>
  <div class="control-group">
    <label for="sensitivity">🔈</label>
    <input type="range" id="sensitivity" min="1" max="80" value="30">
    <span id="sensitivity-display">30</span>
  </div>
  <div class="control-group">
    <label for="speed">⏱</label>
    <input type="range" id="speed" min="300" max="5000" value="2000" step="100">
    <span id="speed-display">2.0s</span>
  </div>
</div>
```

- [ ] **Step 2: Add UI event bindings in JS**

```javascript
document.getElementById('mic-btn').addEventListener('click', () => {
  if (isListening) {
    stopAudio();
  } else {
    startAudio();
  }
});

document.getElementById('sensitivity').addEventListener('input', (e) => {
  sensitivity = parseInt(e.target.value);
  document.getElementById('sensitivity-display').textContent = sensitivity;
});

document.getElementById('speed').addEventListener('input', (e) => {
  speedMs = parseInt(e.target.value);
  document.getElementById('speed-display').textContent = (speedMs / 1000).toFixed(1) + 's';
  if (spinLayer) {
    spinLayer.style.animationDuration = speedMs + 'ms';
  }
});

// Initialize threshold line position
document.getElementById('sound-level-threshold').style.left = '30%';
```

- [ ] **Step 3: Initialize speed display**

```javascript
document.getElementById('speed-display').textContent = '2.0s';
```

---

### Task 6: Final integration and test

- [ ] **Step 1: Verify the HTML structure**

Open `index.html` in a browser. Verify:
- The pinwheel SVG renders centered on dark background
- Controls bar appears at the bottom
- Sliders and button are visible

- [ ] **Step 2: Test microphone interaction**

Click "Avvia microfono". Allow microphone permission. Verify:
- Button changes to "🟢 In ascolto"
- Sound level bar shows activity
- Making noise triggers pinwheel rotation + scaling + color change
- Silence stops the animation

- [ ] **Step 3: Test controls adjustment**

- Move sensitivity slider: verify threshold line moves, animation triggers at different loudness
- Move speed slider: verify rotation speed changes

---

### Spec coverage checklist

- [x] Microphone sound detection → Task 3
- [x] Morphing CSS (no path morphing, CSS transforms + color lerp) → Tasks 2, 4
- [x] Rotazione continua durante suono → Task 2, 4
- [x] Cambio colore → Task 4
- [x] Ingrandimento → Task 2 (scale 1.5)
- [x] Stecca ferma → Task 1 (stecca outside blades-wrapper)
- [x] Sensibilità regolabile → Task 3, 5
- [x] Velocità regolabile → Task 2, 5
- [x] Indicatore livello sonoro → Task 3, 5
- [x] Pulsante start/stop microfono → Task 3, 5
