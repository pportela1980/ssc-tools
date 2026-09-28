(function () {
  'use strict';
  const scene = Experiment.canvas('field'), history = Experiment.canvas('history'), c = Experiment.colors;
  const input = id => document.getElementById(id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let model, flow = null, movedAt = 0;
  function settings() { return { target:+input('target').value, delay:+input('delay').value, response:+input('response').value, patience:+input('patience').value, mode:input('mode').value }; }
  function reset() { model=DelayModel.create(settings()); model.setTap(input('mode').value==='manual'?input('tap').value:50); flow=null; }
  function duration() { return 950/+input('speed').value; }
  function color(temp) { const p=Math.max(0,Math.min(1,(temp-15)/40)); return 'rgb('+Math.round(80+p*131)+','+Math.round(142-p*19)+','+Math.round(159-p*76)+')'; }
  function feeling() { const difference=model.metrics().temperature-model.options.target; return Math.abs(difference)<1?'Comfortable':difference<0?'Too cold':'Too hot'; }
  function draw() {
    const ctx=scene.context,w=scene.width,h=scene.height,m=model.metrics(),compact=w<600;
    ctx.fillStyle='#d8ddd0';ctx.fillRect(0,0,w,h);
    const phase=reducedMotion?1:Math.min(1,(performance.now()-movedAt)/duration());
    const xTap=w*.18,yTap=h*.66,xTop=w*.29,yTop=h*.21,xHead=w*.67,yHead=h*.3;
    const points=[[xTap,yTap],[xTop,yTap],[xTop,yTop],[xHead,yTop],[xHead,yHead]];
    const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1])),total=lengths.reduce((a,b)=>a+b,0);
    function onPipe(f){let distance=Math.max(0,Math.min(1,f))*total;for(let i=0;i<lengths.length;i++){if(distance<=lengths[i]){const p=distance/lengths[i];return [points[i][0]+(points[i+1][0]-points[i][0])*p,points[i][1]+(points[i+1][1]-points[i][1])*p];}distance-=lengths[i];}return points[points.length-1];}
    ctx.strokeStyle='#a9b5a6';ctx.lineWidth=18;ctx.lineJoin='round';ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();
    ctx.strokeStyle='#e9ece3';ctx.lineWidth=12;ctx.stroke();
    const water=flow&&phase<1?flow.travelling.slice().reverse():model.pipeline.slice().reverse();
    water.forEach((temp,i)=>{const fraction=(i+.5+(flow&&phase<1?phase:0))/water.length;if(fraction>1)return;const p=onPipe(fraction);ctx.fillStyle=color(temp);ctx.beginPath();ctx.arc(...p,4.5,0,Math.PI*2);ctx.fill();});
    if(flow&&phase<1&&phase>.5){const p=onPipe((phase-.5)/water.length);ctx.fillStyle=color(flow.entering);ctx.beginPath();ctx.arc(...p,4.5,0,Math.PI*2);ctx.fill();}
    // A restrained tap dial, with a visible pointer from cold to hot.
    const r=Math.min(w*.065,36);ctx.fillStyle='#eee9dd';ctx.strokeStyle='#4f6353';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(xTap,yTap,r,0,Math.PI*2);ctx.fill();ctx.stroke();
    const dial=-Math.PI*.85+m.tap/100*Math.PI*1.7;ctx.strokeStyle=color(m.entering);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(xTap,yTap);ctx.lineTo(xTap+Math.sin(dial)*r*.78,yTap-Math.cos(dial)*r*.78);ctx.stroke();
    ctx.fillStyle='#48594b';ctx.font='12px "DM Sans", sans-serif';ctx.textAlign='center';ctx.fillText('COLD',xTap-r-5,yTap+r+19);ctx.fillText('HOT',xTap+r+5,yTap+r+19);
    ctx.fillStyle='#677c6c';ctx.beginPath();ctx.ellipse(xHead,yHead,w*.045,6,0,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(xHead-w*.045,yHead,w*.09,4);
    const floor=h*.82;ctx.strokeStyle='#b1bdac';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(w*.48,floor);ctx.lineTo(w*.82,floor);ctx.stroke();
    ctx.strokeStyle=color(m.temperature);ctx.lineWidth=2;
    for(let i=0;i<9;i++){const x=xHead+(i-4)*w*.008;ctx.beginPath();ctx.moveTo(x,yHead+14);ctx.lineTo(x+(i-4)*w*.003,floor-12);ctx.stroke();}
    // Temperature gauge sits beside the shower. The target is marked directly on it.
    const gx=w*.9,gy=h*.3,gh=h*.46,gw=compact?9:13;
    ctx.fillStyle='#eee9dd';ctx.fillRect(gx-gw/2,gy,gw,gh);ctx.strokeStyle='#778b76';ctx.strokeRect(gx-gw/2,gy,gw,gh);
    const level=(m.temperature-15)/40;ctx.fillStyle=color(m.temperature);ctx.fillRect(gx-gw/2,gy+gh*(1-level),gw,gh*level);
    const ty=gy+gh*(1-(model.options.target-15)/40);ctx.strokeStyle='#3a4b3e';ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(gx-17,ty);ctx.lineTo(gx+17,ty);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#3e5143';ctx.textAlign='center';ctx.font=(compact?'16':'23')+'px "IBM Plex Mono", monospace';ctx.fillText(m.temperature.toFixed(1)+'°',gx,gy-14);
    ctx.font='12px "DM Sans", sans-serif';ctx.fillText(feeling(),w*.67,h*.94);ctx.fillText('Target '+model.options.target+'°',gx,h*.88);
    ctx.textAlign='left';ctx.fillText('Tap now: '+m.entering.toFixed(0)+'°C',w*.06,h*.1);
    ctx.textAlign='center';ctx.fillText(compact?'Water travelling →':'Water travelling · '+model.options.delay+' seconds before you feel it →',w*.49,h*.12);
    Experiment.chart(history,model.history,[{key:'temperature',color:c.blue}],{min:15,max:55,target:model.options.target});
    input('temperature').textContent=m.temperature.toFixed(1)+'°C';input('comfort').textContent=feeling();input('tap-position').textContent=m.tap.toFixed(0)+'% hot';
    const manual=model.options.mode==='manual';input('tap').disabled=!manual;
    if(!manual){input('tap').value=m.tap;document.querySelector('output[for="tap"]').value=m.tap.toFixed(0)+'%';}
    scene.element.setAttribute('aria-label','Shower: water reaching you '+m.temperature.toFixed(1)+' degrees Celsius, target '+model.options.target+', '+feeling()+'. Tap now mixes '+m.entering.toFixed(1)+' degrees; changes take '+model.options.delay+' seconds to arrive.');
  }
  const app=Experiment.mount({reset,draw,step:()=>{flow=model.step();movedAt=performance.now();},resize:()=>{scene.resize();history.resize();},rate:()=>+input('speed').value,transition:duration});
  input('delay').addEventListener('input',app.reset);
  ['target','response','patience','mode'].forEach(id=>input(id).addEventListener('input',()=>{Object.assign(model.options,settings());draw();}));
  input('tap').addEventListener('input',()=>{if(model.options.mode==='manual'){model.setTap(input('tap').value);draw();}});
  Experiment.presets(app,{quick:{target:37,delay:1,response:.8,patience:10,mode:'automatic',tap:50,speed:2},reactive:{target:37,delay:6,response:.8,patience:10,mode:'automatic',tap:50,speed:2},patient:{target:37,delay:6,response:.3,patience:85,mode:'automatic',tap:50,speed:2}});
}());
