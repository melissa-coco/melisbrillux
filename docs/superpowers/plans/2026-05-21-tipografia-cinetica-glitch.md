# Tipografia Cinetica — WebGL Glitch RGB Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the particle melt effect with a WebGL shader-based noise + RGB split glitch effect for the word "CAOS".

**Architecture:** Offscreen canvas 2D renders text → uploaded as WebGL texture → fragment shader applies simplex noise 3D to distort UV coordinates per-pixel for micro-movements → RGB split glitch triggered by a JS timer shifts red/blue channels independently.

**Tech Stack:** WebGL2, GLSL (simplex noise 3D), Canvas 2D (text rendering), vanilla JS

---

### Task 1: Create shader source file

**Files:**
- Create: `Tipografia Cinetica/shaders.js`

- [ ] **Step 1: Create shaders.js with vertex and fragment shaders**

```js
// shaders.js — GLSL Shader sources for WebGL2

const vertexShaderSource = `#version 300 es
in vec2 aPosition;
in vec2 aTexCoord;
out vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const fragmentShaderSource = `#version 300 es
precision highp float;

in vec2 vTexCoord;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;
uniform float uNoiseIntensity;
uniform float uSpeed;
uniform float uGlitchAmount;
uniform float uGlitchActive;
uniform float uGlitchSeed;
uniform vec3 uColor;

// Simplex noise 3D — Stefan Gustavson / Ashima Arts
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v   - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - 0.5;
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  vec4 j = p - 49.0 * floor(p * (1.0 / 49.0));
  vec4 x_ = floor(j * (1.0 / 7.0));
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = (x_ * 2.0 + 0.5) / 7.0 - 1.0;
  vec4 y = (y_ * 2.0 + 0.5) / 7.0 - 1.0;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  vec4 m2 = m * m;
  vec4 gx = vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3));
  return 105.0 * dot(m2, gx);
}

void main() {
  vec2 uv = vTexCoord;
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);

  // Time-based noise for X and Y displacement
  float t = uTime * uSpeed;
  float nx = snoise(vec3(uv.x * 3.0 + 1.2, uv.y * 3.0, t * 0.8));
  float ny = snoise(vec3(uv.x * 3.0, uv.y * 3.0 + 2.3, t * 0.7));
  float nr = snoise(vec3(uv.x * 3.0 + 4.1, uv.y * 3.0 + 1.7, t * 0.6));

  vec2 offset = vec2(nx, ny) * uNoiseIntensity * 0.02;
  vec2 distortedUv = uv + offset;

  // Rotation via noise
  float angle = nr * uNoiseIntensity * 0.05;
  vec2 center = vec2(0.5);
  vec2 rel = distortedUv - center;
  float cosA = cos(angle);
  float sinA = sin(angle);
  rel = vec2(rel.x * cosA - rel.y * sinA, rel.x * sinA + rel.y * cosA);
  vec2 finalUv = rel + center;

  // Sample text texture
  vec4 texColor = texture(uTexture, finalUv);

  // If no text here, transparent
  if (texColor.a < 0.1) {
    fragColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }

  // RGB Split Glitch
  float glitch = uGlitchActive;
  float seedOffset = uGlitchSeed * 0.1;
  float glitchX = snoise(vec3(finalUv.x * 10.0 + seedOffset, finalUv.y * 10.0, t * 2.0));

  vec2 glitchDir = vec2(
    glitchX * uGlitchAmount / uResolution.x,
    glitchX * uGlitchAmount / uResolution.y * 0.3
  );

  float r = texture(uTexture, finalUv + glitchDir * glitch).r;
  float g = texColor.g;
  float b = texture(uTexture, finalUv - glitchDir * glitch).b;

  // Apply text color (use luminance to preserve shape)
  float lum = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
  vec3 colored = uColor * lum;

  // Blend glitch channels with color
  vec3 finalColor = mix(colored, vec3(r, g, b), glitch * 0.8);

  fragColor = vec4(finalColor, texColor.a);
}
`

export { vertexShaderSource, fragmentShaderSource }
```

- [ ] **Step 2: Verify file created**

Run: `ls -la "Tipografia Cinetica/shaders.js"`
Expected: File exists

- [ ] **Step 3: Commit**

```bash
git add "Tipografia Cinetica/shaders.js"
git commit -m "feat: add GLSL shader sources for noise + glitch"
```

---

### Task 2: Update style.css

**Files:**
- Modify: `Tipografia Cinetica/style.css`

- [ ] **Step 1: Update canvas styles for WebGL (remove gradient, set dark bg)**

```css
#main-canvas {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  background: #0f0f23;
}
```

Replace the existing `#main-canvas` block with the above.

- [ ] **Step 2: Verify no other changes needed**

Run: `git diff "Tipografia Cinetica/style.css"`
Expected: Only the `#main-canvas` block changed.

- [ ] **Step 3: Commit**

```bash
git add "Tipografia Cinetica/style.css"
git commit -m "feat: update canvas style for WebGL dark background"
```

---

### Task 3: Update index.html

**Files:**
- Modify: `Tipografia Cinetica/index.html`

- [ ] **Step 1: Update the HTML to use module script and set default word to CAOS**

Replace the content with:

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tipografia Cinetica — CAOS</title>
  <link rel="stylesheet" href="style.css">
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
      </aside>
    </main>
  </div>
  <script type="module" src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add "Tipografia Cinetica/index.html"
git commit -m "feat: update HTML for WebGL mode with CAOS"
```

---

### Task 4: Rewrite app.js — WebGL setup and helpers

**Files:**
- Modify: `Tipografia Cinetica/app.js`

- [ ] **Step 1: Replace app.js with WebGL initialization and canvas setup**

```js
import { vertexShaderSource, fragmentShaderSource } from './shaders.js'

// === State ===
const state = {
  word: 'CAOS',
  font: 'Fredoka One',
  color: '#FF6B6B',
  noiseIntensity: 0.8,
  speed: 1.5,
  glitchFrequency: 3.0,
  glitchAmount: 30,
}

// === Canvas & WebGL Setup ===
const canvas = document.getElementById('main-canvas')
const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false })

if (!gl) {
  document.getElementById('canvas-container').innerHTML = '<p style="color:red">WebGL2 not supported</p>'
  throw new Error('WebGL2 required')
}

const offscreen = document.createElement('canvas')
const offCtx = offscreen.getContext('2d')

let program, uLocations, vao, texture
let textDirty = true
let animTime = 0
let glitchTimer = 0
let glitchActive = 0
let glitchSeed = 0
let rafId = null
let textNeedsRedraw = true

function compileShader(type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function initShaders() {
  const vs = compileShader(gl.VERTEX_SHADER, vertexShaderSource)
  const fs = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource)
  program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program))
    return
  }
  gl.useProgram(program)

  uLocations = {
    uTexture: gl.getUniformLocation(program, 'uTexture'),
    uTime: gl.getUniformLocation(program, 'uTime'),
    uResolution: gl.getUniformLocation(program, 'uResolution'),
    uNoiseIntensity: gl.getUniformLocation(program, 'uNoiseIntensity'),
    uSpeed: gl.getUniformLocation(program, 'uSpeed'),
    uGlitchAmount: gl.getUniformLocation(program, 'uGlitchAmount'),
    uGlitchActive: gl.getUniformLocation(program, 'uGlitchActive'),
    uGlitchSeed: gl.getUniformLocation(program, 'uGlitchSeed'),
    uColor: gl.getUniformLocation(program, 'uColor'),
  }
}

function initGeometry() {
  const positions = new Float32Array([
    -1, -1,  0, 0,
     1, -1,  1, 0,
    -1,  1,  0, 1,
     1,  1,  1, 1,
  ])
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

  vao = gl.createVertexArray()
  gl.bindVertexArray(vao)

  const aPosition = gl.getAttribLocation(program, 'aPosition')
  const aTexCoord = gl.getAttribLocation(program, 'aTexCoord')
  const stride = 4 * 4

  gl.enableVertexAttribArray(aPosition)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, stride, 0)

  gl.enableVertexAttribArray(aTexCoord)
  gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, stride, 8)

  gl.bindVertexArray(null)
}

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
  gl.viewport(0, 0, canvas.width, canvas.height)
  textNeedsRedraw = true
}

window.addEventListener('resize', resizeCanvas)
```

- [ ] **Step 2: Commit**

```bash
git add "Tipografia Cinetica/app.js"
git commit -m "feat: add WebGL2 initialization and shader compilation"
```

---

### Task 5: app.js — Text rendering to texture

**Files:**
- Modify: `Tipografia Cinetica/app.js`

- [ ] **Step 1: Add text rendering and texture upload functions**

Append after `resizeCanvas()`:

```js
// === Text to Texture ===
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  return [r, g, b]
}

function renderTextToCanvas() {
  const w = offscreen.width
  const h = offscreen.height
  offCtx.clearRect(0, 0, w, h)

  const maxWidth = w * 0.85
  let fontSize = Math.min(w / Math.max(state.word.length, 1) * 1.5, h * 0.5)

  offCtx.font = `${fontSize}px "${state.font}"`

  while (offCtx.measureText(state.word).width > maxWidth && fontSize > 20) {
    fontSize *= 0.9
    offCtx.font = `${fontSize}px "${state.font}"`
  }

  offCtx.textAlign = 'center'
  offCtx.textBaseline = 'middle'
  offCtx.fillStyle = '#ffffff'
  offCtx.fillText(state.word, w / 2, h / 2)
}

function uploadTexture() {
  if (texture) gl.deleteTexture(texture)
  texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, offscreen)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.bindTexture(gl.TEXTURE_2D, null)
}

function ensureTexture() {
  if (textNeedsRedraw) {
    renderTextToCanvas()
    uploadTexture()
    textNeedsRedraw = false
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add "Tipografia Cinetica/app.js"
git commit -m "feat: add text-to-texture rendering pipeline"
```

---

### Task 6: app.js — Animation loop with noise + glitch

**Files:**
- Modify: `Tipografia Cinetica/app.js`

- [ ] **Step 1: Add animation loop, glitch timer, and render function**

Append after `ensureTexture()`:

```js
// === Animation Loop ===
function startAnimation() {
  animTime = 0
  glitchTimer = 0
  loop()
}

function loop() {
  const dt = 1 / 60
  animTime += dt * state.speed

  // Glitch timer
  glitchTimer += dt
  if (glitchActive > 0) {
    glitchActive -= dt
    if (glitchActive <= 0) {
      glitchActive = 0
      glitchTimer = 0
    }
  } else if (glitchTimer >= state.glitchFrequency) {
    glitchActive = 0.1 + Math.random() * 0.15
    glitchSeed = Math.random() * 100
    glitchTimer = 0
  }

  gl.useProgram(program)
  gl.bindVertexArray(vao)
  ensureTexture()

  // Bind texture
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.uniform1i(uLocations.uTexture, 0)

  // Set uniforms
  gl.uniform1f(uLocations.uTime, animTime)
  gl.uniform2f(uLocations.uResolution, canvas.width, canvas.height)
  gl.uniform1f(uLocations.uNoiseIntensity, state.noiseIntensity)
  gl.uniform1f(uLocations.uSpeed, state.speed)
  gl.uniform1f(uLocations.uGlitchAmount, state.glitchAmount)
  gl.uniform1f(uLocations.uGlitchActive, Math.min(glitchActive * 4, 1))
  gl.uniform1f(uLocations.uGlitchSeed, glitchSeed)

  const [r, g, b] = hexToRgb(state.color)
  gl.uniform3f(uLocations.uColor, r, g, b)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

  rafId = requestAnimationFrame(loop)
}

function stopAnimation() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}
```

- [ ] **Step 2: Initialize and start**

Append after `stopAnimation()`:

```js
// === Init ===
initShaders()
initGeometry()
resizeCanvas()
startAnimation()
```

- [ ] **Step 3: Commit**

```bash
git add "Tipografia Cinetica/app.js"
git commit -m "feat: add animation loop with noise and glitch timer"
```

---

### Task 7: app.js — Font loading and controls

**Files:**
- Modify: `Tipografia Cinetica/app.js`

- [ ] **Step 1: Add font loading and controls UI**

Insert before `// === Init ===`:

```js
// === Font Loading ===
function loadFont(family) {
  return new Promise((resolve) => {
    const link = document.createElement('link')
    link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@400;700&display=swap`
    link.rel = 'stylesheet'
    link.onload = resolve
    link.onerror = resolve
    document.head.appendChild(link)
    // fallback: resolve after timeout
    setTimeout(resolve, 3000)
  })
}

// === Controls ===
const controlsEl = document.getElementById('controls')

function buildControls() {
  controlsEl.innerHTML = `
    <div class="control-group">
      <label for="word-input">TESTO</label>
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
      <label for="color-input">Colore</label>
      <input type="color" id="color-input" value="${state.color}">
    </div>
    <div class="control-group">
      <label for="noise-slider">Intensità noise: <span id="noise-value">${state.noiseIntensity.toFixed(2)}</span></label>
      <input type="range" id="noise-slider" min="0" max="2" step="0.05" value="${state.noiseIntensity}">
    </div>
    <div class="control-group">
      <label for="speed-slider">Velocità: <span id="speed-value">${state.speed.toFixed(1)}</span></label>
      <input type="range" id="speed-slider" min="0.1" max="5" step="0.1" value="${state.speed}">
    </div>
    <div class="control-group">
      <label for="glitch-freq-slider">Freq. glitch: <span id="glitch-freq-value">${state.glitchFrequency.toFixed(1)}s</span></label>
      <input type="range" id="glitch-freq-slider" min="0.5" max="10" step="0.5" value="${state.glitchFrequency}">
    </div>
    <div class="control-group">
      <label for="glitch-amount-slider">Intensità glitch: <span id="glitch-amount-value">${state.glitchAmount}px</span></label>
      <input type="range" id="glitch-amount-slider" min="0" max="50" step="1" value="${state.glitchAmount}">
    </div>
  `
}
buildControls()

function setupControls() {
  document.getElementById('word-input').addEventListener('input', e => {
    state.word = e.target.value || ' '
    textNeedsRedraw = true
  })

  document.getElementById('font-select').addEventListener('change', async e => {
    state.font = e.target.value
    await loadFont(state.font)
    textNeedsRedraw = true
  })

  document.getElementById('color-input').addEventListener('input', e => {
    state.color = e.target.value
  })

  document.getElementById('noise-slider').addEventListener('input', e => {
    state.noiseIntensity = Number(e.target.value)
    document.getElementById('noise-value').textContent = state.noiseIntensity.toFixed(2)
  })

  document.getElementById('speed-slider').addEventListener('input', e => {
    state.speed = Number(e.target.value)
    document.getElementById('speed-value').textContent = state.speed.toFixed(1)
  })

  document.getElementById('glitch-freq-slider').addEventListener('input', e => {
    state.glitchFrequency = Number(e.target.value)
    document.getElementById('glitch-freq-value').textContent = state.glitchFrequency.toFixed(1) + 's'
  })

  document.getElementById('glitch-amount-slider').addEventListener('input', e => {
    state.glitchAmount = Number(e.target.value)
    document.getElementById('glitch-amount-value').textContent = state.glitchAmount + 'px'
  })
}
setupControls()
```

- [ ] **Step 2: Load initial font**

Append before `// === Init ===`:

```js
// Load initial font
loadFont(state.font)
```

- [ ] **Step 3: Commit**

```bash
git add "Tipografia Cinetica/app.js"
git commit -m "feat: add controls UI and font loading"
```

---

### Task 8: Visual verification

**Files:** None

- [ ] **Step 1: Serve the project and verify in browser**

Run: `python3 -m http.server 8080` in `Sito 2` directory

Expected: Open `http://localhost:8080/Tipografia%20Cinetica/` — text "CAOS" appears centered with continuous micro-movements, occasional RGB split glitch, controls work.

- [ ] **Step 2: Test all controls**
  - Change text: letters update immediately
  - Change font: loads and updates
  - Change color: text color changes
  - Noise intensity slider: movement range changes
  - Speed slider: animation speed changes
  - Glitch freq: glitch timing changes
  - Glitch amount: split distance changes
