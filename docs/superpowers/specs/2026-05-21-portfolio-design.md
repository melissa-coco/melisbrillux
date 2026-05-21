# Portfolio — Design Doc

## Overview
Single-page portfolio site showcasing creative coding / design projects. Vanilla HTML/CSS/JS. Inspired by Studio Dumbar's work grid layout.

## Architecture
- `index.html` — SPA with 4 sections: Hero, Works, About, Contact
- `style.css` — global styles
- `app.js` — section switching, language toggle, hero canvas
- `works/` — one HTML file per project, each loading the original project in an iframe
- Each project page includes nav for back navigation

## Nav Bar
Fixed top, glassmorphism (`backdrop-filter: blur`).
```
[Logo]          Works | About | Contact          IT/EN
```
- Links switch sections via JS (fade-out/fade-in)
- Current section link highlighted
- Language toggle: `data-it` / `data-en` attributes on text nodes, preference saved to `localStorage`

## Hero Section
- Full viewport height
- Background canvas with 2-3 organic blobs (lavalamp effect)
- Blobs follow cursor with easing, morph smoothly, soft gradients
- Overlay text: name + tagline + "Vedi i lavori" CTA button
- CTA scrolls to Works section

## Works Section
- Responsive grid (2-3 columns)
- Each card: GIF preview + title + tech tags
- Click → navigate to `works/<slug>.html`
- Project pages: nav + back button + iframe loading the original project file

## About Section
- Bio text + optional portrait/photo
- Social/professional links

## Contact Section
- Minimal contact form (name, email, message) or direct email link
- Social icons

## Language Toggle (IT/EN)
- Data attributes on translatable elements
- JS swaps text content on toggle
- Preference persisted in localStorage

## Tech Stack
- Vanilla JS, HTML5, CSS3
- Canvas 2D for hero lava lamp
- No frameworks, no external dependencies

## Future
- Details: colors, fonts, exact copy
- Works page content: one section per project to be added later
