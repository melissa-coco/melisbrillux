# Bubble Pop — Handpose Interactive Tool

## Overview

A relaxing web-based interactive tool that uses hand tracking via TensorFlow.js + MediaPipe to let users pop floating bubbles by pinching their index finger and thumb together near a bubble. All rendering uses a single HTML5 Canvas 2D. Sound is synthesized via Web Audio API. The entire app is a single HTML file loaded from CDN.

## Architecture

One HTML file, one game loop (`requestAnimationFrame`), four subsystems:

```
Game Loop (rAF)
├── HandposeDetector  — MediaPipe via @tensorflow-models/hand-pose-detection
├── BubbleSystem      — 15 floating bubbles
├── ParticleSystem    — pop effects
└── Renderer          — canvas 2D drawing
```

- **No build step.** All dependencies loaded via CDN script tags.
- **No frameworks.** Vanilla JS + Canvas 2D + Web Audio API.

## Handpose Detection

- Uses `@tensorflow-models/hand-pose-detection` with MediaPipe runtime (full model).
- Camera: `getUserMedia` → hidden `<video>` element (not displayed on screen except as PIP).
- Each frame: `detector.estimateHands(video)` → get keypoints for index finger tip and thumb tip.
- **Pinch state:** when Euclidean distance between index tip and thumb tip < threshold (~30px at typical distance), pinch is "closed".
- **Cursor:** a small circle is drawn at the index fingertip position on the canvas to show the user where they are pointing.

## Bubble System

- **Count:** 15 concurrent bubbles.
- **Size:** random radius between 30px and 80px.
- **Appearance:** radial gradient with white highlight for a soap-bubble look. Random color from a pastel/brilliant palette (pink, sky blue, lilac, peach, mint).
- **Movement:** each bubble has a random phase offset for a sinusoidal float. Horizontal oscillation (sin) + gentle upward drift (cos). Speed is slow and calming.
- **Edge wrapping:** when a bubble moves off-screen, it wraps to the opposite side.
- **Respawn:** after a bubble pops, it disappears. A new bubble spawns at a random position 2–3 seconds later.

## Pop Detection

When `pinch === true`:
- Iterate over all active bubbles.
- Find the closest bubble whose center is within the bubble's radius + a small margin (10px) of either the index tip or thumb tip.
- Pop only that closest bubble (not all nearby bubbles).
- A bubble that has just been popped has a brief cooldown (~200ms) to prevent double-popping from the same sustained pinch gesture.

## Pop Effects

### Particles
- 15–25 small circles spawned at the bubble's center.
- Each particle has: random direction, random speed, fading opacity, slight gravity.
- Lifetime: ~600ms, after which the particle is removed from the active list.

### Sound
- Synthesized via `AudioContext` + `OscillatorNode`.
- A short sine wave tone (~0.08s) with rapid frequency drop (600Hz → 200Hz) for a soft "pop" sound.
- Low gain envelope so it is pleasant, not jarring.
- Volume proportional to bubble size (bigger bubble → louder pop).

## Background

- Full-screen dynamic gradient: interpolates smoothly between pastel colors (pink → blue → lilac → peach → pink).
- Colors cycle very slowly (cycle time ~15–20s) for a calm, ambient feel.

## Camera (PIP)

- Webcam feed is shown as a small picture-in-picture rectangle: 240px wide, positioned at the bottom-left corner of the screen.
- The video is mirrored (scaleX(-1)) for a natural mirror-like feel.
- The video element is `<video>` with `autoplay` and `playsinline`.

## Canvas Layout

```
┌──────────────────────────────────────┐
│   Gradient Background (full screen)   │
│                                       │
│         ○     ○         ○             │
│             ○      ○                  │
│   ○                      ○  ○        │
│        ○   * (cursor)                 │
│                                       │
│  ┌──────────┐                        │
│  │ Webcam   │                        │
│  │ PIP      │                        │
│  └──────────┘                        │
└──────────────────────────────────────┘
```

## Technical Constraints

- Must work in Chrome and Edge (desktop) with a webcam.
- ~30 FPS target with 15 bubbles + particles + hand tracking.
- Single file deployment (no build tools, no server required).

## Out of Scope

- No score, timer, levels, or game mechanics.
- No settings/menu UI.
- No audio file loading — sound is always synthesized.
- No mobile support (handpose + webcam not reliable enough on mobile browsers).
