'use strict';
const sprites=['01_mint','02_peach','03_lavender','04_butter','05_blush'];
const sprite=(i,x,y,size=58)=>`<image class="sprite" href="agents/${sprites[i%5]}.png" x="${x-size/2}" y="${y-size/2}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`;
// ---- Agent Orchestration Today: a dense, tangled chain of API-linked LLM agents between a database and its customers ----
const BRM={nodes:[],edges:[],blobs:[],arrows:[],frazz:[],origin:16,anchors:{},ends:{}};
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function blobPath(cx,cy,R,rnd){
 const n=7,p=[];
 for(let k=0;k<n;k++){const a=(k+rnd()*.3)/n*Math.PI*2,r=R*(.82+rnd()*.2);p.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}
 const f=v=>v.toFixed(1);let d=`M${f(p[0][0])} ${f(p[0][1])}`;
 for(let k=0;k<n;k++){const a=p[(k+n-1)%n],b=p[k],c=p[(k+1)%n],e=p[(k+2)%n];
  d+=`C${f(b[0]+(c[0]-a[0])/6)} ${f(b[1]+(c[1]-a[1])/6)} ${f(c[0]-(e[0]-b[0])/6)} ${f(c[1]-(e[1]-b[1])/6)} ${f(c[0])} ${f(c[1])}`}
 return d+'Z';
}
// A broken connection: jagged wire, a gap in the middle, flickering sparks.
function frazzle(p,from,to,k,rnd){
 const dx=to[0]-from[0],dy=to[1]-from[1],len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
 const pt=(t,o)=>[from[0]+dx*t+nx*o,from[1]+dy*t+ny*o],f=v=>v.toFixed(1);
 const seg=(a,b,n)=>{let d='';for(let i=0;i<=n;i++){const [x,y]=pt(a+(b-a)*i/n,i===0||i===n?0:(i%2?1:-1)*(4+rnd()*8));d+=(i?'L':'M')+f(x)+' '+f(y)}return d};
 let sp='';for(const t of [.44,.6]){const [x,y]=pt(t,0);for(let s=0;s<4;s++){const a=rnd()*Math.PI*2,r1=3,r2=7+rnd()*6;sp+=`M${f(x+Math.cos(a)*r1)} ${f(y+Math.sin(a)*r1)}L${f(x+Math.cos(a)*r2)} ${f(y+Math.sin(a)*r2)}`}}
 return `<g class="frazz" id="${p}frz-${k}"><path class="frazz-line" d="${seg(0,.44,5)}"/><path class="frazz-line" d="${seg(.6,1,6)}"/><path class="frazz-spark" d="${sp}"/></g>`;
}
function bridge(p='',opt={}){
 const COLS=11,ROWS=4,id=(r,c)=>r*COLS+c,rn=rng(77),pts=[];
 for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)pts.push([200+c*78.5+(rn()-.5)*26,212+r*62-Math.sin(c/(COLS-1)*Math.PI)*58+(rn()-.5)*26]);
 // anchors the structure hangs from: database (left), customers + ROI (right)
 const anchors={db1:[134,326],db2:[134,360],db3:[134,394],cust1:[1040,230],cust2:[1040,258],roi1:[1044,352],roi2:[1044,392]};
 const edges=[],seen=new Set(),add=(a,b)=>{const k=a<b?a+'-'+b:b+'-'+a;if(a!==b&&!seen.has(k)){seen.add(k);edges.push([a,b])}};
 for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
  if(c<COLS-1)add(id(r,c),id(r,c+1));
  if(r<ROWS-1)add(id(r,c),id(r+1,c));
  if(r<ROWS-1&&c<COLS-1){if(rn()<.9)add(id(r,c),id(r+1,c+1));if(rn()<.9)add(id(r+1,c),id(r,c+1))}
 }
 for(let k=0;k<16;k++){const r=Math.floor(rn()*ROWS),c=Math.floor(rn()*(COLS-2)),r2=Math.max(0,Math.min(ROWS-1,r+Math.round(rn()*2-1)));add(id(r,c),id(r2,c+2))}
 for(let k=0;k<6;k++){const r=Math.floor(rn()*(ROWS-2)),c=Math.floor(rn()*COLS);add(id(r,c),id(r+2,c))}
 [[id(1,0),'db1'],[id(2,0),'db2'],[id(3,0),'db3'],[id(0,COLS-1),'cust1'],[id(1,COLS-1),'cust2'],[id(2,COLS-1),'roi1'],[id(3,COLS-1),'roi2']].forEach(e=>edges.push(e));
 BRM.nodes=pts;BRM.edges=edges;BRM.anchors=anchors;BRM.origin=id(1,5);
 BRM.ends={db:[140,360],cust:[1040,244],roi:[1042,372],layers:[108,170],tools:[1062,128]};
 // agents, scattered through every layer of the tangle
 const blobAt=[[2,0],[0,1],[3,1],[1,2],[2,3],[0,4],[3,4],[1,5],[3,6],[0,7],[2,7],[1,8],[3,9],[0,10]];
 const logoOrder=[0,2,1,1,0,2,2,0,1,2,0,1,2,0],LOGOS=[ASSETS.openai,ASSETS.gemini,ASSETS.claude],names=['OpenAI','Gemini','Claude'];
 const rnd=rng(2024);let defs='',blobs='';
 blobAt.forEach(([r,c],j)=>{
  const [x,y]=pts[id(r,c)],R=27,cx=x+(rnd()-.5)*10,cy=y-12+(rnd()-.5)*8,d=blobPath(cx,cy,R,rnd),slope=(rnd()-.5)*.5;
  const crack=[0,7,-6,8,-5,6,0].map((o,k)=>{const yy=cy-R-6+k*(2*R+12)/6;return[cx+o+(yy-cy)*slope,yy]});
  const poly=side=>[[cx+side*(R+10),cy-R-6],...crack,[cx+side*(R+10),cy+R+6]].map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' ');
  defs+=`<clipPath id="${p}bc${j}"><path d="${d}"/></clipPath><clipPath id="${p}hl${j}"><polygon points="${poly(-1)}"/></clipPath><clipPath id="${p}hr${j}"><polygon points="${poly(1)}"/></clipPath>`;
  const s=R*1.9,art=`<g clip-path="url(#${p}bc${j})"><image href="${LOGOS[logoOrder[j]]}" x="${cx-s/2}" y="${cy-s/2}" width="${s}" height="${s}"/></g><path d="${d}" fill="none" stroke="#8a8a86" stroke-width="1.5"/>`;
  blobs+=`<g class="blob" id="${p}blob-${j}" role="img" aria-label="${names[logoOrder[j]]} agent"><g class="half" id="${p}blob-${j}-l" clip-path="url(#${p}hl${j})">${art}</g><g class="half" id="${p}blob-${j}-r" clip-path="url(#${p}hr${j})">${art}</g><g class="whole" id="${p}blob-${j}-w">${art}</g></g>`;
  BRM.blobs[j]={node:id(r,c),cx,cy,R};
 });
 // arrows = API calls between agents / to the database / to customers
 const arrow=(from,to,lift,label,k)=>{
  const [ax,ay,ar]=from,[bx,by,br]=to,mx=(ax+bx)/2,my=(ay+by)/2-lift,f=v=>v.toFixed(1);
  const u=(px,py,qx,qy)=>{const l=Math.hypot(qx-px,qy-py)||1;return[(qx-px)/l,(qy-py)/l]};
  const [sx,sy]=u(ax,ay,mx,my),[ex,ey]=u(bx,by,mx,my),x1=ax+sx*(ar+5),y1=ay+sy*(ar+5),x2=bx+ex*(br+9),y2=by+ey*(br+9);
  const px=.25*x1+.5*mx+.25*x2,py=.25*y1+.5*my+.25*y2;
  return `<g class="api" id="${p}api-${k}"><path class="api-arrow" d="M${f(x1)} ${f(y1)}Q${f(mx)} ${f(my)} ${f(x2)} ${f(y2)}" marker-end="url(#${p}api-head)"/>${label?`<text class="api-label" x="${f(px+label[0])}" y="${f(py+label[1])}" text-anchor="${label[2]}">API CALL</text>`:''}</g>`;
 };
 const B=j=>[BRM.blobs[j].cx,BRM.blobs[j].cy,BRM.blobs[j].R];
 const arrowDefs=[[[126,330,0],B(0),34,[-12,0,'end'],[0]],[B(2),B(4),70,null,[2,4]],[B(5),B(7),70,[0,-9,'middle'],[5,7]],[B(9),B(11),70,null,[9,11]],[B(12),[1044,246,0],54,[0,-9,'middle'],[12]]];
 const arrows=arrowDefs.map(([f,t,l,lab,ends],k)=>{BRM.arrows[k]=ends;return arrow(f,t,l,lab,k)}).join('');
 const P=v=>typeof v==='number'?pts[v]:anchors[v];
 const strands=edges.map(([a,b],k)=>{const [x,y]=P(a),[xx,yy]=P(b),o=k%2?3:-3;
  return `<g class="edge" id="${p}edge-${k}"><g class="fall"><path class="bridge-strand" d="M${x.toFixed(1)} ${y.toFixed(1)}L${xx.toFixed(1)} ${yy.toFixed(1)}"/><path class="bridge-strand fine" d="M${(x+o).toFixed(1)} ${(y-o).toFixed(1)}L${(xx+o).toFixed(1)} ${(yy-o).toFixed(1)}"/></g></g>`}).join('');
 const joints=pts.map(([x,y],i)=>`<g class="joint" id="${p}joint-${i}"><g transform="rotate(${i%2?8:-9} ${x.toFixed(1)} ${y.toFixed(1)})"><rect class="marshmallow" x="${(x-10).toFixed(1)}" y="${(y-8).toFixed(1)}" width="20" height="16" rx="3.5"/><path d="M${(x-6).toFixed(1)} ${(y+4).toFixed(1)}h12" stroke="#b0b0ac"/></g></g>`).join('');
 // the two extra pieces of the stack, each wired in by a connection that is already failing
 const fr=rng(5);BRM.frazz=[{node:id(0,0)},{node:id(0,COLS-1)}];
 const frazz=frazzle(p,[112,164],pts[id(0,0)],0,fr)+frazzle(p,[1060,134],pts[id(0,COLS-1)],1,fr);
 const lab=(t,x,y)=>`<text class="col-head" x="${x}" y="${y}" text-anchor="middle">${t}</text>`;
 const icon=(href,x,y,w,h,label,lx,ly,label2)=>`<image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}"/>${lab(label,lx,ly)}${label2?lab(label2,lx,ly+14):''}`;
 const head=opt.interactive===false?`<svg class="scene" viewBox="0 70 1180 430" role="img" aria-label="${opt.label||''}">`:`<svg class="scene bridge-trigger" viewBox="0 70 1180 430" role="button" tabindex="0" aria-label="Break the agent chain">`;
 return head+`<defs>${defs}<marker id="${p}api-head" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 .5L7.5 4L0 7.5z" fill="#00b368"/></marker></defs>`+
  icon(ASSETS.database,21,297,110,125,'DATABASE',76,442)+
  icon(ASSETS.customers,1045,187,102,86,'CUSTOMERS',1096,292)+
  icon(ASSETS.roi,1047,327,96,89,'RETURN ON',1095,436,'INVESTMENT')+
  icon(ASSETS.layers,40,112,68,68,'FRAMEWORKS',74,198)+
  icon(ASSETS.tools,1062,76,62,62,'TOOLS',1093,154)+
  `<g class="bridge-assembly">${strands}${joints}${frazz}${blobs}${arrows}</g>`+(opt.extra?opt.extra(BRM):'')+'</svg>';
}
// ---- Self-healing slide scene: web of Procept cells + flagged problems + fix bridges ----
function healExtra(m){
 const f=v=>v.toFixed(1),E=m.ends,cells=m.blobs.map(b=>[b.cx,b.cy]);
 const ob=m.blobs.findIndex(b=>b.node===m.origin),dOb=j=>Math.hypot(cells[j][0]-cells[ob][0],cells[j][1]-cells[ob][1]);
 m.healOrder=cells.map((_,j)=>j).sort((a,b)=>dOb(a)-dOb(b));
 const rank=Object.fromEntries(m.healOrder.map((j,r)=>[j,r]));m.rank=rank;
 const pos=v=>typeof v==='number'?cells[v]:E[v],dist=(a,b)=>Math.hypot(pos(a)[0]-pos(b)[0],pos(a)[1]-pos(b)[1]);
 const seen=new Set(),pairs=[],add=(a,b)=>{const k=[String(a),String(b)].sort().join('|');if(!seen.has(k)){seen.add(k);pairs.push([a,b])}};
 cells.forEach((_,i)=>cells.map((_,j)=>j).filter(j=>j!==i).sort((a,b)=>dist(i,a)-dist(i,b)).slice(0,4).forEach(j=>add(i,j)));
 Object.keys(E).forEach(k=>cells.map((_,j)=>j).sort((a,b)=>dist(k,a)-dist(k,b)).slice(0,k==='db'||k==='cust'||k==='roi'?2:1).forEach(j=>add(k,j)));
 m.web=pairs.map(([a,b],k)=>{
  let from=a,to=b;if(typeof a!=='number'){from=b;to=a}else if(typeof b==='number'&&rank[b]<rank[a]){from=b;to=a}
  const P=pos(from),Q=pos(to),len=Math.hypot(Q[0]-P[0],Q[1]-P[1]),nx=-(Q[1]-P[1])/len,ny=(Q[0]-P[0])/len,bow=len*.16*(k%2?1:-1);
  const mx=(P[0]+Q[0])/2+nx*bow,my=(P[1]+Q[1])/2+ny*bow;
  const trim=(p,v)=>{if(typeof v!=='number')return p;const l=Math.hypot(mx-p[0],my-p[1])||1,r=m.blobs[v].R+4;return[p[0]+(mx-p[0])/l*r,p[1]+(my-p[1])/l*r]};
  const S=trim(P,from),T=trim(Q,to);
  return{k,from,to,cells:[from,to].filter(v=>typeof v==='number'),len,d:`M${f(S[0])} ${f(S[1])}Q${f(mx)} ${f(my)} ${f(T[0])} ${f(T[1])}`,mid:[.25*S[0]+.5*mx+.25*T[0],.25*S[1]+.5*my+.25*T[1]]};
 });
 // three problems the system flags: a slow link mid-network, the database link, the ROI link
 const cc=m.web.filter(e=>e.cells.length===2&&e.len>80).sort((a,b)=>Math.abs(a.mid[0]-590)-Math.abs(b.mid[0]-590))[0];
 m.probIdx=[cc.k,m.web.find(e=>e.to==='db'||e.from==='db').k,m.web.find(e=>e.to==='roi'||e.from==='roi').k];
 // each accepted fix is a new line that bridges over a run of agents
 const R=27,bridgeOf=(S,c1,c2,T)=>({d:`M${f(S[0])} ${f(S[1])}C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(T[0])} ${f(T[1])}`,mid:[(S[0]+3*c1[0]+3*c2[0]+T[0])/8,(S[1]+3*c1[1]+3*c2[1]+T[1])/8]});
 const near=(x,pick)=>cells.map((_,j)=>j).sort((a,b)=>Math.abs(cells[a][0]-x)-Math.abs(cells[b][0]-x)||pick*(cells[b][1]-cells[a][1]))[0];
 const topY=Math.min(...cells.map(c=>c[1]))-R-46,botY=Math.max(...cells.map(c=>c[1]))+R+46;
 const a0=cc.cells[0],xa=cells[a0][0],b0=near(xa<590?xa+320:xa-320,1),xb=cells[b0][0];
 const S0=[xa,cells[a0][1]-R-3],T0=[xb,cells[b0][1]-R-3];
 const b1=near(470,-1),S1=[142,404],T1=[cells[b1][0],cells[b1][1]+R+3];
 const b2=near(720,-1),S2=[1040,404],T2=[cells[b2][0],cells[b2][1]+R+3];
 m.fix=[bridgeOf(S0,[xa+(xb-xa)*.1,topY-24],[xb-(xb-xa)*.1,topY-24],T0),
  bridgeOf(S1,[S1[0]+30,botY+34],[T1[0]-90,botY+34],T1),
  bridgeOf(S2,[S2[0]-30,botY+34],[T2[0]+90,botY+34],T2)];
 const web=m.web.map(e=>`<path class="web-edge" id="h-web-${e.k}" d="${e.d}" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1"/>`).join('');
 const packets=m.web.filter(e=>e.k%3===0&&!m.probIdx.includes(e.k)).map(e=>`<circle class="web-packet" r="2.4"><animateMotion dur="${(2.4+e.k*.13).toFixed(2)}s" repeatCount="indefinite" path="${e.d}"/></circle>`).join('');
 const tags=['TTL CACHE','POOL','REGISTRY'],probs=['950 ms avg','4 drops','no registry'];
 const prob=m.probIdx.map((k,i)=>{const [x,y]=m.web[k].mid,[cx,cy]=m.fix[i].mid;
  return `<path class="prob-edge" id="h-prob-${i}" d="${m.web[k].d}" style="opacity:0"/><text class="prob-label" id="h-probl-${i}" x="${f(x)}" y="${f(y-12)}" text-anchor="middle" style="opacity:0">${probs[i]}</text>`+
   `<path class="fix-bridge" id="h-fixb-${i}" d="${m.fix[i].d}" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1"/><g class="fix-chip" id="h-fixc-${i}" style="opacity:0"><rect x="${f(cx-44)}" y="${f(cy-11)}" width="88" height="22" rx="2"/><text x="${f(cx)}" y="${f(cy+4)}" text-anchor="middle">${tags[i]}</text></g>`}).join('');
 const cellsSvg=m.blobs.map((b,j)=>`<g class="cell" id="h-cell-${j}" style="opacity:0"><g class="agent-float" style="--i:${j}">${sprite(j,b.cx,b.cy,56)}</g></g>`).join('');
 const o=m.blobs[ob],inc=[[-250,-60,0],[250,-70,1],[40,-95,4]].map(([,,s],n)=>`<g class="inc" id="h-inc-${n}" style="opacity:0">${sprite(s,o.cx,o.cy,44)}</g>`).join('');
 return `${web}${prob}<g id="h-packets" style="opacity:0">${packets}</g>${cellsSvg}${inc}`;
}
function swapScene(){
 const names=['TTL cache','Pool','Registry'];
 return `<div class="swap-stage"><div class="graph-wrap swap-wrap">${bridge('h-',{interactive:false,extra:healExtra,label:'Every frontier API call is replaced by a Procept cell. A terminal interviews the enterprise and waits for its goal, then the green web grows over the network and problems are flagged with fixes.'})}</div><div class="deploy-row"><div class="deploy-text"><p class="deploy-a" style="opacity:0">Swap out your API call for a Procept cell, integrate Procept with your coding agent of choice.</p><p class="deploy-b" style="opacity:0;display:none">System 5 begins by interviewing your company to learn what your business and customers actually need.</p><p class="deploy-c" style="opacity:0;display:none">Then it deploys private, self-hosted agents that work toward those goals, recover from each other’s failures, and improve continuously. Governance sandboxes and automatic evaluation are built in.</p></div><aside class="terminal" inert><div class="term-bar">system5 · deployment</div><div class="term-scroll"><div class="term-lines"></div></div><div class="term-input"><span class="term-prompt">&gt;</span><input class="goal-input" type="text" aria-label="Type your goal" placeholder="your goal…" spellcheck="false" autocomplete="off"></div></aside></div><svg class="connectors" aria-hidden="true"></svg><div class="fake-cursor" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M5.5 3.2 L5.5 17.5 L9.4 12.4 L12.6 15.3 L14.6 14.2 L11.5 11.4 L17.3 10.4 Z" fill="#e8e8e4" stroke="#0e0e0d" stroke-width="1"/></svg></div></div><aside class="fix-panel" inert><div class="fix-title">Problems &amp; fixes</div>${['GeoData latency','Postgres drops','MLflow missing'].map((text,i)=>`<div class="fix-item"><p>${text}</p><button data-accept="${i}" aria-label="Accept ${names[i]} fix">+ ${names[i]}</button></div>`).join('')}</aside>`;
}
// ---- Slide 2: exponential costs of renting frontier models ----
function costScene(){
 const logos=[['openai','OpenAI'],['gemini','Gemini'],['claude','Claude']];
 const L=logos.map(([k,name],i)=>{const x=190+i*165,y=112;return `<g class="cost-logo"><rect x="${x-55}" y="${y-55}" width="110" height="110" rx="12" fill="#161615" stroke="#2a2a28"/><image href="${ASSETS[k]}" x="${x-38}" y="${y-38}" width="76" height="76"/><text class="col-head" x="${x}" y="${y+72}" text-anchor="middle">${name.toUpperCase()}</text></g>`}).join('');
 const packets=logos.map((_,i)=>{const x=190+i*165;return [2.3,2.9,3.5,4.2].map(d=>`<rect class="cost-packet" x="-4" y="-3" width="8" height="6" style="opacity:0"><animateMotion begin="indefinite" dur="${d}s" repeatCount="indefinite" path="M83 250 C 60 215, ${x-70} 235, ${x} 172"/></rect>`).join('')}).join('');
 const curve=[];for(let k=0;k<=24;k++){const t=k/24,x=620+920*t,y=330-235*t*t*t;curve.push(`${k?'L':'M'}${x.toFixed(1)} ${y.toFixed(1)}`)}
 const vals=['$1K','$2K','$4K','$8K','$16K','$32K','$64K','$128K','$256K','$512K'],ts=[.04,.12,.2,.29,.38,.48,.58,.69,.8,.92];
 const labels=vals.map((v,i)=>{const t=ts[i],x=620+920*t,y=330-235*t*t*t;return `<text class="cost-label" x="${x.toFixed(1)}" y="${(y-14).toFixed(1)}" text-anchor="middle" style="opacity:0">${v}</text>`}).join('');
 return `<svg class="scene cost-scene" viewBox="0 0 1560 380" role="img" aria-label="Frontier model APIs consume an enterprise's data, prompts, workflows and corrections while costs rise exponentially."><text class="col-head" x="355" y="40" text-anchor="middle">FRONTIER MODELS</text>${L}<image href="${ASSETS.database}" x="45" y="240" width="76" height="88"/><text class="col-head" x="83" y="352" text-anchor="middle">ENTERPRISE</text><text class="task" x="83" y="366" text-anchor="middle">DATA · PROMPTS · WORKFLOWS · CORRECTIONS</text>${packets}<path class="cost-curve" d="${curve.join('')}" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1" opacity="0"/><text class="col-head" x="1540" y="352" text-anchor="end">COSTS</text>${labels}</svg>`;
}
// ---- Slide 3 transformation: the fallen infrastructure becomes a web of Christmas lights,
// one bad bulb at the broken agent, its connections red with an error ----
function lightsSvg(){
 const m=BRM,nodes=m.nodes,badNode=m.origin;
 const COLS=['#ffd9a0','#ff8a7a','#8fd3ff','#b9f07a','#ffb3e6'];
 const badEdges=new Set();m.edges.forEach(([a,b],k)=>{if(a===badNode||b===badNode)badEdges.add(k)});
 const P=v=>typeof v==='number'?nodes[v]:m.anchors[v];
 // wires bow and cross like the tangle they came from
 const wires=m.edges.map(([a,b],k)=>{if(badEdges.has(k))return '';const [x,y]=P(a),[xx,yy]=P(b);
  const mx=(x+xx)/2,my=(y+yy)/2,bow=(k*37%40)-20;
  return `<path class="light-wire" d="M${x.toFixed(1)} ${y.toFixed(1)}Q${mx.toFixed(1)} ${(my+bow).toFixed(1)} ${xx.toFixed(1)} ${yy.toFixed(1)}" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1"/>`}).join('');
 const bulbs=nodes.map(([x,y],i)=>`<g class="light${i===badNode?' bad':''}"><circle class="light-glow" cx="${x}" cy="${y}" r="${i===badNode?22:13}" fill="${COLS[i%5]}"/><circle class="light-bulb" cx="${x}" cy="${y}" r="${i===badNode?11:7}" fill="${i===badNode?'#4a4a43':COLS[i%5]}"/></g>`).join('');
 const [bx,by]=nodes[badNode];
 const errs=m.edges.filter(([a,b])=>a===badNode||b===badNode).map(([a,b])=>{const [ex,ey]=P(a===badNode?b:a),dx=ex-bx,dy=ey-by,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;let d='';
  for(let s=0;s<=6;s++){const t=s/6,off=s===0||s===6?0:(s%2?1:-1)*2.5;d+=(s?'L':'M')+((bx+dx*t+nx*off).toFixed(1))+' '+((by+dy*t+ny*off).toFixed(1))}
  return `<path class="err-line" d="${d}" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1;opacity:0"/>`}).join('');
 return `<g class="lights">${wires}${bulbs}<g class="light-error" style="opacity:0"><circle class="err-ring" cx="${bx}" cy="${by}" r="17" fill="none"/><text class="err-tag" x="${bx}" y="${by-30}" text-anchor="middle">ERROR</text>${errs}</g></g>`;
}
const slides=[
 ['hero',`<p class="intro">Procept’s</p><h1>System <span class="green">5</span></h1><div class="hero-rule"></div><p class="tagline">Turning AI into enterprise property.</p>`],
 ['costs',`<h2><span class="cost-a" style="opacity:0">Today, enterprises pay exponentially rising costs</span><span class="cost-b" style="opacity:0">for their data, prompts, workflows and corrections to be used to train frontier models that they don’t own.</span></h2>${costScene()}<p class="statement" style="opacity:0">Almost none of them are building anything of their own, and their systems are no smarter than they were last year.</p>`],
 ['visual bridge-slide',`<h2>Multi-agent infrastructure today is brittle and impossible to fix.</h2>${bridge('',{interactive:false,label:'A dense chain of API-linked LLM agents between a database and its customers.'})}<p class="statement below-a" style="opacity:0">When one agent breaks or one connection drops, the whole system goes down.</p><p class="statement below-b" style="opacity:0;display:none">Finding the failure is like searching for one bad bulb in a string of Christmas lights while blindfolded.</p><p class="stat-line" style="opacity:0">Because enterprise agents today can’t work together, <span class="stat">87%</span> of multi-agent enterprise deployments fail.</p>`],
 ['statement-slide',`<h1>Enterprises need more than smart, private agents.</h1><h1 class="subtitle">They need a system of agents that <span class="green">owns outcomes</span>, learns from real operations, and improves as one.</h1>`],
 ['visual swap-heal',`<h2 style="opacity:0">System 5: Deployment</h2>${swapScene()}`],
 ['hero closer',`<h1>System 5 isn’t a service enterprises rent.</h1><div class="hero-rule"></div><p class="tagline">It turns AI into a network the company owns, trained on their data. System 5 intelligence stays completely in house, and becomes a system that learns every second, and increases in value every day.</p>`]
];
const stage=document.querySelector('#stage');
stage.innerHTML=slides.map(([cls,html],i)=>`<section class="slide ${cls}" id="slide-${i}" role="group" aria-label="Slide ${i+1} of ${slides.length}" aria-hidden="true" inert>${html}</section>`).join('');
const sections=[...stage.children],nav=document.querySelector('#nav');
const BRIDGE=sections.findIndex(s=>s.classList.contains('bridge-slide')),SWAP=sections.findIndex(s=>s.classList.contains('swap-heal')),COSTS=sections.findIndex(s=>s.classList.contains('costs'));
// Scenes stay hidden from the moment the page builds, so the text always lands first.
sections[BRIDGE].querySelector('svg.scene').style.opacity='0';
sections[COSTS].querySelector('.cost-scene').style.opacity='0';
sections[SWAP].querySelector('svg.scene').style.opacity='0';
nav.innerHTML=slides.map((_,i)=>`<button aria-label="Go to slide ${i+1}" data-slide="${i}" aria-current="false"></button>`).join('');
let current=-1, position=0, transitioning=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function render(){const nearest=Math.round(position);
 sections.forEach((section,i)=>{const distance=i-position;const visible=Math.abs(distance)<.72;section.classList.toggle('active',visible);const opacity=Math.max(0,Math.min(1,(.72-Math.abs(distance))/.36));section.style.opacity=reduced.matches?(nearest===i?1:0):opacity;section.style.transform=reduced.matches?'none':`translateY(${distance*80}px)`;section.inert=i!==nearest;section.setAttribute('aria-hidden',String(i!==nearest));});
 if(current!==nearest){current=nearest;document.querySelector('#counter').textContent=`${String(current).padStart(2,'0')} / ${slides.length-1}`;[...nav.children].forEach((b,i)=>b.setAttribute('aria-current',String(i===current)));document.querySelector('#previous').disabled=current===0;document.querySelector('#next').disabled=current===slides.length-1;}
 document.querySelector('#progress').style.width=`${position/(slides.length-1)*100}%`;
}
function go(index){
 if(transitioning)return;
 index=Math.max(0,Math.min(slides.length-1,index));
 if(index===position)return;
 const from=position, target=sections[index];
 if(index===BRIDGE)resetBridge();
 transitioning=true;
 target.classList.add('arriving');
 history.replaceState(null,'',`#slide-${index}`);
 const finish=()=>{
  position=index;render();
  // Removing this class creates fresh CSS animations on every arrival.
  target.classList.remove('arriving');
  target.querySelectorAll('svg').forEach(svg=>{if(svg.setCurrentTime)svg.setCurrentTime(0)});
  transitioning=false;
  if(from===BRIDGE){clearTimeout(bridgeTimer);bridgeTimers.forEach(clearTimeout);bridgeTimers=[]}
  if(from===COSTS)resetCosts();
  if(from===SWAP)resetSwap();
  if(index===BRIDGE)playBridge();
  if(index===COSTS)playCosts();
  if(index===SWAP)playSwap();
 };
 if(reduced.matches){finish();return}
 const start=performance.now();
 function animate(now){
  const t=Math.min(1,(now-start)/620);
  const eased=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  position=from+(index-from)*eased;render();
  if(t<1)requestAnimationFrame(animate);else finish();
 }
 requestAnimationFrame(animate);
}
// A wheel/trackpad gesture advances once. Its remaining momentum is consumed
// until the device goes quiet, so one flick cannot skip multiple slides.
let wheelGesture=false, wheelQuietTimer;
addEventListener('wheel',e=>{
 if(e.ctrlKey)return; // Preserve browser pinch-to-zoom.
 if(Math.abs(e.deltaY)<=Math.abs(e.deltaX)||!e.deltaY)return;
 e.preventDefault();
 clearTimeout(wheelQuietTimer);
 wheelQuietTimer=setTimeout(()=>{wheelGesture=false},220);
 if(wheelGesture)return;
 wheelGesture=true;
 if(!transitioning)go(current+Math.sign(e.deltaY));
},{passive:false});
let touchStart=null,touchConsumed=false;
addEventListener('touchstart',e=>{
 touchStart=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;
 touchConsumed=false;
},{passive:true});
addEventListener('touchmove',e=>{
 if(!touchStart||e.touches.length!==1)return;
 const dy=touchStart.y-e.touches[0].clientY,dx=touchStart.x-e.touches[0].clientX;
 if(Math.abs(dy)<=Math.abs(dx))return;
 e.preventDefault();
 if(touchConsumed||Math.abs(dy)<12)return;
 touchConsumed=true;
 if(!transitioning)go(current+Math.sign(dy));
},{passive:false});
addEventListener('touchend',()=>{touchStart=null},{passive:true});
addEventListener('touchcancel',()=>{touchStart=null},{passive:true});
addEventListener('resize',render);
nav.addEventListener('click',e=>{const button=e.target.closest('[data-slide]');if(button)go(Number(button.dataset.slide))});
document.querySelector('#previous').onclick=()=>go(current-1);document.querySelector('#next').onclick=()=>go(current+1);
addEventListener('keydown',e=>{if(e.target.closest('input,textarea')||(e.key===' '&&e.target.closest('button,a')))return;let target;if(['ArrowDown','ArrowRight','PageDown',' '].includes(e.key))target=current+1;if(['ArrowUp','ArrowLeft','PageUp'].includes(e.key))target=current-1;if(e.key==='Home')target=0;if(e.key==='End')target=slides.length-1;if(target!==undefined){e.preventDefault();if(!e.repeat)go(target)}});
document.querySelector('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{document.querySelector('#fullscreen').title='Use your browser’s fullscreen command'}};

// ---- Shared animation helpers ----
const SVG_PARTS='.blob,.half,.joint,.fall,.edge,.api,.cell,.inc,.frazz';
const fallFrames=(dx,dy,rot)=>[
 {transform:'translate(0px,0px) rotate(0deg)',opacity:1,offset:0},
 {transform:`translate(${dx*.15}px,${dy*.1}px) rotate(${rot*.15}deg)`,opacity:1,offset:.2},
 {transform:`translate(${dx*.7}px,${dy*.55}px) rotate(${rot*.7}deg)`,opacity:1,offset:.7},
 {transform:`translate(${dx}px,${dy}px) rotate(${rot}deg)`,opacity:0,offset:1}];
const driftX=x=>(x-590)/590*70;
// An agent strains, cracks in two and drops.
function crackBlob(slide,run,prefix,j,at,cx){
 const q=id=>slide.querySelector('#'+prefix+id),strain=Math.min(320,at);
 run(q('blob-'+j),[{transform:'rotate(0deg)'},{transform:'rotate(-7deg)'},{transform:'rotate(6deg)'},{transform:'rotate(-5deg)'},{transform:'rotate(3deg)'},{transform:'rotate(0deg)'}],{duration:strain,delay:at-strain,fill:'none'});
 run(q('blob-'+j+'-w'),[{opacity:1},{opacity:0}],{duration:1,delay:at,fill:'forwards'});
 const dir=driftX(cx);
 [['l',-1],['r',1]].forEach(([s,sign])=>run(q('blob-'+j+'-'+s),[
  {transform:'translate(0px,0px) rotate(0deg)',opacity:1,offset:0},
  {transform:`translate(${sign*-2}px,1px) rotate(${sign*-3}deg)`,opacity:1,offset:.06},
  {transform:`translate(${sign*2}px,-1px) rotate(${sign*2}deg)`,opacity:1,offset:.12},
  {transform:`translate(${sign*10+dir*.1}px,16px) rotate(${sign*10}deg)`,opacity:1,offset:.3},
  {transform:`translate(${sign*48+dir}px,820px) rotate(${sign*95}deg)`,opacity:0,offset:1}],
  {duration:1500,delay:at,easing:'ease-in',fill:'both'}));
}
// Joints and strands. doom[n] = the moment node n lets go. A strand swings from whichever end is still
// standing, then drops when that end goes too; strands tied to the database/customers/ROI dangle, then drop.
function dropStructure(slide,run,prefix,doom,dangle){
 const m=BRM,nodes=m.nodes,P=v=>typeof v==='number'?nodes[v]:m.anchors[v],q=id=>slide.querySelector('#'+prefix+id);
 const fall=(el,delay,dx,dy,rot,dur)=>run(el,fallFrames(dx,dy,rot),{duration:dur,delay,easing:'ease-in',fill:'both'});
 nodes.forEach(([x],i)=>fall(q('joint-'+i),doom[i]+(m.blobs.some(b=>b.node===i)?150:0),driftX(x)+((i*37)%40-20),780,((i*47)%120)-60,1100+(i%5)*80));
 m.edges.forEach(([a,b],k)=>{
  const da=doom[a],db=typeof b==='number'?doom[b]:Infinity,[first,second]=da<=db?[a,b]:[b,a],tf=Math.min(da,db),ts=Math.max(da,db);
  const [sx,sy]=P(second),[fx,fy]=P(first),phi=Math.atan2(fy-sy,fx-sx)*180/Math.PI,delta=((90-phi+540)%360)-180;
  const el=q('edge-'+k),sw=el.firstElementChild;sw.style.transformBox='view-box';sw.style.transformOrigin=`${sx}px ${sy}px`;
  run(sw,[{transform:'rotate(0deg)'},{transform:`rotate(${delta*1.06}deg)`,offset:.6},{transform:`rotate(${delta}deg)`}],{duration:460,delay:tf+30,easing:'cubic-bezier(.4,0,.7,1)',fill:'both'});
  fall(el,(ts===Infinity?tf+dangle:ts)+60,driftX(sx),760,((k*53)%140)-70,1000+(k%4)*90);
 });
 m.frazz.forEach((z,i)=>fall(q('frz-'+i),doom[z.node]-40,driftX(nodes[z.node][0]),520,i?35:-35,800));
}

// ---- Page 3: the scene plays by itself: headline -> graph -> a clean zoom into the one agent
// that breaks -> the chain reaction while the camera pulls back -> the Christmas lights ----
const bridgeSlide=sections[BRIDGE];
bridgeSlide.querySelector('svg.scene').insertAdjacentHTML('beforeend',lightsSvg());
const bridgeAssembly=bridgeSlide.querySelector('.bridge-assembly');
bridgeSlide.querySelectorAll(SVG_PARTS).forEach(el=>{el.style.transformBox='fill-box';el.style.transformOrigin='center'});
const belowA=bridgeSlide.querySelector('.below-a'),belowB=bridgeSlide.querySelector('.below-b'),bridgeStat=bridgeSlide.querySelector('.stat-line'),bridgeSvg=bridgeSlide.querySelector('svg.scene');
let bridgeBroken=false,bridgeAnims=[],bridgeTimer=null,bridgeTimers=[],lightsAnims=[];
// After the collapse: the scene empties and the fallen infrastructure becomes a string of
// Christmas lights with one bad bulb, the failure no one can find blindfolded.
function transformToLights(){
 if(current!==BRIDGE)return;
 bridgeSlide.querySelectorAll('.scene>image,.scene>text').forEach(el=>lightsAnims.push(el.animate([{opacity:1},{opacity:0}],{duration:reduced.matches?1:600,fill:'forwards'})));
 // the whole web crossfades in as one while its wires draw and its bulbs light up
 const lights=bridgeSlide.querySelector('.lights');
 lightsAnims.push(lights.animate([{opacity:0},{opacity:1}],{duration:reduced.matches?1:450,fill:'forwards'}));
 bridgeSlide.querySelectorAll('.light-wire').forEach((el,i)=>lightsAnims.push(el.animate([{strokeDashoffset:1},{strokeDashoffset:0}],{duration:reduced.matches?1:500,delay:reduced.matches?0:120+i*10,easing:'ease-out',fill:'forwards'})));
 bridgeSlide.querySelectorAll('.light').forEach((el,i)=>{el.style.transformBox='fill-box';el.style.transformOrigin='center';
  lightsAnims.push(el.animate([{transform:'scale(.3)'},{transform:'scale(1)'}],{duration:reduced.matches?1:380,delay:reduced.matches?0:280+i*30,easing:'cubic-bezier(.34,1.56,.64,1)',fill:'forwards'}))});
 // the bad bulb: its broken connections draw in red and the ERROR tag pops
 bridgeSlide.querySelectorAll('.err-line').forEach(el=>lightsAnims.push(el.animate([{opacity:0,strokeDashoffset:1},{opacity:1,strokeDashoffset:0}],{duration:reduced.matches?1:500,delay:reduced.matches?0:1500,fill:'forwards'})));
 const err=bridgeSlide.querySelector('.light-error');
 lightsAnims.push(err.animate([{opacity:0},{opacity:1}],{duration:reduced.matches?1:500,delay:reduced.matches?0:1550,fill:'forwards'}));
}
function resetBridge(){
 clearTimeout(bridgeTimer);bridgeTimers.forEach(clearTimeout);bridgeTimers=[];
 bridgeAnims.forEach(a=>a.cancel());bridgeAnims=[];
 lightsAnims.forEach(a=>a.cancel());lightsAnims=[];
 bridgeBroken=false;bridgeAssembly.classList.remove('broken');
 belowA.style.opacity='0';belowA.style.display='';belowB.style.opacity='0';belowB.style.display='none';
 bridgeStat.style.opacity='0';
 bridgeSvg.style.opacity='0';
 bridgeSlide.querySelector('.lights').style.opacity='0';
}
function breakBridge(){
 if(current!==BRIDGE||transitioning||bridgeBroken)return;
 clearTimeout(bridgeTimer);bridgeBroken=true;bridgeAssembly.classList.add('broken');
 const run=(el,frames,opts)=>bridgeAnims.push(el.animate(frames,opts)),q=id=>bridgeSlide.querySelector('#'+id);
 if(reduced.matches){bridgeAssembly.querySelectorAll('g.edge,g.joint,g.blob,g.api,g.frazz').forEach(el=>run(el,[{opacity:1},{opacity:0}],{duration:120,fill:'forwards'}));bridgeTimer=setTimeout(transformToLights,150);return}
 const {nodes,edges,blobs,arrows,origin}=BRM;
 // Chain reaction: outward from one agent, ring by ring, one node at a time; the pace builds.
 const adj=nodes.map(()=>[]);edges.forEach(([a,b])=>{if(typeof a==='number'&&typeof b==='number'){adj[a].push(b);adj[b].push(a)}});
 const hop=nodes.map(()=>Infinity);hop[origin]=0;const queue=[origin];
 while(queue.length){const n=queue.shift();adj[n].forEach(m=>{if(hop[m]===Infinity){hop[m]=hop[n]+1;queue.push(m)}})}
 const [ox,oy]=nodes[origin],eu=i=>Math.hypot(nodes[i][0]-ox,nodes[i][1]-oy);
 const order=nodes.map((_,i)=>i).sort((a,b)=>hop[a]-hop[b]||eu(a)-eu(b)||a-b);
 const T=[];let t=700;order.forEach((n,k)=>{if(k>0)t+=Math.max(30,330*Math.pow(.84,k-1));T[n]=t});
 blobs.forEach((b,j)=>crackBlob(bridgeSlide,run,'',j,T[b.node],b.cx));
 dropStructure(bridgeSlide,run,'',T,520);
 arrows.forEach((ends,k)=>{
  const at=Math.min(...ends.map(j=>T[blobs[j].node]));
  run(q('api-'+k),[{transform:'translate(0px,0px) rotate(0deg)',opacity:1},{transform:'translate(0px,10px) rotate(-4deg)',opacity:.7,offset:.3},{transform:'translate(0px,80px) rotate(14deg)',opacity:0}],{duration:650,delay:at-80,easing:'ease-in',fill:'both'});
 });
 bridgeTimer=setTimeout(transformToLights,3600);
}
function playBridge(){
 resetBridge();
 const run=(el,frames,opts)=>{const a=el.animate(frames,reduced.matches?{...opts,delay:0,duration:1,easing:'linear'}:opts);bridgeAnims.push(a);return a};
 const show=(el,delay)=>run(el,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,delay,easing:'ease-out',fill:'both'});
 if(reduced.matches){run(bridgeSvg,[{opacity:0},{opacity:1}],{duration:1,fill:'both'});bridgeAssembly.querySelectorAll('g.edge,g.joint,g.blob,g.api,g.frazz').forEach(el=>run(el,[{opacity:1},{opacity:0}],{duration:1,fill:'forwards'}));show(belowB,0);show(bridgeStat,0);transformToLights();return}
 // 1) the title is already up; the graph fades in under it
 run(bridgeSvg,[{opacity:0},{opacity:1}],{duration:700,delay:400,fill:'both'});
 // 2) the consequence lands below, then one agent cracks and the rest breaks
 show(belowA,1600);
 bridgeTimers.push(setTimeout(breakBridge,3600));
 // 3) when the graph falls away, the same slot hands over to the Christmas lights line
 bridgeTimers.push(setTimeout(()=>{
  run(belowA,[{opacity:1},{opacity:0}],{duration:350,fill:'forwards'}).finished.then(()=>{belowA.style.display='none'});
  belowB.style.display='block';
  show(belowB,0);
 },8600));
 bridgeTimers.push(setTimeout(()=>show(bridgeStat,0),10000));
}

// ---- Page 5: one flowing scene. The swap -> the terminal interviews the enterprise and
// integrates its coding agent -> the first agent drops in -> old chains ghost away -> the
// self-healing web -> problems flagged -> clickable fixes ----
const swapSlide=sections[SWAP];
const hq=id=>swapSlide.querySelector('#h-'+id);
const hsvg=swapSlide.querySelector('svg.scene');
const [tagX,tagY]=BRM.nodes[BRM.origin];
hsvg.insertAdjacentHTML('beforeend',`<g class="cell-tag" style="opacity:0"><path d="M${tagX} ${tagY+20} v10" stroke="#00b368" stroke-width="1"/><text class="cell-tag-txt" x="${tagX}" y="${tagY+42}" text-anchor="middle">PROCEPT CELL</text></g>`);
const swapWrap=swapSlide.querySelector('.swap-wrap'),swapStage=swapSlide.querySelector('.swap-stage'),swapPanel=swapSlide.querySelector('.fix-panel'),termLines=swapSlide.querySelector('.term-lines'),swapTerm=swapSlide.querySelector('.terminal'),termScroll=swapSlide.querySelector('.term-scroll'),deployRow=swapSlide.querySelector('.deploy-row'),swapHeading=swapSlide.querySelector('h2'),deployA=swapSlide.querySelector('.deploy-a'),deployB=swapSlide.querySelector('.deploy-b'),deployC=swapSlide.querySelector('.deploy-c'),fakeCursor=swapSlide.querySelector('.fake-cursor');
swapSlide.querySelectorAll(SVG_PARTS).forEach(el=>{el.style.transformBox='fill-box';el.style.transformOrigin='center'});
const healNames=['TTL cache','Pool','Registry'],healAccepted=new Set();
let healAnims=[],healTimers=[];
const healRun=(el,frames,opts)=>{const a=el.animate(frames,reduced.matches?{...opts,delay:0,duration:1,easing:'linear'}:opts);healAnims.push(a);return a};
const healAt=(ms,fn)=>healTimers.push(setTimeout(fn,reduced.matches?0:ms));
const typeLine=(text,cls,at,speed=62)=>{
 const line=document.createElement('div');line.className=cls;termLines.appendChild(line);
 const term=termScroll;
 healAt(at,()=>{healTimers.push(setTimeout(function type(){const i=line.textContent.length;
  if(i<text.length){line.textContent+=text[i];line.classList.add('caret');term.scrollTop=term.scrollHeight;healTimers.push(setTimeout(type,reduced.matches?1:speed))}
  else{line.classList.remove('caret');term.scrollTop=term.scrollHeight}},reduced.matches?1:150))});
};
let connectorsDrawn=false;
// Each flagged problem gets a connector that runs from its label on the graph to its fix
// button when the panel pops up.
function updateConnectors(){
 const slideRect=swapStage.getBoundingClientRect(),svg=swapSlide.querySelector('.connectors');
 svg.setAttribute('width',Math.round(slideRect.width));svg.setAttribute('height',Math.round(slideRect.height));
 swapSlide.querySelectorAll('.connector').forEach(p=>{
  const i=Number(p.dataset.conn),label=hq('probl-'+i),btn=swapSlide.querySelectorAll('[data-accept]')[i];
  const a=label.getBoundingClientRect(),b=btn.getBoundingClientRect();
  const x1=a.left+a.width/2-slideRect.left,y1=a.top+a.height/2-slideRect.top,x2=b.left-slideRect.left,y2=b.top+b.height/2-slideRect.top,dx=(x2-x1)/2;
  p.setAttribute('d',`M${x1.toFixed(1)} ${y1.toFixed(1)} C${(x1+dx*.4).toFixed(1)} ${y1.toFixed(1)} ${(x2-dx*.4).toFixed(1)} ${y2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`);
 });
}
function drawConnectors(){
 const slideRect=swapStage.getBoundingClientRect(),svg=swapSlide.querySelector('.connectors');
 svg.setAttribute('width',Math.round(slideRect.width));svg.setAttribute('height',Math.round(slideRect.height));
 svg.innerHTML=[0,1,2].map(i=>{const label=hq('probl-'+i),btn=swapSlide.querySelectorAll('[data-accept]')[i];
  const a=label.getBoundingClientRect(),b=btn.getBoundingClientRect();
  const x1=a.left+a.width/2-slideRect.left,y1=a.top+a.height/2-slideRect.top,x2=b.left-slideRect.left,y2=b.top+b.height/2-slideRect.top,dx=(x2-x1)/2;
  return `<path class="connector" data-conn="${i}" d="M${x1.toFixed(1)} ${y1.toFixed(1)} C${(x1+dx*.4).toFixed(1)} ${y1.toFixed(1)} ${(x2-dx*.4).toFixed(1)} ${y2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1;opacity:0"/>`}).join('');
 swapSlide.querySelectorAll('.connector').forEach((p,i)=>healRun(p,[{opacity:0,strokeDashoffset:1},{opacity:1,strokeDashoffset:0}],{duration:650,delay:i*130,easing:'ease-out',fill:'forwards'}));
 connectorsDrawn=true;
}
addEventListener('resize',()=>{if(connectorsDrawn)updateConnectors();if(swapSlide.classList.contains('has-panel'))dockPanel()});
function resetSwap(){
 healAnims.forEach(a=>a.cancel());healAnims=[];healTimers.forEach(clearTimeout);healTimers=[];
 swapWrap.classList.remove('has-panel');swapStage.classList.remove('has-panel');swapSlide.classList.remove('has-panel');swapPanel.inert=true;
 termLines.textContent='';swapTerm.style.opacity='0';termScroll.scrollTop=0;swapTerm.inert=true;deployRow.style.marginLeft='';deployRow.style.marginRight='';
 swapSlide.querySelector('.term-input').classList.remove('show');
 const gi=swapSlide.querySelector('.goal-input');gi.value='';
 deployA.style.opacity='0';deployA.style.display='';deployB.style.opacity='0';deployB.style.display='none';deployC.style.opacity='0';deployC.style.display='none';
 swapSlide.querySelectorAll('.fix-item').forEach(el=>{el.style.opacity='1'});
 fakeCursor.classList.remove('show');fakeCursor.style.transform='';
 swapPanel.style.left='';swapPanel.style.top='';swapPanel.style.transform='';
 swapSlide.querySelector('.connectors').innerHTML='';connectorsDrawn=false;
 swapHeading.style.opacity='0';hsvg.style.opacity='0';
 healAccepted.clear();
 swapSlide.querySelectorAll('[data-accept]').forEach(b=>{b.classList.remove('accepted');b.textContent=`+ ${healNames[b.dataset.accept]}`;b.removeAttribute('aria-pressed');b.setAttribute('aria-label',`Accept ${healNames[b.dataset.accept]} fix`)});
}
// A Procept cell flies out of the terminal and drops into an API's place in the network.
function dropCell(j,at){
 const b=BRM.blobs[j],cell=hq('cell-'+j);
 cell.style.transformBox='fill-box';cell.style.transformOrigin='center';
 healRun(hq('blob-'+j),[{transform:'scale(1)',opacity:1},{transform:'scale(.15)',opacity:0}],{duration:320,delay:at+420,easing:'ease-in',fill:'both'});
 let dx=0,dy=-80;
 const ctm=hsvg.getScreenCTM&&hsvg.getScreenCTM();
 const tr=swapTerm.getBoundingClientRect();
 if(ctm){const inv=ctm.inverse();const tp=new DOMPoint(tr.left+tr.width/2,tr.top+tr.height-8).matrixTransform(inv);dx=tp.x-b.cx;dy=tp.y-b.cy}
 healRun(cell,[{transform:`translate(${dx}px,${dy}px) scale(.45)`,opacity:0,offset:0},{opacity:1,offset:.55},{transform:'translate(0px,0px) scale(1.08)',opacity:1,offset:.78},{transform:'translate(0px,0px) scale(1)',opacity:1,offset:1}],{duration:820,delay:at,easing:'cubic-bezier(.3,0,.2,1)',fill:'both'});
}
function playSwap(){
 resetSwap();
 const m=BRM,term=swapTerm;
 // 1) the title, then the scene
 healRun(swapHeading,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,delay:200,easing:'ease-out',fill:'both'});
 healRun(hsvg,[{opacity:0},{opacity:1}],{duration:700,delay:600,fill:'both'});
 // 2) the deployment copy and the terminal appear together, and the terminal types the swap
 healAt(1000,()=>{
  alignRow();
  healRun(deployA,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'ease-out',fill:'both'});
  healRun(term,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'ease-out',fill:'both'});
 });
 typeLine('$ system5 deploy','cmd',1500,50);
 typeLine('> api.openai.com → procept cell','ok',2200,50);
 // 3) the Procept cells fly out of the terminal and drop into the APIs, one by one
 healAt(3500,()=>{
  m.blobs.forEach((b,j)=>dropCell(j,(j%14)*160));
 });
 // 4) the API call arrows leave, the old wireframe ghosts to near-transparent, and the label lands
 healAt(6000,()=>{
  m.arrows.forEach((ends,k)=>healRun(hq('api-'+k),[{opacity:1},{opacity:0}],{duration:500,fill:'both'}));
  swapSlide.querySelectorAll('.edge,.joint,.frazz').forEach(el=>healRun(el,[{opacity:1},{opacity:.08}],{duration:700,easing:'ease-out',fill:'both'}));
  healRun(swapSlide.querySelector('.cell-tag'),[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'ease-out',fill:'both'});
 });
 // 5) the terminal integrates the coding agent
 typeLine('$ integrate your coding agent','cmd',7000,50);
 typeLine('> claude-code connected','ok',7600,50);
 // 6) the interview copy takes over, the terminal asks for the goal and waits for the user
 healAt(8600,()=>{
  healRun(deployA,[{opacity:1},{opacity:0}],{duration:350,fill:'forwards'}).finished.then(()=>{deployA.style.display='none'});
  deployB.style.display='block';
  healRun(deployB,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'ease-out',fill:'both'});
 });
 typeLine('what are your goals?','ok',9200,50);
 healAt(10200,()=>{
  swapSlide.querySelector('.term-input').classList.add('show');
  term.inert=false;
  pointCursor(swapSlide.querySelector('.goal-input'));
  swapSlide.querySelector('.goal-input').focus({preventScroll:true});
 });
}
// After the user's goal: acknowledge it, type the rest of the terminal, grow the green web
function continueSwap(goal){
 const m=BRM;
 swapTerm.inert=true;
 const echo=document.createElement('div');echo.className='ok';echo.textContent='> '+goal;termLines.appendChild(echo);termScroll.scrollTop=termScroll.scrollHeight;
 typeLine('> understood. goals captured','ok',250,50);
 // the deployment copy hands over to the private, self-hosted agents
 healAt(450,()=>{
  healRun(deployB,[{opacity:1},{opacity:0}],{duration:350,fill:'forwards'}).finished.then(()=>{deployB.style.display='none'});
  deployC.style.display='block';
  healRun(deployC,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'ease-out',fill:'both'});
 });
 typeLine('$ deploy agents','cmd',1400,50);
 typeLine('> web online · self-healing','ok',2100,50);
 // the green connections grow over the network
 const ob=m.blobs.findIndex(b=>b.node===m.origin);
 let around=0;
 m.web.forEach(e=>{
  const touchesOb=e.cells.includes(ob),other=e.cells.find(c=>c!==ob);
  const t=touchesOb&&typeof other==='number'||(touchesOb&&e.cells.length===1)?2450+(around++)*110:3050+Math.abs(e.k%5)*90;
  healRun(hq('web-'+e.k),[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:650,delay:t,easing:'ease-out',fill:'both'});
 });
 const tDone=3850,tProb=tDone+450;
 healRun(hq('packets'),[{opacity:0},{opacity:1}],{duration:600,delay:tDone-200,fill:'both'});
 // problems identified, then the clickable fixes in the draggable panel
 m.probIdx.forEach((k,i)=>{
  healRun(hq('web-'+k),[{opacity:1},{opacity:0}],{duration:400,delay:tProb,fill:'both'});
  healRun(hq('prob-'+i),[{opacity:0},{opacity:1}],{duration:500,delay:tProb,fill:'both'});
  healRun(hq('probl-'+i),[{opacity:0},{opacity:1}],{duration:500,delay:tProb+150,fill:'both'});
 });
 typeLine('$ system5 probe','cmd',tProb+300,50);
 typeLine('! GeoData latency · 950ms avg','warn',tProb+500,40);
 typeLine('! Postgres drops · 4 today','warn',tProb+700,40);
 typeLine('! MLflow missing · no registry','warn',tProb+900,40);
 typeLine('> 3 problems flagged · apply fixes →','cmd',tProb+1150,50);
 healAt(tProb+1300,()=>{dockPanel();drawConnectors()});
 healAt(tProb+1500,()=>{swapSlide.classList.add('has-panel');swapPanel.inert=false});
 healAt(tProb+1150,()=>pointCursor(swapSlide.querySelectorAll('[data-accept]')[0]));
}
// A ghost cursor glides to the interactive parts so the viewer knows when to click or type.
function pointCursor(el){
 if(!el||reduced.matches)return;
 const sr=swapStage.getBoundingClientRect(),r=el.getBoundingClientRect();
 fakeCursor.style.transform=`translate(${Math.round(r.left-sr.left+r.width/2-8)}px,${Math.round(r.top-sr.top+r.height/2-4)}px)`;
 fakeCursor.classList.add('show');
}
function hideCursor(){fakeCursor.classList.remove('show')}
// The fixes panel docks at the far right of the screen, right below RETURN ON INVESTMENT,
// so it never covers the terminal.
function dockPanel(){
 const sl=swapSlide.getBoundingClientRect(),wr=swapWrap.getBoundingClientRect(),pr=swapPanel.getBoundingClientRect();
 const roiY=wr.top+wr.height*.91+6;
 const maxY=deployRow.getBoundingClientRect().top-pr.height-6;
 swapPanel.style.top=Math.min(roiY,maxY)-sl.top+'px';
}
// The deploy row lines up with the drawn width of the graph on the left, and the terminal
// pushes all the way to the right edge of the stage.
function alignRow(){
 if(window.innerWidth<=760)return;
 const sr=swapStage.getBoundingClientRect(),vr=hsvg.getBoundingClientRect();
 const contentW=Math.min(vr.width,vr.height*1180/430);
 const side=(vr.width-contentW)/2;
 deployRow.style.marginLeft=Math.max(0,Math.round(vr.left-sr.left+side))+'px';
 deployRow.style.marginRight='';
}
addEventListener('resize',alignRow);
swapSlide.querySelector('.goal-input').addEventListener('input',hideCursor,{once:true});
swapSlide.querySelector('.goal-input').addEventListener('keydown',e=>{
 if(e.key!=='Enter')return;
 const goal=e.target.value.trim();
 if(!goal||!swapSlide.querySelector('.term-input').classList.contains('show'))return;
 e.stopPropagation();e.preventDefault();
 swapSlide.querySelector('.term-input').classList.remove('show');
 continueSwap(goal);
});
swapSlide.querySelector('.fix-title').addEventListener('pointerdown',e=>{
 if(!swapSlide.classList.contains('has-panel'))return;
 e.preventDefault();
 const sr=swapSlide.getBoundingClientRect(),pr=swapPanel.getBoundingClientRect(),offX=e.clientX-pr.left,offY=e.clientY-pr.top;
 const move=ev=>{
  let x=ev.clientX-sr.left-offX,y=ev.clientY-sr.top-offY;
  x=Math.max(0,Math.min(sr.width-pr.width,x));y=Math.max(0,Math.min(sr.height-pr.height,y));
  swapPanel.style.transform='none';
  swapPanel.style.left=Math.round(x)+'px';swapPanel.style.top=Math.round(y)+'px';
  if(connectorsDrawn)updateConnectors();
 };
 const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)};
 window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);
});
swapSlide.querySelectorAll('[data-accept]').forEach(button=>button.onclick=()=>{
 const i=Number(button.dataset.accept);if(healAccepted.has(i))return;healAccepted.add(i);
 hideCursor();
 healRun(hq('prob-'+i),[{opacity:1},{opacity:0}],{duration:400,fill:'forwards'});
 healRun(hq('probl-'+i),[{opacity:1},{opacity:0}],{duration:400,fill:'forwards'});
 healRun(hq('web-'+BRM.probIdx[i]),[{opacity:0},{opacity:1}],{duration:520,fill:'forwards'});
 // the fix: a new line that bridges across the agents
 healRun(hq('fixb-'+i),[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:900,easing:'ease-in-out',fill:'forwards'});
 healRun(hq('fixc-'+i),[{opacity:0},{opacity:1}],{duration:400,delay:reduced.matches?0:700,fill:'forwards'});
 const conn=swapSlide.querySelector('.connector[data-conn="'+i+'"]');if(conn)healRun(conn,[{opacity:1},{opacity:0}],{duration:400,fill:'forwards'});
 const fixCmds=[['agent-3','--cache ttl','GeoData latency'],['agent-7','--pool 12','Postgres drops'],['agent-11','--registry','MLflow missing']];
 typeLine(`$ connect ${fixCmds[i][0]} ${fixCmds[i][1]}`,'cmd',60,40);
 typeLine(`✓ connection added · ${fixCmds[i][2]} fixed`,'ok',500,40);
 // the clicked problem goes away; the ghost cursor moves on to the next one
 const item=button.closest('.fix-item');
 healAt(reduced.matches?0:800,()=>{
  healRun(item,[{opacity:1},{opacity:0}],{duration:350,fill:'forwards'});
  const left=[...swapSlide.querySelectorAll('[data-accept]')].filter(b=>!healAccepted.has(Number(b.dataset.accept)));
  if(left.length){healAt(reduced.matches?0:700,()=>pointCursor(left[0]))}
  else{swapSlide.classList.remove('has-panel');swapPanel.inert=true;typeLine('✓ all problems resolved · web healthy','ok',400,40)}
 });
 hsvg.setAttribute('aria-label',`${healAccepted.size} of 3 problems fixed.${healAccepted.size===3?' All connections healthy.':''}`);
});

// ---- Page 2: the headline comes in, the exponential curve draws itself, then the left side ----
const costSlide=sections[COSTS];
let costAnims=[],costTimers=[];
const costRun=(el,frames,opts)=>{const a=el.animate(frames,reduced.matches?{...opts,delay:0,duration:1,easing:'linear'}:opts);costAnims.push(a);return a};
function resetCosts(){
 costAnims.forEach(a=>a.cancel());costAnims=[];costTimers.forEach(clearTimeout);costTimers=[];
 costSlide.querySelectorAll('.cost-a,.cost-b,.statement').forEach(el=>{el.style.opacity='0'});
 costSlide.querySelectorAll('.cost-label,.cost-packet').forEach(el=>{el.style.opacity='0'});
 const curve=costSlide.querySelector('.cost-curve');curve.style.opacity='0';curve.style.strokeDashoffset='1';
 costSlide.querySelector('.cost-scene').style.opacity='0';
}
function playCosts(){
 resetCosts();
 const show=(el,delay)=>costRun(el,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,delay,easing:'ease-out',fill:'both'});
 const scene=costSlide.querySelector('.cost-scene');
 // 1) the headline and the scene land together
 show(costSlide.querySelector('.cost-a'),200);
 costRun(scene,[{opacity:0},{opacity:1}],{duration:600,delay:200,easing:'ease-out',fill:'both'});
 // 2) the exponential graph draws itself with its doubling price tags
 const curve=costSlide.querySelector('.cost-curve');
 costRun(curve,[{opacity:0,strokeDashoffset:1},{opacity:1,strokeDashoffset:0}],{duration:reduced.matches?1:1800,delay:1800,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
 costSlide.querySelectorAll('.cost-label').forEach((el,i)=>{el.style.transformBox='fill-box';el.style.transformOrigin='center';
  costRun(el,[{opacity:0,transform:'scale(.4)'},{opacity:1,transform:'scale(1)'}],{duration:380,delay:2300+i*140,easing:'ease-out',fill:'both'})});
 // 3) the rest of the headline, and the left side: the models being fed
 show(costSlide.querySelector('.cost-b'),3600);
 costSlide.querySelectorAll('.cost-logo').forEach((el,i)=>{el.style.transformBox='fill-box';el.style.transformOrigin='center';
  costRun(el,[{opacity:0,transform:'scale(.85)'},{opacity:1,transform:'scale(1)'}],{duration:520,delay:4000+i*170,easing:'ease-out',fill:'both'})});
 if(!reduced.matches){
  costSlide.querySelectorAll('.cost-packet').forEach((el,i)=>costRun(el,[{opacity:0},{opacity:1}],{duration:300,delay:4200+i*60,fill:'forwards'}));
  costTimers.push(setTimeout(()=>costSlide.querySelectorAll('.cost-packet animateMotion').forEach(p=>p.beginElement()),4400));
 }
 // 4) the kicker
 show(costSlide.querySelector('.statement'),5800);
}
const initial=location.hash.match(/^#slide-(\d+)$/);
if(initial)position=Math.min(slides.length-1,Number(initial[1]));
render();
if(current===COSTS)playCosts();
if(current===BRIDGE)playBridge();
if(current===SWAP)playSwap();
// First slide gets the same bring-in treatment as a navigated arrival.
sections[current].classList.add('arriving');
setTimeout(()=>sections[current].classList.remove('arriving'),900);
