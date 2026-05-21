# Melisbrillux Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) for syntax tracking.

**Goal:** Build a static notebook-themed recipe website for the Melisbrillux brand with 4 pages (home, recipe archive, recipe detail, contacts) and full responsive design.

**Architecture:** 4-page static HTML/CSS/JS site. A single CSS file provides the "quaderno di appunti" (notebook) theme — paper-texture background, polaroid images, post-it cards, handwritten fonts. All pages share nav, footer, and global styles via one stylesheet.

**Tech Stack:** HTML5, CSS3, vanilla JS, Google Fonts (Lato + Caveat), SVG doodles, CSS gradient/background placeholders for images

**File Structure:**
```
melisbrillux/                          ← created in workspace root
├── index.html                         # Homepage
├── ricette/
│   ├── index.html                     # Archive grid
│   └── salame-di-cioccolato.html      # Recipe detail
├── contatti.html                      # Contacts
├── css/
│   └── style.css                      # All styles
└── images/
    ├── doodle-star.svg                # Star doodle
    ├── doodle-heart.svg               # Heart doodle
    ├── doodle-spoon.svg               # Spoon doodle
    ├── doodle-splash.svg              # Chocolate splash doodle
    └── doodle-stamp.svg               # Stamp doodle
```

---

### Task 1: Scaffolding & CSS Foundation

**Files:**
- Create: `melisbrillux/css/style.css`

**Dependencies:** None (first task)

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/css
mkdir -p /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/ricette
mkdir -p /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/images
```

- [ ] **Step 2: Create style.css with full notebook theme**

The CSS includes: reset, CSS variables, notebook paper background, typography (Lato + Caveat via Google Fonts), navigation, polaroid effect, post-it cards, recipe cards, ingredient list, step list, footer, responsive breakpoints, and all decorative elements.

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --carta: #F5F0E8;
  --carta-scura: #E8E0D5;
  --inchiostro: #2C1810;
  --verde: #009246;
  --rosso: #CE2B37;
  --bianco: #FFFFFF;
  --postit: #FFF9C4;
  --ombra: rgba(44, 24, 16, 0.12);
  --riga: #DDD6CB;
  --font-titoli: 'Caveat', 'Comic Sans MS', cursive;
  --font-testo: 'Lato', 'Segoe UI', sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-testo);
  font-weight: 400;
  background-color: var(--carta);
  color: var(--inchiostro);
  line-height: 1.8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Notebook paper lines background */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: repeating-linear-gradient(
    transparent,
    transparent 26px,
    var(--riga) 26px,
    var(--riga) 27px
  );
  pointer-events: none;
  z-index: -1;
}

/* Paper margin line */
body::after {
  content: '';
  position: fixed;
  top: 0;
  left: 48px;
  width: 2px;
  height: 100%;
  background: var(--rosso);
  opacity: 0.25;
  pointer-events: none;
  z-index: -1;
}

h1, h2, h3 {
  font-family: var(--font-titoli);
  font-weight: 700;
  line-height: 1.2;
  color: var(--inchiostro);
}

a {
  color: var(--verde);
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: var(--rosso);
}

/* === Navigation === */
.top-bar {
  height: 6px;
  background: linear-gradient(to right, var(--verde) 33%, var(--bianco) 33%, var(--bianco) 66%, var(--rosso) 66%);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

header {
  background: rgba(245, 240, 232, 0.95);
  backdrop-filter: blur(4px);
  border-bottom: 2px solid var(--carta-scura);
  position: fixed;
  top: 6px;
  left: 0;
  right: 0;
  z-index: 99;
}

nav {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.logo a {
  font-family: var(--font-titoli);
  font-size: 1.6rem;
  color: var(--inchiostro);
}

.logo a:hover {
  color: var(--inchiostro);
}

.logo span {
  color: var(--rosso);
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-links li {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-links li + li::before {
  content: '\276F';
  font-size: 0.7rem;
  color: var(--carta-scura);
  margin-right: 8px;
}

.nav-links a {
  font-family: var(--font-testo);
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--inchiostro);
  padding: 4px 0;
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--rosso);
}

/* === Main Layout === */
main {
  flex: 1;
  margin-top: 66px;
  padding: 48px 24px;
}

.wrapper {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.wrapper-wide {
  max-width: 960px;
  margin: 0 auto;
  position: relative;
}

/* === Hero / Copertina === */
.hero {
  text-align: center;
  padding: 48px 0 32px;
  position: relative;
}

.hero h1 {
  font-size: 4rem;
  margin-bottom: 4px;
  position: relative;
  display: inline-block;
}

/* Underline doodle under main title */
.hero h1::after {
  content: '';
  display: block;
  width: 80%;
  height: 4px;
  background: var(--inchiostro);
  margin: 4px auto 0;
  border-radius: 2px;
  opacity: 0.5;
}

.hero .tagline {
  font-family: var(--font-titoli);
  font-size: 1.4rem;
  color: var(--verde);
  margin-top: 8px;
}

.hero .separator {
  width: 60px;
  height: 3px;
  background: linear-gradient(to right, var(--verde), var(--bianco), var(--rosso));
  margin: 20px auto;
  border-radius: 2px;
}

/* Doodles around hero area */
.hero-doodle-left {
  position: absolute;
  left: -40px;
  top: 30px;
  width: 50px;
  height: 50px;
  opacity: 0.3;
}

.hero-doodle-right {
  position: absolute;
  right: -40px;
  bottom: 30px;
  width: 40px;
  height: 40px;
  opacity: 0.3;
}

/* === Polaroid Effect === */
.polaroid {
  background: var(--bianco);
  padding: 10px 10px 45px 10px;
  box-shadow: 4px 4px 16px var(--ombra);
  display: inline-block;
  max-width: 100%;
  position: relative;
}

.polaroid img,
.polaroid .placeholder-img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4/3;
  object-fit: cover;
}

.polaroid.rotate-left {
  transform: rotate(-1.5deg);
}

.polaroid.rotate-right {
  transform: rotate(1.5deg);
}

.polaroid-hero {
  max-width: 600px;
  margin: 32px auto;
}

/* Placeholder image fallback */
.placeholder-img {
  background: linear-gradient(145deg, var(--carta-scura), #D4A574);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bianco);
  font-family: var(--font-titoli);
  font-size: 1.2rem;
}

/* === Post-it Cards === */
.postit {
  background: var(--postit);
  padding: 20px 24px;
  box-shadow: 3px 3px 12px var(--ombra);
  position: relative;
  border: none;
}

.postit::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 12px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 2px;
}

.postit.rotate-left {
  transform: rotate(-0.8deg);
}

.postit.rotate-right {
  transform: rotate(0.8deg);
}

.postit h3 {
  font-size: 1.6rem;
  margin-bottom: 8px;
}

/* === Torn/folded paper card === */
.torn-card {
  background: var(--bianco);
  padding: 32px;
  box-shadow: 3px 3px 14px var(--ombra);
  position: relative;
  border: 1px solid var(--carta-scura);
}

.torn-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, transparent 50%, var(--carta) 50%);
}

/* === Section Titles === */
.section-title {
  font-size: 2.4rem;
  margin-bottom: 24px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  display: block;
  width: 60%;
  height: 3px;
  background: var(--inchiostro);
  margin-top: 4px;
  border-radius: 2px;
  opacity: 0.3;
}

/* === Recipe Grid (Archive) === */
.recipe-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  margin-top: 24px;
}

.recipe-card {
  background: var(--bianco);
  border: 1px solid var(--carta-scura);
  border-radius: 4px;
  padding: 0;
  box-shadow: 3px 3px 12px var(--ombra);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.recipe-card:hover {
  transform: translateY(-3px);
  box-shadow: 6px 6px 20px var(--ombra);
}

.recipe-card .card-img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  display: block;
}

.recipe-card .card-body {
  padding: 24px;
}

.recipe-card h3 {
  font-size: 1.6rem;
  margin-bottom: 2px;
}

.recipe-card .chef {
  font-size: 0.85rem;
  color: #999;
  margin-bottom: 10px;
  font-family: var(--font-testo);
}

.recipe-card .card-desc {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 16px;
  line-height: 1.6;
}

.recipe-card .btn {
  display: inline-block;
  font-family: var(--font-testo);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--verde);
  color: var(--bianco);
  padding: 10px 20px;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.recipe-card .btn:hover {
  background: var(--rosso);
  color: var(--bianco);
}

/* === Recipe Detail Page === */
.recipe-header {
  margin-bottom: 32px;
}

.recipe-header h1 {
  font-size: 3rem;
  margin-bottom: 2px;
}

.recipe-header .meta {
  font-family: var(--font-testo);
  color: #999;
  font-size: 0.95rem;
  margin-bottom: 20px;
}

.recipe-section {
  margin-bottom: 32px;
}

.recipe-section h2 {
  font-size: 2rem;
  margin-bottom: 16px;
  color: var(--verde);
}

.ingredient-list {
  list-style: none;
  padding: 0;
}

.ingredient-list li {
  padding: 10px 0 10px 32px;
  border-bottom: 1px dashed var(--carta-scura);
  position: relative;
  font-size: 1.05rem;
}

.ingredient-list li::before {
  content: '\2605';
  position: absolute;
  left: 4px;
  top: 10px;
  color: var(--rosso);
  font-size: 0.8rem;
}

.step-list {
  list-style: none;
  counter-reset: step;
  padding: 0;
}

.step-list li {
  counter-increment: step;
  padding: 14px 0 14px 50px;
  position: relative;
  border-bottom: 1px dashed var(--carta-scura);
  font-size: 1rem;
  line-height: 1.7;
}

.step-list li::before {
  content: counter(step);
  position: absolute;
  left: 0;
  top: 14px;
  width: 34px;
  height: 34px;
  background: var(--verde);
  color: var(--bianco);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  font-family: var(--font-titoli);
}

/* Chocolate splash doodle */
.chocolate-splash {
  position: absolute;
  right: -20px;
  bottom: -10px;
  width: 80px;
  height: 80px;
  opacity: 0.15;
  pointer-events: none;
}

/* Print button */
.btn-print {
  display: inline-block;
  font-family: var(--font-testo);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--inchiostro);
  color: var(--bianco);
  padding: 10px 20px;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 16px;
}

.btn-print:hover {
  background: var(--verde);
}

@media print {
  header, footer, .btn-print, .top-bar {
    display: none !important;
  }
  main {
    margin-top: 0;
    padding: 0;
  }
  body::before, body::after {
    display: none;
  }
  .polaroid {
    box-shadow: none;
    padding: 5px;
  }
}

/* === Contacts Page === */
.about-content {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.about-card {
  background: var(--bianco);
  border: 1px solid var(--carta-scura);
  padding: 28px 32px;
  box-shadow: 3px 3px 12px var(--ombra);
  position: relative;
}

.about-card h2 {
  font-size: 1.8rem;
  margin-bottom: 12px;
  color: var(--verde);
  font-family: var(--font-titoli);
}

.about-card p {
  color: #555;
  line-height: 1.8;
  margin-bottom: 12px;
}

.about-card .contact-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px 0;
  color: #555;
}

.about-card .contact-item strong {
  color: var(--inchiostro);
  min-width: 80px;
  font-family: var(--font-titoli);
  font-size: 1.1rem;
}

/* Stamp doodle on contacts */
.stamp-decoration {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 60px;
  height: 60px;
  opacity: 0.2;
  transform: rotate(12deg);
}

/* Profile image circular */
.profile-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  float: left;
  margin: 0 20px 12px 0;
  shape-outside: circle();
  border: 3px solid var(--bianco);
  box-shadow: 2px 2px 8px var(--ombra);
}

/* === Breadcrumb === */
.breadcrumb {
  font-family: var(--font-testo);
  font-size: 0.85rem;
  color: #aaa;
  margin-bottom: 24px;
}

.breadcrumb a {
  color: var(--verde);
}

.breadcrumb a:hover {
  color: var(--rosso);
}

.breadcrumb span {
  color: var(--inchiostro);
}

/* === Footer === */
footer {
  background: var(--inchiostro);
  color: var(--carta);
  text-align: center;
  padding: 28px 24px;
  margin-top: 48px;
  position: relative;
}

footer p {
  font-family: var(--font-testo);
  font-size: 0.85rem;
  opacity: 0.8;
}

footer .tricolore {
  display: inline-block;
  width: 40px;
  height: 4px;
  background: linear-gradient(to right, var(--verde), var(--bianco), var(--rosso));
  border-radius: 2px;
  margin-bottom: 10px;
}

/* === Responsive === */
@media (min-width: 600px) {
  .recipe-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  .about-content {
    flex-direction: row;
  }

  .about-card {
    flex: 1;
  }

  .hero h1 {
    font-size: 5rem;
  }
}

@media (max-width: 600px) {
  nav {
    flex-direction: column;
    height: auto;
    padding: 10px 24px;
    gap: 6px;
  }

  .nav-links {
    gap: 4px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-links li + li::before {
    margin-right: 4px;
  }

  .hero h1 {
    font-size: 2.8rem;
  }

  .recipe-header h1 {
    font-size: 2.2rem;
  }

  body::after {
    left: 24px;
  }

  .hero-doodle-left,
  .hero-doodle-right {
    display: none;
  }
}
```

- [ ] **Step 3: Verify file created**

Check that style.css exists and is non-empty at `melisbrillux/css/style.css`.

```bash
wc -l /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/css/style.css
```

Expected: at least 400 lines of CSS.

---

### Task 2: Create SVG Doodle Decorations

**Files:**
- Create: `melisbrillux/images/doodle-star.svg`
- Create: `melisbrillux/images/doodle-heart.svg`
- Create: `melisbrillux/images/doodle-spoon.svg`
- Create: `melisbrillux/images/doodle-splash.svg`
- Create: `melisbrillux/images/doodle-stamp.svg`

**Dependencies:** Task 1 (directory structure)

- [ ] **Step 1: Create star doodle**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M50 5 L63 38 L98 38 L70 60 L80 95 L50 75 L20 95 L30 60 L2 38 L37 38 Z" fill="#2C1810"/>
</svg>
```

Write to `melisbrillux/images/doodle-star.svg`.

- [ ] **Step 2: Create heart doodle**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M50 88 C20 60 5 40 5 25 C5 12 18 5 28 5 C38 5 45 12 50 20 C55 12 62 5 72 5 C82 5 95 12 95 25 C95 40 80 60 50 88 Z" fill="#CE2B37"/>
</svg>
```

Write to `melisbrillux/images/doodle-heart.svg`.

- [ ] **Step 3: Create spoon doodle**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M25 10 C25 25 18 30 18 45 C18 58 28 65 38 65 L42 65 L42 92 C42 96 46 98 50 98 C54 98 58 96 58 92 L58 65 L62 65 C72 65 82 58 82 45 C82 30 75 25 75 10 Z" fill="#2C1810" opacity="0.6"/>
</svg>
```

Write to `melisbrillux/images/doodle-spoon.svg`.

- [ ] **Step 4: Create chocolate splash doodle**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M10 40 Q20 20 35 30 Q40 25 50 35 Q55 20 65 30 Q75 15 80 35 Q90 40 85 55 Q78 70 65 75 Q55 85 45 80 Q30 90 20 75 Q5 70 10 55 Z" fill="#2C1810" opacity="0.8"/>
  <circle cx="25" cy="25" r="5" fill="#2C1810" opacity="0.6"/>
  <circle cx="75" cy="20" r="4" fill="#2C1810" opacity="0.5"/>
  <circle cx="82" cy="45" r="3" fill="#2C1810" opacity="0.4"/>
</svg>
```

Write to `melisbrillux/images/doodle-splash.svg`.

- [ ] **Step 5: Create stamp doodle**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="10" y="10" width="80" height="80" rx="5" fill="none" stroke="#CE2B37" stroke-width="3" stroke-dasharray="4 4"/>
  <text x="50" y="55" font-family="serif" font-size="14" text-anchor="middle" fill="#CE2B37" transform="rotate(-8 50 55)">APPROVATO</text>
  <circle cx="25" cy="22" r="4" fill="#CE2B37"/>
  <circle cx="75" cy="22" r="4" fill="#CE2B37"/>
  <circle cx="25" cy="78" r="4" fill="#CE2B37"/>
  <circle cx="75" cy="78" r="4" fill="#CE2B37"/>
</svg>
```

Write to `melisbrillux/images/doodle-stamp.svg`.

- [ ] **Step 6: Verify all images exist**

```bash
ls -la /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/images/
```

Expected: 5 SVG files listed.

---

### Task 3: Create Homepage (index.html)

**Files:**
- Create: `melisbrillux/index.html`

**Dependencies:** Task 1 (CSS), Task 2 (doodles)

- [ ] **Step 1: Create index.html**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Melisbrillux — Ricette della tradizione</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<div class="top-bar"></div>

<header>
  <nav>
    <div class="logo"><a href="index.html">Melis<span>brillux</span></a></div>
    <ul class="nav-links">
      <li><a href="index.html" class="active">Home</a></li>
      <li><a href="ricette/">Ricette</a></li>
      <li><a href="contatti.html">Contatti</a></li>
    </ul>
  </nav>
</header>

<main>
  <div class="wrapper">

    <section class="hero">
      <img src="images/doodle-star.svg" alt="" class="hero-doodle-left" aria-hidden="true">
      <img src="images/doodle-heart.svg" alt="" class="hero-doodle-right" aria-hidden="true">
      <h1>Melisbrillux</h1>
      <p class="tagline">Ricette della tradizione, scritte con amore</p>
      <div class="separator"></div>
    </section>

    <div class="polaroid polaroid-hero polaroid rotate-right">
      <div class="placeholder-img" style="aspect-ratio: 4/3;">
        <span style="font-size:1.6rem;">Salame di Cioccolato</span>
      </div>
    </div>

    <section style="margin-top: 48px;">
      <div class="torn-card" style="overflow:hidden;">
        <img src="images/doodle-spoon.svg" alt="" style="position:absolute;right:12px;top:12px;width:40px;height:40px;opacity:0.2;" aria-hidden="true">
        <h2 class="section-title" style="font-size:2rem;">Chi sono</h2>
        <div class="placeholder-img profile-img" style="width:80px;height:80px;border-radius:50%;float:left;margin:0 20px 12px 0;flex-shrink:0;display:inline-flex;font-size:0.7rem;text-align:center;"></div>
        <p>Ciao, sono Melisbrillux. La cucina è la mia passione da sempre. Amo riscoprire le ricette della tradizione italiana e condividerle con chi, come me, crede che il cibo sia prima di tutto amore, cura e memoria. Ogni ricetta che trovi qui è stata preparata e assaggiata personalmente, perché per me la cucina è un gesto d'amore che merita attenzione e rispetto.</p>
      </div>
    </section>

    <section style="margin-top: 36px;">
      <h2 class="section-title" style="font-size:2rem;">Ultima ricetta</h2>
      <div class="postit rotate-left" style="margin-top: 16px;">
        <h3>Salame di Cioccolato</h3>
        <p style="font-size:0.95rem;color:#888;margin-bottom:8px;">di Melisbrillux</p>
        <p style="color:#555;margin-bottom:16px;">Il classico dolce della tradizione italiana, senza cottura: biscotti, cioccolato fondente e rum si uniscono in un rotolo goloso che ricorda un salame.</p>
        <a href="ricette/salame-di-cioccolato.html" class="btn">Leggi la ricetta</a>
      </div>
    </section>

  </div>
</main>

<footer>
  <div class="tricolore"></div>
  <p>&copy; 2026 Melisbrillux — Tutti i diritti riservati</p>
</footer>

</body>
</html>
```

- [ ] **Step 2: Verify file exists and is valid**

```bash
grep -c '<html' /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/index.html
```

Expected: 1 (contains `<html` tag)

---

### Task 4: Create Recipe Archive Page

**Files:**
- Create: `melisbrillux/ricette/index.html`

**Dependencies:** Task 1 (CSS), Task 2 (doodles)

- [ ] **Step 1: Create ricette/index.html**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ricette — Melisbrillux</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>

<div class="top-bar"></div>

<header>
  <nav>
    <div class="logo"><a href="../index.html">Melis<span>brillux</span></a></div>
    <ul class="nav-links">
      <li><a href="../index.html">Home</a></li>
      <li><a href="../ricette/" class="active">Ricette</a></li>
      <li><a href="../contatti.html">Contatti</a></li>
    </ul>
  </nav>
</header>

<main>
  <div class="wrapper-wide">

    <div class="breadcrumb">
      <a href="../index.html">Home</a> / <span>Ricette</span>
    </div>

    <h1 class="section-title">Ricette</h1>

    <div class="recipe-grid">
      <div class="recipe-card">
        <div class="placeholder-img card-img"><span>Salame di Cioccolato</span></div>
        <div class="card-body">
          <h3>Salame di Cioccolato</h3>
          <p class="chef">di Melisbrillux</p>
          <p class="card-desc">Il classico dolce della tradizione italiana, senza cottura: biscotti, cioccolato fondente e rum si uniscono in un rotolo goloso che ricorda un salame.</p>
          <a href="salame-di-cioccolato.html" class="btn">Vedi ricetta</a>
        </div>
      </div>
    </div>

    <p style="text-align:center;color:#aaa;margin-top:48px;font-style:italic;">Altre ricette in arrivo...</p>

  </div>
</main>

<footer>
  <div class="tricolore"></div>
  <p>&copy; 2026 Melisbrillux — Tutti i diritti riservati</p>
</footer>

</body>
</html>
```

- [ ] **Step 2: Verify file exists**

```bash
grep -c 'Ricette' /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/ricette/index.html
```

Expected: 2+ (title and h1 both contain "Ricette")

---

### Task 5: Create Recipe Detail Page

**Files:**
- Create: `melisbrillux/ricette/salame-di-cioccolato.html`

**Dependencies:** Task 1 (CSS), Task 2 (doodles)

- [ ] **Step 1: Create ricette/salame-di-cioccolato.html**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Salame di Cioccolato — Melisbrillux</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>

<div class="top-bar"></div>

<header>
  <nav>
    <div class="logo"><a href="../index.html">Melis<span>brillux</span></a></div>
    <ul class="nav-links">
      <li><a href="../index.html">Home</a></li>
      <li><a href="../ricette/" class="active">Ricette</a></li>
      <li><a href="../contatti.html">Contatti</a></li>
    </ul>
  </nav>
</header>

<main>
  <div class="wrapper">

    <div class="breadcrumb">
      <a href="../index.html">Home</a> / <a href="../ricette/">Ricette</a> / <span>Salame di Cioccolato</span>
    </div>

    <div class="recipe-header">
      <h1>Salame di Cioccolato</h1>
      <p class="meta">di Melisbrillux</p>
    </div>

    <div class="polaroid polaroid rotate-left" style="max-width:100%;margin-bottom:32px;">
      <div class="placeholder-img" style="aspect-ratio:4/3;"><span>Salame di Cioccolato</span></div>
    </div>

    <div class="recipe-section" style="position:relative;">
      <img src="../images/doodle-splash.svg" alt="" class="chocolate-splash" aria-hidden="true">
      <h2>Ingredienti</h2>
      <ul class="ingredient-list">
        <li>200 gr di biscotti secchi</li>
        <li>60 gr di burro a temperatura ambiente</li>
        <li>80 gr di zucchero</li>
        <li>3 tuorli</li>
        <li>100 gr di cioccolato fondente</li>
        <li>3 cucchiaini di rum (a piacere)</li>
      </ul>
    </div>

    <div class="recipe-section">
      <h2>Preparazione</h2>
      <ol class="step-list">
        <li>Prendere un frullatore, inserire la spina nella presa della corrente.</li>
        <li>Aprire la confezione di biscotti.</li>
        <li>Prendere il frullatore e togliere il coperchio.</li>
        <li>Prendere un recipiente.</li>
        <li>Azionare il frullatore per 40 secondi. Quando sono passati, aprire il coperchio e versare il contenuto dentro il recipiente. Per azionare il frullatore bisogna premere il pulsante di accensione.</li>
        <li>Sbricolare per 30 secondi.</li>
        <li>Prendere una ciotola, trasferire i biscotti frantumati in essa.</li>
        <li>Prendere il frullatore.</li>
        <li>Prendere la confezione dello zucchero bianco, aprirla, versare 80 gr di zucchero all'interno del frullatore, chiudere il coperchio ed azionarlo per 30 secondi.</li>
        <li>Prendere un altro recipiente.</li>
        <li>Quando il procedimento è finito, aprire il coperchio del frullatore, versare lo zucchero (diventato a velo) nel recipiente appena preso.</li>
        <li>Prendere la barretta di cioccolato, aprirla, spezzarla a quadretti, inserire i pezzetti di cioccolato all'interno del frullatore e chiudere il coperchio.</li>
        <li>Azionare il frullatore per 50 secondi. Quando sono passati, aprire il coperchio e versare il contenuto dentro il recipiente con lo zucchero. Per azionare il frullatore bisogna inserire la spina nella presa della corrente e premere il pulsante di accensione.</li>
        <li>Prendere un contenitore piccolo.</li>
        <li>Prendere le uova, rompere un'uova alla volta, dividerla a metà, versare l'albume nel piccolo contenitore, versare i tuorli nel contenitore con lo zucchero ed il cioccolato.</li>
        <li>Prendere il burro, prendere un coltello, tagliare il burro a pezzi piccoli ed inserirli nel recipiente con zucchero, cioccolato e tuorli.</li>
        <li>Prendere la bottiglia del rum scelto, togliere il tappo, prendere un cucchiaio, riprendere la bottiglia e versare il liquido nel cucchiaio fino a riempirlo e versarlo nel recipiente con zucchero, cioccolato, tuorli e burro per tre volte.</li>
        <li>Prendere le fruste, prendere il recipiente indicato sopra, iniziare a girare le fruste all'interno del contenitore per mixare gli ingredienti fino ad ottenere un impasto omogeneo.</li>
        <li>Prendere la ciotola con i biscotti, versare il contenuto all'interno dell'altra ciotola, riprendere le fruste e girare per almeno 5 minuti.</li>
        <li>Ottenuto il composto, prendere la carta forno a fogli, aprirla, prendere un foglio, stenderlo su un tavolo, versare il composto sul foglio dando la forma di un salame ed arrotolarlo.</li>
        <li>Aprire il congelatore, prendere il composto arrotolato ed inserirlo nel congelatore per minimo 1 ora, chiudere il congelatore.</li>
        <li>Dopo 1 ora, aprire il congelatore, prendere il composto, chiudere il congelatore e srotolare il composto, che ora chiameremo salame di cioccolato.</li>
        <li>Prendere un piatto ed un coltello, poggia il salame di cioccolato sul piatto.</li>
        <li>Con il coltello, tagliare delle fette spesse 3 centimetri.</li>
      </ol>
    </div>

    <button class="btn-print" onclick="window.print()"> Stampa ricetta</button>

  </div>
</main>

<footer>
  <div class="tricolore"></div>
  <p>&copy; 2026 Melisbrillux — Tutti i diritti riservati</p>
</footer>

</body>
</html>
```

- [ ] **Step 2: Verify file exists**

```bash
grep -c 'Salame' /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/ricette/salame-di-cioccolato.html
```

Expected: 3+ (title, h1, ingredients)

---

### Task 6: Create Contacts Page

**Files:**
- Create: `melisbrillux/contatti.html`

**Dependencies:** Task 1 (CSS), Task 2 (doodles)

- [ ] **Step 1: Create contatti.html**

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contatti — Melisbrillux</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<div class="top-bar"></div>

<header>
  <nav>
    <div class="logo"><a href="index.html">Melis<span>brillux</span></a></div>
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="ricette/">Ricette</a></li>
      <li><a href="contatti.html" class="active">Contatti</a></li>
    </ul>
  </nav>
</header>

<main>
  <div class="wrapper">

    <div class="breadcrumb">
      <a href="index.html">Home</a> / <span>Contatti</span>
    </div>

    <h1 class="section-title">Contatti</h1>

    <div class="about-content">
      <div class="about-card">
        <img src="images/doodle-stamp.svg" alt="" class="stamp-decoration" aria-hidden="true">
        <h2>Chi sono</h2>
        <div class="placeholder-img profile-img" style="width:80px;height:80px;border-radius:50%;float:left;margin:0 20px 12px 0;flex-shrink:0;display:inline-flex;font-size:0.7rem;text-align:center;"></div>
        <p>Ciao, sono Melisbrillux. La cucina è la mia passione da sempre. Amo riscoprire le ricette della tradizione italiana e condividerle con chi, come me, crede che il cibo sia prima di tutto amore, cura e memoria.</p>
        <p>Ogni ricetta che trovi qui è stata preparata e assaggiata personalmente, perché per me la cucina è un gesto d'amore che merita attenzione e rispetto.</p>
      </div>

      <div class="about-card">
        <img src="images/doodle-heart.svg" alt="" class="stamp-decoration" style="opacity:0.15;" aria-hidden="true">
        <h2>Contatti</h2>
        <div class="contact-item">
          <strong>Email</strong> melisbrillux@example.com
        </div>
        <div class="contact-item">
          <strong>Instagram</strong> @melisbrillux
        </div>
      </div>
    </div>

  </div>
</main>

<footer>
  <div class="tricolore"></div>
  <p>&copy; 2026 Melisbrillux — Tutti i diritti riservati</p>
</footer>

</body>
</html>
```

- [ ] **Step 2: Verify file exists**

```bash
grep -c 'Contatti' /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/contatti.html
```

Expected: 2+ (title and h1)

---

### Task 7: Verify the Complete Site

**Files:** All files from Tasks 1-6

**Dependencies:** All previous tasks

- [ ] **Step 1: Verify all files exist**

```bash
ls -la /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/
ls -la /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/ricette/
ls -la /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/css/
ls -la /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/images/
```

Expected: all files present.

- [ ] **Step 2: Verify all HTML pages have valid structure**

```bash
for f in /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/index.html /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/ricette/index.html /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/ricette/salame-di-cioccolato.html /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/contatti.html; do echo "--- $f ---"; grep -c '<html' "$f"; grep -c '</html>' "$f"; done
```

Expected: each page shows `<html` count 1 and `</html>` count 1.

- [ ] **Step 3: Verify all internal links are relative paths**

```bash
grep -rn 'href="\|src="' /Users/melissa/Desktop/WS\ -\ Design\ 2/Ricetta\ salame\ di\ cioccolato/melisbrillux/ --include="*.html" | grep -v 'http://\|https://\|fonts.googleapis\|googleapis'
```

Expected: all local links use relative paths (../ or ./ or no prefix).

---

### Post-Implementation: Image Generation

After the code is complete, the placeholder images need to be replaced with AI-generated food photography. This is a separate step since it requires an external tool.

**Images needed:**
1. `hero-salame.jpg` — Hero image for homepage, close-up of chocolate salami on a wooden board, warm lighting
2. `ricetta-salame.jpg` — Recipe detail photo, chocolate salami slice on a plate, rustic style
3. `profile-melisbrillux.jpg` — Warm, welcoming portrait of Melisbrillux in a kitchen setting

**Action:** Generate these images using an AI image generation tool (DALL-E, Midjourney, Stable Diffusion, etc.) and place them in `melisbrillux/images/`. Update `index.html`, `ricette/salame-di-cioccolato.html`, and `contatti.html` to replace `placeholder-img` divs with actual `<img>` tags.
