(function () {
  'use strict';
  const field = Experiment.canvas('field'), bars = Experiment.canvas('agents'), c = Experiment.colors;
  const input = id => document.getElementById(id);
  let model;
  function settings() { return { regeneration: +input('regeneration').value, capacity: +input('capacity').value, agents: +input('agents-count').value, pressure: +input('pressure').value, visibility: +input('visibility').value, communication: input('communication').checked, monitoring: input('monitoring').checked }; }
  function reset() { model = CommonsModel.create(settings(), 42); }
  function draw() {
    Experiment.chart(field, model.history, [{ key: 'resource', color: c.green }], { min: 0, max: model.options.capacity });
    Experiment.clear(bars); const ctx = bars.context, width = bars.width / model.agents.length, scale = 12;
    model.agents.forEach((agent, i) => { ctx.fillStyle = c.orange; const h = agent.harvest / scale * (bars.height - 25); ctx.fillRect(i * width + 2, bars.height - 18 - h, Math.max(1, width - 4), h); });
    ctx.fillStyle = c.muted; ctx.font = '10px monospace'; ctx.fillText('0–12 units / agent', 8, 12);
    const m = model.metrics(); input('resource').textContent = Math.round(m.resource) + ' / ' + model.options.capacity; input('harvest').textContent = m.harvest.toFixed(1); input('growth').textContent = m.growth.toFixed(1); input('regime').textContent = m.regime;
  }
  const app = Experiment.mount({ reset, draw, step: () => { model.step(); }, resize: () => { field.resize(); bars.resize(); }, rate: () => +input('speed').value });
  ['capacity', 'agents-count'].forEach(id => input(id).addEventListener('input', app.reset));
  ['regeneration', 'pressure', 'visibility', 'communication', 'monitoring'].forEach(id => input(id).addEventListener('input', () => { Object.assign(model.options, settings()); draw(); }));
}());
