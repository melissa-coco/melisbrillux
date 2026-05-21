# Bubble Pop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-file HTML interactive tool that pops floating bubbles using hand-pinch gestures via webcam hand tracking.

**Architecture:** Single `index.html` with all logic in one `<script>` block. Four runtime subsystems: BubbleSystem, ParticleSystem, HandposeDetector, and a Renderer driven by a `requestAnimationFrame` game loop. Audio via Web Audio API. No build step, no dependencies beyond CDN script tags.

**Tech Stack:** Canvas 2D, @tensorflow-models/hand-pose-detection v2.0.1, @mediapipe/hands v0.4, Web Audio API.

---

### Task 1: Project skeleton + CDN setup

**Files:**
- Create: `index.html` (full project)

- [ ] **Step 1: Write the base HTML file with CDN scripts, CSS, and empty canvas**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bubble Pop</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #111; overflow: hidden; font-family: system-ui, sans-serif; }
    #app-canvas { display: block; width: 100vw; height: 100vh; }
    #debug-video { display: none; }
    #pip-video {
      position: fixed; left: 20px; bottom: 20px; width: 200px;
      border-radius: 10px; transform: scaleX(-1); z-index: 10;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.15);
    }
  </style>
</head>
<body>
  <canvas id="app-canvas"></canvas>
  <video id="debug-video" autoplay playsinline></video>
  <video id="pip-video" autoplay playsinline></video>

  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@4.22.0/dist/tf-core.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter@4.22.0/dist/tf-converter.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@4.22.0/dist/tf-backend-webgl.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection@2.0.1/dist/hand-pose-detection.min.js"></script>

  <script>
    // --- DOM refs ---
    const canvas = document.getElementById('app-canvas');
    const ctx = canvas.getContext('2d');
    const debugVideo = document.getElementById('debug-video');
    const pipVideo = document.getElementById('pip-video');

    // --- resize ---
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // --- placeholder: main entry ---
    console.log('Bubble Pop skeleton loaded');
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify file loads**

Open `index.html` in Chrome. Confirm: canvas fills the viewport, no console errors.

---

### Task 2: Background gradient renderer

- [ ] **Step 1: Add gradient state and render function**

Insert before `console.log`:

```js
// --- Background ---
const bgColors = [
  [255, 182, 193],  // pink
  [173, 216, 230],  // sky blue
  [216, 191, 255],  // lilac
  [255, 218, 185],  // peach
  [179, 255, 206],  // mint
];
let bgColorA = bgColors[0];
let bgColorB = bgColors[1];
let bgLerp = 0;
let bgTargetPair = [bgColors[1], bgColors[2]];
let bgT = 0;

function updateBackground(dt) {
  bgLerp += dt * 0.05;
  if (bgLerp >= 1) {
    bgLerp = 0;
    bgColorA = bgTargetPair[0];
    // pick next pair, avoid repeating the same color
    let available = bgColors.filter(c => c !== bgTargetPair[0] && c !== bgTargetPair[1]);
    let next = available[Math.floor(Math.random() * available.length)];
    bgTargetPair = [bgTargetPair[1], next];
  }
}

function renderBackground() {
  const a = bgColorA;
  const b = bgTargetPair[0];
  const t = bgLerp;
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, `rgb(${r},${g},${bl})`);
  grad.addColorStop(1, `rgb(${bl},${r},${g})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
```

- [ ] **Step 2: Add timer reference at top of script**

```js
let lastTime = performance.now();
```

- [ ] **Step 3: Add a test render call after `resize()`**

```js
function testBackground() {
  updateBackground(0.016);
  renderBackground();
  requestAnimationFrame(testBackground);
}
testBackground();
```

- [ ] **Step 4: Verify in browser**

Open file. Confirm: full-screen pastel gradient animates smoothly cycling through colors.

---

### Task 3: Bubble system — data model + initialization

- [ ] **Step 1: Add bubble config and factory**

Replace the `testBackground` call with the bubble system code. Add after `renderBackground()`:

```js
// --- Bubble System ---
const BUBBLE_COUNT = 15;
const BUBBLE_MIN_R = 30;
const BUBBLE_MAX_R = 80;
const BUBBLE_COLORS = [
  '#ffb6c1', '#87ceeb', '#d8b4fe', '#ffdab9', '#b3ffce',
  '#fda4af', '#67e8f9', '#c4b5fd', '#fdba74', '#86efac',
];

let bubbles = [];

function createBubble() {
  const r = BUBBLE_MIN_R + Math.random() * (BUBBLE_MAX_R - BUBBLE_MIN_R);
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: r,
    color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
    phase: Math.random() * Math.PI * 2,
    speed: 15 + Math.random() * 25,
    amp: 20 + Math.random() * 40,
    alive: true,
    popTimer: 0,
  };
}

function initBubbles() {
  bubbles = [];
  for (let i = 0; i < BUBBLE_COUNT; i++) {
    bubbles.push(createBubble());
  }
}
initBubbles();
```

- [ ] **Step 2: Add bubble update and render functions**

```js
function updateBubbles(dt) {
  for (const b of bubbles) {
    if (!b.alive) {
      b.popTimer -= dt;
      if (b.popTimer <= 0) {
        Object.assign(b, createBubble());
        b.alive = true;
      }
      continue;
    }
    b.phase += dt * b.speed * 0.01;
    b.x += Math.sin(b.phase) * 0.8;
    b.y -= Math.cos(b.phase) * 0.4;
    // wrap screen edges
    if (b.x < -b.r) b.x = canvas.width + b.r;
    if (b.x > canvas.width + b.r) b.x = -b.r;
    if (b.y < -b.r) b.y = canvas.height + b.r;
    if (b.y > canvas.height + b.r) b.y = -b.r;
  }
}

function renderBubbles() {
  for (const b of bubbles) {
    if (!b.alive) continue;
    const grad = ctx.createRadialGradient(b.x - b.r*0.3, b.y - b.r*0.3, 0, b.x, b.y, b.r);
    grad.addColorStop(0, 'rgba(255,255,255,0.8)');
    grad.addColorStop(0.3, b.color);
    grad.addColorStop(1, 'rgba(255,255,255,0.1)');
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    // subtle shine highlight
    ctx.beginPath();
    ctx.arc(b.x - b.r*0.25, b.y - b.r*0.25, b.r*0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fill();
  }
}
```

- [ ] **Step 3: Test by wiring into a temporary loop**

```js
function testLoop() {
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  updateBackground(dt);
  updateBubbles(dt);
  renderBackground();
  renderBubbles();
  requestAnimationFrame(testLoop);
}
testLoop();
```

- [ ] **Step 4: Verify in browser**

Open file. Confirm: 15 rainbow bubbles float gently with sinusoidal movement, wrap edges, respawn is not yet active (bubbles float forever).

---

### Task 4: Handpose detector + webcam setup

- [ ] **Step 1: Add handpose setup and keypoint access**

Add after the resize handler, before background code:

```js
// --- Handpose ---
let detector = null;
let handData = null; // { indexTip: {x,y}, thumbTip: {x,y}, landmarks }
const PIP_THUMBNAIL_W = 200;

async function setupHandpose() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
  debugVideo.srcObject = stream;
  pipVideo.srcObject = stream;
  await debugVideo.play();
  await pipVideo.play();

  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  detector = await handPoseDetection.createDetector(model, {
    runtime: 'mediapipe',
    modelType: 'full',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240',
    maxHands: 1,
  });
}

function getFingerTips(landmarks) {
  if (!landmarks || landmarks.length === 0) return null;
  const hand = landmarks[0];
  return {
    indexTip: { x: hand.keypoints[8].x * (canvas.width / debugVideo.videoWidth), y: hand.keypoints[8].y * (canvas.height / debugVideo.videoHeight) },
    thumbTip: { x: hand.keypoints[4].x * (canvas.width / debugVideo.videoWidth), y: hand.keypoints[4].y * (canvas.height / debugVideo.videoHeight) },
    landmarks: hand,
  };
}

async function detectHands() {
  if (!detector || debugVideo.readyState < 2) return;
  const hands = await detector.estimateHands(debugVideo);
  handData = getFingerTips(hands);
}
```

- [ ] **Step 2: Verify handpose loads**

In the browser console, call `setupHandpose()`. Confirm: camera permission prompt, no errors, `detector` is set.

---

### Task 5: Pinch detection + cursor

- [ ] **Step 1: Add pinch state and cursor rendering**

```js
// --- Pinch ---
const PINCH_THRESHOLD = 35;
let isPinching = false;
let prevPinching = false;

function updatePinch() {
  if (!handData) { isPinching = false; return; }
  const dx = handData.indexTip.x - handData.thumbTip.x;
  const dy = handData.indexTip.y - handData.thumbTip.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  isPinching = dist < PINCH_THRESHOLD;
}

function renderCursor() {
  if (!handData) return;
  const p = handData.indexTip;
  ctx.beginPath();
  ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
  ctx.fillStyle = isPinching ? 'rgba(255,100,100,0.6)' : 'rgba(255,255,255,0.5)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.lineWidth = 2;
  ctx.stroke();
}
```

- [ ] **Step 2: Wire into the game loop**

Replace `testLoop` with the real loop:

```js
async function start() {
  await setupHandpose();
  lastTime = performance.now();

  function loop() {
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    detectHands().then(() => {
      updatePinch();
      updateBackground(dt);
      updateBubbles(dt);

      renderBackground();
      renderBubbles();
      renderCursor();

      requestAnimationFrame(loop);
    });
  }
  loop();
}
start().catch(console.error);
```

- [ ] **Step 3: Verify**

Open file. Confirm: webcam PIP bottom-left, cursor follows index finger, turns red when pinching.

---

### Task 6: Pop detection

- [ ] **Step 1: Add pop function with cooldown**

After `updatePinch()`:

```js
// --- Pop ---
const POP_MARGIN = 10;
function randomRespawnDelay() { return 2 + Math.random(); } // 2-3 seconds

function detectPop() {
  if (!isPinching || !handData) return;
  const points = [handData.indexTip, handData.thumbTip];
  let closest = null;
  let closestDist = Infinity;

  for (const b of bubbles) {
    if (!b.alive) continue;
    for (const p of points) {
      const dx = p.x - b.x;
      const dy = p.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy) - b.r;
      if (dist < POP_MARGIN && dist < closestDist) {
        closestDist = dist;
        closest = b;
      }
    }
  }

  if (closest) {
    popBubble(closest);
  }
}

function popBubble(bubble) {
  bubble.alive = false;
  bubble.popTimer = randomRespawnDelay();
  // particles and sound will be added next tasks
}
```

- [ ] **Step 2: Wire into loop after detectHands**

Add `detectPop();` in the loop:

```js
detectHands().then(() => {
  updatePinch();
  detectPop();
  // ... rest
});
```

- [ ] **Step 3: Update `prevPinching` tracking**

The `detectPop` already handles the case during sustained pinch through the cooldown on the bubble itself. Add cooldown tracking:

In `popBubble`, we already set `popTimer`. The bubble won't be alive so it won't be detected again. This is sufficient.

- [ ] **Step 4: Verify**

Open file. Confirm: pinching near a bubble causes it to disappear and respawn after 2-3 seconds.

---

### Task 7: Particle system

- [ ] **Step 1: Add particle state and functions**

```js
// --- Particles ---
let particles = [];
const PARTICLE_COUNT = 20;

function spawnParticles(x, y, color) {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 50 + Math.random() * 150;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 2 + Math.random() * 4,
      color: color,
      life: 0.6,
      maxLife: 0.6,
    });
  }
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 120 * dt; // gravity
    p.life -= dt;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function renderParticles() {
  for (const p of particles) {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * alpha, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}
```

- [ ] **Step 2: Wire into `popBubble`**

Replace `popBubble`:

```js
function popBubble(bubble) {
  bubble.alive = false;
  bubble.popTimer = randomRespawnDelay();
  spawnParticles(bubble.x, bubble.y, bubble.color);
}
```

- [ ] **Step 3: Add to update and render calls in loop**

In update section: `updateParticles(dt);`
In render section, after `renderBubbles()`: `renderParticles();`

- [ ] **Step 4: Verify**

Open file. Confirm: popping a bubble releases ~20 colorful particles that spread, fall with gravity, and fade out over 0.6s.

---

### Task 8: Sound system

- [ ] **Step 1: Add Web Audio pop sound**

```js
// --- Sound ---
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playPopSound(bubbleRadius) {
  initAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.type = 'sine';
  const baseFreq = 400 + (bubbleRadius / BUBBLE_MAX_R) * 400; // 400-800Hz based on size
  osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.3, audioCtx.currentTime + 0.08);

  const volume = 0.15 + (bubbleRadius / BUBBLE_MAX_R) * 0.15;
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.1);
}
```

- [ ] **Step 2: Wire into `popBubble`**

```js
function popBubble(bubble) {
  bubble.alive = false;
  bubble.popTimer = randomRespawnDelay();
  spawnParticles(bubble.x, bubble.y, bubble.color);
  playPopSound(bubble.r);
}
```

- [ ] **Step 3: Verify**

Open file. Confirm: popping a bubble produces a soft "pop" sound, louder for bigger bubbles. First pop may require a user click/interaction to init AudioContext.

---

### Task 9: PIP webcam rendering

- [ ] **Step 1: Add PIP video update in loop**

The PIP video element already exists in HTML and gets its stream from `setupHandpose`. It auto-plays. Done.

- [ ] **Step 2: Style verification**

Check: `#pip-video` is fixed bottom-left, 200px wide, mirrored, with rounded corners and subtle shadow. Resize works.

---

### Task 10: Final integration + polish

- [ ] **Step 1: Verify game loop order is correct**

The final loop should be:

```js
function loop() {
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  detectHands().then(() => {
    updatePinch();
    detectPop();
    updateBackground(dt);
    updateBubbles(dt);
    updateParticles(dt);

    renderBackground();
    renderBubbles();
    renderParticles();
    renderCursor();

    requestAnimationFrame(loop);
  });
}
```

- [ ] **Step 2: Manual QA checklist**

Open in Chrome. Test each:
1. Bubbles float smoothly with sinusoidal motion — PASS/FAIL
2. Bubbles wrap screen edges — PASS/FAIL
3. Bubbles respawn 2-3s after pop — PASS/FAIL
4. Cursor follows index finger — PASS/FAIL
5. Cursor turns red when pinching — PASS/FAIL
6. Pinching near a bubble pops it — PASS/FAIL
7. Particles burst on pop with gravity and fade — PASS/FAIL
8. Sound pops on each burst, variable pitch/volume — PASS/FAIL
9. Background gradient cycles smoothly — PASS/FAIL
10. Webcam PIP visible bottom-left, mirrored — PASS/FAIL
11. No console errors — PASS/FAIL

- [ ] **Step 3: Fix any issues found during QA**

- [ ] **Step 4: Clean up any console.log/test code**

Remove any stray test calls or debug log statements.

---

### Task 11: Initialize git repo + commit

- [ ] **Step 1: Initialize git**

```bash
git init
git add -A
git status
```

- [ ] **Step 2: Create .gitignore**

```bash
echo ".DS_Store" > .gitignore
git add .gitignore
```

- [ ] **Step 3: Commit**

```bash
git commit -m "feat: bubble pop handpose interactive tool

Single-file HTML app using TensorFlow.js + MediaPipe hand tracking.
Pop floating bubbles by pinching index finger and thumb.
Features: particle burst effects, synthesized pop sounds,
dynamic pastel gradient background, webcam PIP overlay."
```
