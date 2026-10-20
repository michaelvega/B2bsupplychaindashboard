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
  const s=R*1.9,art=opt.agentsOnly
   ?`<circle cx="${cx}" cy="${cy}" r="${R}" fill="#1c1c1a" stroke="#8a8a86" stroke-width="1.5"/><text class="agent-label" x="${cx}" y="${cy+3}" text-anchor="middle">AGENT</text>`
   :`<g clip-path="url(#${p}bc${j})"><image href="${LOGOS[logoOrder[j]]}" x="${cx-s/2}" y="${cy-s/2}" width="${s}" height="${s}"/></g><path d="${d}" fill="none" stroke="#8a8a86" stroke-width="1.5"/>`;
  blobs+=`<g class="blob" id="${p}blob-${j}" role="img" aria-label="${opt.agentsOnly?'Agent':names[logoOrder[j]]}"${opt.blobsHidden?' style="opacity:0"':''}><g class="half" id="${p}blob-${j}-l" clip-path="url(#${p}hl${j})">${art}</g><g class="half" id="${p}blob-${j}-r" clip-path="url(#${p}hr${j})">${art}</g><g class="whole" id="${p}blob-${j}-w">${art}</g></g>`;
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
  return `<g class="edge" id="${p}edge-${k}"><g class="fall"><path class="bridge-strand${opt.spaghetti?' spaghetti':''}" d="M${x.toFixed(1)} ${y.toFixed(1)}L${xx.toFixed(1)} ${yy.toFixed(1)}"/><path class="bridge-strand fine${opt.spaghetti?' spaghetti':''}" d="M${(x+o).toFixed(1)} ${(y-o).toFixed(1)}L${(xx+o).toFixed(1)} ${(yy-o).toFixed(1)}"/></g></g>`}).join('');
 const joints=pts.map(([x,y],i)=>`<g class="joint" id="${p}joint-${i}"><g transform="rotate(${i%2?8:-9} ${x.toFixed(1)} ${y.toFixed(1)})"><rect class="marshmallow" x="${(x-10).toFixed(1)}" y="${(y-8).toFixed(1)}" width="20" height="16" rx="3.5"/><path d="M${(x-6).toFixed(1)} ${(y+4).toFixed(1)}h12" stroke="#b0b0ac"/></g></g>`).join('');
 // the two extra pieces of the stack, each wired in by a connection that is already failing
 const fr=rng(5);BRM.frazz=[{node:id(0,0),from:[112,164]},{node:id(0,COLS-1),from:[1060,134]}];
 const stick=(from,to,k)=>`<g class="frazz" id="${p}frz-${k}"><g class="fall"><path class="bridge-strand spaghetti" d="M${from[0]} ${from[1]}L${to[0].toFixed(1)} ${to[1].toFixed(1)}"/><path class="bridge-strand fine spaghetti" d="M${from[0]+3} ${from[1]-3}L${(to[0]+3).toFixed(1)} ${(to[1]-3).toFixed(1)}"/></g></g>`;
 const frazz=opt.spaghetti?stick([112,164],pts[id(0,0)],0)+stick([1060,134],pts[id(0,COLS-1)],1):frazzle(p,[112,164],pts[id(0,0)],0,fr)+frazzle(p,[1060,134],pts[id(0,COLS-1)],1,fr);
 const lab=(t,x,y)=>`<text class="col-head" x="${x}" y="${y}" text-anchor="middle">${t}</text>`;
 const icon=(href,x,y,w,h,label,lx,ly,label2)=>`<image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}"/>${label?lab(label,lx,ly):''}${label2?lab(label2,lx,ly+14):''}`;
 const head=opt.interactive===false?`<svg class="scene" viewBox="0 70 ${opt.viewW||1180} 430" role="img" aria-label="${opt.label||''}">`:`<svg class="scene bridge-trigger" viewBox="0 70 1180 430" role="button" tabindex="0" aria-label="Break the agent chain">`;
 return head+`<defs>${defs}<marker id="${p}api-head" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 .5L7.5 4L0 7.5z" fill="#00b368"/></marker></defs>`+
  icon(ASSETS.database,21,297,110,125,opt.companyData?'':'DATABASE',76,442)+
  icon(ASSETS.customers,1045,187,102,86,'CUSTOMERS',1096,292)+
  icon(ASSETS.roi,1047,327,96,89,'RETURN ON',1095,436,'INVESTMENT')+
  icon(ASSETS.layers,40,112,68,68,opt.companyData?'':'FRAMEWORKS',74,198)+
  (opt.companyData?`<path class="col-link" d="M74 192V230M74 262V292"/>${lab('COMPANY DATA',74,250)}`:'')+
  icon(ASSETS.tools,1062,76,62,62,'TOOLS',1093,154)+
  `<g class="bridge-assembly">${strands}${joints}${frazz}${blobs}${opt.noApi?'':arrows}</g>`+(opt.extra?opt.extra(BRM):'')+'</svg>';
}
// ---- Slide 5 scene: one left-to-right pipeline (your tools -> agents -> outcomes) ----
const HS={tools:[['GeoData','location API',85],['Postgres','database',180],['MLflow','model registry',275]],c1:[[480,85],[480,180],[480,275]],c2:[[720,132],[720,228]],out:[1040,180],web:[[0,0],[1,0],[1,1],[2,1]],probs:['Fix · 950 ms latency'],tags:['FIXED · TTL CACHE','FIXED · POOL','FIXED · REGISTRY'],logos:['openai','gemini','claude'],vh:384,newAgent:[900,292],caps:[['Private and self-hosted','your agents run inside your own environment'],['Governance sandboxes','each agent can only touch what you allow'],['Automatic evaluation','the network is tested against your goals, and System 5 suggests changes']]};
function healScene(){
 // curvy links: a quadratic bow to one side, so the network reads as an organic web
 const ln=(x1,y1,x2,y2,bow=0)=>{if(!bow)return `M${x1} ${y1}L${x2} ${y2}`;const mx=(x1+x2)/2,my=(y1+y2)/2,l=Math.hypot(x2-x1,y2-y1)||1;return `M${x1} ${y1}Q${(mx-(y2-y1)/l*bow).toFixed(1)} ${(my+(x2-x1)/l*bow).toFixed(1)} ${x2} ${y2}`},hid='style="stroke-dasharray:1;stroke-dashoffset:1"';
 const tools=HS.tools.map(([n,s,y])=>`<g class="hs-tool"><rect x="30" y="${y-28}" width="190" height="56" rx="8"/><text class="hs-name" x="52" y="${y-3}">${n}</text><text class="hs-sub" x="52" y="${y+17}">${s}</text></g>`).join('');
 const links=HS.c1.map(([x,y],i)=>{const ty=HS.tools[i][2],bow=[-16,16,-16][i],d=ln(220,y,x-31,y,bow),mx=(220+x-31)/2;y=y+bow/2;
  return `<path class="api-arrow" id="h-api-${i}" d="${d}" marker-end="url(#h-api-head)" style="opacity:0"/><g class="api-pill" id="h-apil-${i}" style="opacity:0"><rect x="${mx-38}" y="${y-10}" width="76" height="20" rx="10"/><text x="${mx}" y="${y+4}" text-anchor="middle">API CALL</text></g>`+
   `<path class="web-edge" id="h-link-${i}" d="${d}" pathLength="1" ${hid}/>`+(i?'':`<rect class="tool-err" id="h-prob-${i}" x="30" y="${ty-28}" width="190" height="56" rx="8" style="opacity:0"/><g class="prob-btn" id="h-probl-${i}" role="button" tabindex="0" aria-label="Fix: ${HS.probs[i]}" style="opacity:0"><rect x="30" y="${ty+15}" width="190" height="26" rx="13"/><circle class="prob-dot" cx="49" cy="${ty+28}" r="4.5"/><text x="61" y="${ty+32.5}">${HS.probs[i]}</text></g>`+
   `<path class="fix-bridge" id="h-fixb-${i}" d="${d}" pathLength="1" ${hid}/><g class="fix-chip" id="h-fixc-${i}" style="opacity:0"><rect class="tool-ok" x="30" y="${ty-28}" width="190" height="56" rx="8"/><rect x="30" y="${ty+15}" width="190" height="26" rx="13"/><text x="125" y="${ty+32.5}" text-anchor="middle">${HS.tags[i]}</text></g>`)}).join('');
 // suggested improvements, shaped by the customer's goal: a new agent, and a direct route to customers
 const G=HS.newAgent,ga=ln(758,228,G[0]-34,G[1],18),gb=ln(G[0]+34,G[1],1000,214,-18),arc=ln(518,72,1000,150,-90);
 const pill=(i,x,y,w,txt,cls)=>`<g class="prob-btn ${cls}" id="h-probl-${i}" role="button" tabindex="0" aria-label="${txt}" style="opacity:0"><rect x="${x-w/2}" y="${y-13}" width="${w}" height="26" rx="13"/><circle class="prob-dot" cx="${x-w/2+19}" cy="${y}" r="4.5"/><text x="${x-w/2+31}" y="${y+4.5}">${txt}</text></g>`;
 const chip=(i,x,y,w,txt)=>`<g class="fix-chip" id="h-fixc-${i}" style="opacity:0"><rect x="${x-w/2}" y="${y-13}" width="${w}" height="26" rx="13"/><text x="${x}" y="${y+4.5}" text-anchor="middle">${txt}</text></g>`;
 const sugs=`<g id="h-prob-1" style="opacity:0"><path class="ghost-link" d="${ga}"/><path class="ghost-link" d="${gb}"/><circle class="ghost-cell" cx="${G[0]}" cy="${G[1]}" r="34"/><text class="ghost-plus" x="${G[0]}" y="${G[1]+8}" text-anchor="middle">+</text></g>`+
  `<path class="fix-bridge" id="h-fixb-1" d="${ga}" pathLength="1" ${hid}/><path class="fix-bridge" id="h-fixb-1b" d="${gb}" pathLength="1" ${hid}/>`+
  `<g class="cell" id="h-newcell" style="opacity:0"><path class="cell-body" style="--i:6" d="${blobPath(G[0],G[1],40,rng(17))}"/><path class="cell-inner" style="--i:6" d="${blobPath(G[0],G[1],27,rng(47))}"/><g class="agent-float" style="--i:6">${sprite(2,G[0],G[1],58)}</g></g>`+
  pill(1,G[0],G[1]+51,250,'Improve · add a forecasting agent','sug-imp')+chip(1,G[0],G[1]+51,250,'ADDED · ON-TIME +18%')+
  `<path class="ghost-link" id="h-prob-2" d="${arc}" style="opacity:0"/><path class="fix-bridge" id="h-fixb-2" d="${arc}" pathLength="1" ${hid}/>`+
  pill(2,766,66,270,'Improve · route straight to customers','sug-imp')+chip(2,766,66,270,'REWIRED · RESPONSE TIME −40%');
 // governance layer: a private boundary around the agents, a sandbox per agent, and an evaluation sweep
 const AG=[...HS.c1,...HS.c2];
 const govern=`<g id="h-gov"><rect class="hs-private" id="h-private" x="392" y="42" width="416" height="274" rx="16" pathLength="1" ${hid}/>`+
  AG.map(([x,y],j)=>`<g class="hs-sbx" id="h-sbx-${j}" style="opacity:0"><rect x="${x-40}" y="${y-40}" width="80" height="80" rx="10"/></g>`).join('')+
  HS.caps.map(([t,d],k)=>`<text class="hs-cap" id="h-cap-${k}" x="600" y="344" text-anchor="middle" style="opacity:0"><tspan class="hs-cap-t">${t}</tspan><tspan> · ${d}</tspan></text>`).join('')+
  `<defs><linearGradient id="h-scan-g" x1="0" x2="1"><stop offset="0" stop-color="#00b368" stop-opacity="0"/><stop offset="1" stop-color="#00b368" stop-opacity=".55"/></linearGradient></defs><rect class="hs-scan" id="h-scan" x="176" y="44" width="42" height="270" fill="url(#h-scan-g)" style="opacity:0"/></g>`;
 const webD=HS.web.map(([a,b],k)=>ln(HS.c1[a][0]+42,HS.c1[a][1],HS.c2[b][0]-42,HS.c2[b][1],k%2?-24:24)),outD=HS.c2.map(([x,y],k)=>ln(x+42,y,984,HS.out[1],k?-34:34));
 // neighbours also reach out to each other
 const nbD=[ln(480+30,85+30,480+30,180-30,-34),ln(480+30,180+30,480+30,275-30,34),ln(720,132+38,720,228-38,-30)];
 HS.nWeb=webD.length+outD.length+nbD.length;
 const web=[...webD,...outD,...nbD].map((d,k)=>`<path class="web-edge" id="h-web-${k}" d="${d}" pathLength="1" ${hid}/>`).join('');
 const packets='';
 const logos=HS.c1.map(([x,y],j)=>`<g id="h-logo-${j}" style="opacity:0"><image href="${ASSETS[HS.logos[j]]}" x="${x-26}" y="${y-26}" width="52" height="52"/><text class="api-name" x="${x}" y="${y+44}" text-anchor="middle">${['OPENAI','GEMINI','CLAUDE'][j]}</text></g>`).join('');
 const body=(x,y,i)=>`<path class="cell-body" style="--i:${i}" d="${blobPath(x,y,40,rng(11+i))}"/><path class="cell-inner" style="--i:${i}" d="${blobPath(x,y,27,rng(41+i))}"/>`;
 const cells=HS.c1.map(([x,y],j)=>`<g class="cell" id="h-cell-${j}" style="opacity:0">${body(x,y,j)}<g class="agent-float" style="--i:${j}">${sprite(j,x,y,58)}</g></g>`).join('')+HS.c2.map(([x,y],k)=>`<g class="cell" id="h-cell2-${k}" style="opacity:0">${body(x,y,k+3)}<g class="agent-float" style="--i:${k+3}">${sprite(k+3,x,y,58)}</g></g>`).join('');
 const [ox,oy]=HS.out,lab=(t,x,y,id,st)=>`<text class="col-head" ${id?`id="${id}"`:''} x="${x}" y="${y}" text-anchor="middle" ${st||''}>${t}</text>`;
 return `<svg class="scene" viewBox="0 -24 1180 ${HS.vh}" role="img" aria-label="Every frontier API call is replaced by a Procept cell. A terminal interviews the enterprise and waits for its goal, then the agents connect your tools to your customers and problems are flagged with fixes."><defs><marker id="h-api-head" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 .5L7.5 4L0 7.5z" fill="#00b368"/></marker></defs>`+
  `<g id="h-g-tools" style="opacity:0"><rect class="hs-frame" x="8" y="0" width="1164" height="358" rx="14"/><text class="hs-frame-txt" x="22" y="-8">YOUR EXISTING ARCHITECTURE</text>`+
  lab('YOUR TOOLS',125,30)+tools+'</g>'+lab('FRONTIER APIS',480,30,'h-head-api','style="opacity:0"')+lab('PROCEPT CELLS',600,30,'h-head-cell','style="opacity:0"')+lab('SYSTEM 5',600,30,'h-head-sys','style="opacity:0"')+
  `<g id="h-cust" style="opacity:0"><image href="${ASSETS.customers}" x="${ox-50}" y="${oy-44}" width="100" height="86"/>`+lab('YOUR CUSTOMERS',ox,30)+'</g>'+
  links+web+sugs+`<text class="goal-tag" id="h-goal" x="1166" y="-8" text-anchor="end" style="opacity:0"></text>`+`<g id="h-packets" style="opacity:0">${packets}</g>`+logos+cells+govern+'</svg>';
}
function swapScene(){
 return `<div class="swap-stage"><div class="graph-wrap swap-wrap">${healScene()}</div><div class="deploy-row"><div class="deploy-text"><p class="deploy-a" style="opacity:0">Swap out your API call for a Procept cell, integrate Procept with your coding agent of choice.</p><p class="deploy-b" style="opacity:0;display:none">System 5 begins by interviewing your company to learn what your business and customers actually need.</p><div class="deploy-c" style="opacity:0;display:none"><p class="dc-lead">Then Procept Cells turn into System 5. They form into a network, constantly learning and improving together.</p></div></div><aside class="terminal" inert><div class="term-bar"><i></i><i></i><i></i><span>Terminal</span></div><div class="term-scroll"><div class="term-lines"></div></div><div class="term-input"><span class="term-prompt">&gt;</span><input class="goal-input" type="text" aria-label="Type your goal" placeholder="your goal…" spellcheck="false" autocomplete="off"></div></aside><aside class="sys-panel" aria-label="What System 5 deploys"><div class="sys-inner"><div class="sys-title">System 5</div><ul>${HS.caps.map(([t,d])=>`<li><b>${t}</b><span>${d}</span></li>`).join('')}</ul></div></aside></div><div class="fake-cursor" aria-hidden="true"><span class="cursor-ring"></span><svg viewBox="0 0 24 24" width="44" height="44"><path d="M5.5 3.2 L5.5 17.5 L9.4 12.4 L12.6 15.3 L14.6 14.2 L11.5 11.4 L17.3 10.4 Z" fill="#ffffff" stroke="#0e0e0d" stroke-width="1.2"/></svg><span class="cursor-hint">click</span></div></div>`;
}
function chatCard(k,x,y,name,role,initials){
 const w=240,h=300,r=x+w-12;
 return `<g class="chat-panel chat-${k}"><g class="chat-float" style="animation-delay:${-k*2.3}s"><linearGradient id="chat-fade-g${k}" gradientUnits="userSpaceOnUse" x1="0" y1="${y+44}" x2="0" y2="${y+100}"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="chat-fade${k}"><rect x="${x}" y="${y+44}" width="${w}" height="212" fill="url(#chat-fade-g${k})"/></mask><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="url(#chat-bg)" stroke="rgba(255,255,255,.09)" filter="url(#chat-shadow)"/><path d="M${x+16} ${y+.5} H${r-4}" stroke="rgba(255,255,255,.14)"/><circle class="chat-avatar" cx="${x+24}" cy="${y+20}" r="10"/><text class="chat-initials" x="${x+24}" y="${y+23.5}" text-anchor="middle">${initials}</text><text class="chat-name" x="${x+40}" y="${y+24}">${name}<tspan class="chat-role" dx="6">${role}</tspan></text><path d="M${x} ${y+40} H${x+w}" stroke="rgba(255,255,255,.06)"/><g mask="url(#chat-fade${k})"><g class="chat-feed" data-left="${x+12}" data-right="${r}" data-align="${k?'left':'right'}" transform="translate(0,${y+250})"></g></g><rect class="chat-input" x="${x+12}" y="${y+260}" width="${w-24}" height="28" rx="14"/><text class="chat-placeholder" x="${x+26}" y="${y+278}">Ask anything…</text><circle cx="${r-15}" cy="${y+274}" r="10" fill="#00b368"/><path d="M${r-15} ${y+279} V${y+269} M${r-19.5} ${y+273.5} L${r-15} ${y+269} L${r-10.5} ${y+273.5}" stroke="#0e0e0d" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></g>`;
}
// ---- Slide 2: exponential costs of renting frontier models ----
function costScene(){
 const logos=[['openai','OpenAI'],['gemini','Gemini'],['claude','Claude']];
 const L=logos.map(([k,name],i)=>{const x=900+i*200,y=112;return `<g class="cost-logo"><rect x="${x-55}" y="${y-55}" width="110" height="110" rx="12" fill="#161615" stroke="#2a2a28"/><image href="${ASSETS[k]}" x="${x-38}" y="${y-38}" width="76" height="76"/><text class="col-head" x="${x}" y="${y+72}" text-anchor="middle">${name.toUpperCase()}</text></g>`}).join('');
 const packets=logos.map((_,i)=>{const x=900+i*200;return [2.3,2.9,3.5,4.2].map(d=>`<rect class="cost-packet" x="-4" y="-3" width="8" height="6" style="opacity:0"><animateMotion begin="indefinite" dur="${d}s" repeatCount="indefinite" path="M1418 252 C 1440 215, ${x-70} 235, ${x} 172"/></rect>`).join('')}).join('');
 // a stack of employees all chatting with the same rented model, the front one on top
 const chats=`<defs><filter id="chat-shadow" x="-40%" y="-30%" width="180%" height="170%"><feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#000" flood-opacity=".8"/></filter><linearGradient id="chat-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1a18"/><stop offset="1" stop-color="#121211"/></linearGradient></defs>`
  +chatCard(2,-78,-20,'Priya','Logistics','PS')+chatCard(1,-44,10,'Luis','Finance','LO')+chatCard(0,-10,40,'Maya','Procurement','MC');
 const SPAN=10.5,cx=t=>300+460*t,cy=t=>330-235*Math.pow(2,SPAN*t)/Math.pow(2,SPAN);
 const curve=[];for(let k=0;k<=60;k++){const t=k/60;curve.push(`${k?'L':'M'}${cx(t).toFixed(1)} ${cy(t).toFixed(1)}`)}
 return `<svg class="scene cost-scene" viewBox="0 0 1560 380" role="img" aria-label="An employee chats with a chatbot on the left, per-prompt costs rise exponentially, and frontier model APIs consume an enterprise's data, prompts, workflows and corrections on the right."><g class="cost-left" style="opacity:0">${chats}<g class="cost-meter" style="opacity:0"><text class="col-head" x="300" y="40">PROMPTS SENT</text><text class="meter-num meter-prompts" x="300" y="100">0</text><text class="col-head" x="300" y="152">TOTAL SPEND</text><text class="meter-num meter-spend" x="300" y="212">$0</text></g><path class="cost-curve" d="${curve.join('')}" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1" opacity="0"/><text class="col-head" x="760" y="352" text-anchor="end">COSTS PER PROMPT</text><circle class="cost-dot" r="6" cx="300" cy="330" style="opacity:0"/></g><g class="cost-right" style="opacity:0">${L}<text class="col-head" x="1100" y="40" text-anchor="middle">FRONTIER MODELS</text><image href="${ASSETS.database}" x="1380" y="240" width="76" height="88"/><text class="col-head" x="1418" y="352" text-anchor="middle">ENTERPRISE</text><text class="task" x="1418" y="366" text-anchor="middle">PROMPTS · DATA · WORKFLOWS · CORRECTIONS</text>${packets}</g><g class="cost-arrow" style="opacity:0"><defs><marker id="cost-head" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 .5L7.5 4L0 7.5z" fill="#00b368"/></marker></defs><path class="cost-arrow-line" d="M785 190 H838" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1" marker-end="url(#cost-head)"/></g></svg>`;
}
// ---- Slide 3: one genius agent, then the whole team working together ----
const TEAM_C=[300,250],TEAM_SLOTS=[0,1,2,3,4].map(k=>{const a=(-90+k*72)*Math.PI/180;return[300+175*Math.cos(a),250+175*Math.sin(a)]});
const TEAM_LINKS=[...TEAM_SLOTS.map((_,k)=>[k,(k+1)%5]),...TEAM_SLOTS.map((_,k)=>[k,'hub'])];
function teamScene(){
 const P=v=>v==='hub'?TEAM_C:TEAM_SLOTS[v],f=v=>v.toFixed(1);
 const links=TEAM_LINKS.map(([a,b],n)=>{const [x,y]=P(a),[xx,yy]=P(b);return `<path class="team-link" d="M${f(x)} ${f(y)}L${f(xx)} ${f(yy)}" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1"/>`}).join('');
 // messages run back and forth along every link, like the agents talking
 const packets=TEAM_LINKS.map(([a,b],n)=>{const [x,y]=P(a),[xx,yy]=P(b);return `<circle class="team-packet" r="4"><animateMotion begin="indefinite" dur="${(2.2+(n*0.37)%1.4).toFixed(2)}s" repeatCount="indefinite" keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear" path="M${f(x)} ${f(y)}L${f(xx)} ${f(yy)}"/></circle>`}).join('');
 const sparks=[[-62,-50],[66,-34],[-58,40],[60,52]].map(([x,y],i)=>`<path class="genius-spark" style="animation-delay:${i*.35}s" d="M${x} ${y-7}V${y+7}M${x-7} ${y}H${x+7}"/>`).join('');
 const agents=TEAM_SLOTS.map((_,k)=>`<g class="team-agent" id="ta-${k}" style="opacity:0"><g class="ta-body">${k===0?`<g class="genius-fx" style="opacity:0"><circle class="genius-halo" r="58"/>${sparks}</g>`:''}<g class="agent-float" style="--i:${k}">${sprite(k,0,0,64)}</g></g><g class="ta-chip" style="opacity:0"><rect x="-54" y="-70" width="108" height="22" rx="11"/><text x="0" y="-55" text-anchor="middle"></text></g></g>`).join('');
 return `<svg class="scene team-scene" viewBox="0 0 600 500" role="img" aria-label="One smart agent arrives, then a team of agents joins it, passing messages and completing tasks together."><g class="team-links">${links}</g><g class="team-packets" style="opacity:0">${packets}</g><g class="team-hub" style="opacity:0"><circle cx="${TEAM_C[0]}" cy="${TEAM_C[1]}" r="46"/><text class="col-head" x="${TEAM_C[0]}" y="${TEAM_C[1]-8}" text-anchor="middle">OUTCOMES</text><text class="hub-num" x="${TEAM_C[0]}" y="${TEAM_C[1]+20}" text-anchor="middle">0</text></g>${agents}</svg>`;
}
// Slide 3's stage is wider than the others: Business goals / Success from AI sits right of the ROI column.
const SCENE_W=1370;
const slides=[
 ['hero',`<p class="intro">Procept’s</p><h1>System <span class="green">5</span></h1><div class="hero-rule"></div><p class="tagline">Turning AI into enterprise property.</p>`],
 ['costs',`<div class="cost-cols"><div class="cost-col"><p class="cost-a" style="opacity:0">Building and training AI hasn’t worked for most enterprises. The models they make in-house aren't smart enough to pay off, so they’re forced to rent frontier models by the prompt, at exponential costs.</p></div><div class="cost-arrow" style="opacity:0"><svg viewBox="0 0 70 16" width="70" height="16"><defs><marker id="cost-head" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 .5L7.5 4L0 7.5z" fill="#00b368"/></marker></defs><path class="cost-arrow-line" d="M2 8 H62" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1" marker-end="url(#cost-head)"/></svg></div><div class="cost-col"><p class="cost-b" style="opacity:0">They end up paying for their data, prompts, workflows and corrections to train frontier models they don’t own.</p></div></div>${costScene()}<p class="statement" style="opacity:0">Those models are built for everyone, not for their business, and the enterprise never builds secure, trained models that understand the company and grow in value over time.</p>`],
 ['visual bridge-slide search2',`<h2><span class="title-a">Not only can companies not build their own agents, they can’t get them to work together.</span><span class="v-part v-sub" style="opacity:0"><span>With every agent touching dozens of tools, databases and APIs,</span> <span class="v-blind" style="opacity:0">finding a failure is like searching blindfolded in the dark.</span></span><span class="v-part v-spread-txt" style="opacity:0;display:none"><span style="opacity:0">One agent’s mistake</span> <span style="opacity:0">quietly becomes the next agent’s input,</span> <span style="opacity:0">spreading through the business</span> <span style="opacity:0">until customers see it before the company does.</span> <span style="opacity:0">And because agents don’t learn,</span> <span style="opacity:0">the same failure happens again and again.</span></span><span class="v-part v-stakes" style="opacity:0;display:none"><span style="opacity:0">Customers lose trust and leave.</span> <span style="opacity:0">Meanwhile, enterprises that never get multi-agent AI working give up a <span class="g">40% cost reduction</span> and <span class="g">75% faster execution</span>.</span></span></h2><svg class="scene" viewBox="0 70 ${SCENE_W} 430" role="img" aria-label="A web of agents, each wired to dozens of tools, goes dark while a flashlight chases a small red failure it never catches. With the lights up, one mistake passes from agent to agent to the customers, again and again. Business goals then snaps." style="opacity:0"></svg>`],
 ['agents-slide',`<div class="agents-copy"><h1 class="agents-a" style="opacity:0">Enterprises need more than smart, private agents.</h1><h1 class="agents-b" style="opacity:0">They need a system of agents with <span class="green">the same goals as the business</span>, with each agent constantly learning what it needs to do to get there.</h1></div>${teamScene()}`],
 ['visual swap-heal',`<h2><span class="t-part t1" style="opacity:0"><span class="green">System 5</span> integrates naturally</span> <span class="t-part t2" style="opacity:0">into the infrastructure enterprises already have.</span></h2>${swapScene()}`],
 ['hero closer',`<h1>System 5 isn’t a service enterprises rent.</h1><div class="hero-rule"></div><p class="tagline">It turns AI into a network the company owns, trained on their data. System 5 intelligence stays completely in house, and becomes a system that learns every second, and increases in value every day.</p>`]
];
const stage=document.querySelector('#stage');
stage.innerHTML=slides.map(([cls,html],i)=>`<section class="slide ${cls}" id="slide-${i}" role="group" aria-label="Slide ${i+1} of ${slides.length}" aria-hidden="true" inert>${html}</section>`).join('');
const sections=[...stage.children],nav=document.querySelector('#nav');
const SWAP=sections.findIndex(s=>s.classList.contains('swap-heal')),COSTS=sections.findIndex(s=>s.classList.contains('costs')),AGENTS=sections.findIndex(s=>s.classList.contains('agents-slide')),SEARCH2=sections.findIndex(s=>s.classList.contains('search2'));
// Scenes stay hidden from the moment the page builds, so the text always lands first.
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
// Hero slides: the tagline lands on a click.
function armTagline(sec){gateWait(sec,()=>sec.classList.add('tag-on'),sec.querySelector('h1'))}
// A few seconds after a slide has finished showing everything, nudge toward the down button.
const HINT_DELAY=[6500,17600,50000,12000,20000];
let hintTimer=0;
function scheduleHint(index){
 const next=document.getElementById('next');
 clearTimeout(hintTimer);next.classList.remove('hint');
 if(index<0||index>=slides.length-1)return;
 hintTimer=setTimeout(()=>next.classList.add('hint'),reduced.matches?0:(HINT_DELAY[index]??8000));
}
function go(index){
 if(transitioning)return;
 index=Math.max(0,Math.min(slides.length-1,index));
 if(index===position)return;
 const from=position, target=sections[index];
 if(index===SEARCH2)resetSearch2();
 transitioning=true;
 gateClear();
 scheduleHint(-1);
 target.classList.add('arriving');
 history.replaceState(null,'',`#slide-${index}`);
 const finish=()=>{
  position=index;render();
  // Removing this class creates fresh CSS animations on every arrival.
  target.classList.remove('arriving');
  target.querySelectorAll('svg').forEach(svg=>{if(svg.setCurrentTime)svg.setCurrentTime(0)});
  transitioning=false;
  scheduleHint(index);
  if(sections[from].classList.contains('closer'))sections[from].classList.remove('tag-on');
  if(sections[index].classList.contains('closer'))armTagline(sections[index]);
  if(from===COSTS)resetCosts();
  if(from===SWAP)resetSwap();
  if(index===COSTS)playCosts();
  if(index===SWAP)playSwap();
  if(from===AGENTS)resetAgents();
  if(index===AGENTS)playAgents();
  if(from===SEARCH2){s2Timers.forEach(clearTimeout);s2Timers=[]}
  if(index===SEARCH2)playSearch2();
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

// ---- Click gate: a story beat waits for a click on the slide; a ghost cursor hovers after a pause ----
const gateState={fn:null,timer:0,slide:null};
function gateCursor(slide){
 let c=slide.querySelector(':scope>.gate-cursor');
 if(!c){slide.insertAdjacentHTML('beforeend','<div class="fake-cursor gate-cursor" aria-hidden="true"><span class="cursor-ring"></span><svg viewBox="0 0 24 24" width="44" height="44"><path d="M5.5 3.2 L5.5 17.5 L9.4 12.4 L12.6 15.3 L14.6 14.2 L11.5 11.4 L17.3 10.4 Z" fill="#ffffff" stroke="#0e0e0d" stroke-width="1.2"/></svg><span class="cursor-hint">click</span></div>');c=slide.querySelector(':scope>.gate-cursor')}
 return c;
}
function gateClear(){
 clearTimeout(gateState.timer);gateState.fn=null;
 document.querySelectorAll('.gate-cursor.show').forEach(c=>c.classList.remove('show'));
}
function gateWait(slide,fn,target,idle=2200){
 gateClear();gateState.fn=fn;gateState.slide=slide;
 if(reduced.matches)return;
 gateState.timer=setTimeout(()=>{
  if(gateState.fn!==fn)return;
  const c=gateCursor(slide),sr=slide.getBoundingClientRect(),r=(target||slide).getBoundingClientRect();
  c.style.transform=`translate(${Math.round(r.left-sr.left+r.width/2-10)}px,${Math.round(r.top-sr.top+r.height/2-6)}px)`;
  c.classList.add('show');
 },idle);
}
addEventListener('click',e=>{
 if(!gateState.fn||!gateState.slide.contains(e.target)||e.target.closest('input,button,a,.fix-panel'))return;
 const fn=gateState.fn;gateClear();fn();
});

// ---- Shared animation helpers ----
const SVG_PARTS='.blob,.half,.joint,.fall,.edge,.api,.cell,.inc,.frazz';
// Where falling pieces come to rest (scene coordinates).
const GROUND=486;

// ---- Page 3: the web of agents and the failure nobody can find ----
const SEARCH={agents:[[150,200],[320,385],[490,185],[665,380],[835,200],[1005,380],[1050,160]],links:[[0,1],[0,2],[1,2],[2,3],[2,4],[3,4],[3,5],[4,5],[4,6],[5,6],[1,3]],

 // where the failure shows up, in order; it moves on just as the flashlight gets there
 hops:[3,0,5,2,6,1,4],hopMs:1500};
function searchSvg(p='',dx=(SCENE_W-1180)/2){
 const f=v=>v.toFixed(1),rn=rng(31),A=SEARCH.agents,KINDS=['API','DB','TOOL','API','SQL','API','CRM','TOOL','API','DB'];
 let spokes='',parts='',packets='',n=0;
 A.forEach(([x,y],i)=>{for(let k=0;k<10;k++){
  const t=(k+rn()*.35)/10*Math.PI*2+i,len=54+rn()*26,ex=x+Math.cos(t)*len,ey=Math.min(492,Math.max(84,y+Math.sin(t)*len)),d=`M${f(x)} ${f(y)}L${f(ex)} ${f(ey)}`;
  spokes+=`<path class="s-spoke" d="${d}" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1"/>`;
  parts+=`<g class="s-part" style="opacity:0"><rect x="${f(ex-13)}" y="${f(ey-7)}" width="26" height="14" rx="2"/><text x="${f(ex)}" y="${f(ey+2.5)}" text-anchor="middle">${KINDS[(k+i)%10]}</text></g>`;
  if((k+i)%3===0)packets+=`<circle class="s-packet" r="2"><animateMotion dur="${(1.1+rn()*1.2).toFixed(2)}s" repeatCount="indefinite" keyPoints="${k%2?'0;1':'1;0'}" keyTimes="0;1" calcMode="linear" path="${d}"/></circle>`;
  n++}});
 const links=SEARCH.links.map(([a,b])=>{const d=`M${A[a][0]} ${A[a][1]}L${A[b][0]} ${A[b][1]}`;packets+=`<circle class="s-packet" r="2.4"><animateMotion dur="${(1.6+rn()).toFixed(2)}s" repeatCount="indefinite" path="${d}"/></circle>`;return `<path class="s-link" d="${d}" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1"/>`}).join('');
 const agents=A.map(([x,y])=>`<g class="s-agent" style="opacity:0"><circle cx="${x}" cy="${y}" r="26"/><text class="agent-label" x="${x}" y="${y+3}" text-anchor="middle">AGENT</text></g>`).join('');
 SEARCH.parts=n;
 return `<g class="search" transform="translate(${dx} 0)" style="opacity:0"><defs><radialGradient id="${p}torch-grad"><stop offset="0" stop-color="#000"/><stop offset=".55" stop-color="#000"/><stop offset="1" stop-color="#fff"/></radialGradient><mask id="${p}torch-mask" maskUnits="userSpaceOnUse" x="0" y="70" width="1180" height="430"><rect x="0" y="70" width="1180" height="430" fill="#fff"/><circle class="torch" r="96" fill="url(#${p}torch-grad)"/></mask></defs>`+
  `${links}${spokes}<g class="s-packets" style="opacity:0">${packets}</g>${parts}${agents}<text class="col-head s-count" x="14" y="96">0 MOVING PARTS</text>`+
  `<rect class="s-dark" x="0" y="70" width="1180" height="430" mask="url(#${p}torch-mask)" style="opacity:0"/><g class="s-fail" style="opacity:0"><g class="s-fail-pos"><g class="s-fail-blink"><circle class="s-fail-halo" r="40"/><circle class="s-fail-ring" r="26"/><text class="agent-label s-fail-txt" y="3" text-anchor="middle">AGENT</text></g></g></g></g>`;
}

// ---- Page 3: no bridge. The web of agents and their tools -> a failure (a small
// red dot) the flashlight can never catch -> the lights come up and one mistake spreads to the
// customers, again and again -> the stakes, and business goals snaps ----
const s2Slide=sections[SEARCH2],s2Svg=s2Slide.querySelector('svg.scene');
const V_GOAL={cx:1262,cy:292,R:50},V_CUST=[1262,130],V_DX=20;
// the spreading mistake: agent to agent, then out to the customers
const V_PATH=[1,2,4,6];
const vAg=j=>[SEARCH.agents[j][0]+V_DX,SEARCH.agents[j][1]];
s2Svg.insertAdjacentHTML('beforeend',searchSvg('v',V_DX)+(()=>{
 const {cx,cy,R}=V_GOAL,f=v=>v.toFixed(1);
 const crack=[0,6,-5,7,-4,5,0].map((o,k)=>[cx+o,cy-R-8+k*(2*R+16)/6]);
 const poly=side=>[[cx+side*(R+12),cy-R-8],...crack,[cx+side*(R+12),cy+R+8]].map(q=>q.map(f).join(',')).join(' ');
 const art=`<circle cx="${cx}" cy="${cy}" r="${R}"/><circle cx="${cx}" cy="${cy}" r="${R*.64}"/><circle cx="${cx}" cy="${cy}" r="${R*.28}" class="success-dot"/><path d="M${cx+R+16} ${cy-R-10}L${cx+4} ${cy-4}M${cx+R+16} ${cy-R-10}l-12 1M${cx+R+16} ${cy-R-10}l-1 12"/>`;
 const tie=(x,y,tx,ty,rFrom,rTo,cls)=>{const a=Math.atan2(ty-y,tx-x);return `<path class="s-link ${cls}" d="M${f(x+Math.cos(a)*rFrom)} ${f(y+Math.sin(a)*rFrom)}L${f(tx-Math.cos(a)*rTo)} ${f(ty-Math.sin(a)*rTo)}" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:1"/>`};
 const ties=[5,6].map(j=>tie(...vAg(j),cx,cy,26,R+4,'v-tie')).join('')+tie(...vAg(6),V_CUST[0]-40,V_CUST[1],26,4,'v-ctie');
 const sparks=[0,1,2,3,4,5,6,7].map(k=>{const t=k/8*Math.PI*2+.3,r1=10,r2=26+(k%3)*10;return `M${f(cx+Math.cos(t)*r1)} ${f(cy+Math.sin(t)*r1)}L${f(cx+Math.cos(t)*r2)} ${f(cy+Math.sin(t)*r2)}`}).join('');
 const [ux,uy]=V_CUST;
 return `<g class="v-goal" style="opacity:0"><defs><clipPath id="v-gl"><polygon points="${poly(-1)}"/></clipPath><clipPath id="v-gr"><polygon points="${poly(1)}"/></clipPath></defs>${ties}`+
  `<g class="v-cust"><image href="${ASSETS.customers}" x="${ux-40}" y="${uy-34}" width="80" height="68"/><text class="col-head" x="${ux}" y="${uy+52}" text-anchor="middle">CUSTOMERS</text>`+
  `<g class="v-alert" style="opacity:0"><circle class="v-alert-ring" cx="${ux}" cy="${uy}" r="40"/><circle class="v-alert-badge" cx="${ux+34}" cy="${uy-26}" r="11"/><text class="v-alert-mark" x="${ux+34}" y="${uy-21.5}" text-anchor="middle">!</text></g></g>`+
  `<circle class="success-halo" cx="${cx}" cy="${cy}" r="${R+14}"/><g class="success" id="v-goal" role="img" aria-label="Business goals and success from AI"><g id="v-goal-l" clip-path="url(#v-gl)">${art}</g><g id="v-goal-r" clip-path="url(#v-gr)">${art}</g><g id="v-goal-w">${art}</g><path class="snap-spark goal-spark" style="opacity:0" d="${sparks}"/></g>`+
  `<text class="col-head success-label" x="${cx}" y="${cy+R+38}" text-anchor="middle">BUSINESS GOALS</text><text class="col-head success-label" x="${cx}" y="${cy+R+58}" text-anchor="middle">SUCCESS FROM AI</text></g>`+
  `<g class="v-spread" style="opacity:0"><circle class="v-dot-glow" r="17"/><circle class="v-dot" r="7"/><g class="v-fail-tag"><path d="M6 -6L20 -20H92"/><text x="24" y="-25">FAILURE</text></g></g>`;
})());
// in this version the failure is a small red dot, not a red agent
s2Svg.querySelector('.s-fail-blink').innerHTML='<g class="v-dot-pulse"><circle class="v-dot-glow" cx="26" cy="-22" r="17"/><circle class="v-dot" cx="26" cy="-22" r="7"/></g><g class="v-fail-tag"><path d="M32 -28L46 -42H118"/><text x="50" y="-47">FAILURE</text></g>';
const s2q=s=>s2Slide.querySelector(s),s2qa=s=>s2Slide.querySelectorAll(s);
// under the darkness, so the dot only shows where the flashlight is pointing
s2q('.search').insertBefore(s2q('.s-fail'),s2q('.s-dark'));
const s2Stakes=[...s2qa('.v-stakes>span')],s2Cust=s2q('.v-cust'),s2Clauses=[...s2qa('.v-spread-txt>span')],s2Blind=s2q('.v-blind'),s2Title=s2q('.title-a'),s2Parts=[...s2qa('.v-part')],s2Search=s2q('.search'),s2Dark=s2q('.s-dark'),s2Torch=s2q('.torch'),s2Count=s2q('.s-count'),s2Goal=s2q('.v-goal'),s2Fail=s2q('.s-fail'),s2Spread=s2q('.v-spread'),s2Alert=s2q('.v-alert');
let s2Anims=[],s2Timers=[],s2Token=0;
let s2Off=0;
const s2Run=(el,frames,opts)=>{const a=el.animate(frames,reduced.matches?{...opts,delay:0,duration:1,easing:'linear',iterations:1}:{...opts,delay:Math.max(0,(opts.delay||0)-s2Off)});s2Anims.push(a);return a};
const s2Show=(el,delay=0,duration=600)=>s2Run(el,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration,delay,easing:'ease-out',fill:'both'});
const s2Fade=(el,to,duration=500,delay=0)=>s2Run(el,[{opacity:to?0:1},{opacity:to}],{duration,delay,fill:'both'});
const s2At=(ms,fn)=>{const off=s2Off;s2Timers.push(setTimeout(()=>{const p=s2Off;s2Off=0;fn();s2Off=p},reduced.matches?0:Math.max(0,ms-off)))};
const s2Gate=(fn,off=0)=>gateWait(s2Slide,()=>{s2Off=off;fn();s2Off=0},s2Svg);
function s2CountUp(el,to,dur,fmt){const token=s2Token,start=performance.now();
 (function tick(now){if(token!==s2Token)return;const t=Math.min(1,(now-start)/dur),e=1-Math.pow(1-t,3);el.textContent=fmt(Math.round(to*e));if(t<1)requestAnimationFrame(tick)})(start);}
// The heading swaps from one part to the next.
function s2Swap(from,to){
 [from].flat().forEach(el=>s2Run(el,[{opacity:1},{opacity:0}],{duration:350,fill:'forwards'}));
 s2Timers.push(setTimeout(()=>{[from].flat().forEach(el=>{el.style.display='none'});to.style.display='block';s2Show(to,0,900)},reduced.matches?0:380));
}
function resetSearch2(){
 gateClear();
 s2Anims.forEach(a=>a.cancel());s2Anims=[];s2Timers.forEach(clearTimeout);s2Timers=[];s2Token++;
 s2Blind.style.opacity='0';s2Clauses.forEach(c=>{c.style.opacity='0'});s2Stakes.forEach(c=>{c.style.opacity='0'});s2Title.style.display='';s2Parts.forEach((p,i)=>{p.style.opacity='0';p.style.display=i?'none':''});
 s2Search.style.opacity='0';s2Dark.style.opacity='0';s2Count.textContent='';s2Count.classList.remove('v-red');s2Goal.style.opacity='0';
 s2Svg.style.opacity='0';
}
// One mistake passes from agent to agent and reaches the customers; each pass is the same failure again.
function spreadOnce(start,dur,keep){
 const pts=[...V_PATH.map(vAg),[V_CUST[0]-40,V_CUST[1]]],seg=pts.slice(1).map((p,i)=>Math.hypot(p[0]-pts[i][0],p[1]-pts[i][1])),total=seg.reduce((a,b)=>a+b,0);
 let acc=0;const at=[0,...seg.map(l=>(acc+=l)/total)];
 s2Run(s2Spread,pts.map(([x,y],i)=>({transform:`translate(${x}px,${y}px)`,offset:at[i],easing:'ease-in-out'})),{duration:dur,delay:start,fill:keep?'forwards':'none'});
 s2Run(s2Spread,[{opacity:0},{opacity:1,offset:.04},{opacity:1,offset:.96},{opacity:keep?1:0}],{duration:dur,delay:start,fill:keep?'forwards':'none'});
 const agents=s2qa('.s-agent'),end=start+dur+900;
 V_PATH.forEach((j,i)=>{const t=start+dur*at[i],c=agents[j].querySelector('circle'),span=end-t;
  s2Run(c,[{stroke:'#8a8a86',fill:'#1c1c1a'},{stroke:'#ff5b52',fill:'#3a1513',offset:Math.min(.2,250/span)},{stroke:'#ff5b52',fill:'#3a1513',offset:.97},{stroke:keep?'#ff5b52':'#8a8a86',fill:keep?'#3a1513':'#1c1c1a'}],{duration:span,delay:t,fill:keep?'forwards':'none'})});
 const t=start+dur;
 s2Run(s2Alert,[{opacity:0},{opacity:1,offset:.1},{opacity:1,offset:.9},{opacity:keep?1:0}],{duration:900,delay:t,fill:keep?'forwards':'none'});
 s2Run(s2q('.v-alert-ring'),[{transform:'scale(.8)'},{transform:'scale(1.1)'},{transform:'scale(1)'}],{duration:500,delay:t});
}
// Business goals: the ties give way, then it shakes, turns red, snaps with sparks and falls away.
function snapGoal2(at){
 const {cx,cy}=V_GOAL,q=id=>s2Slide.querySelector('#'+id);
 s2qa('.v-tie').forEach((el,k)=>{s2Run(el,[{stroke:'#8a8a86'},{stroke:'#ff5b52'}],{duration:300,delay:at-1100+k*120,fill:'both'});
  s2Run(el,[{transform:'translateY(0px)',opacity:1},{transform:'translateY(120px)',opacity:0}],{duration:700,delay:at-700+k*120,easing:'ease-in',fill:'both'})});
 s2Run(s2q('.v-goal .success-halo'),[{opacity:1},{opacity:0}],{duration:400,delay:at-500,fill:'both'});
 const w=q('v-goal');w.style.transformBox='fill-box';w.style.transformOrigin='center';
 s2Run(w,[{transform:'rotate(0deg)'},{transform:'rotate(-6deg)'},{transform:'rotate(5deg)'},{transform:'rotate(-4deg)'},{transform:'rotate(2deg)'},{transform:'rotate(0deg)'}],{duration:500,delay:at-500,fill:'none'});
 w.querySelectorAll('circle,path:not(.goal-spark)').forEach(el=>s2Run(el,[{stroke:'#e8e8e4'},{stroke:'#ff5b52'}],{duration:300,delay:at-450,fill:'both'}));
 w.querySelectorAll('.success-dot').forEach(el=>s2Run(el,[{fill:'#e8e8e4'},{fill:'#ff5b52'}],{duration:300,delay:at-450,fill:'both'}));
 s2Run(q('v-goal-w'),[{opacity:1},{opacity:0}],{duration:1,delay:at,fill:'forwards'});
 const gs=s2q('.v-goal .goal-spark');gs.style.transformBox='view-box';gs.style.transformOrigin=`${cx}px ${cy}px`;
 s2Run(gs,[{opacity:1,transform:'scale(.6)'},{opacity:1,transform:'scale(1.4)',offset:.35},{opacity:0,transform:'scale(1.9)'}],{duration:600,delay:at,fill:'forwards'});
 s2Run(s2Svg,[{transform:'translate(0,0)'},{transform:'translate(5px,-3px)'},{transform:'translate(-5px,3px)'},{transform:'translate(2px,-1px)'},{transform:'translate(0,0)'}],{duration:320,delay:at,easing:'linear'});
 const dy=GROUND-cy;
 [['l',-1],['r',1]].forEach(([s,sign])=>{const h=q('v-goal-'+s);h.style.transformBox='fill-box';h.style.transformOrigin='center';s2Run(h,[
  {transform:'translate(0px,0px) rotate(0deg)',opacity:1,offset:0},
  {transform:`translate(${sign*8}px,10px) rotate(${sign*8}deg)`,opacity:1,offset:.2,easing:'cubic-bezier(.45,0,.95,.55)'},
  {transform:`translate(${sign*30}px,${dy}px) rotate(${sign*92}deg)`,opacity:0,offset:1}],{duration:1300,delay:at,fill:'both'})});
 s2qa('.v-goal .success-label').forEach(el=>s2Run(el,[{fill:'#e8e8e4',opacity:1},{fill:'#ff5b52',opacity:1,offset:.3},{fill:'#5a5a56',opacity:0}],{duration:1200,delay:at-300,fill:'both'}));
}
function playSearch2(){
 resetSearch2();
 const A=SEARCH.agents,H=SEARCH.hops,P=SEARCH.hopMs,N=H.length;
 if(reduced.matches){s2Svg.style.opacity='1';s2Search.style.opacity='1';s2Goal.style.opacity='1';s2Count.textContent='';
  s2qa('.s-agent,.s-part,.s-packets').forEach(el=>{el.style.opacity='1'});s2qa('.s-link,.s-spoke').forEach(el=>{el.style.strokeDashoffset='0'});
  s2Title.style.display='none';s2Parts.forEach((p,i)=>{p.style.display=i===2?'block':'none';p.style.opacity='1'});s2Blind.style.opacity='1';s2Clauses.forEach(c=>{c.style.opacity='1'});s2Stakes.forEach(c=>{c.style.opacity='1'});return}
 const b1=()=>{
 // 1) every agent touches dozens of tools; customers and business goals wait on the right
 s2Svg.style.opacity='1';
 // each half rises in out of a blur, slower than the rest so it reads clearly
 s2Run(s2Parts[0],[{opacity:0,transform:'translateY(26px)',filter:'blur(8px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0px)'}],{duration:1100,delay:1500,easing:'cubic-bezier(.2,.7,.3,1)',fill:'both'});
 s2Fade(s2Search,1,1,1500);
 s2qa('.s-agent').forEach((el,i)=>{el.style.transformBox='fill-box';el.style.transformOrigin='center';s2Run(el,[{opacity:0,transform:'scale(.5)'},{opacity:1,transform:'scale(1)'}],{duration:380,delay:1800+i*90,easing:'ease-out',fill:'both'})});
 s2qa('.search .s-link').forEach((el,i)=>s2Run(el,[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:500,delay:2200+i*40,easing:'ease-out',fill:'forwards'}));
 s2qa('.s-spoke').forEach((el,i)=>s2Run(el,[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:360,delay:2500+i*24,easing:'ease-out',fill:'forwards'}));
 s2qa('.s-part').forEach((el,i)=>s2Run(el,[{opacity:0},{opacity:1}],{duration:260,delay:2700+i*24,fill:'both'}));
 s2Fade(s2q('.s-packets'),1,600,3500);
 s2Goal.style.transformBox='fill-box';s2Goal.style.transformOrigin='center';
 s2Run(s2Goal,[{opacity:0,transform:'scale(.85)'},{opacity:1,transform:'scale(1)'}],{duration:700,delay:2200,easing:'ease-out',fill:'both'});
 s2qa('.v-tie,.v-ctie').forEach(el=>s2Run(el,[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:600,delay:3600,easing:'ease-out',fill:'forwards'}));
 s2At(4500,()=>s2Gate(b2,6200));
 };
 const b2=()=>{
 // 2) the failure: a small red dot by one agent, pulsing
 s2Run(s2Blind,[{opacity:0,filter:'blur(8px)'},{opacity:1,filter:'blur(0px)'}],{duration:1100,delay:6200,easing:'cubic-bezier(.2,.7,.3,1)',fill:'both'});
 s2Fade(s2Fail,1,300,6500);
 s2Run(s2q('.v-dot-pulse'),[{transform:'scale(1)'},{transform:'scale(1.5)'},{transform:'scale(1)'}],{duration:900,delay:6500,iterations:Infinity,easing:'ease-in-out'});
 // 3) the lights go out; the dot keeps moving and the flashlight always arrives just after it leaves
 s2Run(s2Dark,[{opacity:0},{opacity:.85,offset:.2},{opacity:.15,offset:.35},{opacity:.95,offset:.55},{opacity:.4,offset:.7},{opacity:1}],{duration:1000,delay:7900,fill:'both'});
 s2Run(s2q('.s-fail-pos'),H.map((j,i)=>({transform:`translate(${A[j][0]}px,${A[j][1]}px)`,offset:i/N,easing:'step-end'})).concat([{transform:`translate(${A[H[N-1]][0]}px,${A[H[N-1]][1]}px)`,offset:1}]),{duration:N*P,delay:7900,iterations:Infinity,fill:'both'});
 s2Run(s2q('.s-fail-blink'),[{opacity:0},{opacity:1,offset:.1},{opacity:1,offset:.85},{opacity:0}],{duration:P,delay:7900,iterations:Infinity,fill:'forwards'});
 // the beam reaches each spot just before the dot moves on: a glimpse of red, then it is gone
 const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],L=0.7,start=lerp(A[H[N-1]],A[H[0]],1-L);
 s2Run(s2Torch,[{transform:`translate(${start[0]}px,${start[1]}px)`,offset:0,easing:'ease-in-out'},...H.map((j,i)=>({transform:`translate(${A[j][0]}px,${A[j][1]}px)`,offset:(i+L)/N,easing:'ease-in-out'})),{transform:`translate(${start[0]}px,${start[1]}px)`,offset:1}],{duration:N*P,delay:7900,iterations:Infinity,fill:'both'});
 s2At(14000,()=>s2Gate(b4));
 };
 // 4) lights up, and the second part plays clause by clause
 const b4=()=>{
  s2Swap([s2Title,s2Parts[0]],s2Parts[1]);
  s2Run(s2Dark,[{opacity:1},{opacity:0}],{duration:900,fill:'forwards'});
  s2Run(s2Fail,[{opacity:1},{opacity:0}],{duration:400,fill:'forwards'});
  const say=(i,at)=>s2Run(s2Clauses[i],[{opacity:0},{opacity:1}],{duration:600,delay:at,easing:'ease-out',fill:'both'});
  const pts=[...V_PATH.map(vAg),[V_CUST[0]-40,V_CUST[1]]],agents=s2qa('.s-agent');
  const infect=(j,at)=>{const c=agents[j].querySelector('circle');
   s2Run(c,[{stroke:'#8a8a86',fill:'#1c1c1a'},{stroke:'#ff5b52',fill:'#3a1513'}],{duration:300,delay:at,fill:'forwards'});
   s2Run(agents[j],[{transform:'scale(1)'},{transform:'scale(1.15)'},{transform:'scale(1)'}],{duration:450,delay:at,easing:'ease-in-out'})};
  const move=(a,b,at,dur)=>s2Run(s2Spread,[{transform:`translate(${pts[a][0]}px,${pts[a][1]}px)`},{transform:`translate(${pts[b][0]}px,${pts[b][1]}px)`}],{duration:dur,delay:at,easing:'ease-in-out',fill:'forwards'});
  // "One agent's mistake": a red dot in one agent
  say(0,400);
  s2Run(s2Spread,[{transform:`translate(${pts[0][0]}px,${pts[0][1]}px)`},{transform:`translate(${pts[0][0]}px,${pts[0][1]}px)`}],{duration:1,delay:900,fill:'forwards'});
  s2Run(s2Spread,[{opacity:0},{opacity:1}],{duration:300,delay:900,fill:'forwards'});
  infect(V_PATH[0],900);
  // "quietly becomes the next agent's input,": it moves on and the next agent turns red
  say(1,2600);move(0,1,2900,1000);infect(V_PATH[1],3900);
  // "spreading through the business": on through the rest of the chain
  say(2,5000);move(1,2,5300,800);infect(V_PATH[2],6100);move(2,3,6100,800);infect(V_PATH[3],6900);
  // "until customers see it before the company does.": it reaches the customers
  say(3,8000);move(3,4,8300,800);
  s2Run(s2Alert,[{opacity:0},{opacity:1}],{duration:300,delay:9100,fill:'forwards'});
  s2Run(s2q('.v-alert-ring'),[{transform:'scale(.8)'},{transform:'scale(1.1)'},{transform:'scale(1)'}],{duration:500,delay:9100});
  s2Timers.push(setTimeout(()=>{s2Count.classList.add('v-red');s2Count.textContent='SAME FAILURE ×1'},9100));
  // "And because agents don't learn,": everything looks fine again, nothing was learned
  say(4,11000);
  s2Run(s2Spread,[{opacity:1},{opacity:0}],{duration:500,delay:11500,fill:'forwards'});
  s2Run(s2Alert,[{opacity:1},{opacity:0}],{duration:500,delay:11500,fill:'forwards'});
  V_PATH.forEach(j=>s2Run(agents[j].querySelector('circle'),[{stroke:'#ff5b52',fill:'#3a1513'},{stroke:'#8a8a86',fill:'#1c1c1a'}],{duration:500,delay:11500,fill:'forwards'}));
  // "the same failure happens again and again.": the exact same run, twice more
  say(5,13000);
  [[13300,2600,2],[16400,2100,3]].forEach(([at,dur,n])=>{
   s2Timers.push(setTimeout(()=>{s2Count.textContent=`SAME FAILURE ×${n}`},at));
   spreadOnce(at,dur,n===3)});
 s2At(19500,()=>s2Gate(b5));
 };
 // 5) the stakes next to the diagram; once it has been read, business goals snaps
 const b5=()=>{
  s2Swap(s2Parts[1],s2Parts[2]);
  const say=(i,at)=>s2Run(s2Stakes[i],[{opacity:0},{opacity:1}],{duration:700,delay:at,easing:'ease-out',fill:'both'});
  // "Not only does this result in user dissatisfaction,": the customers get angry and walk away
  say(0,400);
  s2Cust.style.transformBox='fill-box';s2Cust.style.transformOrigin='center';
  const shake=[0,-6,6,-5,5,-3,3,0].map(x=>({transform:`translate(${x}px,0px) rotate(${x*.6}deg)`}));
  s2Run(s2Cust,shake,{duration:520,delay:900,iterations:2,easing:'linear'});
  s2Run(s2q('.v-alert-ring'),[{transform:'scale(1)'},{transform:'scale(1.18)'},{transform:'scale(1)'}],{duration:420,delay:900,iterations:3});
  s2Run(s2Cust,[{transform:'translate(0px,0px)',opacity:1},{transform:'translate(-6px,0px)',opacity:1,offset:.15},{transform:'translate(170px,-10px)',opacity:0}],{duration:1100,delay:2200,easing:'ease-in',fill:'forwards'});
  s2Run(s2q('.v-ctie'),[{opacity:1},{opacity:0}],{duration:500,delay:2200,fill:'forwards'});
  s2Run(s2Spread,[{opacity:1},{opacity:0}],{duration:400,delay:2200,fill:'forwards'});
  // "but also, enterprises ... are actively forfeiting ...": once it has been read, business goals fails
  say(1,3800);
  snapGoal2(10300);
 };
 s2Gate(b1,1500);
}

// ---- Page 5: one flowing scene. The swap -> the terminal interviews the enterprise and
// integrates its coding agent -> the first agent drops in -> old chains ghost away -> the
// self-healing web -> problems flagged -> clickable fixes ----
const swapSlide=sections[SWAP];
const hq=id=>swapSlide.querySelector('#h-'+id);
const hsvg=swapSlide.querySelector('svg.scene');
const swapWrap=swapSlide.querySelector('.swap-wrap'),swapStage=swapSlide.querySelector('.swap-stage'),termLines=swapSlide.querySelector('.term-lines'),swapTerm=swapSlide.querySelector('.terminal'),termScroll=swapSlide.querySelector('.term-scroll'),deployRow=swapSlide.querySelector('.deploy-row'),swapHeading=swapSlide.querySelector('h2'),deployA=swapSlide.querySelector('.deploy-a'),deployB=swapSlide.querySelector('.deploy-b'),deployC=swapSlide.querySelector('.deploy-c'),fakeCursor=swapSlide.querySelector('.fake-cursor');
swapSlide.querySelectorAll(SVG_PARTS).forEach(el=>{el.style.transformBox='fill-box';el.style.transformOrigin='center'});
const healNames=['TTL cache','Pool','Registry'],healAccepted=new Set();
let healAnims=[],healTimers=[],probReady=false;
const healRun=(el,frames,opts)=>{const a=el.animate(frames,reduced.matches?{...opts,delay:0,duration:1,easing:'linear'}:opts);healAnims.push(a);return a};
const healAt=(ms,fn)=>healTimers.push(setTimeout(fn,reduced.matches?0:ms));
const typeLine=(text,cls,at,speed=62)=>{
 const line=document.createElement('div');line.className=cls;termLines.appendChild(line);
 const term=termScroll;
 healAt(at,()=>{healTimers.push(setTimeout(function type(){const i=line.textContent.length;
  if(i<text.length){line.textContent+=text[i];line.classList.add('caret');term.scrollTop=term.scrollHeight;healTimers.push(setTimeout(type,reduced.matches?1:speed))}
  else{line.classList.remove('caret');term.scrollTop=term.scrollHeight}},reduced.matches?1:150))});
};
// Story beats advance on a click anywhere on the slide; after a pause a ghost cursor hovers the diagram to say so.
let gate=null;
function waitClick(fn,target,idle=2200){
 gate=fn;
 healAt(idle,()=>{if(gate===fn)pointCursor(target)});
}
swapSlide.addEventListener('click',e=>{
 if(!gate||e.target.closest('input,button,.fix-panel'))return;
 const fn=gate;gate=null;hideCursor();fn();
});
function resetSwap(){
 gate=null;hq('goal').textContent='';probReady=false;[0,1,2].forEach(i=>hq('probl-'+i).classList.remove('ready'));
 swapSlide.querySelector('.sys-panel').classList.remove('show');
 healAnims.forEach(a=>a.cancel());healAnims=[];healTimers.forEach(clearTimeout);healTimers=[];
 termLines.textContent='';swapTerm.style.opacity='0';termScroll.scrollTop=0;swapTerm.inert=true;deployRow.style.marginLeft='';deployRow.style.marginRight='';
 swapSlide.querySelector('.term-input').classList.remove('show');
 const gi=swapSlide.querySelector('.goal-input');gi.value='';
 deployA.style.opacity='0';deployA.style.display='';deployB.style.opacity='0';deployB.style.display='none';deployC.style.opacity='0';deployC.style.display='none';
 fakeCursor.classList.remove('show');fakeCursor.style.transform='';
 hsvg.style.opacity='0';
 healAccepted.clear();
}
// A Procept cell flies out of the terminal and drops into an API's place.
function dropCell(j,at){
 const [cx,cy]=HS.c1[j],cell=hq('cell-'+j),logo=hq('logo-'+j);
 cell.style.transformBox='fill-box';cell.style.transformOrigin='center';
 logo.style.transformBox='fill-box';logo.style.transformOrigin='center';
 healRun(logo,[{transform:'scale(1)',opacity:1},{transform:'scale(.15)',opacity:0}],{duration:320,delay:at+420,easing:'ease-in',fill:'both'});
 let dx=0,dy=-80;
 const ctm=hsvg.getScreenCTM&&hsvg.getScreenCTM();
 const tr=swapTerm.getBoundingClientRect();
 if(ctm){const inv=ctm.inverse();const tp=new DOMPoint(tr.left+tr.width/2,tr.top+tr.height-8).matrixTransform(inv);dx=tp.x-cx;dy=tp.y-cy}
 healRun(cell,[{transform:`translate(${dx}px,${dy}px) scale(.45)`,opacity:0,offset:0},{opacity:1,offset:.55},{transform:'translate(0px,0px) scale(1.08)',opacity:1,offset:.78},{transform:'translate(0px,0px) scale(1)',opacity:1,offset:1}],{duration:820,delay:at,easing:'cubic-bezier(.3,0,.2,1)',fill:'both'});
}
// After the goal, one idea at a time: private boundary, then sandboxes, then evaluation sweeps through and surfaces the problems.
// Schedules everything from t0 and returns when evaluation starts.
function playGovern(t0){
 let capK=-1;const show=k=>{if(capK>=0)healRun(hq('cap-'+capK),[{opacity:1},{opacity:0}],{duration:500,fill:'forwards'});capK=k;healRun(hq('cap-'+k),[{opacity:0},{opacity:1}],{duration:700,easing:'ease-out',fill:'forwards'})};
 const fade=(el,delay)=>healRun(el,[{opacity:1},{opacity:0}],{duration:700,delay,easing:'ease-in-out',fill:'forwards'});
 const all=[...HS.c1,...HS.c2],tE=t0+7000;
 healAt(t0,()=>show(0));
 healRun(hq('private'),[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:1400,delay:t0,easing:'ease-in-out',fill:'forwards'});
 fade(hq('private'),t0+3000);
 healAt(t0+3600,()=>{show(1);all.forEach((_,j)=>{const el=hq('sbx-'+j);el.style.transformBox='fill-box';el.style.transformOrigin='center';
  healRun(el,[{opacity:0},{opacity:1}],{duration:700,delay:j*220,easing:'ease-out',fill:'forwards'});fade(el,2200)})});
 healAt(tE,()=>{
  show(2);
  healRun(hq('scan'),[{opacity:.9,transform:'translateX(0)'},{opacity:.9,transform:'translateX(592px)',offset:.9},{opacity:0,transform:'translateX(592px)'}],{duration:1900,easing:'linear',fill:'forwards'});
 });
 // once all three have been shown, they settle on the right of the terminal as a list under "System 5"
 healAt(tE+3200,()=>{[0,1,2].forEach(k=>healRun(hq('cap-'+k),[{opacity:+(k===capK)},{opacity:0}],{duration:600,fill:'forwards'}));swapSlide.querySelector('.sys-panel').classList.add('show')});
 return tE;
}
function playSwap(){
 resetSwap();
 const term=swapTerm;
 // 1) "Your tools stay as they are": the frame and the tool cards come in with the first phrase
 const fadeIn=(el,delay,dur=700)=>healRun(el,[{opacity:0},{opacity:1}],{duration:dur,delay,easing:'ease-out',fill:'both'});
 healRun(hsvg,[{opacity:0},{opacity:1}],{duration:400,delay:200,fill:'both'});
 fadeIn(swapSlide.querySelector('.t1'),300);
 fadeIn(swapSlide.querySelector('.t2'),1300);
 fadeIn(hq('g-tools'),1300,900);
 // click 1: the frontier API calls those tools make today, the deployment copy and the terminal
 waitClick(()=>{
  fadeIn(hq('head-api'),0);HS.c1.forEach((_,i)=>{fadeIn(hq('logo-'+i),i*150);fadeIn(hq('api-'+i),300+i*150);fadeIn(hq('apil-'+i),300+i*150)});
  healAt(1200,()=>{
   alignRow();
   healRun(deployA,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'ease-out',fill:'both'});
   healRun(term,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'ease-out',fill:'both'});
  });
  typeLine('$ system5 deploy','cmd',1700,50);
  typeLine('> api.openai.com → procept cell','ok',2400,50);
  // click 2: "Procept agents sit on top" as the Procept cells fly out of the terminal and drop in
  healAt(3400,()=>waitClick(()=>{
   HS.c1.forEach((_,j)=>dropCell(j,j*260));
   // the API call arrows turn into solid Procept links, and the column is renamed
   healAt(1400,()=>{
    HS.c1.forEach((_,i)=>{
     healRun(hq('api-'+i),[{opacity:1},{opacity:0}],{duration:500,fill:'both'});
     healRun(hq('apil-'+i),[{opacity:1},{opacity:0}],{duration:500,fill:'both'});
     healRun(hq('link-'+i),[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:700,delay:i*120,easing:'ease-out',fill:'both'});
    });
    healRun(hq('head-api'),[{opacity:1},{opacity:0}],{duration:400,fill:'both'});
    healRun(hq('head-cell'),[{opacity:0},{opacity:1}],{duration:500,delay:300,fill:'both'});
   });
   // the terminal integrates the coding agent
   typeLine('$ integrate your coding agent','cmd',3200,50);
   typeLine('> claude-code connected','ok',3800,50);
   // the interview copy takes over, the terminal asks for the goal and waits for the user
   healAt(4900,()=>{
    healRun(deployA,[{opacity:1},{opacity:0}],{duration:350,fill:'forwards'}).finished.then(()=>{deployA.style.display='none'});
    deployB.style.display='block';
    healRun(deployB,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'ease-out',fill:'both'});
   });
   typeLine('what are your goals?','ok',5500,50);
   healAt(6500,()=>{
    swapSlide.querySelector('.term-input').classList.add('show');
    term.inert=false;
    pointCursor(swapSlide.querySelector('.goal-input'));
    swapSlide.querySelector('.goal-input').focus({preventScroll:true});
   });
  },swapTerm));
 },hsvg,2200);
}
// After the user's goal: acknowledge it, type the rest of the terminal, grow the green web
let swapGoal='';
function continueSwap(goal){
 swapGoal=goal;
 swapTerm.inert=true;
 const echo=document.createElement('div');echo.className='ok';echo.textContent='> '+goal;termLines.appendChild(echo);termScroll.scrollTop=termScroll.scrollHeight;
 typeLine('> understood. goals captured','ok',250,50);
 // click 3: "and connect them to your customers", then the rest of the deployment
 healAt(1000,()=>waitClick(continueDeploy,hsvg,1800));
}
function continueDeploy(){
 // the deployment copy hands over to the private, self-hosted agents
 healAt(450,()=>{
  healRun(deployB,[{opacity:1},{opacity:0}],{duration:350,fill:'forwards'}).finished.then(()=>{deployB.style.display='none'});
  deployC.style.display='block';
  healRun(deployC,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'ease-out',fill:'both'});
 });
 typeLine('$ deploy agents','cmd',1400,50);
 typeLine('> web online · self-healing','ok',2100,50);
 // the second row of agents joins, and the green links carry work through to the customers
 HS.c2.forEach((_,k)=>{
  const c=hq('cell2-'+k);c.style.transformBox='fill-box';c.style.transformOrigin='center';
  healRun(c,[{opacity:0},{opacity:1}],{duration:800,delay:2450+k*200,easing:'ease-out',fill:'both'});
 });
 healRun(hq('cust'),[{opacity:0},{opacity:1}],{duration:800,delay:2600,easing:'ease-out',fill:'both'});
 healRun(hq('head-cell'),[{opacity:1},{opacity:0}],{duration:500,delay:2500,fill:'both'});
 healRun(hq('head-sys'),[{opacity:0},{opacity:1}],{duration:700,delay:3000,fill:'both'});
 for(let k=0;k<HS.nWeb;k++)healRun(hq('web-'+k),[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:650,delay:2900+k*110,easing:'ease-out',fill:'both'});
 const tDone=3850;
 typeLine('$ system5 govern','cmd',tDone+100,50);
 const tE=playGovern(tDone+900);
 typeLine('$ system5 evaluate','cmd',tE,50);
 const tProb=tE+350;
 healRun(hq('packets'),[{opacity:0},{opacity:1}],{duration:600,delay:tDone-200,fill:'both'});
 // evaluation turns the goal into suggested changes: one fix to the existing stack, two improvements to the system
 const g=swapGoal.length>42?swapGoal.slice(0,41)+'…':swapGoal;
 hq('goal').textContent=`CHANGES SUGGESTED FOR YOUR GOAL: “${g.toUpperCase()}”`;
 healRun(hq('goal'),[{opacity:0},{opacity:1}],{duration:700,delay:tProb,fill:'both'});
 [0,1,2].forEach(i=>{
  healRun(hq('prob-'+i),[{opacity:0},{opacity:1}],{duration:600,delay:tProb+400+i*500,fill:'both'});
  healRun(hq('probl-'+i),[{opacity:0},{opacity:1}],{duration:500,delay:tProb+550+i*500,fill:'both'});
 });
 typeLine(`> goal: "${g}"`,'ok',tProb+300,30);
 typeLine('! fix · GeoData latency 950 ms','warn',tProb+900,30);
 typeLine('+ improve · spawn a forecasting agent','ok',tProb+1400,30);
 typeLine('+ improve · route agents straight to customers','ok',tProb+1900,30);
 typeLine('> 3 changes suggested · click to apply','cmd',tProb+2600,40);
 // the suggestions become clickable and the ghost cursor points at the first one
 healAt(tProb+2800,()=>{probReady=true;[0,1,2].forEach(i=>hq('probl-'+i).classList.add('ready'));pointCursor(hq('probl-0'))});
}
// A ghost cursor glides to the interactive parts so the viewer knows when to click or type.
function pointCursor(el){
 if(!el||reduced.matches)return;
 const sr=swapStage.getBoundingClientRect(),r=el.getBoundingClientRect();
 const cx=el.matches('input')?r.left+70:r.left+r.width/2;
 fakeCursor.style.transform=`translate(${Math.round(cx-sr.left-10)}px,${Math.round(r.top-sr.top+r.height/2-6)}px)`;
 fakeCursor.querySelector('.cursor-hint').textContent=el.matches('input')?'type, then hit enter':'click';
 fakeCursor.classList.add('show');
 swapSlide.querySelectorAll('.nudge').forEach(n=>n.classList.remove('nudge'));
}
function hideCursor(){fakeCursor.classList.remove('show');swapSlide.querySelectorAll('.nudge').forEach(n=>n.classList.remove('nudge'))}
// The deploy row lines up with the drawn width of the graph on the left, and the terminal
// pushes all the way to the right edge of the stage.
function alignRow(){
 if(window.innerWidth<=760)return;
 const sr=swapStage.getBoundingClientRect(),vr=hsvg.getBoundingClientRect();
 const contentW=Math.min(vr.width,vr.height*1180/HS.vh);
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
// Clicking a red problem badge on the diagram fixes it: the link turns green and a FIXED chip lands on it.
function acceptFix(i){
 if(healAccepted.has(i)||!probReady)return;healAccepted.add(i);
 hideCursor();
 healRun(hq('prob-'+i),[{opacity:1},{opacity:0}],{duration:400,fill:'forwards'});
 healRun(hq('probl-'+i),[{opacity:1},{opacity:0}],{duration:400,fill:'forwards'});
 hq('probl-'+i).classList.remove('ready');
 // the change lands: new connections draw in, and a new agent joins when one was suggested
 healRun(hq('fixb-'+i),[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:900,easing:'ease-in-out',fill:'forwards'});
 if(i===1){
  healRun(hq('newcell'),[{opacity:0},{opacity:1}],{duration:700,delay:reduced.matches?0:500,easing:'ease-out',fill:'forwards'});
  healRun(hq('fixb-1b'),[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:700,delay:reduced.matches?0:900,easing:'ease-out',fill:'forwards'});
 }
 healRun(hq('fixc-'+i),[{opacity:0},{opacity:1}],{duration:400,delay:reduced.matches?0:900,fill:'forwards'});
 const cmds=[['$ apply fix --cache ttl geodata','✓ GeoData latency 950 ms → 40 ms'],['$ spawn agent forecast --goal','✓ forecasting agent online · on-time +18%'],['$ rewire geodata-agent → customers','✓ response time −40%']];
 typeLine(cmds[i][0],'cmd',60,35);
 typeLine(cmds[i][1],'ok',600,35);
 // the ghost cursor moves on to the next suggestion
 healAt(reduced.matches?0:1100,()=>{
  const left=[0,1,2].filter(k=>!healAccepted.has(k));
  if(left.length)pointCursor(hq('probl-'+left[0]));
  else{typeLine('✓ system rebuilt around your goal · v1 → v2','ok',300,35);typeLine('> re-evaluating continuously…','cmd',1600,35)}
 });
 hsvg.setAttribute('aria-label',`${healAccepted.size} of 3 suggested changes applied.${healAccepted.size===3?' The system has been rebuilt around the goal.':''}`);
}
[0,1,2].forEach(i=>{const b=hq('probl-'+i);b.addEventListener('click',e=>{e.stopPropagation();acceptFix(i)});b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();acceptFix(i)}})});

// ---- Page 2: the headline comes in, the exponential curve draws itself, then the left side ----
const costSlide=sections[COSTS];
let costAnims=[],costTimers=[];
let costOff=0;
const costRun=(el,frames,opts)=>{const a=el.animate(frames,reduced.matches?{...opts,delay:0,duration:1,easing:'linear'}:{...opts,delay:Math.max(0,(opts.delay||0)-costOff)});costAnims.push(a);return a};
let costRaf=0;
const PROMPTS=['Summarize supplier contracts','Draft vendor email','Classify this invoice','Forecast Q3 demand','Reroute late shipment','Explain this variance','Translate PO to German','Match receipt to order','Write a status report','Flag risky suppliers','Reconcile inventory','Extract line items','Rewrite escalation note','Score this lead'];
function resetCosts(){
 gateClear();
 cancelAnimationFrame(costRaf);costRaf=0;
 costSlide.querySelectorAll('.chat-feed').forEach(f=>f.replaceChildren());
 costSlide.querySelector('.cost-meter').style.opacity='0';costSlide.querySelector('.cost-dot').style.opacity='0';
 costAnims.forEach(a=>a.cancel());costAnims=[];costTimers.forEach(clearTimeout);costTimers=[];
 costSlide.querySelectorAll('.cost-a,.cost-b,.statement').forEach(el=>{el.style.opacity='0'});
 costSlide.querySelectorAll('.cost-left,.cost-right,.cost-arrow').forEach(el=>{el.style.opacity='0'});
 costSlide.querySelectorAll('.cost-packet').forEach(el=>{el.style.opacity='0'});
 const curve=costSlide.querySelector('.cost-curve');curve.style.opacity='0';curve.style.strokeDashoffset='1';
 costSlide.querySelector('.cost-scene').style.opacity='0';
}
// Every prompt the company sends lands as a line of text with its price, and the price keeps climbing
// as the total spend rides up the exponential curve.
function runPromptMeter(){
 const SPAN=10.5,DUR=3500,cx=t=>300+460*t,cy=t=>330-235*Math.pow(2,SPAN*t)/Math.pow(2,SPAN);
 const meter=costSlide.querySelector('.cost-meter'),dot=costSlide.querySelector('.cost-dot'),feeds=[...costSlide.querySelectorAll('.chat-feed')].reverse();
 const nPrompts=costSlide.querySelector('.meter-prompts'),nSpend=costSlide.querySelector('.meter-spend');
 const money=v=>v>=1e6?`$${(v/1e6).toFixed(2)}M`:v>=1e4?`$${Math.round(v/1e3)}K`:v>=1e3?`$${(v/1e3).toFixed(1)}K`:`$${Math.round(v)}`;
 const price=v=>{const p=v/20000;return p<1?`$${p.toFixed(2)}`:p<100?`$${p.toFixed(1)}`:`$${Math.round(p)}`};
 const paint=p=>{const spend=1000*Math.pow(2,SPAN*p);nSpend.textContent=money(spend);nPrompts.textContent=Math.round(spend/0.05).toLocaleString('en-US');
  dot.setAttribute('cx',cx(p).toFixed(1));dot.setAttribute('cy',cy(p).toFixed(1));
  const hot=p>.75?'#ff5b52':p>.5?'#d9a05b':'#00b368';nSpend.style.fill=hot;dot.style.fill=hot;return spend};
 meter.style.opacity='1';dot.style.opacity='1';
 if(reduced.matches){paint(1);return}
 const t0=performance.now();let nextAt=0,n=0;
 const spawn=(spend,p)=>{
  // the thread scrolls: every older message steps up one row, the oldest fall off the top
  const STEP=30,ROWS=7,feed=feeds[[0,1,0,2,0,1,2][n%7]];
  feed.querySelectorAll('.chat-msg').forEach(m=>{const k=+m.dataset.k+1;m.dataset.k=k;m.style.transform=`translateY(${-k*STEP}px)`;if(k>ROWS)m.remove()});
  const g=document.createElementNS('http://www.w3.org/2000/svg','g');
  const hot=p>.75?'#ff5b52':p>.5?'#d9a05b':'#00b368';
  const text=PROMPTS[n++%PROMPTS.length];
  g.setAttribute('class','chat-msg');g.dataset.k='0';
  g.innerHTML=`<g class="chat-in"><rect class="chat-bubble" y="-24" height="24" rx="12"/><text class="chat-text" y="-8">${text.length>22?text.slice(0,21)+'…':text}</text><rect class="chat-price-bg" y="-20" height="16" rx="8" fill="${hot}" fill-opacity=".14"/><text class="chat-price" y="-8.5" fill="${hot}" text-anchor="middle">${price(spend)}</text></g>`;
  feed.appendChild(g);
  // measure the real text so the bubble hugs it, right aligned like a sent message
  // the windows behind only peek out on the left, so they show just the climbing price
  const back=feed.dataset.align==='left';if(back)g.firstChild.children[1].textContent='';
  const [bub,tx,pbg,pt]=g.firstChild.children,tw=back?-12:tx.getComputedTextLength(),pw=pt.getComputedTextLength()+12,w=Math.min(216,tw+pw+26),x=back?+feed.dataset.left:feed.dataset.right-w,right=x+w;
  bub.setAttribute('x',x);bub.setAttribute('width',w);tx.setAttribute('x',x+11);
  pbg.setAttribute('x',right-4-pw);pbg.setAttribute('width',pw);pt.setAttribute('x',right-4-pw/2);
  const a=g.firstChild.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'cubic-bezier(.2,.7,.3,1)'});
  costAnims.push(a);
 };
 const tick=now=>{
  const e=now-t0,p=Math.min(1,e/DUR),spend=paint(p);
  // prompts arrive faster and faster, from two a second up to a flood
  if(e>=nextAt&&p<1){spawn(spend,p);nextAt=e+Math.max(60,500*Math.pow(.1,p))}
  if(p<1)costRaf=requestAnimationFrame(tick);
 };
 costRaf=requestAnimationFrame(tick);
}
function playCosts(){
 resetCosts();
 const show=(el,delay)=>costRun(el,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,delay,easing:'ease-out',fill:'both'});
 const scene=costSlide.querySelector('.cost-scene');
 // 1) the first sentence and the whole left chart arrive together
 show(costSlide.querySelector('.cost-a'),200);
 costRun(scene,[{opacity:0},{opacity:1}],{duration:600,delay:200,easing:'ease-out',fill:'both'});
 costRun(costSlide.querySelector('.cost-left'),[{opacity:0},{opacity:1}],{duration:600,delay:200,easing:'ease-out',fill:'both'});
 // 2) the exponential curve races up and the counters start climbing, all with the left chart
 const curve=costSlide.querySelector('.cost-curve');
 costRun(curve,[{opacity:0,strokeDashoffset:1},{opacity:1,strokeDashoffset:0}],{duration:reduced.matches?1:900,delay:300,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
 costTimers.push(setTimeout(runPromptMeter,reduced.matches?0:400));
 // click 1: the arrow points across, and the second sentence lands with the whole right chart
 const costB=()=>{
 costRun(costSlide.querySelector('.cost-right'),[{opacity:0},{opacity:1}],{duration:600,delay:7000,easing:'ease-out',fill:'both'});
 costRun(costSlide.querySelector('.cost-arrow'),[{opacity:0},{opacity:1}],{duration:400,delay:7000,fill:'both'});
 costRun(costSlide.querySelector('.cost-arrow-line'),[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:600,delay:7100,easing:'ease-out',fill:'forwards'});
 show(costSlide.querySelector('.cost-b'),7000);
 costSlide.querySelectorAll('.cost-logo').forEach((el,i)=>{el.style.transformBox='fill-box';el.style.transformOrigin='center';
  costRun(el,[{opacity:0,transform:'scale(.85)'},{opacity:1,transform:'scale(1)'}],{duration:520,delay:7000+i*120,easing:'ease-out',fill:'both'})});
 if(!reduced.matches){
  costSlide.querySelectorAll('.cost-packet').forEach((el,i)=>costRun(el,[{opacity:0},{opacity:1}],{duration:300,delay:7100+i*60,fill:'forwards'}));
  costTimers.push(setTimeout(()=>costSlide.querySelectorAll('.cost-packet animateMotion').forEach(p=>p.beginElement()),300));
 }
 // click 2: the subtitle
 costTimers.push(setTimeout(()=>{costOff=12000;show(costSlide.querySelector('.statement'),12000);costOff=0},reduced.matches?0:5000));
 };
 costTimers.push(setTimeout(()=>{costOff=7000;costB();costOff=0},reduced.matches?0:4400));
}
const agentsSlide=sections[AGENTS];
let agentsAnims=[],agentsTimers=[],agentsLoop=0;
let agOff=0;
const agentsRun=(el,frames,opts)=>{const a=el.animate(frames,reduced.matches?{...opts,delay:0,duration:1,easing:'linear'}:{...opts,delay:Math.max(0,(opts.delay||0)-agOff)});agentsAnims.push(a);return a};
function resetAgents(){
 gateClear();
 agentsAnims.forEach(a=>a.cancel());agentsAnims=[];agentsTimers.forEach(clearTimeout);agentsTimers=[];clearInterval(agentsLoop);
 agentsSlide.querySelector('.hub-num').textContent='0';
 agentsSlide.querySelectorAll('.ta-chip').forEach(c=>c.style.opacity='0');
}
function playAgents(){
 resetAgents();
 const q=sel=>agentsSlide.querySelector(sel),[cx,cy]=TEAM_C,at=(x,y,s=1)=>`translate(${x}px,${y}px) scale(${s})`;
 const show=(el,delay)=>agentsRun(el,[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,delay,easing:'ease-out',fill:'both'});
 // 1) the first sentence lands as one genius agent walks in and lights up
 show(q('.agents-a'),200);
 const genius=q('#ta-0');
 agentsRun(genius,[{opacity:0,transform:at(cx+320,cy,1.9)},{opacity:1,transform:at(cx,cy,1.9)}],{duration:1100,delay:500,easing:'cubic-bezier(.2,.7,.3,1)',fill:'both'});
 agentsRun(q('.genius-fx'),[{opacity:0},{opacity:1}],{duration:600,delay:1500,fill:'both'});
 // click 1: the second sentence, as the genius steps into its place and the rest of the team arrives around it
 const agB=()=>{
 show(q('.agents-b'),4200);
 agentsRun(q('.genius-fx'),[{opacity:1},{opacity:0}],{duration:400,delay:4200,fill:'forwards'});
 agentsRun(genius,[{opacity:1,transform:at(cx,cy,1.9)},{opacity:1,transform:at(...TEAM_SLOTS[0])}],{duration:900,delay:4300,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
 TEAM_SLOTS.forEach(([x,y],k)=>{if(!k)return;const fx=cx+(x-cx)*2.6,fy=cy+(y-cy)*2.6;
  agentsRun(q('#ta-'+k),[{opacity:0,transform:at(fx,fy)},{opacity:1,transform:at(x,y)}],{duration:900,delay:4400+k*140,easing:'cubic-bezier(.2,.7,.3,1)',fill:'both'})});
 agentsRun(q('.team-hub'),[{opacity:0},{opacity:1}],{duration:500,delay:5300,fill:'both'});
 agentsSlide.querySelectorAll('.team-link').forEach((el,n)=>agentsRun(el,[{strokeDashoffset:1},{strokeDashoffset:0}],{duration:500,delay:5500+n*60,easing:'ease-out',fill:'both'}));
 // 3) they start talking, and finished tasks pop up and add to the shared outcomes
 agentsRun(q('.team-packets'),[{opacity:0},{opacity:1}],{duration:400,delay:6200,fill:'both'});
 if(reduced.matches)return;
 agentsTimers.push(setTimeout(()=>agentsSlide.querySelectorAll('.team-packet animateMotion').forEach(m=>m.beginElement()),2000));
 const TASKS=['FORECAST','REROUTE','RECONCILE','RESTOCK','APPROVE','INVOICE','SCHEDULE','RESOLVE'],order=[2,0,3,1,4];
 let n=0;const num=q('.hub-num');
 agentsTimers.push(setTimeout(()=>{agentsLoop=setInterval(()=>{
  const chip=q('#ta-'+order[n%5]+' .ta-chip');chip.querySelector('text').textContent='✓ '+TASKS[n%TASKS.length];
  agentsRun(chip,[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)',offset:.15},{opacity:1,offset:.75},{opacity:0,transform:'translateY(-8px)'}],{duration:1800,easing:'ease-out'});
  n++;num.textContent=String(n);
 },850)},2600));
 };
 agentsTimers.push(setTimeout(()=>gateWait(agentsSlide,()=>{agOff=4200;agB();agOff=0},agentsSlide.querySelector('.team-scene')),reduced.matches?0:3500));
}
const initial=location.hash.match(/^#slide-(\d+)$/);
if(initial)position=Math.min(slides.length-1,Number(initial[1]));
render();
scheduleHint(position);
if(current===COSTS)playCosts();
if(current===SWAP)playSwap();
if(current===AGENTS)playAgents();
if(current===SEARCH2)playSearch2();
if(sections[current].classList.contains('closer'))armTagline(sections[current]);
// First slide gets the same bring-in treatment as a navigated arrival.
sections[current].classList.add('arriving');
setTimeout(()=>sections[current].classList.remove('arriving'),900);
