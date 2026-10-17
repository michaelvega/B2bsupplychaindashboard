'use strict';
const sprites=['01_mint','02_peach','03_lavender','04_butter','05_blush'];
const sprite=(i,x,y,size=58)=>`<image class="sprite" href="agents/${sprites[i%5]}.png" x="${x-size/2}" y="${y-size/2}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`;
const positions=[[105,125],[310,90],[560,140],[790,90],[1010,160],[205,280],[445,260],[700,290],[940,330],[100,435],[340,450],[605,435],[825,455],[1080,450]];
function agents(){const jobs=['Planner','Researcher','Analyst','geocode','search','fetch','run_model','score','report'];return `<svg class="scene" viewBox="0 0 1180 560" role="img" aria-label="Fourteen independent agents each working on a separate task">${positions.map(([x,y],i)=>`<g class="agent-float" style="--i:${i}"><path d="M${x-46} ${y+51}h92 M${x-46} ${y+46}v10 M${x+46} ${y+46}v10" stroke="#2a2a28" fill="none"/>${sprite(i,x,y,65)}<text class="task" x="${x}" y="${y+73}" text-anchor="middle">${jobs[i%jobs.length]}</text><path d="M${x+42} ${y-16}h22 m-22 6h14 m-14 6h18" stroke="#8a8a86" stroke-width="1"/></g>`).join('')}</svg>`}
function bridge(){let points=[];for(let i=0;i<9;i++)points.push([125+i*115,350-Math.sin(i/8*Math.PI)*70]);for(let i=0;i<8;i++)points.push([182+i*115,245-Math.sin(i/7*Math.PI)*95]);let lines='';for(let i=0;i<8;i++){for(const [a,b] of [[i,i+1],[i,9+i],[i+1,9+i],...(i<7?[[9+i,10+i]]:[])]){const [x,y]=points[a],[xx,yy]=points[b];lines+=`<path class="bridge-strand" d="M${x} ${y}L${xx} ${yy}"/><path class="bridge-strand fine" d="M${x+3} ${y-3}L${xx+3} ${yy-3}"/>`;}}return `<svg class="scene bridge-trigger" viewBox="0 0 1180 530" role="button" tabindex="0" aria-label="Break the spaghetti and marshmallow bridge"><path d="M30 450H165V368H30M1015 368h135v82h-135" stroke="#8a8a86" fill="#161615"/><g class="bridge-assembly">${lines}${points.map(([x,y],i)=>`<g transform="rotate(${i%2?8:-9} ${x} ${y})"><rect class="marshmallow" x="${x-12}" y="${y-10}" width="24" height="20" rx="4"/><path d="M${x-8} ${y+5}h16" stroke="#b0b0ac"/></g>${i>=9?sprite(i,x,y-43,56):''}`).join('')}</g></svg>`}
const nodeData=[
{id:'Planner',type:'prompt',weight:100,failures:0,avg_latency_ms:140,total_tokens:12400},
{id:'Researcher',type:'prompt',weight:75,failures:0,avg_latency_ms:210,total_tokens:10200},
{id:'Analyst',type:'prompt',weight:55,failures:0,avg_latency_ms:180,total_tokens:8500},
...['geocode','search','fetch','run_model','score','report'].map((id,i)=>({id,type:'tool',weight:85-i*10,failures:0,avg_latency_ms:40,total_tokens:0})),
...['GeoData','Postgres','MLflow'].map((id,i)=>({id,type:'data_op',weight:80-i*15,failures:3+i,avg_latency_ms:950+i*300,total_tokens:0}))].map(n=>({...n,label:n.id}));
const edgeData=[...Array.from({length:6},(_,i)=>({source:nodeData[Math.floor(i/2)].id,target:nodeData[i+3].id,type:'calls',failures:0})),...Array.from({length:6},(_,i)=>({source:nodeData[i+3].id,target:nodeData[9+Math.floor(i/2)].id,type:'hits',failures:3+Math.floor(i/2)})),...Array.from({length:3},(_,i)=>({source:nodeData[9+i].id,target:nodeData[i].id,type:'returns',failures:0}))];
function graph(id,fixes=false,converge=false){
 const xs={prompt:120,tool:400,data_op:680};
 const nodes=nodeData.map(n=>({...n,r:12+14*Math.sqrt(n.weight/100),x:xs[n.type]}));
 // Weighted initial order, then barycenter passes within each fixed column.
 let columns=['prompt','tool','data_op'].map(t=>nodes.filter(n=>n.type===t).sort((a,b)=>b.weight-a.weight));
 const indexOf=n=>columns.flatMap(c=>c.map((v,i)=>[v.id,i/(c.length-1||1)])).find(v=>v[0]===n)?.[1]??0;
 for(let pass=0;pass<2;pass++)for(const column of columns){const center=n=>{const near=edgeData.filter(e=>e.type!=='returns'&&(e.source===n.id||e.target===n.id)).map(e=>indexOf(e.source===n.id?e.target:e.source));return near.reduce((a,b)=>a+b,0)/(near.length||1)};column.sort((a,b)=>center(a)-center(b)||b.weight-a.weight)}
 for(const column of columns){const total=column.reduce((sum,n)=>sum+2*n.r,0)+(column.length-1)*24;let y=290-total/2;for(const n of column){n.y=y+n.r;y+=2*n.r+24}}
 const lookup=Object.fromEntries(nodes.map(n=>[n.id,n]));
 const paths=edgeData.map((e,i)=>{const s=lookup[e.source],t=lookup[e.target];let d;if(e.type==='returns'){const lane=i-12;d=`M${s.x-s.r} ${s.y} C${s.x-80} ${8+lane*18} ${t.x+90} ${8+lane*18} ${t.x+t.r} ${t.y}`}else{let start=s.x+s.r,end=t.x-t.r;d=`M${start} ${s.y} C${start+(end-start)*.45} ${s.y} ${start+(end-start)*.55} ${t.y} ${end} ${t.y}`;}return `<path id="${id}-edge-${i}" class="edge ${e.type}" data-target="${e.target}" d="${d}" marker-end="url(#${id}-arrow)"/>${e.type==='calls'?`<circle class="packet" r="2.5"><animateMotion dur="${2.5+i*.2}s" repeatCount="indefinite" path="${d}"/></circle>`:''}`}).join('');
 const shapes=nodes.map((n,i)=>`<g class="graph-node" data-node="${n.id}"><title>${n.label}: ${n.weight} uses; ${n.failures} failures; ${n.avg_latency_ms} ms</title>${n.type==='prompt'?sprite(i,n.x,n.y,n.r*2+8):`<g transform="translate(${n.x} ${n.y})${n.type==='tool'?' rotate(45)':''}"><rect x="${-n.r*.66}" y="${-n.r*.66}" width="${n.r*1.32}" height="${n.r*1.32}" fill="${n.type==='tool'?'#7a7a74':'#b8b8b0'}" stroke="#1c1c1c" stroke-width="1.5"/><path d="M-7-7h5v5h-5z M2-7h5v5H2z M-2-2h4v4h-4z M-7 2h5v5h-5z M2 2h5v5H2z" fill="#1c1c1a"/></g>`}<text class="node-name" x="${n.x}" y="${n.y+n.r+15}" text-anchor="middle">${n.label}</text></g>`).join('');
 const fixesSvg=['GeoData','Postgres','MLflow'].map((name,i)=>{let y=lookup[name].y;return `<rect data-fix="${i}" class="fix-node" x="531" y="${y-14}" width="46" height="28"/><text data-fix="${i}" class="fix-label" x="554" y="${y+4}" text-anchor="middle">${['TTL','Pool','Reg.'][i]}</text>`}).join('');
 const incoming=converge?positions.slice(0,9).map(([x,y],i)=>{let n=lookup[nodeData[i%3].id];return `<g class="converge-agent" style="--i:${i};--dx:${x*.7-n.x}px;--dy:${y-n.y}px">${sprite(i,n.x,n.y,48)}</g>`}).join(''):'';
 return `<div class="graph-wrap"><svg class="scene graph" id="${id}" viewBox="0 0 800 590" role="img" aria-label="Cognition graph: three agents call six tools that access three data operations. Grey connections indicate failures."><defs><marker id="${id}-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 1L7 4L0 7" fill="none" stroke="#e8e8e4"/></marker></defs><path class="separator" d="M260 70V540 M540 70V540"/>${paths}${shapes}${fixesSvg}${incoming}<text class="col-head" x="120" y="565" text-anchor="middle">AI AGENTS</text><text class="col-head" x="400" y="565" text-anchor="middle">TOOL CALLS</text><text class="col-head" x="680" y="565" text-anchor="middle">DATA OPERATIONS</text></svg>${fixes?`<aside class="fix-panel"><div class="fix-title">Problems & fixes</div>${['GeoData latency','Postgres drops','MLflow missing'].map((text,i)=>`<div class="fix-item"><p>${text}</p><button data-accept="${i}" aria-label="Accept ${['TTL cache','Pool','Registry'][i]} fix">+ ${['TTL cache','Pool','Registry'][i]}</button></div>`).join('')}</aside>`:''}</div>`;
}
function bullets(title,items){return `<h2>${title}</h2><div class="bullet-list">${items.map(([lead,body])=>`<div class="bullet"><strong>${lead}:</strong><span>${body}</span></div>`).join('')}</div><p class="statement">Your proprietary data stays untouched and your agents cannot realistically handle any of your operations</p>`}
function code(procept){return `<pre class="code-block"><code><span class="line-number">1</span>const response = await fetch(
<span class="line-number">2</span>  <span class="${procept?'changed':''}">"https://${procept?'procept.tech/system5':'api.openai.com/v1/chat/completions'}",</span>
<span class="line-number">3</span>  {
<span class="line-number">4</span>    method: "POST",
<span class="line-number">5</span>    headers,
<span class="line-number">6</span>    body: JSON.stringify({ model, messages })
<span class="line-number">7</span>  }
<span class="line-number">8</span>);</code></pre>`}
const slides=[
 ['hero',`<p class="intro">Procept’s new</p><h1>System <span class="green">5</span></h1><div class="hero-rule"></div>`],
 ['visual grid',agents()],
 ['question',`<h1>How do you manage<br>your <span class="green">agents?</span></h1>`],
 ['visual',`<h2>Current agent management system like LangChain</h2>${bridge()}`],
 ['bullets',bullets('Current agent management system like LangChain',[
 ['Blind and brittle','individual agents can only see adjacent agents, not the big picture'],
 ['Exponential cost','the more user actions, the more agent groups are called and the more the spend rises exponentially'],
 ['Manual sculpting','Every time the physical or operational reality changes, this macaroni bridge must be manually rechiseled']])],
 ['question',`<h2>Current 24/7 Operational Harnesses</h2><h1 class="subtitle">Are Dots and GrokBot<br><span class="green">better?</span></h1>`],
 ['bullets',bullets('Current 24/7 Operational Harnesses',[
 ['Short lived','Agents are ephemeral and frequently used workflows are never optimized'],
 ['Silo’ed existences','Each agent is built for one job only since true coordination requires documented workflows'],
 ['Exponential cost','frontier LLMs cost 3 orders of magnitude above SLMs, and still exponential with more users']])],
 ['question',`<h1>So how do<br>we <span class="green">fix this?</span></h1>`],
 ['systems',`${['Decision Making (Jev)','Reasoning (ChatGPT)','Coordination (Claude Code)','Digital Twins (Palantir Foundry)'].map((t,i)=>`<div class="system-row"><span>System ${i+1}:</span><p>${t}</p></div>`).join('')}<div class="system-row"><span>System 5:</span><div><p>All of the Above (Procept’s System 5)</p><p class="capabilities">Metacognitive<br>Self healing<br>Auto implementation of new value streams</p></div></div>`],
 ['visual grid',`<h2>All your agents…</h2>${agents()}`],
 ['visual grid',`<div class="graph-heading"><h2>Turning your company data into IP that grows in value over time</h2><span>System 5</span></div>${graph('cognition',false,true)}`],
 ['code-slide',`<h1>Just swap out<br>your LLM api call</h1>${code(false)}`],
 ['code-slide',`<h1>For Procept’s <span class="green">System 5</span></h1>${code(true)}`],
 ['visual grid telemetry',`<h2>Our system automatically ingests telemetry, logs, agent actions, and user actions and immediately shows you what is going wrong, where and why suggesting architectural changes and changes to the system prompt</h2>${graph('healing',true)}`],
 ['kpis',`<h2>Improving your KPIs and</h2><h1>Targeting User Actions<br>that you Choose</h1><div class="metric-row"><div class="metric"><span class="number">95%</span><p>ARC AGI 3 score of 95%, Mythos Class at 1/1000th of the size</p></div><div class="metric"><span class="number cost-range">10×–100×</span><span class="cost-label">cheaper</span><p>An order cheaper than Claude Code and 2 orders cheaper than Dots</p></div></div>`],
 ['hero',`<p class="intro">Procept’s new</p><h1>System <span class="green">5</span></h1><div class="hero-rule"></div><p class="thanks">Thank you</p>`]
];
const stage=document.querySelector('#stage');
stage.innerHTML=slides.map(([cls,html],i)=>`<section class="slide ${cls}" id="slide-${i}" role="group" aria-label="Slide ${i+1} of ${slides.length}" aria-hidden="true" inert>${html}</section>`).join('');
const sections=[...stage.children],nav=document.querySelector('#nav');
nav.innerHTML=slides.map((_,i)=>`<button aria-label="Go to slide ${i+1}" data-slide="${i}" aria-current="false"></button>`).join('');
let current=-1, position=0, transitioning=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function render(){const nearest=Math.round(position);
 sections.forEach((section,i)=>{const distance=i-position;const visible=Math.abs(distance)<.72;section.classList.toggle('active',visible);const opacity=Math.max(0,Math.min(1,(.72-Math.abs(distance))/.36));section.style.opacity=reduced.matches?(nearest===i?1:0):opacity;section.style.transform=reduced.matches?'none':`translateY(${distance*80}px)`;section.inert=i!==nearest;section.setAttribute('aria-hidden',String(i!==nearest));});
 if(current!==nearest){current=nearest;document.querySelector('#counter').textContent=`${String(current).padStart(2,'0')} / 15`;[...nav.children].forEach((b,i)=>b.setAttribute('aria-current',String(i===current)));document.querySelector('#previous').disabled=current===0;document.querySelector('#next').disabled=current===slides.length-1;}
 document.querySelector('#progress').style.width=`${position/(slides.length-1)*100}%`;
}
function go(index){
 if(transitioning)return;
 index=Math.max(0,Math.min(slides.length-1,index));
 if(index===position)return;
 const from=position, target=sections[index];
 if(index===3)resetBridge();
 transitioning=true;
 target.classList.add('arriving');
 history.replaceState(null,'',`#slide-${index}`);
 const finish=()=>{
  position=index;render();
  // Removing this class creates fresh CSS animations on every arrival.
  target.classList.remove('arriving');
  target.querySelectorAll('svg').forEach(svg=>{if(svg.setCurrentTime)svg.setCurrentTime(0)});
  transitioning=false;
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

const bridgeSlide=sections[3];
const bridgeAssembly=bridgeSlide.querySelector('.bridge-assembly');
const bridgeTrigger=bridgeSlide.querySelector('.bridge-trigger');
const bridgePieces=[...bridgeAssembly.children].map(child=>{
 const wrapper=document.createElementNS('http://www.w3.org/2000/svg','g');
 child.before(wrapper);wrapper.append(child);return wrapper;
});
let bridgeBroken=false;
let fallingPieces=[];
function resetBridge(){
 fallingPieces.forEach(animation=>animation.cancel());fallingPieces=[];
 bridgeBroken=false;bridgeAssembly.classList.remove('broken');
 bridgeTrigger.setAttribute('aria-label','Break the spaghetti and marshmallow bridge');
}
function breakBridge(){
 if(current!==3||transitioning||bridgeBroken)return;
 bridgeBroken=true;bridgeAssembly.classList.add('broken');
 bridgeTrigger.setAttribute('aria-label','The bridge has collapsed');
 bridgePieces.forEach((piece,i)=>{
  const box=piece.getBBox();
  const direction=(box.x+box.width/2-590)/590;
  const drift=direction*(90+(i%5)*30);
  const rotation=((i*47)%150-75);
  piece.style.transformOrigin=`${box.x+box.width/2}px ${box.y+box.height/2}px`;
  const frames=reduced.matches?[{opacity:1},{opacity:0}]:[
   {transform:'translate(0px,0px) rotate(0deg)',opacity:1,offset:0},
   {transform:`translate(${drift*.15}px,25px) rotate(${rotation*.2}deg)`,opacity:1,offset:.25},
   {transform:`translate(${drift*.55}px,230px) rotate(${rotation*.6}deg)`,opacity:1,offset:.6},
   {transform:`translate(${drift}px,850px) rotate(${rotation}deg)`,opacity:0,offset:1}
  ];
  fallingPieces.push(piece.animate(frames,{duration:reduced.matches?120:1100+(i%7)*65,delay:reduced.matches?0:(i%9)*18,easing:'ease-in',fill:'forwards'}));
 });
}
bridgeSlide.addEventListener('click',breakBridge);
bridgeTrigger.addEventListener('keydown',event=>{
 if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();breakBridge()}
});

const accepted=new Set();
document.querySelectorAll('[data-accept]').forEach(button=>button.onclick=()=>{
 const i=Number(button.dataset.accept);if(accepted.has(i))return;accepted.add(i);
 const svg=document.querySelector('#healing');const name=['GeoData','Postgres','MLflow'][i];const rect=svg.querySelector(`rect[data-fix="${i}"]`);const y=Number(rect.getAttribute('y'))+14;
 svg.querySelectorAll(`.hits[data-target="${name}"]`).forEach(path=>{const numbers=path.getAttribute('d').match(/-?\d+(?:\.\d+)?/g).map(Number);const sx=numbers[0],sy=numbers[1],ex=numbers[6],ey=numbers[7];const d=`M${sx} ${sy} C${sx+45} ${sy} 500 ${y} 531 ${y} M577 ${y} C600 ${y} ${ex-35} ${ey} ${ex} ${ey}`;path.setAttribute('d',d);if(!reduced.matches){const fade=document.createElementNS('http://www.w3.org/2000/svg','animate');fade.setAttribute('attributeName','opacity');fade.setAttribute('values','0.35;1');fade.setAttribute('dur','520ms');path.append(fade);fade.beginElement()}path.classList.add('fixed');});
 svg.querySelectorAll(`[data-fix="${i}"]`).forEach(n=>n.classList.add('fixed'));button.classList.add('accepted');button.textContent=`✓ ${['TTL cache','Pool','Registry'][i]}`;button.setAttribute('aria-label',`${name} fix accepted`);button.setAttribute('aria-pressed','true');
 const fixId=['TTL cache','Pool','Registry'][i];
 const targetNode=nodeData.find(n=>n.id===name);targetNode.failures=0;
 nodeData.push({id:fixId,label:fixId,type:'tool',weight:targetNode.weight,failures:0,avg_latency_ms:12,total_tokens:0});
 edgeData.filter(e=>e.type==='hits'&&e.target===name).forEach(e=>{e.target=fixId;e.failures=0});
 edgeData.push({source:fixId,target:name,type:'hits',failures:0});
 svg.setAttribute('aria-label',`Cognition graph. ${accepted.size} of 3 data operation fixes accepted. ${accepted.size===3?'All connections healthy.':''}`);
});
const initial=location.hash.match(/^#slide-(\d+)$/);
if(initial)position=Math.min(slides.length-1,Number(initial[1]));
render();
// Expose the toy model for inspection without making any network/API calls.
window.cognitionModel={nodes:nodeData,edges:edgeData};
