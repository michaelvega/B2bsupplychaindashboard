(function () {
  var tiles = [['1. Cost', '140k', '23k'], ['2. Latency', '40s', '20s'], ['3. Error', '9.7%', '4.8%']]
    .map(function (t, i) {
      return '<div class="tile" style="transition-delay:' + i * .25 + 's"><div class="lbl">' + t[0] + '</div>' +
        '<div class="num g">' + t[2] + '</div><div class="was">was <b>' + t[1] + '</b></div><div class="hit">Target hit</div></div>';
    }).join('');
  var rows = [
    ['Move a property to the next stage', 'Deals close faster', ''],
    ['Forecast sales, with sources', 'Revenue plans they can trust', 'Revenue and inventory plans they can trust'],
    ['Query the data directly', 'Fewer requests to the data team', '']
  ];
  var goals = rows.map(function (r, i) {
    var bn = r[2] ? '<span class="old">' + r[1] + '</span><span class="new">' + r[2] + '</span>' : r[1];
    return '<div class="gr' + (r[2] ? ' edited' : '') + '" style="--d:' + i * .2 + 's"><span class="mk"></span>' +
      '<span class="t" contenteditable="plaintext-only" spellcheck="false">' + r[0] + '</span>' +
      '<span class="t bn" contenteditable="plaintext-only" spellcheck="false">' + bn + '</span>' +
      '<span class="by">Edited by them</span><span class="ok">Achieved</span></div>';
  }).join('') +
    '<div class="gr added" style="--d:.6s"><span class="mk"></span>' +
    '<span class="t" contenteditable="plaintext-only" spellcheck="false">Never change my data unless I say so</span>' +
    '<span class="t bn" contenteditable="plaintext-only" spellcheck="false">Stay compliant</span>' +
    '<span class="by">Added by them</span><span class="ok">Achieved</span></div>';
  var css = '@import url(slides/b2-common.css);' +
    '.s11 h2{font-size:clamp(28px,3.6vw,60px);max-width:none}' +
    '.s11 .body{display:grid}.s11 .body>*{grid-area:1/1;align-self:center}' +
    '.s11 .tiles,.s11 .goals{opacity:0;pointer-events:none;transition:opacity .6s}' +
    '.s11.on1 .tiles{opacity:1}.s11.on2 .tiles{opacity:0}' +
    '.s11.on2 .goals{opacity:1;pointer-events:auto}' +
    '.s11 .tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:2vw}' +
    '.s11 .tile{border:1px solid #2a2a28;padding:3vh 2vw;transform:translateY(20px);transition:transform .7s}' +
    '.s11.on1 .tile{transform:none}' +
    '.s11 .num{font-size:clamp(56px,8vw,130px);letter-spacing:-.06em;line-height:1;margin:1.5vh 0}' +
    '.s11 .was{font-size:clamp(14px,1.4vw,22px);color:#9a9a96}.s11 .was b{font-weight:300;color:#ff5b52}' +
    '.s11 .hit{margin-top:1.5vh;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#00b368}' +
    '.s11 .gh,.s11 .gr{display:grid;grid-template-columns:1.4em 1.2fr 1fr 10em;gap:1.4vw;align-items:center}' +
    '.s11 .gh{padding-bottom:1vh;border-bottom:1px solid #8a8a86}' +
    '.s11 .gr{padding:1.8vh 0;border-bottom:1px solid #2a2a28;font-size:clamp(16px,1.7vw,27px);letter-spacing:-.02em;line-height:1.25}' +
    '.s11 .gr .t{outline:0;padding:2px 4px;border-bottom:1px dashed #4a4a47;cursor:text}' +
    '.s11 .gr .t:focus{background:#1e1e1c;border-bottom-color:#00b368}' +
    '.s11 .gr .t:first-of-type{color:#00b368}.s11 .gr .bn{color:#e8e8e4}' +
    '.s11 .mk{width:1em;height:1em;border:1px solid #8a8a86;border-radius:50%;transition:background .4s,border-color .4s}' +
    '.s11 .by,.s11 .ok{grid-column:4;grid-row:1;font-size:11px;letter-spacing:.18em;text-transform:uppercase;transition:opacity .5s}' +
    '.s11 .by{color:#e8e8e4;opacity:0}.s11 .ok{color:#00b368;opacity:0}' +
    '.s11 .new{display:none}.s11.on3 .edited .old{display:block;text-decoration:line-through;color:#6a6a66;font-size:.7em}' +
    '.s11.on3 .edited .new{display:inline}' +
    '.s11 .added{opacity:0;transform:translateY(10px);transition:opacity .5s,transform .5s}' +
    '.s11.on3 .added{opacity:1;transform:none}' +
    '.s11.on3 .edited .by,.s11.on3 .added .by{opacity:1}' +
    '.s11.on3 .edited,.s11.on3 .added{background:rgba(0,179,104,.06)}' +
    '.s11.on4 .edited .by,.s11.on4 .added .by{opacity:0}.s11.on4 .ok{opacity:1;transition-delay:var(--d)}' +
    '.s11.on4 .mk{background:#00b368;border-color:#00b368;transition-delay:var(--d)}' +
    '.s11 .hint{margin-top:1.4vh;font-size:clamp(12px,1vw,15px);color:#9a9a96}' +
    '.s11 .caps{display:grid}.s11 .cap{grid-area:1/1;font-size:clamp(20px,2.4vw,38px);color:#e8e8e4}' +
    '.s11.on2 .cap[data-step="1"],.s11.on3 .cap[data-step="2"],.s11.on4 .cap[data-step="3"]{opacity:0}';
  function set(root, n) {
    var r = root.querySelector('.s11');
    for (var i = 1; i <= 4; i++) r.classList.toggle('on' + i, i <= n);
  }
  DEMO.add({
    id: 'swap',
    title: 'Metrics and business goals',
    html: '<style>' + css + '</style><div class="b2 s11">' +
      '<div class="bar5" style="margin-bottom:0"></div>' +
      '<h2>Step 4: We hit their metrics, and <span class="g">they own the goals.</span></h2>' +
      '<div class="body"><div class="tiles">' + tiles + '</div>' +
      '<div class="goals" data-noadvance><div class="gh lbl"><span></span><span>User goal</span><span>Business goal</span><span></span></div>' + goals +
      '<div class="hint">Click any goal to edit it.</div></div></div>' +
      '<div class="caps"><p class="cap g" data-step="1">We hit the metrics they care about.</p>' +
      '<p class="cap" data-step="2">We give them the <span class="g">user and business goals</span> we found.</p>' +
      '<p class="cap" data-step="3">They edit them. <span class="g">We don&rsquo;t assume we know everything about their business.</span></p>' +
      '<p class="cap g" data-step="4">Then we prove every goal is met.</p></div>' +
      '<p class="foot">Illustrative: baseline is measured on the customer\'s staging logs (372 runs); Procept values are the study\'s planning targets, not yet measured live.</p></div>',
    init: function (root) { set(root, 0); },
    onStep: function (n, root) { set(root, n); }
  });
})();
