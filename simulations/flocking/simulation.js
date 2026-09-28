(function () {
  'use strict';
  const view = Experiment.canvas('field'), c = Experiment.colors;
  const input = id => document.getElementById(id); let model;
  function settings() { return { separation: +input('separation').value, alignment: +input('alignment').value, cohesion: +input('cohesion').value, radius: +input('radius').value, agents: +input('agents-count').value, speed: +input('speed').value }; }
  function reset() { model = FlockingModel.create(settings(),42); }
  function draw() {
    Experiment.clear(view); const ctx = view.context, sx = view.width / model.width, sy = view.height / model.height;
    model.agents.forEach(agent => { const angle = Math.atan2(agent.vy * sy, agent.vx * sx); ctx.save(); ctx.translate(agent.x * sx, agent.y * sy); ctx.rotate(angle); ctx.beginPath(); ctx.moveTo(6,0); ctx.lineTo(-4,-2.7); ctx.lineTo(-2,0); ctx.lineTo(-4,2.7); ctx.closePath(); ctx.fillStyle = c.green; ctx.fill(); ctx.restore(); });
    const pointer = model.getPointer(); if (pointer) { ctx.strokeStyle = c.orange; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(pointer.x * sx,pointer.y * sy,8,0,Math.PI*2); ctx.stroke(); }
    const m = model.metrics(); input('alignment-index').textContent = m.agreement.toFixed(0) + '%'; input('nearby').textContent = m.neighbours.toFixed(1); input('count').textContent = model.agents.length;
  }
  const app = Experiment.mount({ reset, draw, step: () => model.step(), resize: view.resize, rate: () => 60 });
  ['separation','alignment','cohesion','radius','speed'].forEach(id => input(id).addEventListener('input', () => { Object.assign(model.options,settings()); draw(); }));
  input('agents-count').addEventListener('input',app.reset);
  view.element.addEventListener('pointermove',event => { const rect = view.element.getBoundingClientRect(); model.setPointer({ x:(event.clientX-rect.left)/rect.width*model.width, y:(event.clientY-rect.top)/rect.height*model.height }); draw(); });
  view.element.addEventListener('pointerleave',() => { model.setPointer(null); draw(); });
}());
