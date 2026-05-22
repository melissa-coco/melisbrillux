# Scioglimento Testo → Pozzanghera con Particelle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sostituire l'effetto di scioglimento a gocce con un sistema a particelle fluide dove il testo scivola verso il basso e si accumula in una pozzanghera.

**Architecture:** Un unico oggetto `particleEffect` sostituisce `meltEffect` mantenendo la stessa interfaccia (`reset()`, `process()`, `draw()`). Le particelle vengono campionate dai pixel del testo all'inizio dell'animazione e simulate con gravità e spreading laterale.

**Tech Stack:** Vanilla JS, Canvas 2D API

**Files:**
- Modify: `app.js` (sostituire `meltEffect` con `particleEffect`)

---

### Task 1: Sostituire meltEffect con particleEffect

**Files:**
- Modify: `app.js:274-402`

- [ ] **Step 1: Sostituire l'oggetto meltEffect**

Sostituire l'intero oggetto `meltEffect` (righe 274-402) con il nuovo `particleEffect`:

```js
// === Particelle Scioglimento ===
const particleEffect = {
  particles: [],
  gravity: 0.15,
  groundY: 0,
  sampled: false,

  reset() {
    this.particles = []
    this.sampled = false
  },

  process(imageData, w, h, progress, state) {
    if (!this.sampled) {
      this.groundY = h - 40
      this.particles = []
      const step = 3
      const data = imageData.data

      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const idx = (y * w + x) * 4
          const alpha = data[idx + 3]
          if (alpha > 128) {
            this.particles.push({
              x, y,
              vx: 0,
              vy: 0,
              r: data[idx],
              g: data[idx + 1],
              b: data[idx + 2],
              radius: 2.5,
              settled: false
            })
          }
        }
      }
      this.sampled = true
    }

    const gravity = state.intensity * this.gravity
    const phaseSpeed = 0.02 * state.speed
    const activeCount = Math.floor(this.particles.length * Math.min(progress * 1.5, 1))

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]

      if (p.settled) {
        p.x += p.vx
        p.vx *= 0.95
        continue
      }

      if (i > activeCount) break

      p.vy += gravity
      p.x += p.vx
      p.y += p.vy

      if (p.y + p.radius >= this.groundY) {
        p.y = this.groundY - p.radius
        p.vy = 0
        p.vx += (Math.random() - 0.5) * 0.8
        p.settled = true
      }
    }

    for (let i = 0; i < this.particles.length; i++) {
      const a = this.particles[i]
      if (!a.settled) continue

      for (let j = i + 1; j < Math.min(i + 50, this.particles.length); j++) {
        const b = this.particles[j]
        if (!b.settled) continue

        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const minDist = a.radius + b.radius

        if (dist < minDist && dist > 0) {
          const push = (minDist - dist) * 0.15
          const nx = dx / dist
          const ny = dy / dist
          a.vx -= nx * push
          a.vy -= ny * push
          b.vx += nx * push
          b.vy += ny * push
        }
      }
    }
  },

  draw(ctx, w, h, progress, state) {
    for (const p of this.particles) {
      ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},0.9)`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}
```

- [ ] **Step 2: Aggiornare il riferimento in playAnimation**

Alla riga 197, cambiare `meltEffect.reset()` in `particleEffect.reset()`:

```js
  particleEffect.reset()
```

- [ ] **Step 3: Aggiornare i riferimenti in renderFrame**

Alle righe 237 e 244, cambiare `meltEffect.process()` e `meltEffect.draw()` in `particleEffect.process()` e `particleEffect.draw()`:

```js
  particleEffect.process(imageData, w, h, progress, state)
  // ...
  particleEffect.draw(ctx, w, h, progress, state)
```

- [ ] **Step 4: Verificare che l'app funzioni**

Aprire il browser su `http://localhost:8080` e:
1. Verificare che la schermata iniziale mostri "GELATO" normale
2. Cliccare Play → le particelle del testo devono cadere verso il basso
3. Verificare che le particelle si accumulino formando una pozzanghera
4. Verificare che Intensità influenzi la velocità di caduta
5. Verificare che il loop funzioni (le particelle tornano su)

- [ ] **Step 5: Commit**

```bash
git add app.js
git commit -m "feat: replace melt effect with fluid particle system
- Text particles fall with gravity and accumulate into a puddle
- Particle collision causes lateral spreading at the bottom
- Maintains same control interface (Intensità, Durata, Velocità)"
```
