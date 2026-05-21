// === State ===
const state = {
  word: 'GELEATO',
  font: 'Fredoka One',
  weight: 700,
  colors: ['#FF6B6B', '#FFD93D', '#6BCB77'],
  gradient: true,
  duration: 4000,
  intensity: 1.0,
  speed: 1.0,
  playing: false,
  loop: true
}

// === Canvas Setup ===
const canvas = document.getElementById('main-canvas')
const ctx = canvas.getContext('2d')
const offscreen = document.createElement('canvas')
const offCtx = offscreen.getContext('2d', { willReadFrequently: true })

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
  syncDisplay()
}

window.addEventListener('resize', resizeCanvas)

// === Text Rendering ===
function drawText() {
  const w = offscreen.width
  const h = offscreen.height
  offCtx.clearRect(0, 0, w, h)

  const maxWidth = w * 0.85
  let fontSize = Math.min(w / Math.max(state.word.length, 1) * 1.5, h * 0.5)

  offCtx.font = `${state.weight} ${fontSize}px "${state.font}"`

  while (offCtx.measureText(state.word).width > maxWidth && fontSize > 20) {
    fontSize *= 0.9
    offCtx.font = `${state.weight} ${fontSize}px "${state.font}"`
  }

  offCtx.textAlign = 'center'
  offCtx.textBaseline = 'middle'

  const x = w / 2
  const y = h / 2

  if (state.gradient && state.colors.length >= 2) {
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

function syncDisplay() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(offscreen, 0, 0)
}

// Load font then render
WebFont.load({
  google: { families: [state.font] },
  active: () => { drawText(); syncDisplay(); }
})

resizeCanvas()

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
      <label>
        <input type="checkbox" id="gradient-check" ${state.gradient ? 'checked' : ''}>
        Sfumatura
      </label>
    </div>
    <div class="control-group">
      <label for="duration-slider">Durata: <span id="duration-value">${(state.duration / 1000).toFixed(1)}s</span></label>
      <input type="range" id="duration-slider" min="1000" max="10000" step="500" value="${state.duration}">
    </div>
    <div class="controls-actions">
      <button class="btn btn-primary" id="play-btn">▶ Play</button>
      <button class="btn btn-secondary" id="loop-btn">↺ Loop</button>
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

function setupControls() {
  document.getElementById('word-input').addEventListener('input', e => {
    state.word = e.target.value || ' '
    stopAnimation()
    drawText()
    syncDisplay()
  })

  document.getElementById('font-select').addEventListener('change', e => {
    state.font = e.target.value
    WebFont.load({
      google: { families: [state.font] },
      active: () => { stopAnimation(); drawText(); syncDisplay() }
    })
  })

  document.getElementById('weight-slider').addEventListener('input', e => {
    state.weight = Number(e.target.value)
    document.getElementById('weight-value').textContent = state.weight
    stopAnimation()
    drawText()
    syncDisplay()
  })

  document.getElementById('color-pickers').addEventListener('input', e => {
    if (e.target.type === 'color') {
      const idx = Number(e.target.id.replace('color-', ''))
      state.colors[idx] = e.target.value
      stopAnimation()
      drawText()
      syncDisplay()
    }
  })

  document.getElementById('gradient-check').addEventListener('change', e => {
    state.gradient = e.target.checked
    stopAnimation()
    drawText()
    syncDisplay()
  })

  document.getElementById('duration-slider').addEventListener('input', e => {
    state.duration = Number(e.target.value)
    document.getElementById('duration-value').textContent = (state.duration / 1000).toFixed(1) + 's'
  })
}
setupControls()

function stopAnimation() {
  state.playing = false
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }
  const btn = document.getElementById('play-btn')
  if (btn) btn.textContent = '▶ Play'
}

// === Effect System ===
let animFrameId = null
let animStartTime = 0
let pausedProgress = 0

function playAnimation() {
  if (state.playing) return
  state.playing = true
  document.getElementById('play-btn').textContent = '⏸ Pause'

  meltEffect.reset()
  drawText()
  pausedProgress = 0
  animStartTime = performance.now()
  animFrameId = requestAnimationFrame(animLoop)
}

function animLoop(time) {
  if (!state.playing) return

  const effectiveDuration = state.duration / state.speed
  let elapsed = (time - animStartTime) * state.speed

  if (elapsed >= effectiveDuration) {
    if (state.loop) {
      animStartTime = time
      pausedProgress = 0
      drawText()
      elapsed = 0
    } else {
      pausedProgress = 1
      renderFrame(1)
      stopAnimation()
      return
    }
  } else {
    pausedProgress = Math.min(elapsed / state.duration, 1)
  }

  const progress = Math.min(elapsed / effectiveDuration, 1)
  renderFrame(progress)
  animFrameId = requestAnimationFrame(animLoop)
}

function renderFrame(progress) {
  const w = offscreen.width
  const h = offscreen.height

  const imageData = offCtx.getImageData(0, 0, w, h)

  meltEffect.process(imageData, w, h, progress, state)

  offCtx.putImageData(imageData, 0, 0)

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(offscreen, 0, 0)

  meltEffect.draw(ctx, w, h, progress, state)
}

// Wire play button
document.getElementById('play-btn').addEventListener('click', () => {
  if (state.playing) stopAnimation()
  else playAnimation()
})

document.getElementById('loop-btn').addEventListener('click', () => {
  state.loop = !state.loop
  const btn = document.getElementById('loop-btn')
  btn.classList.toggle('active', state.loop)
  btn.textContent = state.loop ? '↺ Loop: ON' : '↺ Loop: OFF'
})

document.getElementById('loop-btn').classList.add('active')
document.getElementById('loop-btn').textContent = '↺ Loop: ON'

document.getElementById('intensity-slider').addEventListener('input', e => {
  state.intensity = Number(e.target.value)
  document.getElementById('intensity-value').textContent = state.intensity.toFixed(2)
})

document.getElementById('speed-slider').addEventListener('input', e => {
  state.speed = Number(e.target.value)
  document.getElementById('speed-value').textContent = state.speed.toFixed(1)
})

// === Scioglimento Effect ===
const meltEffect = {
  drips: [],
  fallingDrops: [],
  bottomEdges: [],
  textPixels: [],
  needsRescan: true,

  reset() {
    this.drips = []
    this.fallingDrops = []
    this.bottomEdges = []
    this.textPixels = []
    this.needsRescan = true
  },

  process(imageData, w, h, progress, state) {
    const data = imageData.data

    if (this.needsRescan) {
      this.textPixels = []
      this.bottomEdges = []
      let sumY = 0
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const alpha = data[(y * w + x) * 4 + 3]
          if (alpha > 128) {
            this.textPixels.push({ x, y })
            sumY += y
          }
        }
      }
      const midY = this.textPixels.length > 0 ? sumY / this.textPixels.length : 0
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const alpha = data[(y * w + x) * 4 + 3]
          if (alpha > 128 && y > midY) {
            if (y + 1 >= h || data[((y + 1) * w + x) * 4 + 3] <= 128) {
              if (Math.random() < 0.04) {
                this.bottomEdges.push({ x, y })
              }
            }
          }
        }
      }
      this.needsRescan = false
    }

    if (this.textPixels.length === 0) return

    if (this.drips.length === 0 && this.bottomEdges.length > 0) {
      for (let i = 0; i < Math.min(25, this.bottomEdges.length); i++) {
        const edge = this.bottomEdges[i]
        const idx = (edge.y * w + edge.x) * 4
        this.drips.push({
          x: edge.x,
          y: edge.y,
          originY: edge.y,
          length: 0,
          maxLength: 60 + Math.random() * 80,
          speed: 0.4 + Math.random() * 0.6,
          baseWidth: 4 + Math.random() * 6,
          color: {
            r: data[idx] !== undefined ? data[idx] : 200,
            g: data[idx + 1] !== undefined ? data[idx + 1] : 100,
            b: data[idx + 2] !== undefined ? data[idx + 2] : 100
          }
        })
      }
    }

    for (const d of this.drips) {
      d.length += d.speed * state.intensity * 0.5
      if (d.length >= d.maxLength) {
        this.fallingDrops.push({
          x: d.x,
          y: d.y + d.length,
          speed: 0.6 + Math.random() * 0.3,
          radius: d.baseWidth * 0.25 + 2,
          color: d.color
        })
        d.length = 0
      }
    }

    for (let i = this.fallingDrops.length - 1; i >= 0; i--) {
      const fd = this.fallingDrops[i]
      fd.speed += 0.03
      fd.y += fd.speed * state.intensity
      if (fd.y > h + 30) {
        this.fallingDrops.splice(i, 1)
      }
    }
  },

  draw(ctx, w, h, progress, state) {
    for (const d of this.drips) {
      const { x, originY, length, baseWidth, color } = d
      const tipY = originY + length
      const segs = Math.ceil(length / 3)

      for (let i = 0; i < segs; i++) {
        const t = i / Math.max(segs - 1, 1)
        const cy = originY + t * length
        const r = baseWidth * (1 - t * 0.65)
        const alpha = 0.7 + t * 0.2

        if (r < 1) continue

        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${alpha})`
        ctx.beginPath()
        ctx.arc(x, cy, r, 0, Math.PI * 2)
        ctx.fill()
      }

      const tipR = baseWidth * 0.35
      ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},0.85)`
      ctx.beginPath()
      ctx.arc(x, tipY, tipR, 0, Math.PI * 2)
      ctx.fill()
    }

    for (const fd of this.fallingDrops) {
      ctx.fillStyle = `rgba(${fd.color.r},${fd.color.g},${fd.color.b},0.75)`
      ctx.beginPath()
      ctx.arc(fd.x, fd.y, fd.radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}
