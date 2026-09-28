(function () {
  'use strict';
  const view = Experiment.canvas('field'), c = Experiment.colors;
  const input = id => document.getElementById(id);
  let model;
  function reset() { model = SegregationModel.create({ threshold: +input('threshold').value, radius: +input('radius').value, mix: +input('mix').value, empty: +input('empty').value }, 42); }
  function draw() {
    Experiment.clear(view); const ctx = view.context, cell = view.width / model.size;
    model.grid.forEach((type, i) => { if (!type) return; ctx.fillStyle = type === 1 ? c.orange : c.blue; ctx.fillRect(i % model.size * cell + .6, Math.floor(i / model.size) * cell + .6, Math.max(1, cell - 1.2), Math.max(1, cell - 1.2)); });
    const m = model.metrics(); input('satisfied').textContent = m.satisfied.toFixed(0) + '%'; input('mixing').textContent = m.mixing.toFixed(0) + '%'; input('iteration').textContent = m.t; input('moved').textContent = m.moved;
  }
  const app = Experiment.mount({ reset, draw, step: () => model.step(), resize: view.resize, rate: () => +input('speed').value, finished: 'No agents moving' });
  ['threshold', 'radius'].forEach(id => input(id).addEventListener('input', () => { model.options[id] = +input(id).value; app.pause(); draw(); }));
  ['mix', 'empty'].forEach(id => input(id).addEventListener('input', app.reset));
}());
