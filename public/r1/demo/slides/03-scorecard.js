(function () {
  var tiles = [['1. Cost', '140k', 'tokens spent per query.'], ['2. Latency', '40<small>s</small>', 'customers wait for an answer.'], ['3. Error', '9.7%', 'of customers see an error.']]
    .map(function (t, i) {
      return '<div class="tile" style="transition-delay:' + i * .25 + 's"><i>' + t[0] + '</i><b>' + t[1] + '</b><p>' + t[2] + '</p></div>';
    }).join('');
  var goals = [
    ['Property manager', 'Move a property to the next stage', 'Call the right tool, no 40s stall', 'Deals close faster'],
    ['Sales lead', 'Forecast sales, with sources', 'Show the data behind every number', 'Revenue plans they can trust'],
    ['Data analyst', 'Query the data directly', 'Find tables that exist, every time', 'Fewer requests to the data team']
  ].map(function (g, i) {
    return '<div class="goal" style="--d:' + i * .3 + 's"><div class="who">' + g[0] + '<span class="ex">Example</span></div>' +
      '<div class="k">User goal</div><div class="gt">' + g[1] + '</div><span class="tag">Not met today</span>' +
      '<div class="why"><div class="k">Solution</div><div class="v">' + g[2] + '</div>' +
      '<div class="k">Why we solve it</div><div class="v">' + g[3] + '</div></div></div>';
  }).join('');
  DEMO.add({
    id: 'scorecard', title: 'Scorecard',
    html: `<style>
  [data-id=scorecard] h2{max-width:none;font-size:clamp(26px,3.2vw,52px)}
  [data-id=scorecard] .bar5{margin-bottom:20px}
  [data-id=scorecard] .body{display:grid;margin-top:3vh}
  [data-id=scorecard] .body>*{grid-area:1/1;align-self:center}
  [data-id=scorecard] .tiles,[data-id=scorecard] .goals{display:grid;grid-template-columns:repeat(3,1fr);gap:2vw;opacity:0;pointer-events:none;transition:opacity .6s}
  [data-id=scorecard].on1 .tiles{opacity:1}[data-id=scorecard].on2 .tiles{opacity:0}
  [data-id=scorecard].on2 .goals{opacity:1}
  [data-id=scorecard] .tile,[data-id=scorecard] .goal{border:1px solid var(--strong);background:var(--panel);padding:3vh 2vw}
  [data-id=scorecard] .tile{transform:translateY(16px);transition:transform .6s}
  [data-id=scorecard].on1 .tile{transform:none}
  [data-id=scorecard] .tile i,[data-id=scorecard] .who{font-style:normal;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
  [data-id=scorecard] .tile b{display:block;font-weight:300;font-size:clamp(60px,8.5vw,140px);line-height:1;letter-spacing:-.07em;color:var(--bad);margin:1.5vh 0}
  [data-id=scorecard] .tile b small{font-size:.4em;letter-spacing:-.03em;color:var(--soft)}
  [data-id=scorecard] .tile p{font-size:clamp(16px,1.6vw,24px);line-height:1.35;color:var(--soft)}
  [data-id=scorecard] .goal{display:flex;flex-direction:column;gap:1.4vh;opacity:0;transform:translateY(16px);transition:opacity .5s var(--d),transform .5s var(--d),border-color .5s}
  [data-id=scorecard].on2 .goal{opacity:1;transform:none}
  [data-id=scorecard] .who{display:flex;justify-content:space-between}
  [data-id=scorecard] .ex{border:1px solid var(--strong);padding:2px 8px;font-size:10px;color:var(--soft)}
  [data-id=scorecard] .k{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-bottom:-.8vh}
  [data-id=scorecard] .goal{gap:1.2vh;padding:2.4vh 1.6vw}
  [data-id=scorecard] .gt{font-size:clamp(22px,2.3vw,36px);line-height:1.15;letter-spacing:-.03em;color:var(--green)}
  [data-id=scorecard] .why{display:flex;flex-direction:column;gap:1.2vh;border-top:1px solid var(--line);padding-top:1.6vh;opacity:0;transition:opacity .5s calc(.3s + var(--d))}
  [data-id=scorecard] .v{font-size:clamp(17px,1.7vw,26px);line-height:1.25;letter-spacing:-.02em;color:var(--ink)}
  [data-id=scorecard] .tag{align-self:flex-start;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--bad);border:1px solid var(--bad);padding:3px 8px;opacity:0;transition:opacity .5s var(--d)}
  [data-id=scorecard].on3 .goal{border-color:var(--bad)}[data-id=scorecard].on3 .why,[data-id=scorecard].on3 .tag{opacity:1}
  [data-id=scorecard] .caps{display:grid;margin-top:4vh}
  [data-id=scorecard] .caps>*{grid-area:1/1}
  [data-id=scorecard] .caps .sub{margin-top:1.2vh;font-size:clamp(15px,1.5vw,22px);letter-spacing:-.01em;color:var(--soft)}
  [data-id=scorecard] .caps>p,[data-id=scorecard] .caps>div>p:first-child{font-size:clamp(22px,2.6vw,40px);letter-spacing:-.04em}
  [data-id=scorecard].on2 .caps [data-step="1"],[data-id=scorecard].on3 .caps [data-step="2"]{opacity:0}
  [data-id=scorecard] .red{color:var(--bad)}
  [data-id=scorecard] .note{margin-top:3vh}
  @media(max-width:900px){[data-id=scorecard] .tiles,[data-id=scorecard] .goals{grid-template-columns:1fr}}
  </style>
  <div class="bar5"></div>
  <h2>Step 2: What we hand back, a scorecard of <span class="red">their problems.</span></h2>
  <div class="body"><div class="tiles">${tiles}</div><div class="goals">${goals}</div></div>
  <div class="caps">
    <p data-step="1">We track three metrics: <span class="green">cost, latency and error.</span></p>
    <p data-step="2">Then we find each user&rsquo;s <span class="green">goal.</span></p>
    <div data-step="3"><p>We show them what&rsquo;s <span class="red">not met</span>, how we solve it, and why it matters.</p>
      <p class="sub">These are examples. At every company we&rsquo;ve worked with so far, we found problems that made the product unusable.</p></div>
  </div>
  <p class="note">Measured on the customer&rsquo;s staging logs, 372 runs, 14-24 Sep.</p>`,
    onStep(n, root) { for (var i = 1; i <= 3; i++) root.classList.toggle('on' + i, i <= n); }
  });
})();
