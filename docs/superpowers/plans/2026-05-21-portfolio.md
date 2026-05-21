# Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page portfolio site with interactive hero (canvas lavalamp), nav, works grid with GIF previews, project pages with iframes, about/contact sections, and IT/EN language toggle.

**Architecture:** SPA in `index.html` with 4 sections (Hero, Works, About, Contact) toggled via JS. Each project has a dedicated page in `works/` that loads the original exercise in an iframe. Hero uses a fullscreen canvas with organic blob simulation. Language toggle uses data attributes + localStorage.

**Tech Stack:** Vanilla HTML5/CSS3/JS, Canvas 2D API. No frameworks, no external dependencies.

---

## File Structure

```
Sito/
├── index.html                 # Main SPA with all 4 sections
├── style.css                  # Global styles (nav, sections, hero overlay, grid, form)
├── app.js                     # Section switching, nav active state, language toggle
├── hero.js                    # Canvas lavalamp effect (blob simulation, cursor following)
├── data.js                    # Project metadata + text content (both languages)
├── works/                     # Individual project pages
│   ├── pattern-tool.html
│   ├── maschera-sonora.html
│   ├── bubble-pop.html
│   └── tipografia-cinetica.html
└── gifs/                      # GIF previews for works grid
    ├── pattern-tool.gif
    ├── maschera-sonora.gif
    ├── bubble-pop.gif
    └── tipografia-cinetica.gif
```

---

### Task 1: Static scaffolding — HTML + CSS skeleton

**Files:**
- Create: `Sito/index.html`
- Create: `Sito/style.css`

- [ ] **Step 1: Create `index.html` with all 4 sections**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Melissa — Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Nav -->
  <nav id="nav">
    <div class="nav-inner">
      <a href="#" class="nav-logo" data-section="hero">Melissa</a>
      <div class="nav-links">
        <a href="#" data-section="works" data-it="Lavori" data-en="Works">Lavori</a>
        <a href="#" data-section="about" data-it="Chi sono" data-en="About">Chi sono</a>
        <a href="#" data-section="contact" data-it="Contatti" data-en="Contact">Contatti</a>
      </div>
      <button id="lang-toggle" data-it="EN" data-en="IT">EN</button>
    </div>
  </nav>

  <!-- Hero -->
  <section id="hero" class="section active">
    <canvas id="hero-canvas"></canvas>
    <div class="hero-overlay">
      <h1 data-it="Melissa" data-en="Melissa">Melissa</h1>
      <p class="hero-sub" data-it="Design &amp; Creative Code" data-en="Design &amp; Creative Code">Design &amp; Creative Code</p>
      <a href="#" class="hero-cta" data-section="works" data-it="Vedi i lavori" data-en="View my work">Vedi i lavori</a>
    </div>
  </section>

  <!-- Works -->
  <section id="works" class="section">
    <h2 data-it="Lavori" data-en="Works">Lavori</h2>
    <div class="works-grid" id="works-grid"></div>
  </section>

  <!-- About -->
  <section id="about" class="section">
    <h2 data-it="Chi sono" data-en="About">Chi sono</h2>
    <div class="about-content">
      <p data-it="Ciao, sono Melissa. Sono una designer e creative coder..." data-en="Hi, I'm Melissa. I'm a designer and creative coder...">Ciao, sono Melissa. Sono una designer e creative coder...</p>
      <div class="about-links">
        <a href="https://github.com/" target="_blank">GitHub</a>
        <a href="https://instagram.com/" target="_blank">Instagram</a>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section id="contact" class="section">
    <h2 data-it="Contatti" data-en="Contact">Contatti</h2>
    <div class="contact-content">
      <a href="mailto:melissa@email.com" class="contact-email">melissa@email.com</a>
    </div>
  </section>

  <script src="data.js"></script>
  <script src="hero.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `style.css`**

```css
* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0a0a0a;
  color: #f0f0f0;
  overflow-x: hidden;
}

/* --- Nav --- */
#nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 16px 32px;
  background: rgba(10,10,10,0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  font-size: 20px;
  font-weight: 700;
  color: #f0f0f0;
  text-decoration: none;
}

.nav-links { display: flex; gap: 24px; }

.nav-links a {
  color: #999;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.active { color: #f0f0f0; }

#lang-toggle {
  background: none;
  border: 1px solid #444;
  color: #f0f0f0;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: border-color 0.2s;
}

#lang-toggle:hover { border-color: #f0f0f0; }

/* --- Sections --- */
.section {
  display: none;
  min-height: 100vh;
  padding-top: 80px;
}

.section.active { display: block; }

/* --- Hero --- */
#hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
  padding-top: 0;
}

#hero-canvas {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
}

.hero-overlay {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-overlay h1 {
  font-size: clamp(48px, 10vw, 96px);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.hero-sub {
  font-size: clamp(16px, 3vw, 24px);
  color: #999;
  margin-top: 8px;
}

.hero-cta {
  display: inline-block;
  margin-top: 32px;
  padding: 12px 28px;
  border: 1px solid #f0f0f0;
  border-radius: 24px;
  color: #f0f0f0;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.2s;
}

.hero-cta:hover { background: rgba(255,255,255,0.1); }

/* --- Works --- */
#works {
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 32px;
}

#works h2 { margin-bottom: 48px; font-size: 32px; }

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.works-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #1a1a1a;
  cursor: pointer;
  transition: transform 0.3s;
}

.works-card:hover { transform: translateY(-4px); }

.works-card img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  display: block;
}

.works-card-info {
  padding: 16px;
}

.works-card-info h3 {
  font-size: 16px;
  margin-bottom: 4px;
}

.works-card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.works-card-tags span {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: #2a2a2a;
  color: #999;
}

/* --- About --- */
#about {
  max-width: 720px;
  margin: 0 auto;
  padding: 120px 32px;
}

#about h2 { margin-bottom: 24px; font-size: 32px; }

.about-content p {
  line-height: 1.7;
  color: #ccc;
  margin-bottom: 24px;
}

.about-links { display: flex; gap: 16px; }

.about-links a { color: #f0f0f0; text-decoration: none; font-size: 14px; }
.about-links a:hover { text-decoration: underline; }

/* --- Contact --- */
#contact {
  max-width: 720px;
  margin: 0 auto;
  padding: 120px 32px;
}

#contact h2 { margin-bottom: 24px; font-size: 32px; }

.contact-email {
  display: inline-block;
  font-size: 24px;
  color: #f0f0f0;
  text-decoration: none;
  border-bottom: 1px solid #444;
  padding-bottom: 4px;
}

.contact-email:hover { border-color: #f0f0f0; }
```

- [ ] **Step 3: Commit**

```bash
git add index.html style.css
git commit -m "feat: add HTML skeleton and CSS styles"
```

---

### Task 2: Project data + text content

**Files:**
- Create: `Sito/data.js`

- [ ] **Step 1: Create `data.js` with project metadata and translatable content**

```js
const projects = [
  {
    slug: 'pattern-tool',
    title: 'Vector Pattern Tool',
    tags: ['SVG', 'Canvas'],
    gif: 'gifs/pattern-tool.gif',
    url: 'works/pattern-tool.html',
  },
  {
    slug: 'maschera-sonora',
    title: 'Girandola Sonora',
    tags: ['SVG', 'Audio'],
    gif: 'gifs/maschera-sonora.gif',
    url: 'works/maschera-sonora.html',
  },
  {
    slug: 'bubble-pop',
    title: 'Bubble Pop',
    tags: ['Canvas', 'Hand Tracking', 'TensorFlow'],
    gif: 'gifs/bubble-pop.gif',
    url: 'works/bubble-pop.html',
  },
  {
    slug: 'tipografia-cinetica',
    title: 'Tipografia Cinetica',
    tags: ['Canvas', 'Typography'],
    gif: 'gifs/tipografia-cinetica.gif',
    url: 'works/tipografia-cinetica.html',
  },
];

const content = {
  it: {
    heroTitle: 'Melissa',
    heroSub: 'Design & Creative Code',
    heroCta: 'Vedi i lavori',
    worksTitle: 'Lavori',
    aboutTitle: 'Chi sono',
    aboutBio: 'Ciao, sono Melissa. Sono una designer e creative coder con passione per l\'interattività, il motion design e la grafica generativa.',
    contactTitle: 'Contatti',
    contactEmail: 'melissa@email.com',
    navWorks: 'Lavori',
    navAbout: 'Chi sono',
    navContact: 'Contatti',
    langBtn: 'EN',
  },
  en: {
    heroTitle: 'Melissa',
    heroSub: 'Design & Creative Code',
    heroCta: 'View my work',
    worksTitle: 'Works',
    aboutTitle: 'About',
    aboutBio: 'Hi, I\'m Melissa. I\'m a designer and creative coder passionate about interactivity, motion design, and generative graphics.',
    contactTitle: 'Contact',
    contactEmail: 'melissa@email.com',
    navWorks: 'Works',
    navAbout: 'About',
    navContact: 'Contact',
    langBtn: 'IT',
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add data.js
git commit -m "feat: add project data and text content"
```

---

### Task 3: Hero canvas — lavalamp blobs

**Files:**
- Create: `Sito/hero.js`

- [ ] **Step 1: Create `hero.js` with organic blob simulation**

```js
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let mouse = { x: 0.5, y: 0.5 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX / canvas.width;
  mouse.y = e.clientY / canvas.height;
});

class Blob {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random();
    this.y = Math.random();
    this.radius = 0.15 + Math.random() * 0.2;
    this.vx = (Math.random() - 0.5) * 0.002;
    this.vy = (Math.random() - 0.5) * 0.002;
    this.points = [];
    this.phase = Math.random() * Math.PI * 2;
    this.hue = Math.random() * 60 + 260;
    this.saturation = 70 + Math.random() * 30;
    this.lightness = 50 + Math.random() * 20;
  }

  update() {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    this.vx += dx * 0.0001;
    this.vy += dy * 0.0001;
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.x += this.vx;
    this.y += this.vy;

    this.phase += 0.02;
  }

  draw() {
    const cx = this.x * canvas.width;
    const cy = this.y * canvas.height;
    const r = this.radius * Math.min(canvas.width, canvas.height);

    const numPoints = 12;
    const points = [];

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const wave = Math.sin(angle * 3 + this.phase) * 0.3 + 1;
      const pr = r * wave;
      points.push({
        x: cx + Math.cos(angle) * pr,
        y: cy + Math.sin(angle) * pr,
      });
    }

    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const next = points[(i + 1) % points.length];
      const cp = points[(i + 2) % points.length];
      if (i === 0) {
        ctx.moveTo(p.x, p.y);
      }
      const cpx = (p.x + next.x) / 2;
      const cpy = (p.y + next.y) / 2;
      ctx.quadraticCurveTo(next.x, next.y, cpx, cpy);
    }
    ctx.closePath();

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.8);
    gradient.addColorStop(0, `hsla(${this.hue + 20}, ${this.saturation}%, ${this.lightness + 10}%, 0.4)`);
    gradient.addColorStop(0.5, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0.25)`);
    gradient.addColorStop(1, `hsla(${this.hue - 20}, ${this.saturation}%, ${this.lightness - 10}%, 0)`);

    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

const blobs = [new Blob(), new Blob(), new Blob()];

function drawHero() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const blob of blobs) {
    blob.update();
    blob.draw();
  }

  requestAnimationFrame(drawHero);
}

drawHero();
```

- [ ] **Step 2: Commit**

```bash
git add hero.js
git commit -m "feat: add hero canvas with organic blob lavalamp effect"
```

---

### Task 4: App JS — section switching + nav + language toggle

**Files:**
- Create: `Sito/app.js`

- [ ] **Step 1: Create `app.js`**

```js
// --- Section switching ---
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');
let currentSection = 'hero';

function showSection(id) {
  sections.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === id));
  currentSection = id;
}

document.querySelectorAll('[data-section]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const target = el.dataset.section;
    if (target === 'works') {
      document.getElementById('works').scrollIntoView({ behavior: 'smooth' });
      showSection('works');
    } else {
      showSection(target);
    }
  });
});

// --- Language toggle ---
let lang = localStorage.getItem('lang') || 'it';

function applyLang(l) {
  lang = l;
  localStorage.setItem('lang', l);
  const dict = content[l];

  document.querySelectorAll('[data-section]').forEach(a => {
    if (a.dataset[l]) a.textContent = a.dataset[l];
  });
  document.querySelectorAll('.hero-overlay h1').forEach(el => el.textContent = dict.heroTitle);
  document.querySelectorAll('.hero-sub').forEach(el => el.textContent = dict.heroSub);
  document.querySelectorAll('.hero-cta').forEach(el => el.textContent = dict.heroCta);
  document.querySelectorAll('#works h2').forEach(el => el.textContent = dict.worksTitle);
  document.querySelectorAll('#about h2').forEach(el => el.textContent = dict.aboutTitle);
  document.querySelectorAll('#contact h2').forEach(el => el.textContent = dict.contactTitle);
  document.querySelectorAll('.about-content p').forEach(el => el.textContent = dict.aboutBio);
  document.querySelectorAll('.contact-email').forEach(el => el.textContent = dict.contactEmail);
  document.querySelectorAll('#lang-toggle').forEach(el => el.textContent = dict.langBtn);
}

document.getElementById('lang-toggle').addEventListener('click', () => {
  applyLang(lang === 'it' ? 'en' : 'it');
});

applyLang(lang);

// --- Build works grid ---
const grid = document.getElementById('works-grid');

for (const p of projects) {
  const card = document.createElement('a');
  card.className = 'works-card';
  card.href = p.url;

  card.innerHTML = `
    <img src="${p.gif}" alt="${p.title}" loading="lazy">
    <div class="works-card-info">
      <h3>${p.title}</h3>
      <div class="works-card-tags">
        ${p.tags.map(t => `<span>${t}</span>`).join('')}
      </div>
    </div>
  `;

  grid.appendChild(card);
}
```

- [ ] **Step 2: Commit**

```bash
git add app.js
git commit -m "feat: add section switching, nav, language toggle, works grid"
```

---

### Task 5: Project pages with iframes

**Files:**
- Create: `Sito/works/pattern-tool.html`
- Create: `Sito/works/maschera-sonora.html`
- Create: `Sito/works/bubble-pop.html`
- Create: `Sito/works/tipografia-cinetica.html`

- [ ] **Step 1: Create reusable project page template. For each project, create a page like this**

Example for `works/pattern-tool.html`:

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vector Pattern Tool — Melissa</title>
  <link rel="stylesheet" href="../style.css">
  <style>
    body { overflow: hidden; height: 100vh; }
    #nav { position: relative; }
    .project-back {
      margin-right: auto;
      color: #999;
      text-decoration: none;
      font-size: 14px;
    }
    .project-back:hover { color: #f0f0f0; }
    #project-frame {
      width: 100vw;
      height: calc(100vh - 60px);
      border: none;
      display: block;
    }
    .nav-links { display: none; }
  </style>
</head>
<body>
  <nav id="nav">
    <div class="nav-inner">
      <a href="../index.html" class="project-back">← Back</a>
      <a href="../index.html" class="nav-logo">Melissa</a>
      <div></div>
    </div>
  </nav>
  <iframe id="project-frame" src="../Pattern%20exercise/index.html"></iframe>
</body>
</html>
```

Create all 4 variations with correct title, iframe src, and back link.

Project mappings:
- `works/pattern-tool.html` → `../Pattern%20exercise/index.html`, title "Vector Pattern Tool"
- `works/maschera-sonora.html` → `../Maschera%20sonora/index.html`, title "Girandola Sonora"
- `works/bubble-pop.html` → `../Manionetta%20bolle/index.html`, title "Bubble Pop"
- `works/tipografia-cinetica.html` → `../Tipografia%20Cinetica/index.html`, title "Tipografia Cinetica"

- [ ] **Step 2: Commit**

```bash
git add works/
git commit -m "feat: add project pages with iframes"
```

---

### Task 6: GIF previews placeholder

**Files:**
- Create: directory `Sito/gifs/`

- [ ] **Step 1: Create placeholder note file**

```bash
mkdir -p gifs
```

GIFs need to be generated (screenshots/recordings of each project). The cards will show broken images until real GIFs are added. Create a placeholder or add a note.

- [ ] **Step 2: Commit**

```bash
git add gifs/
git commit -m "chore: add gifs directory for project previews"
```

---

### Task 7: Final integration — link project pages into nav

**Files:**
- Modify: `Sito/works/*.html`

- [ ] **Step 1: Add nav links to the back button area so users can navigate to other sections from project pages**

Update each project page to include the full nav structure (same as index.html but with simplified links):

```html
<nav id="nav">
  <div class="nav-inner">
    <a href="../index.html" class="project-back">← Back</a>
    <a href="../index.html" class="nav-logo">Melissa</a>
    <div class="nav-links">
      <a href="../index.html#works">Works</a>
      <a href="../index.html#about">About</a>
      <a href="../index.html#contact">Contact</a>
    </div>
  </div>
</nav>
```

- [ ] **Step 2: Commit**

```bash
git add works/
git commit -m "feat: add nav links to project pages"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- Hero lavalamp (Task 3)
- Nav bar (Task 1, 4)
- Works grid with cards (Task 4 using data.js from Task 2)
- GIF previews (Task 6 — placeholders)
- Click → project page with iframe (Task 5)
- About section (Task 1)
- Contact section (Task 1)
- Language toggle (Task 4)
- SPA section switching (Task 4)

**2. Placeholder scan:** No TBDs, TODOs, or "implement later" in code. GIFs are deferred intentionally — the user needs to generate them.

**3. Type consistency:** `data-section`, `data-it`, `data-en` attributes match between HTML, CSS, and JS. Project slugs match between `data.js` and filenames in `works/`. URLs use proper encoding for spaces (`%20`).
