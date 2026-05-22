# Scioglimento Testo → Pozzanghera con Particelle Fluide

## Obiettivo
Sostituire l'attuale effetto di scioglimento (drops) con un sistema a particelle fluide: il testo scivola verso il basso trasformandosi in una pozzanghera.

## Sistema a Particelle

### Campionamento
- All'avvio dell'animazione, scansionare i pixel del testo renderizzato sull'offscreen canvas
- Creare una particella ogni N×N pixel (es. 3×3) dove il testo è presente
- Ogni particella contiene: `{x, y, vx, vy, colore {r,g,b}, raggio}`

### Fisica
- **Gravità**: `vy += gravity * dt` costante verso il basso
- **Velocità iniziale**: tutte a `(0, 0)`, l'animazione inizia con le particelle ferme nella posizione del testo
- **Fasi animazione**:
  - 0–30%: prime particelle iniziano a cadere dalla parte superiore del testo
  - 30–70%: caduta progressiva, prime particelle raggiungono il fondo
  - 70–100%: accumulo e spreading laterale a formare la pozzanghera
- **Pavimento**: quando `y + raggio >= canvas.height`, azzerare `vy` e applicare un piccolo impulso orizzontale casuale per simulare lo spreading
- **Spreading pozzanghera**: particelle accumulate si spingono lateralmente con una soft collisione tra vicine (repulsione leggera)

### Rendering
- Ogni particella disegnata come cerchio `arc(x, y, raggio, 0, PI*2)` con `fillStyle = rgba(r,g,b,alpha)`
- La pozzanghera finale emerge naturalmente dall'accumulo di particelle che si allargano orizzontalmente

### Parametri
- **Intensità** → modifica la gravità (più intensità = caduta più rapida)
- **Durata** → durata totale dell'animazione
- **Speed** → moltiplicatore di velocità

## Modifiche al Codice

### `app.js`
- Sostituire l'intero oggetto `meltEffect` con il nuovo `particleMeltEffect`
- Mantenere stessa interfaccia: `reset()`, `process(imageData, w, h, progress, state)`, `draw(ctx, w, h, progress, state)`
- Rimuovere `drips`, `fallingDrops`, `bottomEdges`, `textPixels`, `needsRescan`
- Aggiungere: `particles[]`, `gravity`, `groundY`

### Interfaccia invariata
- `renderFrame(progress)` chiama `particleMeltEffect.process()` e `.draw()` come prima
- `playAnimation()` chiama `.reset()` come prima
- Tutti i controlli (Intensità, Durata, Velocità) continuano a funzionare allo stesso modo
