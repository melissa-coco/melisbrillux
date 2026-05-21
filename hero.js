const C = document.querySelector('.c');
const B = document.querySelector('.b');

const BR = '47% 53% 45% 55% / 67% 59% 41% 33%';

const GRADIENTS = [
  'linear-gradient(45deg, rgba(255,0,0,0.64), rgba(0,255,0,0.84))',
  'linear-gradient(45deg, #FF5733, #33FF57)',
  'linear-gradient(45deg, rgba(76,249,225,0.64), rgb(69,107,212))',
];

let mouseX = 0.5;
let mouseY = 0.5;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX / window.innerWidth;
  mouseY = e.clientY / window.innerHeight;
});

const blobs = [];

function rand(a, b) { return a + Math.random() * (b - a); }

function build() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  C.style.width = w + 'px';
  C.style.height = h + 'px';
  C.style.borderRadius = '0';

  let st = document.getElementById('lamp-style');
  if (!st) {
    st = document.createElement('style');
    st.id = 'lamp-style';
    document.head.appendChild(st);
  }

  let css = '';
  B.innerHTML = '';
  blobs.length = 0;

  function add(gradIdx, szMin, szMax, blurMin, blurMax) {
    const el = document.createElement('div');
    const id = `b${blobs.length}`;
    const grad = GRADIENTS[gradIdx % GRADIENTS.length];
    const szW = rand(szMin, szMax);
    const szH = rand(szMin, szMax);
    const blurAmt = rand(blurMin, blurMax);
    const i = blobs.length;

    css += `.${id} { width: ${szW}px; height: ${szH}px; background: ${grad}; filter: blur(${blurAmt}px); }\n`;
    el.className = id;
    el.style.cssText = `position: absolute; border-radius: ${BR}; left: 0; right: 0; margin: auto; z-index: 0;`;
    B.appendChild(el);

    blobs.push({
      el,
      xPct: rand(0, 100),
      speed: rand(0.02, 0.06),
      phase: i * 0.04,
      up: Math.random() > 0.5,
      magnet: rand(0.2, 0.5),
      rotSpeed: rand(10, 30),
      sx: 0,
    });
  }

  for (let i = 0; i < 6; i++) { add(0, 20, 40, 4, 8); }
  for (let i = 0; i < 6; i++) { add(1, 25, 45, 4, 8); }
  for (let i = 0; i < 6; i++) { add(2, 18, 38, 4, 8); }
  for (let i = 0; i < 10; i++) { add(i % 3, 50, 80, 8, 13); }
  for (let i = 0; i < 8; i++) { add(i % 3, 90, 140, 13, 18); }
  for (let i = 0; i < 4; i++) { add(i % 3, 160, 250, 18, 26); }

  st.textContent = css;
}

function animate() {
  const t = Date.now() / 1000;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const margin = 150;

  for (const b of blobs) {
    let prog = (t * b.speed + b.phase) % 1;
    if (b.up) prog = 1 - prog;
    const y = -margin + prog * (h + margin * 2);

    const pullX = (mouseX * 100 - b.xPct) * b.magnet;
    b.sx += (pullX - b.sx) * 0.02;

    const xPx = (b.xPct + b.sx) / 100 * w;

    b.el.style.transform = `translate(${xPx - w / 2}px, ${y}px) rotate(${t * b.rotSpeed}deg)`;
  }

  requestAnimationFrame(animate);
}

build();
animate();
window.addEventListener('resize', build);
