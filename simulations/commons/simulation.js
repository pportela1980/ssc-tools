(function () {
  'use strict';
  const lake = Experiment.canvas('field'), history = Experiment.canvas('history'), c = Experiment.colors;
  const input = id => document.getElementById(id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let model, flow = null, movedAt = 0, metrics;
  function settings() { return { regeneration: +input('regeneration').value, capacity: +input('capacity').value, agents: +input('agents-count').value, pressure: +input('pressure').value, visibility: +input('visibility').value, communication: input('communication').checked, monitoring: input('monitoring').checked }; }
  function reset() { model = CommonsModel.create(settings(), 42); metrics = model.metrics(); flow = null; }
  function duration() { return 850 / +input('speed').value; }
  function fish(ctx,x,y,size,color,angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle); ctx.fillStyle = color;
    ctx.beginPath(); ctx.ellipse(0,0,size,size*.42,0,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.moveTo(-size*.65,0); ctx.lineTo(-size*1.5,-size*.65); ctx.lineTo(-size*1.5,size*.65); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function condition() {
    if (!metrics.resource) return 'Collapsed';
    if (metrics.resource < model.options.capacity*.12) return 'Collapsing';
    if (flow && flow.end > flow.start + .2) return 'Recovering';
    if (metrics.resource < model.options.capacity*.45 || metrics.regime === 'Declining' || (flow && flow.end < flow.start - .5)) return 'Pressured';
    return metrics.regime === 'Stabilising' ? 'Stable' : 'Healthy';
  }
  function draw() {
    const ctx = lake.context, w = lake.width, h = lake.height, cx = w*.5, cy = h*.49, rx = w*.33, ry = h*.32;
    ctx.fillStyle = '#d8ddd0'; ctx.fillRect(0,0,w,h);
    const phase = reducedMotion ? 1 : Math.min(1, (performance.now()-movedAt)/duration());
    const visible = flow && phase < 1 ? phase < .35 ? flow.start + flow.growth*phase/.35 : flow.start+flow.growth-flow.harvest*(phase-.35)/.65 : metrics.resource;
    const health = Math.max(0,visible/model.options.capacity);
    // A shallow shore makes the lake boundary legible even after complete depletion.
    ctx.fillStyle = '#b9c5b1'; ctx.beginPath(); ctx.ellipse(cx,cy,rx+10,ry+9,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = health < .12 ? '#b3c0b8' : '#7eaaac'; ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#486b6c'; ctx.lineWidth = 1; ctx.stroke();
    ctx.strokeStyle = '#d2e0d488'; ctx.lineWidth = 1;
    for (let i=0;i<5;i++) { const x=cx+(i-2)*rx*.28,y=cy+Math.sin(i*4)*ry*.5; ctx.beginPath();ctx.moveTo(x-12,y);ctx.quadraticCurveTo(x,y+4,x+12,y);ctx.stroke(); }
    const fishCount = Math.round(120*health), size = Math.max(2.3,Math.min(4.2,w/180));
    for (let i=0;i<fishCount;i++) {
      const a=i*2.39996, r=Math.sqrt((i+.5)/120)*.86;
      const drift = metrics.t*.04 + phase*.015;
      const x=cx+Math.cos(a+drift)*rx*r,y=cy+Math.sin(a+drift)*ry*r;
      fish(ctx,x,y,size,'#365d62',Math.sin(i*2)*.5);
    }
    if (flow && phase<1 && flow.growth>0) {
      const count = Math.min(12,Math.max(1,Math.ceil(flow.growth/3)));
      for(let i=0;i<count;i++) { const a=i*2.4,r=.35+(i%3)*.18,x=cx+Math.cos(a)*rx*r,y=cy+Math.sin(a)*ry*r; ctx.strokeStyle='#dfedd5';ctx.globalAlpha=1-phase;ctx.beginPath();ctx.arc(x,y,5+phase*13,0,Math.PI*2);ctx.stroke();fish(ctx,x,y,size,'#ebf0dd',a);ctx.globalAlpha=1; }
    }
    model.agents.forEach((agent,i)=>{
      const a=(i+.5)/model.agents.length*Math.PI*2, x=cx+Math.cos(a)*(rx+23), y=cy+Math.sin(a)*(ry+23), angle=a+Math.PI/2;
      ctx.save();ctx.translate(x,y);ctx.rotate(angle);
      ctx.fillStyle='#eee7d6';ctx.strokeStyle='#485b50';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-9,0);ctx.quadraticCurveTo(0,-7,9,0);ctx.quadraticCurveTo(0,8,-9,0);ctx.fill();ctx.stroke();
      ctx.fillStyle='#6e796a';ctx.fillRect(-2,-2,4,4);ctx.restore();
      const reachX=cx+Math.cos(a)*rx*.87,reachY=cy+Math.sin(a)*ry*.87;
      ctx.strokeStyle='#566f6180';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(reachX,reachY);ctx.stroke();
      // Catch marks remain at each boat; moving marks expose the harvest event.
      const marks=Math.min(5,Math.ceil(agent.harvest/1.8));
      for(let n=0;n<marks;n++) { const px=x+Math.cos(a)*(11+n*3),py=y+Math.sin(a)*(11+n*3);fish(ctx,px,py,1.8,'#9b603f',angle); }
      if(flow&&phase>.35&&phase<1&&agent.harvest>0){const p=(phase-.35)/.65;fish(ctx,reachX+(x-reachX)*p,reachY+(y-reachY)*p,size,c.orange,a);}
    });
    ctx.fillStyle='#415346';ctx.font='12px "DM Sans", sans-serif';ctx.textAlign='center';
    ctx.fillText(metrics.resource===0?'No fish left — Reset to refill the lake':model.agents.length+' fishers · one shared lake',cx,h-12);
    Experiment.chart(history,model.history,[{key:'resource',color:c.green}],{min:0,max:model.options.capacity});
    input('resource').textContent = Math.round(metrics.resource)+' / '+model.options.capacity; input('harvest').textContent=metrics.harvest.toFixed(1);input('growth').textContent=metrics.growth.toFixed(1);input('regime').textContent=condition();
    lake.element.setAttribute('aria-label','Shared lake: '+Math.round(metrics.resource)+' fish remain; '+model.agents.length+' fishers; condition '+condition()+'. Peach marks show catches; green ripples show regrowth.');
  }
  const app=Experiment.mount({reset,draw,step:()=>{flow=model.step();metrics=model.metrics();movedAt=performance.now();},resize:()=>{lake.resize();history.resize();},rate:()=>+input('speed').value,transition:duration});
  ['capacity','agents-count'].forEach(id=>input(id).addEventListener('input',app.reset));
  ['regeneration','pressure','visibility','communication','monitoring'].forEach(id=>input(id).addEventListener('input',()=>{Object.assign(model.options,settings());metrics=model.metrics();draw();}));
  Experiment.presets(app,{
    abundant:{regeneration:25,capacity:800,'agents-count':25,pressure:.5,visibility:80,communication:true,monitoring:false,speed:2},
    fragile:{regeneration:4,capacity:400,'agents-count':30,pressure:.6,visibility:60,communication:false,monitoring:false,speed:2},
    heavy:{regeneration:8,capacity:600,'agents-count':35,pressure:3,visibility:80,communication:false,monitoring:false,speed:2},
    talk:{regeneration:12,capacity:600,'agents-count':30,pressure:1.5,visibility:40,communication:true,monitoring:false,speed:2}
  });
}());
