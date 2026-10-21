// Click-through slide framework. Nothing here runs on a timer: every change is caused by a click or key.
(function () {
    const $ = s => document.querySelector(s);
  const IGNORE = 'button,input,textarea,a,label,select,[contenteditable],[data-noadvance]';

  // Tiny DOM helper: DEMO.el('div', {class:'x', onclick:fn}, child, 'text', ...)
  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else if (v === true) n.setAttribute(k, '');
      else if (v !== false && v != null) n.setAttribute(k, v);
    }
    for (const c of kids.flat()) if (c != null) n.append(c);
    return n;
  }

  const DEMO = { slides: [], el, add(s) { this.slides.push(s); } };
  let cur = -1, step = 0;

  const maxStep = r => Math.max(0, ...[...r.querySelectorAll('[data-step]')].map(e => +e.dataset.step));
  function paint(s) {
    s.root.querySelectorAll('[data-step]').forEach(e => e.classList.toggle('on', +e.dataset.step <= step));
    const n = DEMO.slides.length;
    $('#cue').hidden = cur >= n - 1 && step >= s.max;
    $('#progress').style.width = (cur + (s.max ? step / s.max : 1)) / n * 100 + '%';
  }
  function setStep(n) {
    const s = DEMO.slides[cur];
    step = Math.max(0, Math.min(n, s.max));
    paint(s);
    s.onStep && s.onStep(step, s.root, s.api);
  }
  function show(i, atEnd) {
    i = Math.max(0, Math.min(i, DEMO.slides.length - 1));
    if (i !== cur && cur >= 0) DEMO.slides[cur].root.classList.remove('active');
    const s = DEMO.slides[cur = i];
    s.root.classList.add('active');
    if (!s.inited) { s.inited = true; s.init && s.init(s.root, s.api); }
    fit(s);
    step = 0; paint(s); s.onStep && s.onStep(0, s.root, s.api);
    if (atEnd) for (let k = 1; k <= s.max; k++) setStep(k);
    $('#counter').textContent = String(i + 1).padStart(2, '0') + ' / ' + String(DEMO.slides.length).padStart(2, '0');
    document.querySelectorAll('#nav button').forEach((b, j) => b.setAttribute('aria-current', j === i));
    try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) {}
  }
  // Shrink a slide's content so nothing is cut off at small window sizes.
  function fit(s) {
    const r = s.root; r.style.zoom = 1; r.style.justifyContent = 'flex-start';
    const avail = r.getBoundingClientRect().height * .96;
    const used = () => { let lo = 1e9, hi = -1e9; r.querySelectorAll('*:not(.b2)').forEach(e => { const b = e.getBoundingClientRect(); if (b.height && getComputedStyle(e).position !== 'fixed') { lo = Math.min(lo, b.top); hi = Math.max(hi, b.bottom); } }); return hi - lo; };
    let z = 1;
    for (let k = 0; k < 5; k++) { const u = used(); if (u <= avail) break; z = Math.max(.45, z * avail / u * .98); r.style.zoom = z; }
    r.style.justifyContent = '';
  }
  const fitCur = () => cur >= 0 && fit(DEMO.slides[cur]);
  addEventListener('resize', fitCur);
  if (document.fonts) document.fonts.ready.then(fitCur);
  // Wait for the text/animation from the last click to finish before accepting the next one.
  let locked = false, pending = 0, minDone = true, lockTimer = 0;
  const infinite = t => { const c = getComputedStyle(t); return /infinite/.test(c.animationIterationCount); };
  function unlockIfIdle() { if (minDone && pending <= 0) { locked = false; document.body.classList.remove('busy'); } }
  function lock() {
    locked = true; minDone = false; pending = 0; document.body.classList.add('busy');
    setTimeout(() => { minDone = true; unlockIfIdle(); }, 500);
    clearTimeout(lockTimer); lockTimer = setTimeout(() => { pending = 0; minDone = true; unlockIfIdle(); }, 2800);
  }
  const mine = e => e.target.closest && e.target.closest('#stage') && !e.target.closest('button,input,textarea,[contenteditable]');
  document.addEventListener('transitionrun', e => { if (locked && mine(e)) pending++; }, true);
  for (const t of ['transitionend', 'transitioncancel']) document.addEventListener(t, e => { if (locked && mine(e)) { pending = Math.max(0, pending - 1); unlockIfIdle(); } }, true);
  document.addEventListener('animationstart', e => { if (locked && mine(e) && !infinite(e.target)) pending++; }, true);
  for (const t of ['animationend', 'animationcancel']) document.addEventListener(t, e => { if (locked && mine(e) && !infinite(e.target)) { pending = Math.max(0, pending - 1); unlockIfIdle(); } }, true);
  const next = () => { if (locked) return; lock(); step < DEMO.slides[cur].max ? setStep(step + 1) : cur < DEMO.slides.length - 1 && show(cur + 1); };
  const prev = () => { if (locked) return; lock(); step > 0 ? setStep(step - 1) : cur > 0 && show(cur - 1, true); };

  DEMO.start = function () {
    const stage = $('#stage');
    DEMO.slides.forEach((s, i) => {
      s.root = el('section', { class: 'slide', 'data-id': s.id });
      s.root.innerHTML = s.html;
      s.root.querySelectorAll('[data-step]').forEach(e => e.classList.add('st'));
      stage.append(s.root);
      s.max = maxStep(s.root);
      s.api = { root: s.root, get step() { return step; }, go: n => setStep(n), reset: () => setStep(0) };
      $('#nav').append(el('button', { 'aria-label': 'Slide ' + (i + 1), onclick: () => show(i) }));
    });
    if (!DEMO.slides.length) return;
    stage.addEventListener('click', e => { if (!e.target.closest(IGNORE)) next(); });
    $('#next').onclick = next; $('#previous').onclick = prev;
    $('#fullscreen').onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {});
    addEventListener('keydown', e => {
      if (e.target.closest && e.target.closest('input,textarea,[contenteditable]')) return;
      if (['ArrowRight', ' ', 'Enter', 'ArrowDown'].includes(e.key)) { e.preventDefault(); next(); }
      else if (['ArrowLeft', 'Backspace', 'ArrowUp'].includes(e.key)) { e.preventDefault(); prev(); }
    });
    const fromHash = () => { const n = parseInt(location.hash.slice(1), 10); return n >= 1 ? n - 1 : 0; };
    const stepHash = () => parseInt(location.hash.split('.')[1], 10) || 0; // #3.2 = slide 3, step 2
    addEventListener('hashchange', () => { const i = fromHash(); if (i !== cur) show(i); });
    const st0 = stepHash();
    show(fromHash());
    if (st0) setStep(st0);
    window.focus();
  };
  window.DEMO = DEMO;
})();
