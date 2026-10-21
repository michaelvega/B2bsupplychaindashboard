(function () {
  var A = 'assets/b2/agents/', G = '#00b368';
  // wave 0 is the network from the previous slide; each later wave is added by an improvement
  var nodes = [
    { x: 70, y: 88, w: 0, s: '01_mint.png' }, { x: 70, y: 198, w: 0, s: '03_lavender.png' }, { x: 70, y: 308, w: 0, s: '05_blush.png' },
    { x: 250, y: 88, w: 0, c: 1 }, { x: 250, y: 198, w: 0, c: 1 }, { x: 250, y: 308, w: 0, c: 1 },
    { x: 420, y: 140, w: 0, s: '04_butter.png' }, { x: 420, y: 260, w: 0, s: '02_peach.png' },
    { x: 160, y: 34, w: 1 }, { x: 160, y: 362, w: 1 }, { x: 335, y: 42, w: 1 }, { x: 335, y: 356, w: 1 }, { x: 340, y: 200, w: 1 },
    { x: 515, y: 70, w: 1, s: '05_blush.png' }, { x: 515, y: 330, w: 1, s: '01_mint.png' },
    { x: 165, y: 142, w: 2 }, { x: 165, y: 256, w: 2 }, { x: 430, y: 34, w: 2 }, { x: 430, y: 366, w: 2 }, { x: 540, y: 200, w: 2, c: 1 },
    { x: 610, y: 128, w: 2 }, { x: 610, y: 272, w: 2 }, { x: 330, y: 120, w: 2 }, { x: 330, y: 282, w: 2 },
    { x: 80, y: 30, w: 3 }, { x: 80, y: 366, w: 3 }, { x: 250, y: 20, w: 3 }, { x: 250, y: 378, w: 3 }, { x: 600, y: 40, w: 3, s: '03_lavender.png' },
    { x: 600, y: 360, w: 3, s: '04_butter.png' }, { x: 470, y: 200, w: 3 }, { x: 420, y: 90, w: 3 }, { x: 420, y: 310, w: 3 }, { x: 40, y: 140, w: 3 }, { x: 40, y: 256, w: 3 }
  ];
  var svg = '<svg viewBox="0 0 640 400" role="img" aria-label="A network of agents and Procept cells that keeps adding connections over time">';
  var edges = '', pk = '', n = 0;
  for (var i = 0; i < nodes.length; i++) for (var j = i + 1; j < nodes.length; j++) {
    var a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y), w = Math.max(a.w, b.w);
    if (d < (w === 0 ? 215 : 150) && !(a.w === 0 && b.w === 0 && d > 215)) {
      edges += '<line class="e w' + w + '" x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '"/>';
      if (n++ % 9 === 0) pk += '<circle class="p w' + w + '" r="2.6"><animateMotion dur="' + (2.2 + (n % 5) * .5).toFixed(1) + 's" repeatCount="indefinite" path="M' + a.x + ' ' + a.y + ' L' + b.x + ' ' + b.y + '"/></circle>';
    }
  }
  svg += edges + pk;
  nodes.forEach(function (p) {
    if (p.s) svg += '<image class="nd w' + p.w + '" href="' + A + p.s + '" x="' + (p.x - 20) + '" y="' + (p.y - 20) + '" width="40" height="40" preserveAspectRatio="xMidYMid meet"/>';
    else if (p.c) svg += '<g class="nd w' + p.w + '"><circle cx="' + p.x + '" cy="' + p.y + '" r="15" fill="#0e0e0d" stroke="' + G + '" stroke-width="1.5"/><circle cx="' + p.x + '" cy="' + p.y + '" r="5" fill="' + G + '"/></g>';
    else svg += '<circle class="nd w' + p.w + '" cx="' + p.x + '" cy="' + p.y + '" r="5" fill="' + G + '"/>';
  });
  svg += '</svg>';
  var chart = '<svg viewBox="0 0 300 140" role="img" aria-label="An owned network grows in value over time, a rented API stays flat">' +
    '<line x1="10" y1="120" x2="290" y2="120" stroke="#8a8a86"/><line x1="10" y1="10" x2="10" y2="120" stroke="#8a8a86"/>' +
    '<path d="M10 100 L290 96" stroke="#8a8a86" stroke-width="2" stroke-dasharray="4 4" fill="none"/>' +
    '<path class="grow" d="M10 108 C90 106 150 92 200 62 S265 22 290 16" stroke="' + G + '" stroke-width="3" fill="none" pathLength="1"/>' +
    '<text x="290" y="90" fill="#9a9a96" font-size="11" text-anchor="end">Rented API calls</text>' +
    '<text x="196" y="26" fill="' + G + '" font-size="12" text-anchor="end">Value of the network the company owns</text>' +
    '<text x="290" y="136" fill="#9a9a96" font-size="10" text-anchor="end" letter-spacing="2">TIME</text>' +
    '</svg>';
  var css = '@import url(slides/b2-common.css);' +
    '.s12 .wrap{display:grid;grid-template-columns:1.3fr .7fr;gap:3vw;align-items:center}' +
    '.s12 svg{max-height:60vh}' +
    '.s12 .e{stroke:#00b368;stroke-opacity:.38;stroke-width:1.2}' +
    '.s12 .p{fill:#00b368}' +
    '.s12 .e,.s12 .p,.s12 .nd{transition:opacity .9s}' +
    '.s12 .w1,.s12 .w2,.s12 .w3{opacity:0}' +
    '.s12.on1 .w1,.s12.on2 .w2,.s12.on3 .w3{opacity:1}' +
    '.s12 .nd.w1,.s12 .nd.w2,.s12 .nd.w3{transition-delay:.3s}' +
    '.s12 .grow{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.6s ease .3s}.s12.on3 .grow{stroke-dashoffset:0}' +
    '.s12 .chart{opacity:0;transition:opacity .6s}.s12.on3 .chart{opacity:1}' +
    '.s12 .caps{display:grid}.s12 .cap{grid-area:1/1}' +
    '.s12.on2 .cap[data-step="1"],.s12.on3 .cap[data-step="2"],.s12.on4 .cap[data-step="3"]{opacity:0}' +
    '.s12 .big{font-size:clamp(24px,3vw,48px);line-height:1.1;letter-spacing:-.035em;color:#e8e8e4}' +
    '.s12 .brand{margin-top:3vh;font-size:12px;letter-spacing:.4em;text-transform:uppercase;color:#00b368}' +
    '@media(max-width:900px){.s12 .wrap{grid-template-columns:1fr}}';
  function set(root, k) {
    var r = root.querySelector('.s12');
    for (var i = 1; i <= 4; i++) r.classList.toggle('on' + i, i <= k);
  }
  DEMO.add({
    id: 'improve',
    title: 'A network the company owns',
    html: '<style>' + css + '</style><div class="b2 s12">' +
      '<div class="eyebrow">Now we keep improving</div>' +
      '<div class="wrap"><div>' + svg + '</div><div>' +
      '<div class="caps"><p class="cap" data-step="1">Every improvement we suggest adds an agent and new connections.</p>' +
      '<p class="cap" data-step="2">More workflows, more connections. The network gets denser with every request.</p>' +
      '<p class="cap" data-step="3">A rented API never compounds. This does.</p>' +
      '<div class="cap" data-step="4"><div class="big">System 5 is a <span class="g">network the company owns.</span> It grows in value over time.</div><div class="brand">Procept</div></div></div>' +
      '<div class="chart" style="margin-top:3vh">' + chart + '<div class="lbl" style="margin-top:6px">Illustrative</div></div></div></div></div>',
    init: function (root) { set(root, 0); },
    onStep: function (k, root) { set(root, k); }
  });
})();
