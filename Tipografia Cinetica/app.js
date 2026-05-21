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
let textNeedsRedraw = true
let animTime = 0
let glitchTimer = 0
let glitchActive = 0
let glitchSeed = 0
let rafId = null

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

// === Animation Loop ===
function loop() {
  const dt = 1 / 60
  animTime += dt * state.speed

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

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.uniform1i(uLocations.uTexture, 0)

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

// === Font Loading ===
function loadFont(family) {
  return new Promise((resolve) => {
    const link = document.createElement('link')
    link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@400;700&display=swap`
    link.rel = 'stylesheet'
    link.onload = resolve
    link.onerror = resolve
    document.head.appendChild(link)
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

// === Init ===
loadFont(state.font).then(() => {
  textNeedsRedraw = true
})
initShaders()
initGeometry()
resizeCanvas()
loop()
