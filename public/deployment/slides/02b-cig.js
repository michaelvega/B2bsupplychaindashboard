DEMO.add({
  id: 'cig', title: 'In practice',
  html: `<style>
  [data-id=cig]{flex-direction:row;gap:5vw;align-items:center}
  [data-id=cig].active{display:flex}
  [data-id=cig] .side{flex:0 0 38%}
  [data-id=cig] .side h2{margin-bottom:28px}
  [data-id=cig] .side p{font-size:clamp(17px,1.8vw,26px);line-height:1.35;color:var(--soft);margin:0 0 18px;letter-spacing:-.02em}
  [data-id=cig] .shot{flex:1;min-width:0;display:flex;justify-content:center}
  [data-id=cig] .shot img{display:block;height:74vh;max-width:100%;object-fit:contain;border:1px solid var(--strong);background:var(--panel)}
  [data-id=cig] .more{display:inline-block;margin-top:22px;padding:12px 18px;border:1px solid var(--green);color:var(--ink);text-decoration:none;font-size:12px;letter-spacing:.16em;text-transform:uppercase}
  [data-id=cig] .more:hover{background:var(--green);color:#04140b}
  @media(max-width:900px){[data-id=cig]{flex-direction:column}[data-id=cig] .side{flex:none}[data-id=cig] .shot img{height:50vh}}
  </style>
  <div class="side">
    <div class="bar5"></div>
    <h2>This is what it looks like <span class="green">in practice.</span></h2>
    <p class="st" data-step="1">Every agent, every tool call, every data operation in their system, mapped from their own logs.</p>
    <p class="st" data-step="2">Green is healthy. Grey is where it fails. Names blurred for anonymity.</p>
    <a class="more" href="https://procept.tech/blog/cognitive-induction-graphs" target="_blank" rel="noopener">Understand the technology &rarr;</a>
  </div>
  <div class="shot"><img src="assets/cig-blurred.png" alt="Cognition graph of agents, tool calls and data operations, with names blurred"></div>`
});
