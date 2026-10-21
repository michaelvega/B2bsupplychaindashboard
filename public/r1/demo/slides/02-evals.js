DEMO.add({
  id: 'evals', title: 'Evals package',
  html: `<style>
  [data-id=evals] .scene{position:relative;height:38vh;margin-top:2vh}
  [data-id=evals] .lede{margin-top:14px}
  [data-id=evals] .env{position:absolute;right:0;top:0;bottom:0;width:68%;border:1px solid var(--strong);background:var(--panel)}
  [data-id=evals] .env>b{position:absolute;left:18px;top:14px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
  [data-id=evals] .env svg{position:absolute;right:2%;top:8%;width:72%;height:86%}
  [data-id=evals] .env text{fill:var(--soft);font-size:11px}
  [data-id=evals] .eval{position:absolute;left:0;top:calc(50% - 70px);width:26%;min-width:190px;min-height:120px;border:1px solid var(--green);background:#0b1f16;padding:16px 18px;transition:left 1.2s cubic-bezier(.4,0,.2,1),width 1.2s cubic-bezier(.4,0,.2,1),box-shadow .8s,opacity .4s;z-index:2}
  [data-id=evals] .eval.in{left:33.5%;width:21%;min-width:170px;box-shadow:0 0 0 1px var(--green),0 0 36px rgba(0,179,104,.3)}
  [data-id=evals] .eval .s2{opacity:0;max-height:0;overflow:hidden;transition:opacity .6s .8s,max-height .6s .8s;color:var(--green)}
  [data-id=evals] .eval.in .s2{opacity:1;max-height:60px}
  [data-id=evals] .env path{transition:stroke-width .6s .9s,stroke .6s .9s}
  [data-id=evals] .scene.on path{stroke-width:2.6;stroke:#3dffa8}
  [data-id=evals] .eval b{display:block;color:var(--green);font-size:clamp(18px,1.8vw,26px);letter-spacing:-.03em}
  [data-id=evals] .eval span{font-size:13px;color:var(--soft);line-height:1.4;display:block;margin-top:6px}
  [data-id=evals] .cap{margin-top:3vh;font-size:clamp(20px,2.4vw,36px);letter-spacing:-.035em}
  </style>
  <div class="bar5"></div>
  <h2>Step 1: Our evals package, <span class="green">inside their system.</span></h2>
  <p class="lede st" data-step="1">We signed a contract, under NDA, to run <span class="green">agentic evaluations</span> for an enterprise interested in System 5.</p>
  <p class="lede st" data-step="2" style="color:var(--ink)">Companies know their agents aren&rsquo;t perfect. We find out where it fails, and turn their interest into a need for <span class="green">System 5</span> that is impossible to ignore.</p>
  <div class="scene">
    <div class="env"><b>Customer environment</b>
      <svg viewBox="0 0 520 300" preserveAspectRatio="xMidYMid meet">
        <g stroke="#00b368" stroke-width="1.4" fill="none">
          <path d="M260 60L120 150M260 60L400 150M120 150L200 240M400 150L320 240M200 240L320 240M120 150L400 150M260 60L260 150"/>
        </g>
        <g image-rendering="pixelated">
          <image href="assets/01_mint.png" x="230" y="26" width="60" height="65"/>
          <image href="assets/02_peach.png" x="92" y="122" width="56" height="56"/>
          <image href="assets/03_lavender.png" x="372" y="120" width="56" height="61"/>
          <image href="assets/04_butter.png" x="172" y="212" width="56" height="56"/>
          <image href="assets/05_blush.png" x="292" y="212" width="56" height="56"/>
        </g>
        <text x="260" y="108" text-anchor="middle" letter-spacing="2">AGENTS</text>
      </svg></div>
    <div class="eval st" data-step="3"><b>Procept evals package</b><span>Uses cheap, fast models.</span><span class="s2">Views their agent connections.</span></div>
  </div>
  <p class="cap st" data-step="5">Enterprises resist change and have to stay compliant. So the evals are <span class="green">read-only</span>: nothing leaves their system, and nothing in production changes.</p>`,
  onStep(n, root) {
    root.querySelector('.eval').classList.toggle('in', n >= 4);
    root.querySelector('.scene').classList.toggle('on', n >= 4);
  }
});
