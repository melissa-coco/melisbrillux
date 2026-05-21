# Tipografia Cinetica — Design Doc

## Overview

Web tool interattivo per animazioni tipografiche. L'utente scrive una parola, sceglie font/colore/peso e applica effetti di animazione. La prima animazione è **Melt** (scioglimento), ispirata a un gelato che si scioglie al sole.

Parola iniziale: **GELEATO** — font **Fredoka One**, gradiente color gelato.

## Stack

- HTML/CSS/JS vanilla
- Canvas 2D per il rendering delle animazioni
- Google Fonts Web Font Loader
- Zero dipendenze esterne
- Singolo file `index.html` + `style.css` + `app.js`

## Layout

```
┌──────────────────────────────────────────────────────┐
│  TIPOGRAFIA CINETICA                                  │
├───────────────────────────┬──────────────────────────┤
│                           │  CONTROLLI               │
│                           │  Parola: [input text]     │
│    CANVAS                 │  Font:    [select ▼]      │
│    (animazione fullscreen │  Peso:    [slider]        │
│     al centro)            │  Colori:  [gradient picker]│
│                           │  Anim:    [select ▼]      │
│                           │  ▶ Play  ↺ Loop          │
│                           │  ─────────────────        │
│                           │  Effetti attivi:          │
│                           │  ☑ Deformazione [↑↓]     │
│                           │  ☑ Gocciolamento [↑↓]    │
│                           │  ☐ Pozzanghera   [↑↓]    │
│                           │  Intensità [═══●═══]     │
│                           │  Velocità  [═══●═══]     │
└───────────────────────────┴──────────────────────────┘
```

## Stato Applicazione

```js
state = {
  word: "GELEATO",
  font: "Fredoka One",
  weight: 700,
  colors: ["#FF6B6B", "#FFD93D", "#6BCB77"],
  animationType: "melt",
  effects: [
    { type: "deformazione", active: true, order: 0 },
    { type: "gocciolamento", active: true, order: 1 },
    { type: "pozzanghera", active: false, order: 2 }
  ],
  intensity: 0.5,
  speed: 1.0,
  playing: false,
  loop: true
}
```

## Motore Animazione (Melt)

Render loop a 60fpm con `requestAnimationFrame`. Ogni frame:

1. Pulisce il canvas
2. Disegna il testo sul canvas (con font/caratteri/gradiente correnti)
3. Applica gli effetti attivi in ordine, ciascuno con il proprio `progress (0→1)`:
   - **Deformazione**: griglia di vertici per lettera, spostati con noise Perlin. L'ampiezza cresce col progress.
   - **Gocciolamento**: pixel dal bordo inferiore si staccano e cadono. Ogni goccia ha posizione, velocità, scia.
   - **Pozzanghera**: alla base del testo, accumulo di pixel che si allarga orizzontalmente. Simula un liquido che cola e si espande.
4. Il canvas usa `getImageData` per pixel manipulation (displacement, melt trails)

## Controlli UI

| Controllo | Tipo | Descrizione |
|-----------|------|-------------|
| Parola | `<input type="text">` | Testo da animare |
| Font | `<select>` | Font Google caricati |
| Peso | `<input type="range">` | Font-weight (300-900) |
| Colori | Gradient picker (3 colori) | Colori per lo sfumato |
| Animazione | `<select>` | Tipo di animazione (ora: solo melt, estensibile) |
| Play/Loop | Button + toggle | Avvia/ferma loop |
| Effetti | Checkbox + drag order | Attiva/disattiva e riordina effetti |
| Intensità | Range slider | 0–1, amplifica l'effetto |
| Velocità | Range slider | 0.1–3x, velocità animazione |

## Estensibilità

Il motore effetti è progettato per essere esteso:

```js
// Per aggiungere un nuovo effetto:
effects.register("wave", {
  apply(ctx, progress, letter, config) {
    // displacement sinusoidale
  }
})
```

Basta implementare una funzione `apply(ctx, progress, letter, config)` e registrarla.

## Milestone

1. Scheletro HTML/CSS con layout a 2 pannelli
2. Canvas rendering del testo con font/caratteri/gradiente
3. Controlli funzionanti (parola, font, peso, colore)
4. Effetto deformazione
5. Effetto gocciolamento
6. Effetto pozzanghera
7. Riordino e combinazione effetti
8. Play/Loop controls
9. Refine UX e styling finale
