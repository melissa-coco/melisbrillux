# Girandola Sonora — Design Doc

## Obiettivo

Strumento web che anima una girandola SVG usando il suono in tempo reale dal microfono. In silenzio la girandola è ferma nello stato "no suono". Quando rileva rumore, transisce allo stato "suono": le pale ruotano, cambiano colore e si ingrandiscono finché il suono persiste.

## Approccio

Singola pagina HTML auto-contenuta, zero dipendenze esterne. CSS transform + JavaScript per animazioni e Web Audio API per il microfono.

## Architettura

```
index.html
├── SVG inline ("no suono" come base)
├── CSS (animazioni, layout, transizioni)
└── JavaScript
    ├── AudioEngine  — Web Audio API, AnalyserNode
    ├── Animator    — gestione stati, color lerp, rotazione
    └── UI          — controlli, binding slider
```

## Stati visivi

| Proprietà | Silenzio | Suono |
|---|---|---|
| Rotazione pale | fermo | continua (360°) |
| Scala | 1.0 | 1.5 |
| Centro (`#centro`) | `#009fe3` (blu) | `#e6332a` (rosso) |
| Ali arancioni (`#ali_arancioni`) | `#f39200` (arancione) | `#662483` (viola) |
| Ali ciliegia (`#ali_ciliegia`) | `#d60b52` (ciliegia) | `#009640` (verde) |
| Stecca (`#stecca`) | invariata | invariata |

## Animazioni

### Rotazione continua (stato suono)
- Animazione CSS `@keyframes spin` sul gruppo pale+centro
- `animation-duration` legata allo slider velocità
- Perno di rotazione: centro del cerchio (cx~298.95, cy~307.43)

### Transizione stati (morphing)
- Durata: ~400ms
- Scala: CSS `transition` su `transform`
- Rotazione: `animation-name` none ↔ spin
- Colori: JavaScript lerp via `requestAnimationFrame` sui fill SVG

### Interpolazione colori
- Ad ogni frame calcola il valore intermedio tra start e target per ogni gruppo
- Usa interpolazione lineare RGB
- Durante la transizione, disabilita momentaneamente la rotazione per smoothness

## Rilevamento suono

1. `getUserMedia` → `AudioContext` → `AnalyserNode`
2. `getByteFrequencyData()` ad ogni frame
3. Media dei bin di frequenza = livello sonoro corrente
4. Se livello > soglia (sensibilità) → stato SUONO
5. Se livello < soglia per X frame consecutivi → stato SILENZIO
6. Soglia regolabile via slider sensibilità (0–100)

## UI

Layout:

```
┌────────────────────────────────┐
│                                │
│          GIRANDOLA             │
│        (centrata)              │
│                                │
├────────────────────────────────┤
│ 🎤 Avvia  ████████░░  📈 Sensitivity  ⏱ Speed │
│           (livello)                            │
└────────────────────────────────┘
```

- Pulsante Start/Stop microfono
- Barra livello sonoro (riempimento dinamico + linea di soglia)
- Slider Sensibilità (soglia di attivazione)
- Slider Velocità (durata rotazione)
- Sfondo scuro per contrasto colori

## Comportamento

1. Pagina caricata → stato "no suono", girandola ferma
2. Utente preme "Avvia" → richiede permesso microfono, inizia analisi
3. Suono sopra soglia → transizione a stato "suono", rotazione parte
4. Suono sotto soglia → transizione a stato "no suono", rotazione ferma
5. Utente regola sensibilità e velocità in tempo reale
6. Utente preme "Stop" → microfono disattivato, ritorno a stato "no suono"

## Limiti

- Richiede permesso microfono (HTTPS o localhost)
- I browser iOS richiedono tap esplicito per attivare audio
- La qualità del rilevamento dipende dal microfono e dall'ambiente
