const SCENARIOS=[
  {a:5,  b:8,  c:2.67, trail:600},
  {a:10, b:16, c:2.67, trail:300},
  {a:10, b:24, c:2.67, trail:700},
  {a:10, b:28, c:2.67, trail:800},
  {a:10, b:28, c:10.0, trail:600}
];

const canvas=document.getElementById('lorenzCanvas');
const ctx=canvas.getContext('2d');

function resize(){
  const w=canvas.parentElement.getBoundingClientRect().width;
  canvas.width=Math.floor(w);canvas.height=Math.floor(w*0.56);
}
resize();
window.addEventListener('resize',()=>{resize();initState();});

let a,b,c,x,y,z,trail=[],animId=null;
let TRAIL=800;const DT=0.008;

function readSliders(){
  a=parseFloat(document.getElementById('sl-a').value);
  b=parseFloat(document.getElementById('sl-b').value);
  c=parseFloat(document.getElementById('sl-c').value);
  ['a','b','c'].forEach(p=>{
    const v=p==='a'?a:p==='b'?b:c;
    document.getElementById('lbl-'+p).textContent=v.toFixed(1);
    document.getElementById('disp-'+p).textContent=v.toFixed(1);
  });
}

function setSliders(sa,sb,sc){
  document.getElementById('sl-a').value=sa;
  document.getElementById('sl-b').value=sb;
  document.getElementById('sl-c').value=sc;
  readSliders();
}

function initState(){x=0.1;y=0.0;z=0.0;trail=[];}

function step(){
  const dx=a*(y-x),dy=x*(b-z)-y,dz=x*y-c*z;
  x+=dx*DT;y+=dy*DT;z+=dz*DT;
  trail.push([x,z]);
  if(trail.length>TRAIL)trail.shift();
}

function project(px,pz){
  const cx=canvas.width/2,cy=canvas.height/2;
  const sx=canvas.width/80,sy=canvas.height/60;
  return[cx+px*sx,cy-(pz-25)*sy];
}

function systemState(){
  if(trail.length<120)return'stable';
  let mnX=1e9,mxX=-1e9,mnZ=1e9,mxZ=-1e9;
  for(let i=trail.length-120;i<trail.length;i++){
    if(trail[i][0]<mnX)mnX=trail[i][0];if(trail[i][0]>mxX)mxX=trail[i][0];
    if(trail[i][1]<mnZ)mnZ=trail[i][1];if(trail[i][1]>mxZ)mxZ=trail[i][1];
  }
  const sp=(mxX-mnX)+(mxZ-mnZ);
  if(sp<12)return'stable';
  if(sp<42)return'tension';
  return'chaos';
}

function updateUI(state){
  const badge=document.getElementById('state-badge');
  const colors={stable:'#1D9E75',tension:'#c97d1a',chaos:'#c0392b'};
  const labels={stable:'stable',tension:'under tension',chaos:'chaotic'};
  const cls={stable:'ss',tension:'st',chaos:'sc'};
  badge.textContent=labels[state];badge.style.color=colors[state];
  ['stable','tension','chaos'].forEach(s=>{
    const el=document.getElementById('box-'+s);
    el.classList.remove('ss','st','sc');
    if(s===state)el.classList.add(cls[s]);
  });
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#111110';ctx.fillRect(0,0,canvas.width,canvas.height);
  const state=systemState();
  const cm={stable:'rgba(29,158,117,',tension:'rgba(201,125,26,',chaos:'rgba(216,90,48,'};
  const col=cm[state];
  if(trail.length>1){
    for(let i=1;i<trail.length;i++){
      const alpha=(i/trail.length)*0.85;
      const[x1,y1]=project(trail[i-1][0],trail[i-1][1]);
      const[x2,y2]=project(trail[i][0],trail[i][1]);
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
      ctx.strokeStyle=col+alpha+')';ctx.lineWidth=1.2;ctx.stroke();
    }
  }
  if(trail.length>0){
    const[px,py]=project(trail[trail.length-1][0],trail[trail.length-1][1]);
    const dc={stable:'#1D9E75',tension:'#c97d1a',chaos:'#D85A30'};
    ctx.beginPath();ctx.arc(px,py,4.5,0,Math.PI*2);ctx.fillStyle=dc[state];ctx.fill();
  }
  updateUI(state);
}

function loop(){for(let i=0;i<4;i++)step();draw();animId=requestAnimationFrame(loop);}

function onSlider(){
  if(animId)cancelAnimationFrame(animId);
  readSliders();initState();loop();
}

function resetSim(){
  if(animId)cancelAnimationFrame(animId);
  readSliders();initState();loop();
}

function pushToEdge(){
  const sl=document.getElementById('sl-b');
  const cur=parseFloat(sl.value);
  const next=Math.min(35,cur+8);
  sl.value=next;b=next;
  document.getElementById('lbl-b').textContent=next.toFixed(1);
  document.getElementById('disp-b').textContent=next.toFixed(1);
}

function loadScenario(idx,btn){
  document.querySelectorAll('.sc-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const s=SCENARIOS[idx];
  TRAIL=s.trail;
  if(animId)cancelAnimationFrame(animId);
  setSliders(s.a,s.b,s.c);
  initState();loop();
}


window.SimulationShell.init({actions:{reset:resetSim}});
setSliders(10,15,2.67);
document.querySelectorAll('.sc-btn')[2].classList.add('active');
initState();loop();
