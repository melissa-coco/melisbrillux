# Tipografia Cinetica — WebGL Noise + Glitch RGB

## Obiettivo
Sostituire l'attuale effetto a particelle (melt) con un sistema WebGL che applica micro-variazioni di posizione X/Y e rotazione tramite noise, con glitch RGB occasionale.

## Parola predefinita
`CAOS`

## Stack
- Canvas WebGL2 con shaders GLSL
- Simplex noise 3D implementato inline nel fragment shader
- Offscreen canvas 2D per generare la texture del testo

## Architettura

1. Il testo viene renderizzato su un canvas 2D offscreen → caricato come `WebGLTexture`
2. Fullscreen quad con quella texture
3. **Vertex shader**: passa UV e posizione; applica rotazione base della texture
4. **Fragment shader**:
   - Campiona la texture con offset X/Y derivati da simplex noise 3D
   - Ogni pixel ha offset diverso basato su `(uv.x + time, uv.y + time * 0.7)`
   - **Glitch RGB**: timer stocastico; quando attivo, il canale R viene campionato con shift a destra, B con shift a sinistra, G invariato

## Uniforms GLSL
| Uniform | Tipo | Descrizione |
|---------|------|-------------|
| `uTexture` | sampler2D | Texture del testo |
| `uTime` | float | Tempo continuo |
| `uResolution` | vec2 | Risoluzione canvas |
| `uNoiseIntensity` | float | 0–2, quanto si muove |
| `uSpeed` | float | 0.1–5, velocità noise |
| `uGlitchAmount` | float | 0–50 pixel di split |
| `uGlitchActive` | float | 0.0 o 1.0 |
| `uGlitchSeed` | float | Seed random per pattern glitch |
| `uColor` | vec3 | Colore del testo (RGB) |

## Glitch Logic (JavaScript)
- Timer che ogni `uGlitchFrequency` secondi attiva il glitch per 100–200ms
- Durante il glitch: `uGlitchActive = 1.0`, con seed casuale per variare la direzione
- `uGlitchAmount` controlla l'intensità dello split

## Controlli UI
- Testo (input text)
- Font (select, Google Fonts via WebFont loader)
- Colore testo (color picker, singolo)
- Intensità noise (range 0–2)
- Velocità noise (range 0.1–5)
- Frequenza glitch (range 0.5–10s)
- Intensità glitch (range 0–50px)

## Stile
- Sfondo scuro `#0f0f23`
- Pannello controlli laterale scuro stile portfolio esistente
- Stessi pattern CSS del portfolio (dark theme, bordi `#0f3460`, accenti `#e94560`)

## Comportamento
- Sempre animato (non serve pulsante play/pausa)
- Animazione continua con loop noise
- Glitch ogni pochi secondi automaticamente
