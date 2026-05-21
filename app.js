const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');
let currentSection = 'hero';

const hashSection = window.location.hash.replace('#', '');
if (hashSection && document.getElementById(hashSection)) {
  currentSection = hashSection;
}

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
    }
    showSection(target);
  });
});

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
  document.querySelectorAll('.hero-date').forEach(el => el.textContent = dict.heroDate);
  document.querySelectorAll('.hero-cta').forEach(el => el.textContent = dict.heroCta);
  document.querySelectorAll('#works h2').forEach(el => el.textContent = dict.worksTitle);
  document.querySelectorAll('#about h2').forEach(el => el.textContent = dict.aboutTitle);
  document.querySelectorAll('.about-card:nth-child(1) .about-text').forEach(el => el.textContent = dict.aboutMelissa);
  document.querySelectorAll('.about-card:nth-child(2) .about-text').forEach(el => el.textContent = dict.aboutAbadir);
  document.querySelectorAll('.about-card:nth-child(3) .about-text').forEach(el => el.textContent = dict.aboutWs);
  document.querySelectorAll('#contact h2').forEach(el => el.textContent = dict.contactTitle);
  document.querySelectorAll('.about-content p').forEach(el => el.textContent = dict.aboutBio);
  document.querySelectorAll('.contact-email').forEach(el => el.textContent = dict.contactEmail);
  document.querySelectorAll('#lang-toggle').forEach(el => el.textContent = dict.langBtn);
}

document.getElementById('lang-toggle').addEventListener('click', () => {
  applyLang(lang === 'it' ? 'en' : 'it');
});

applyLang(lang);

if (hashSection && hashSection !== 'hero') {
  showSection(hashSection);
  setTimeout(() => {
    document.getElementById(hashSection).scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

const grid = document.getElementById('works-grid');

for (const p of projects) {
  const card = document.createElement('a');
  card.className = 'works-card';
  card.href = p.url;

  card.style.background = p.color;

  card.innerHTML = `
    <div class="works-card-info">
      <h3>${p.title}</h3>
    </div>
  `;

  grid.appendChild(card);
}
