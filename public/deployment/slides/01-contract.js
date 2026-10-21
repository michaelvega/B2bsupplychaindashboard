DEMO.add({
  id: 'contract', title: 'Contract',
  html: `<style>
  [data-id=contract]{padding-left:12vw}
  [data-id=contract] h1{font-size:clamp(48px,7.5vw,120px);letter-spacing:-.06em;white-space:nowrap}
  [data-id=contract] .intro{margin-top:4vh;max-width:1100px}
  [data-id=contract] .tag{font-size:clamp(22px,2.6vw,40px);letter-spacing:-.035em;color:var(--green);margin-bottom:3vh}
  [data-id=contract] .pt{font-size:clamp(17px,1.8vw,27px);line-height:1.35;letter-spacing:-.02em;color:var(--soft);border-left:2px solid var(--line);padding:.4vh 0 .4vh 1.4vw;margin-bottom:2vh;opacity:0;transform:translateY(10px);transition:opacity .5s var(--d),transform .5s var(--d)}
  [data-id=contract] .intro.on .pt{opacity:1;transform:none}
  [data-id=contract] .pt b{font-weight:400;color:var(--ink)}
  </style>
  <h1>Procept <span class="green">demo</span></h1>
  <div class="rule"></div>
  <div class="intro st" data-step="1">
    <p class="tag">The operating system for 24/7 agent harnesses.</p>
    <p class="pt" style="--d:.3s"><b>Small models.</b> We replace the frontier API calls inside a company&rsquo;s agents with small, self-hosted models.</p>
    <p class="pt" style="--d:.6s"><b>One web.</b> Each model gets the context of the entire business, so they self-improve together toward goals the business sets in plain English.</p>
    <p class="pt" style="--d:.9s"><b>The whole stack.</b> From GPUs to self-improvement to governance. Agents that are cheaper, more reliable, and theirs.</p>
  </div>`
});
