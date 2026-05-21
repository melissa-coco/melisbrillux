const previewAnimations = {
  'pattern-tool': (ctx, w, h, t) => {
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, w, h);
    const cols = 5, rows = 5;
    const margin = 40;
    const cw = (w - margin * 2) / cols, ch = (h - margin * 2) / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = margin + c * cw + cw / 2, cy = margin + r * ch + ch / 2;
        const bx = cw * 0.35, by = ch * 0.35;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#fff';
        for (const s of [1, 0.65, 0.35]) {
          const pts = [
            [cx, cy - by * s],
            [cx + bx * s, cy],
            [cx, cy + by * s],
            [cx - bx * s, cy],
          ];
          ctx.beginPath();
          ctx.moveTo(pts[0][0], pts[0][1]);
          for (let i = 1; i < 4; i++) ctx.lineTo(pts[i][0], pts[i][1]);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
    }
  },

  'maschera-sonora': (ctx, w, h, t) => {
    ctx.fillStyle = '#caf0f8';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h * 0.35;
    const sc = 1 + Math.sin(t * 1.3) * 0.35;
    const rot = t * 2.2;
    const morph = (Math.sin(t * 0.7) + 1) / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(sc, sc);
    ctx.rotate(rot);

    const R = Math.min(w, h) * 0.3;
    const bladeColors = [
      ['#f39200', '#662483'],
      ['#d60b52', '#009640'],
    ];

    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI * 2 - Math.PI / 4;
      const pair = bladeColors[i % 2];
      ctx.fillStyle = lerpColor(pair[0], pair[1], morph);
      ctx.strokeStyle = '#1d1d1b';
      ctx.lineWidth = 0.5;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(
        Math.cos(ang) * R * 1.3, Math.sin(ang) * R * 1.3,
        Math.cos(ang + Math.PI / 4) * R * 0.9, Math.sin(ang + Math.PI / 4) * R * 0.9
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(
        Math.cos(ang + Math.PI / 6) * R * 1.1, Math.sin(ang + Math.PI / 6) * R * 1.1,
        Math.cos(ang + Math.PI / 4) * R * 0.9, Math.sin(ang + Math.PI / 4) * R * 0.9
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = lerpColor('#009fe3', '#e6332a', morph);
    ctx.strokeStyle = '#1d1d1b';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(w, h) * 0.07, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    ctx.fillStyle = '#7d4e24';
    ctx.fillRect(cx - Math.min(w, h) * 0.025, cy + Math.min(w, h) * 0.2, Math.min(w, h) * 0.05, Math.min(w, h) * 0.3);
  },

  'bubble-pop': (ctx, w, h, t) => {
    const bgColors = [
      [255, 182, 193], [173, 216, 230], [216, 191, 255],
      [255, 218, 185], [179, 255, 206]
    ];
    const idx = Math.floor(t / 4) % bgColors.length;
    const blend = ((t % 4) / 4);
    const c1 = bgColors[idx], c2 = bgColors[(idx + 1) % bgColors.length];
    const r = Math.round(c1[0] + (c2[0] - c1[0]) * blend);
    const g = Math.round(c1[1] + (c2[1] - c1[1]) * blend);
    const b = Math.round(c1[2] + (c2[2] - c1[2]) * blend);
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, `rgb(${r},${g},${b})`);
    grad.addColorStop(1, `rgb(${b},${r},${g})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const pastels = ['#ffb6c1', '#87ceeb', '#d8b4fe', '#ffdab9', '#b3ffce', '#fda4af', '#67e8f9', '#c4b5fd', '#fdba74', '#86efac'];

    for (let i = 0; i < 15; i++) {
      const phase = i * 0.7 + t * 0.3;
      const x = ((i * 137.5 + Math.sin(t * 0.5 + i) * 60) % (w + 100)) - 50;
      const y = ((i * 97.3 + t * 25 + Math.sin(t * 0.3 + i * 1.3) * 30) % (h + 100)) - 50;
      const r = 20 + Math.sin(t * 0.2 + i * 1.1) * 10 + (i % 5) * 5;

      const bg = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 2, x, y, r);
      const col = pastels[i % pastels.length];
      bg.addColorStop(0, 'rgba(255,255,255,0.85)');
      bg.addColorStop(0.25, col + 'cc');
      bg.addColorStop(0.7, col + '55');
      bg.addColorStop(1, 'rgba(255,255,255,0.1)');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  'tipografia-cinetica': (ctx, w, h, t) => {
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#fff8f0');
    bg.addColorStop(0.5, '#fff');
    bg.addColorStop(1, '#f0f8ff');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const fontSize = Math.min(w * 0.18, h * 0.35);
    ctx.font = `700 ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const tx = w / 2, ty = h * 0.35;
    const grad = ctx.createLinearGradient(tx - fontSize * 2, 0, tx + fontSize * 2, 0);
    grad.addColorStop(0, '#FF6B6B');
    grad.addColorStop(0.5, '#FFD93D');
    grad.addColorStop(1, '#6BCB77');
    ctx.fillStyle = grad;
    ctx.fillText('GELEATO', tx, ty);

    const textB = ty + fontSize * 0.5;
    const textL = tx - fontSize * 2.5;
    const textW = fontSize * 5;

    for (let i = 0; i < 25; i++) {
      const dripPhase = ((t * 0.25 + i * 0.035) % 1.2);
      const x = textL + (i / 25) * textW + Math.sin(t * 0.3 + i * 0.5) * 8;
      const len = Math.min(dripPhase, 1) * h * 0.35;

      const hue = 0 + (i / 25) * 120;
      ctx.fillStyle = `hsl(${hue}, 80%, 55%)`;

      const segs = Math.floor(len / 3);
      for (let j = 0; j < segs; j++) {
        const r = 6 * (1 - (j / segs) * 0.65);
        ctx.beginPath();
        ctx.arc(x, textB + j * 4, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (dripPhase > 1) {
        const fallT = (dripPhase - 1) / 0.2;
        const fallY = textB + h * 0.35 + fallT * h * 0.2;
        ctx.globalAlpha = 1 - fallT;
        ctx.beginPath();
        ctx.arc(x, fallY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  },

  'salame-cioccolato': (ctx, w, h, t) => {
    ctx.fillStyle = '#f7f1e6';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w / 2, 28);
    ctx.rotate(Math.sin(t * 0.3) * 0.015);

    ctx.font = 'italic 36px serif';
    ctx.fillStyle = '#b83a2a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Melisbrillux', 0, 0);

    const sW = ctx.measureText('Melisbrillux').width;
    ctx.strokeStyle = '#b83a2a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-45, 38);
    ctx.lineTo(45, 38);
    ctx.stroke();

    ctx.restore();

    ctx.save();
    ctx.translate(w / 2, h * 0.3);
    const rotAmt = Math.sin(t * 0.15) * 0.025;

    ctx.rotate(rotAmt);

    ctx.shadowColor = 'rgba(0,0,0,0.08)';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(-130, -95);
    ctx.lineTo(130, -95);
    ctx.lineTo(130, 115);
    ctx.lineTo(-130, 115);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#f5ede1';
    ctx.shadowBlur = 3;
    const margin = 8;
    ctx.beginPath();
    ctx.rect(-130 + margin, -95 + margin, 260 - margin * 2, 210 - margin * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#4a2a10';
    ctx.beginPath();
    ctx.ellipse(8, 18, 72, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5c381a';
    ctx.beginPath();
    ctx.ellipse(8, 18, 60, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + t * 0.1;
      const dist = 30 + Math.sin(t * 0.3 + i) * 8;
      const bx = 8 + Math.cos(a) * dist;
      const by = 18 + Math.sin(a) * dist * 0.6;
      const sz = 5 + Math.sin(t * 0.2 + i) * 2;
      ctx.fillStyle = `hsl(30, 35%, ${28 + Math.sin(t + i) * 8}%)`;
      ctx.beginPath();
      ctx.arc(bx, by, sz, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.beginPath();
    ctx.ellipse(-15, 6, 20, 12, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#c0392b';
    ctx.font = 'bold 16px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Salame di Cioccolato', 0, 110);

    ctx.fillStyle = '#999';
    ctx.font = '13px serif';
    ctx.fillText('di Melisbrillux', 0, 130);

    ctx.restore();

    ctx.fillStyle = '#5a3a1a';
    ctx.font = 'bold 15px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Il classico dolce della tradizione italiana', w / 2, h * 0.76);

    ctx.fillStyle = '#888';
    ctx.font = '13px serif';
    ctx.fillText('200g biscotti  ·  100g cioccolato  ·  rum  ·  burro  ·  zucchero  ·  uova', w / 2, h * 0.82);

    ctx.fillStyle = '#e8ddd0';
    ctx.beginPath();
    ctx.moveTo(w * 0.15, h - 20);
    ctx.quadraticCurveTo(w * 0.3, h - 18, w * 0.5, h - 20);
    ctx.quadraticCurveTo(w * 0.7, h - 22, w * 0.85, h - 20);
    ctx.lineWidth = 1;
    ctx.stroke();
  },
};

function lerpColor(c1, c2, t) {
  const r1 = parseInt(c1.slice(1, 3), 16);
  const g1 = parseInt(c1.slice(3, 5), 16);
  const b1 = parseInt(c1.slice(5, 7), 16);
  const r2 = parseInt(c2.slice(1, 3), 16);
  const g2 = parseInt(c2.slice(3, 5), 16);
  const b2 = parseInt(c2.slice(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

function startPreviews() {
  const canvases = document.querySelectorAll('.works-card canvas');
  canvases.forEach(canvas => {
    const slug = canvas.dataset.slug;
    const anim = previewAnimations[slug];
    if (!anim) return;
    const ctx = canvas.getContext('2d');
    let start = null;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = Math.round(rect.width * devicePixelRatio);
        canvas.height = Math.round(rect.height * devicePixelRatio);
        ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      }
    }

    resize();
    window.addEventListener('resize', resize);

    function frame(ts) {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      anim(ctx, w, h, t);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startPreviews);
} else {
  startPreviews();
}
