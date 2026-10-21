(function () {
  var A = 'assets/b2/agents/';
  var agents = [['01_mint.png', 70], ['03_lavender.png', 180], ['05_blush.png', 290]];
  var s = '<svg viewBox="0 -100 1000 520" role="img" aria-label="Procept package goes into the customer servers, then Procept cells run beside every API call">';
  s += '<rect x="20" y="20" width="670" height="380" fill="none" stroke="#8a8a86" stroke-dasharray="3 6"/>' +
       '<text x="34" y="44" fill="#b0b0ac" font-size="13" letter-spacing="3">THEIR SERVERS</text>';
  agents.forEach(function (a, i) {
    var y = a[1] + 30;
    s += '<image href="' + A + a[0] + '" x="44" y="' + a[1] + '" width="60" height="60" preserveAspectRatio="xMidYMid meet"/>';
    s += '<line class="flow f1" x1="130" y1="' + y + '" x2="690" y2="' + y + '" stroke="#8a8a86" stroke-width="1.5" stroke-dasharray="8 4"/>';
    s += '<path d="M684 ' + (y - 7) + ' L696 ' + y + ' L684 ' + (y + 7) + '" fill="none" stroke="#8a8a86" stroke-width="1.5"/>';
    if (i === 0) s += '<text x="160" y="' + (y - 10) + '" fill="#9a9a96" font-size="13" letter-spacing="2">API CALL</text>';
    s += '<g class="cell" style="--d:' + (i * .3) + 's">' +
      '<path class="flow f2" d="M130 ' + y + ' C160 ' + y + ' 160 ' + (y + 38) + ' 200 ' + (y + 38) + ' H690" fill="none" stroke="#00b368" stroke-width="1.5" stroke-dasharray="8 4"/>' +
      '<circle cx="420" cy="' + (y + 38) + '" r="19" fill="#0e0e0d" stroke="#00b368" stroke-width="1.5"/>' +
      '<circle cx="420" cy="' + (y + 38) + '" r="25" fill="none" stroke="#00b368" stroke-opacity=".35"/>' +
      '<circle cx="420" cy="' + (y + 38) + '" r="6" fill="#00b368"/></g>';
  });
  s += '<rect x="700" y="20" width="14" height="380" fill="#161615" stroke="#8a8a86"/>' +
       '<text x="730" y="48" fill="#e8e8e4" font-size="19">Outside</text><text x="730" y="72" fill="#9a9a96" font-size="14">what they pay for today</text>';
  s += '<g class="lab"><rect x="450" y="124" width="148" height="26" fill="#00b368"/><text x="464" y="142" fill="#06150d" font-size="12" letter-spacing="2.5">PROCEPT CELL</text></g>';
  s += '<g class="rails">' +
    '<line x1="760" y1="170" x2="980" y2="170" stroke="#8a8a86"/><circle cx="760" cy="170" r="4" fill="#8a8a86"/>' +
    '<text x="760" y="156" fill="#b0b0ac" font-size="14" letter-spacing="3">TODAY: API</text><text x="760" y="196" fill="#9a9a96" font-size="12">errors, speed, cost</text>' +
    '<line x1="760" y1="290" x2="980" y2="290" stroke="#00b368"/><circle cx="760" cy="290" r="4" fill="#00b368"/>' +
    '<text x="760" y="276" fill="#00b368" font-size="14" letter-spacing="3">PROCEPT</text><text x="760" y="316" fill="#9a9a96" font-size="12">errors, speed, cost</text></g>';
  s += '<g class="pkg"><rect x="0" y="0" width="190" height="66" fill="#00b368"/>' +
    '<text x="16" y="26" fill="#06150d" font-size="11" letter-spacing="3">PROCEPT</text><text x="16" y="52" fill="#06150d" font-size="22">System 5</text></g>';
  s += '</svg>';
  var rows = [
    { k: 'err', name: 'Error rate', p: '9.7%', n: '4.8%', pv: 9.7, sp: [9.7, 8.2, 6.9, 5.6, 4.8], dom: 10.5 },
    { k: 'lat', name: 'Speed (p90)', p: '40s', n: '20s', pv: 40, sp: [40, 34, 28, 23, 20], dom: 44 },
    { k: 'tok', name: 'Cost', p: '140k', n: '23k', pv: 140, sp: [140, 105, 70, 40, 23], dom: 150 }
  ];
  function spark(r) {
    var W = 150, H = 44, x = function (i) { return 6 + i * (W - 12) / 4; }, y = function (v) { return H - 6 - v / r.dom * (H - 12); };
    var pts = r.sp.map(function (v, i) { return x(i).toFixed(1) + ',' + y(v).toFixed(1); }).join(' ');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" style="max-height:none"><line x1="6" x2="' + (W - 6) + '" y1="' + y(r.pv).toFixed(1) + '" y2="' + y(r.pv).toFixed(1) + '" stroke="#ff5b52" stroke-dasharray="2 3"/>' +
      '<polyline class="sl" pathLength="1" points="' + pts + '" fill="none" stroke="#00b368" stroke-width="2"/></svg>';
  }
  var metrics = '<div class="hd lbl"><span></span><span>Today (API)</span><span class="g">Procept cell</span><span>5 rounds</span></div>';
  rows.forEach(function (r, i) {
    metrics += '<div class="mrow" style="--d:' + (i * .35) + 's"><div class="nm">' + r.name + '</div>' +
      '<div class="pv big">' + r.p + '</div>' +
      '<div class="pn big"><span class="o">' + r.p + '</span><span class="v">' + r.n + '</span></div>' +
      '<div class="sp">' + spark(r) + '</div></div>';
  });
  var css = '@import url(slides/b2-common.css);' +
    '.s08 svg{max-height:56vh}' +
    '.s08 .wrap{display:grid;grid-template-columns:1.3fr .7fr;gap:3vw;align-items:center}' +
    '.s08 .side h3{margin:0 0 3vh;font-weight:300;font-size:clamp(22px,2.6vw,42px);line-height:1.1;letter-spacing:-.035em}' +
    '.s08 .pkg{transform:translate(60px,-90px);opacity:0;transition:opacity .6s}' +
    '.s08.on1 .pkg{opacity:1}' +
    '.s08.on2 .pkg{transform:translate(325px,160px);opacity:0;transition:transform 1.1s cubic-bezier(.6,0,.2,1),opacity .5s 1.1s}' +
    '.s08 .cell,.s08 .lab,.s08 .rails{opacity:0;transition:opacity .6s}' +
    '.s08.on2 .cell{opacity:1;transition:opacity .7s calc(1.3s + var(--d))}' +
    '.s08.on2 .lab{opacity:1;transition:opacity .6s 2.4s}' +
    '.s08.on2 .rails{opacity:1}' +
    '.s08 .flow{animation:b2flow 1.2s linear infinite;animation-play-state:paused}' +
    '.s08 .f1,.s08.on2 .f2{animation-play-state:running}' +
    '.s08 .caps{display:grid}.s08 .cap,.s08 .metrics{grid-area:1/1}' +
    '.s08 .hd,.s08 .mrow{display:grid;grid-template-columns:1.1fr 1fr 1fr 1fr;gap:.8vw;align-items:center}' +
    '.s08 .hd{padding-bottom:.8vh;border-bottom:1px solid #8a8a86}.s08 .hd .g{color:#00b368}' +
    '.s08 .mrow{padding:1vh 0;border-bottom:1px solid #2a2a28}' +
    '.s08 .nm{font-size:clamp(13px,1.2vw,19px);letter-spacing:-.02em}' +
    '.s08 .big{font-size:clamp(20px,2.4vw,38px);letter-spacing:-.05em;line-height:1}' +
    '.s08 .pv{color:#ff5b52}' +
    '.s08 .pn{position:relative;color:#e8e8e4}.s08 .pn .o{color:#ff5b52;transition:opacity .5s calc(.2s + var(--d))}' +
    '.s08 .pn .v{position:absolute;left:0;top:0;color:#00b368;opacity:0;transform:translateY(10px);white-space:nowrap;transition:opacity .5s calc(.5s + var(--d)),transform .6s calc(.5s + var(--d))}' +
    '.s08.on3 .pn .o{opacity:0}.s08.on3 .pn .v{opacity:1;transform:none}' +
    '.s08 .sp svg{width:100%;height:auto;max-height:6vh}.s08 .sl{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1s ease calc(.3s + var(--d))}.s08.on3 .sl{stroke-dashoffset:0}' +
    '.s08 .metrics .note{margin:1.6vh 0 0}' +
    '.s08.on2 .cap[data-step=\"1\"],.s08.on3 .cap[data-step=\"2\"],.s08.on4 .metrics{opacity:0}' +
    '@media(max-width:900px){.s08 .wrap{grid-template-columns:1fr}}';
  function set(root, n) {
    var r = root.querySelector('.s08');
    for (var i = 1; i <= 4; i++) r.classList.toggle('on' + i, i <= n);
  }
  DEMO.add({
    id: 'inject',
    title: 'Deploy side by side',
    html: '<style>' + css + '</style><div class="b2 s08">' +
      '<div class="bar5"></div>' +
      '<h2 style="font-size:clamp(24px,3vw,50px);max-width:none">Step 3: We&rsquo;ve proved to them that they need to monitor problems in their systems. We put a small Procept model <span class="g">next to every API call</span> and compare the two.</h2>' +
      '<div class="wrap"><div>' + s + '</div><div class="side">' +
      '<h3>Same request, <span class="g">two paths.</span></h3>' +
      '<div class="caps"><p class="cap g" data-step="1">With their go-ahead, we place a Procept cell beside each API call their agents make today.</p>' +
      '<p class="cap" data-step="2">Each cell is a small model that runs on their servers and learns from their own data and goals. Both paths run live, so they see errors, speed and cost side by side.</p>' +
      '<div class="metrics" data-step="3">' + metrics + '<p class="cap g note">Their API keeps having the same problems. Our cells improve every round.</p></div>' +
      '<p class="cap g" data-step="4">If they want us to keep running evals and coordinating their models, <b>they need System 5 implemented.</b> It is what lets us act on what the evals find.</p></div></div></div></div>',
    init: function (root) { set(root, 0); },
    onStep: function (n, root) { set(root, n); }
  });
})();
