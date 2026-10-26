(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover)').matches;

  $('#yr').textContent = new Date().getFullYear();
  addEventListener('load', () => setTimeout(() => $('#loader').classList.add('done'), 800));
  setTimeout(() => $('#loader').classList.add('done'), 2500);

  /* links from site.config.js — empty values keep the button hidden */
  const cfg = window.SITE || {};
  const map = { linkedin: cfg.linkedin, github: cfg.github, ...(cfg.projects || {}) };
  $$('[data-link]').forEach((a) => { const u = map[a.dataset.link]; if (u) a.href = u; });

  /* theme toggle */
  $('#theme').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* typed roles */
  const roles = ['Java Full-Stack Developer', 'Spring Boot & REST API Builder', 'Aspiring Software Engineer', 'Always learning, always building'];
  const el = $('#typed'); let r = 0, ch = 0, del = false;
  (function tick() {
    const w = roles[r]; el.textContent = w.slice(0, ch);
    if (!del && ch === w.length) { del = true; return setTimeout(tick, 1600); }
    if (del && ch === 0) { del = false; r = (r + 1) % roles.length; }
    ch += del ? -1 : 1; setTimeout(tick, del ? 30 : 70);
  })();

  /* reveal + counters */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.style.transitionDelay = (e.target.dataset.d || 0) + 'ms';
    e.target.classList.add('in'); io.unobserve(e.target);
    const n = e.target.querySelector('[data-count]'); if (n) count(n);
  }), { threshold: 0.12 });
  $$('.reveal').forEach((n, i) => { n.dataset.d = (i % 3) * 90; io.observe(n); });
  function count(n) {
    const to = +n.dataset.count, suf = n.dataset.suffix || '', t0 = performance.now(), dur = 1500;
    (function f(t) {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      n.textContent = Math.round(to * e) + suf; if (p < 1) requestAnimationFrame(f);
    })(t0);
  }

  /* nav state, progress, timeline fill */
  const nav = $('#nav'), prog = $('#progress'), tl = $('.timeline');
  const secs = $$('main section[id]'), links = $$('#links a:not(.pill)');
  function onScroll() {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (y / h * 100) + '%';
    nav.classList.toggle('stuck', y > 30);
    let cur = secs[0].id; secs.forEach((s) => { if (s.offsetTop - 160 <= y) cur = s.id; });
    links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
    const b = tl.getBoundingClientRect();
    tl.style.setProperty('--tl', Math.max(0, Math.min(100, (innerHeight * 0.65 - b.top) / b.height * 100)) + '%');
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobile menu */
  const burger = $('#burger'), menu = $('#links');
  burger.onclick = () => { burger.classList.toggle('open'); menu.classList.toggle('open'); };
  $$('#links a').forEach((a) => a.addEventListener('click', () => { burger.classList.remove('open'); menu.classList.remove('open'); }));

  /* spotlight + subtle tilt on project cards */
  $$('.project').forEach((c) => {
    c.addEventListener('pointermove', (e) => {
      const b = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - b.left) + 'px'); c.style.setProperty('--my', (e.clientY - b.top) + 'px');
    });
  });

  /* profile modal */
  const modal = $('#profile'), pbtn = $('#profileBtn');
  const setModal = (open) => {
    modal.classList.toggle('open', open); document.body.classList.toggle('lock', open);
    if (open) $('.modal-x', modal).focus(); else pbtn.focus();
  };
  pbtn.addEventListener('click', () => setModal(true));
  $$('[data-close]', modal).forEach((n) => n.addEventListener('click', () => setModal(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) setModal(false); });
})();
