(function () {
  'use strict';
  const view = Experiment.canvas('field'), c = Experiment.colors;
  const input = id => document.getElementById(id); let model, trails;
  function settings() { return { separation:input('separation-on').checked?+input('separation').value:0,alignment:input('alignment-on').checked?+input('alignment').value:0,cohesion:input('cohesion-on').checked?+input('cohesion').value:0,radius:+input('radius').value,agents:+input('agents-count').value,speed:+input('speed').value }; }
  function rules() { ['separation','alignment','cohesion'].forEach(id=>{const enabled=input(id+'-on').checked;input(id).disabled=!enabled;input(id).closest('.exp-control').classList.toggle('exp-rule-off',!enabled);}); }
  function reset() { rules(); model=FlockingModel.create(settings(),42);trails=model.agents.map(a=>[{x:a.x,y:a.y}]); }
  function draw() {
    const ctx=view.context,sx=view.width/model.width,sy=view.height/model.height;
    ctx.fillStyle='#d8ddd0';ctx.fillRect(0,0,view.width,view.height);
    model.agents.forEach((agent,i)=>{
      const points=trails[i];ctx.strokeStyle='#667e6580';ctx.lineWidth=1.1;ctx.beginPath();
      points.forEach((p,j)=>{if(!j||Math.abs(p.x-points[j-1].x)>model.width/2||Math.abs(p.y-points[j-1].y)>model.height/2)ctx.moveTo(p.x*sx,p.y*sy);else ctx.lineTo(p.x*sx,p.y*sy);});ctx.stroke();
      const angle=Math.atan2(agent.vy*sy,agent.vx*sx);ctx.save();ctx.translate(agent.x*sx,agent.y*sy);ctx.rotate(angle);
      // A compact wing stroke and a short tail make direction readable while paused.
      ctx.strokeStyle='#44634c';ctx.lineWidth=1.7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-5,-3.5);ctx.lineTo(3,0);ctx.lineTo(-5,3.5);ctx.moveTo(1,0);ctx.lineTo(-7,0);ctx.stroke();ctx.restore();
    });
    const pointer=model.getPointer();if(pointer){ctx.strokeStyle='#9b603f';ctx.lineWidth=1;ctx.beginPath();ctx.arc(pointer.x*sx,pointer.y*sy,10,0,Math.PI*2);ctx.stroke();}
    const m=model.metrics();input('alignment-index').textContent=m.agreement.toFixed(0)+'%';input('nearby').textContent=m.neighbours.toFixed(1);
    view.element.setAttribute('aria-label','Leaderless flock of '+model.agents.length+' birds: '+m.agreement.toFixed(0)+'% moving in the same direction. Trails show local coordination.');
  }
  const app=Experiment.mount({reset,draw,step:()=>{model.step();model.agents.forEach((a,i)=>{trails[i].push({x:a.x,y:a.y});if(trails[i].length>14)trails[i].shift();});},resize:view.resize,rate:()=>60});
  ['separation','alignment','cohesion','radius','speed','separation-on','alignment-on','cohesion-on'].forEach(id=>input(id).addEventListener('input',()=>{rules();Object.assign(model.options,settings());draw();}));
  input('agents-count').addEventListener('input',app.reset);
  view.element.addEventListener('pointermove',event=>{const rect=view.element.getBoundingClientRect();model.setPointer({x:(event.clientX-rect.left)/rect.width*model.width,y:(event.clientY-rect.top)/rect.height*model.height});draw();});
  view.element.addEventListener('pointerleave',()=>{model.setPointer(null);draw();});
  Experiment.presets(app,{
    coordinate:{'separation-on':true,'alignment-on':true,'cohesion-on':true,separation:1.4,alignment:1.8,cohesion:.8,radius:130,'agents-count':80,speed:1},
    wander:{'separation-on':true,'alignment-on':false,'cohesion-on':false,separation:1.4,alignment:1.8,cohesion:.8,radius:110,'agents-count':80,speed:1},
    loose:{'separation-on':true,'alignment-on':true,'cohesion-on':false,separation:2,alignment:1.2,cohesion:.8,radius:60,'agents-count':80,speed:1}
  },rules);
}());
