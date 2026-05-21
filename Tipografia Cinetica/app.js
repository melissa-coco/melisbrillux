import { vertexShaderSource, fragmentShaderSource } from './shaders.js'

// === State ===
const state = {
  word: 'ANSIA',
  font: 'Lato',
  color: '#FF6B6B',
  fillOpacity: 1.0,
  strokeWidth: 2,
  strokeColor: '#FFFFFF',
  strokeOpacity: 1.0,
  noiseIntensity: 0.45,
  speed: 3.7,
  bgEnabled: true,
  bgColor: '#0f0f23',
  paused: false,
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
    uColor: gl.getUniformLocation(program, 'uColor'),
    uStrokeColor: gl.getUniformLocation(program, 'uStrokeColor'),
    uFillOpacity: gl.getUniformLocation(program, 'uFillOpacity'),
    uStrokeOpacity: gl.getUniformLocation(program, 'uStrokeOpacity'),
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
  if (state.strokeWidth > 0) {
    offCtx.strokeStyle = '#00ff00'
    offCtx.lineWidth = state.strokeWidth
    offCtx.lineJoin = 'round'
    offCtx.strokeText(state.word, w / 2, h / 2)
  }
  offCtx.fillStyle = '#ff0000'
  offCtx.fillText(state.word, w / 2, h / 2)
}

function uploadTexture() {
  if (texture) gl.deleteTexture(texture)
  texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
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
  if (!state.paused) {
    animTime += dt * state.speed
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

  const [r, g, b] = hexToRgb(state.color)
  gl.uniform3f(uLocations.uColor, r, g, b)
  const [sr, sg, sb] = hexToRgb(state.strokeColor)
  gl.uniform3f(uLocations.uStrokeColor, sr, sg, sb)
  gl.uniform1f(uLocations.uFillOpacity, state.fillOpacity)
  gl.uniform1f(uLocations.uStrokeOpacity, state.strokeOpacity)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

  rafId = requestAnimationFrame(loop)
}

// === Background ===
function updateBackground() {
  const container = document.getElementById('canvas-container')
  if (state.bgEnabled) {
    container.style.background = state.bgColor
    canvas.style.background = state.bgColor
  } else {
    container.style.background = 'transparent'
    canvas.style.background = 'transparent'
  }
}

// === Export ===
let mediaRecorder = null
let recordingChunks = []

function exportVideo() {
  const stream = canvas.captureStream(30)
  recordingChunks = []
  const mimeTypes = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
  let mimeType = mimeTypes.find(t => MediaRecorder.isTypeSupported(t)) || 'video/webm'
  mediaRecorder = new MediaRecorder(stream, { mimeType })
  mediaRecorder.ondataavailable = e => {
    if (e.data.size > 0) recordingChunks.push(e.data)
  }
  mediaRecorder.onstop = () => {
    const blob = new Blob(recordingChunks, { type: 'video/webm' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${state.word}.webm`
    a.click()
    URL.revokeObjectURL(url)
    recordingChunks = []
  }
  mediaRecorder.start()
  const btn = document.getElementById('export-video-btn')
  btn.textContent = '⏺ Registrando...'
  btn.disabled = true
  setTimeout(() => {
    mediaRecorder.stop()
    btn.textContent = '▶ Esporta MP4'
    btn.disabled = false
  }, 3000)
}

// === Font Loading ===
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
        <option value="Lato" ${state.font === 'Lato' ? 'selected' : ''}>Lato</option>
        <option value="Times New Roman" ${state.font === 'Times New Roman' ? 'selected' : ''}>Times New Roman</option>
      </select>
    </div>
    <div class="control-group">
      <label for="color-input">Colore</label>
      <input type="color" id="color-input" value="${state.color}">
    </div>
    <div class="control-group">
      <label for="stroke-color-input">Colore contorno</label>
      <input type="color" id="stroke-color-input" value="${state.strokeColor}">
    </div>
    <div class="control-group">
      <label for="stroke-width-slider">Spessore contorno: <span id="stroke-width-value">${state.strokeWidth}px</span></label>
      <input type="range" id="stroke-width-slider" min="0" max="10" step="1" value="${state.strokeWidth}">
    </div>
    <div class="control-group">
      <label for="fill-opacity-slider">Opacità riempimento: <span id="fill-opacity-value">${state.fillOpacity.toFixed(2)}</span></label>
      <input type="range" id="fill-opacity-slider" min="0" max="1" step="0.05" value="${state.fillOpacity}">
    </div>
    <div class="control-group">
      <label for="stroke-opacity-slider">Opacità contorno: <span id="stroke-opacity-value">${state.strokeOpacity.toFixed(2)}</span></label>
      <input type="range" id="stroke-opacity-slider" min="0" max="1" step="0.05" value="${state.strokeOpacity}">
    </div>
    <div class="control-group">
      <label for="noise-slider">Intensità noise: <span id="noise-value">${state.noiseIntensity.toFixed(2)}</span></label>
      <input type="range" id="noise-slider" min="0" max="2" step="0.05" value="${state.noiseIntensity}">
    </div>
    <div class="control-group">
      <label for="speed-slider">Velocità: <span id="speed-value">${state.speed.toFixed(1)}</span></label>
      <input type="range" id="speed-slider" min="0.1" max="5" step="0.1" value="${state.speed}">
    </div>
    <hr>
    <div class="control-group">
      <label>
        <input type="checkbox" id="bg-toggle" ${state.bgEnabled ? 'checked' : ''}>
        Sfondo
      </label>
    </div>
    <div class="control-group" id="bg-color-group" style="${state.bgEnabled ? '' : 'display:none'}">
      <label for="bg-color-input">Colore sfondo</label>
      <input type="color" id="bg-color-input" value="${state.bgColor}">
    </div>
    <hr>
    <div class="controls-actions">
      <button class="btn btn-primary" id="pause-btn">⏸ Pausa</button>
    </div>
    <div class="controls-actions">
      <button class="btn btn-primary" id="export-video-btn">▶ Esporta MP4</button>
    </div>
  `
}
buildControls()

function setupControls() {
  document.getElementById('word-input').addEventListener('input', e => {
    state.word = e.target.value || ' '
    textNeedsRedraw = true
  })

  document.getElementById('font-select').addEventListener('change', e => {
    state.font = e.target.value
    textNeedsRedraw = true
  })

  document.getElementById('color-input').addEventListener('input', e => {
    state.color = e.target.value
  })

  document.getElementById('stroke-color-input').addEventListener('input', e => {
    state.strokeColor = e.target.value
    textNeedsRedraw = true
  })

  document.getElementById('stroke-width-slider').addEventListener('input', e => {
    state.strokeWidth = Number(e.target.value)
    document.getElementById('stroke-width-value').textContent = state.strokeWidth + 'px'
    textNeedsRedraw = true
  })

  document.getElementById('fill-opacity-slider').addEventListener('input', e => {
    state.fillOpacity = Number(e.target.value)
    document.getElementById('fill-opacity-value').textContent = state.fillOpacity.toFixed(2)
  })

  document.getElementById('stroke-opacity-slider').addEventListener('input', e => {
    state.strokeOpacity = Number(e.target.value)
    document.getElementById('stroke-opacity-value').textContent = state.strokeOpacity.toFixed(2)
  })

  document.getElementById('noise-slider').addEventListener('input', e => {
    state.noiseIntensity = Number(e.target.value)
    document.getElementById('noise-value').textContent = state.noiseIntensity.toFixed(2)
  })

  document.getElementById('speed-slider').addEventListener('input', e => {
    state.speed = Number(e.target.value)
    document.getElementById('speed-value').textContent = state.speed.toFixed(1)
  })

  document.getElementById('pause-btn').addEventListener('click', () => {
    state.paused = !state.paused
    document.getElementById('pause-btn').textContent = state.paused ? '▶ Play' : '⏸ Pausa'
  })

  document.getElementById('bg-toggle').addEventListener('change', e => {
    state.bgEnabled = e.target.checked
    document.getElementById('bg-color-group').style.display = state.bgEnabled ? '' : 'none'
    updateBackground()
  })

  document.getElementById('bg-color-input').addEventListener('input', e => {
    state.bgColor = e.target.value
    updateBackground()
  })

  document.getElementById('export-video-btn').addEventListener('click', exportVideo)
}
setupControls()

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

// === Init ===
document.fonts.ready.then(() => {
  textNeedsRedraw = true
})
updateBackground()
initShaders()
initGeometry()
resizeCanvas()
loop()
