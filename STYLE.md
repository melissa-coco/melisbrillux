# Style Guide — Melissa Portfolio

## Colori

| Ruolo | Colore | HEX |
|-------|--------|-----|
| Sfondo principale | `#0a0a0a` |
| Testo primario | `#f0f0f0` |
| Testo secondario | `#999` |
| Testo corpo (about) | `#ccc` |
| Sfondo card | `#1a1a1a` |
| Sfondo tag | `#2a2a2a` |
| Bordi / lang-toggle | `#444` |

### Lava Lamp (hero)

Blob principali — gradienti radiali con sfumatura `transparent`:
- `#ff3366` → `#ff6b3d`
- `#ff6b3d` → `#ff8c42`
- `#ff8c42` → `#ffb347`
- `#f43f5e` → `#f97316`

Blob di profondità — grande, bassa opacità, blur 40px:
- `#a855f7`, `#3b82f6`, altri viola/blu

## Tipografia

| Elemento | Font | Dimensione | Spessore |
|----------|------|-----------|----------|
| **Logo nav** | Libre Barcode 39 Extended Text | 28px | — |
| **h1** (hero) | Libre Barcode 39 Extended Text | 9rem | 400 |
| **h2** (sezioni) | Lato | 3rem | — |
| **Body** | Lato | 1.5rem | 400 |
| **Caption** | Lato | 1rem | — |
| **Nav links** | Lato (ereditato) | 14px | — |
| **Lang toggle** | Lato (ereditato) | 13px | — |
| **Hero subtitle** | Lato (ereditato) | clamp(16px, 3vw, 24px) | — |
| **Hero CTA** | Lato (ereditato) | 14px | — |
| **Card titolo** | Lato (ereditato) | 16px | — |
| **Card tag** | Lato (ereditato) | 1rem | — |
| **About links** | Lato (ereditato) | 14px | — |
| **Contact email** | Lato (ereditato) | 24px | — |

## Layout

### Nav
- `position: fixed`, z-index 100
- Sfondo semitrasparente: `rgba(10,10,10,0.6)`
- `backdrop-filter: blur(12px)`
- Padding: `16px 32px`
- Logo a sinistra con `margin-left: 5px`
- Links + lang-toggle a destra (`justify-content: space-between`)
- Max-width contenuto: `1200px`

### Sezioni (SPA)
- `display: none` di default, `display: block` con classe `.active`
- `min-height: 100vh`
- `padding-top: 80px` (tranne hero)

### Hero
- `height: 100vh`, `overflow: hidden`
- Canvas lava lamp come sfondo assoluto
- Overlay centrato con flexbox (colonna, center/center)

### Works Grid
- `max-width: 1200px`, margine auto
- CSS Grid: `repeat(auto-fill, minmax(320px, 1fr))`
- Gap: `24px`
- Card: `border-radius: 12px`, sfondo `#1a1a1a`
- Hover: `translateY(-4px)` con `transition: 0.3s`
- Thumb: `aspect-ratio: 16/10`

### About / Contact
- `max-width: 720px`, margine auto
- Padding: `120px 32px`

## Effetti

### Lava Lamp (canvas)
- Canvas `#lava-canvas` con `filter: none` (renderizzato via JS)
- 20 blob caldi circolari, blur 8px, opacità 0.75
- 4 blob freddi di profondità, blur 40px, opacità 0.1
- Animazione sinusoidale via `requestAnimationFrame`

### Nav glassmorphism
- `backdrop-filter: blur(12px)` con sfondo `rgba(10,10,10,0.6)`

### Card hover
- `transform: translateY(-4px)` in 0.3s

### Lang toggle
- Bordo `#444` con hover `#f0f0f0`, `transition: 0.2s`

## Animazioni

### Lava lamp
- Blob si muovono su asse X e Y con funzioni sinusoidali (~30–160px ampiezza)
- Speed: blob 0.4–1.0, layer 0.1–0.25
- Rotazione implicita via movimento circolare
- Nessun `filter: contrast()` (per evitare artefatti squadrati)
