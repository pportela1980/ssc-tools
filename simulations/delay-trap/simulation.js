(function () {
  'use strict';
  const field = Experiment.canvas('field'), pipe = Experiment.canvas('pipeline'), c = Experiment.colors;
  const input = id => document.getElementById(id); let model;
  function settings() { return { demand: +input('demand').value, response: +input('response').value, delay: +input('delay').value, smoothing: +input('smoothing').value, mode: input('mode').value }; }
  function reset() { model = DelayModel.create(settings()); input('order-status').textContent = 'Manual: set an order, then Step. An unset round places no order.'; }
  function draw() {
    Experiment.chart(field, model.history, [{key:'stock',color:c.green},{key:'demand',color:c.blue},{key:'ordered',color:c.orange}], { target: 40 });
    Experiment.clear(pipe); const ctx = pipe.context, width = pipe.width / model.pipeline.length;
    model.pipeline.forEach((amount, i) => { const h = amount / 80 * (pipe.height - 33); ctx.fillStyle = c.orange; ctx.fillRect(i * width + 6, pipe.height - 19 - h, Math.max(1, width - 12), h); ctx.font = '10px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = c.ink; ctx.fillText(amount.toFixed(0), (i + .5) * width, pipe.height - 24 - h); ctx.fillStyle = c.muted; ctx.fillText('+' + (i + 1), (i + .5) * width, pipe.height - 5); });
    const m = model.metrics(); input('stock').textContent = m.stock.toFixed(1); input('ordered').textContent = m.ordered.toFixed(1); input('pipeline-total').textContent = m.pipeline.toFixed(1); input('time').textContent = m.t;
    const manual = input('mode').value === 'manual'; input('manual-order').disabled = !manual; input('submit-order').disabled = !manual;
  }
  const app = Experiment.mount({ reset, draw, step: () => { model.step(); if (model.options.mode === 'manual') input('order-status').textContent = 'Order consumed. Set another before the next round, or leave it at zero.'; }, resize: () => { field.resize(); pipe.resize(); }, rate: () => +input('speed').value });
  input('delay').addEventListener('input', app.reset);
  ['demand','response','smoothing','mode'].forEach(id => input(id).addEventListener('input', () => { Object.assign(model.options,settings()); if(id==='mode') app.pause(); draw(); }));
  input('submit-order').addEventListener('click', () => { model.setOrder(input('manual-order').value); input('order-status').textContent = 'Queued ' + model.metrics().nextManual + ' units for the next round.'; });
  input('nudge').addEventListener('click', () => { input('demand').value = Math.min(25, +input('demand').value + 2); input('demand').dispatchEvent(new Event('input', { bubbles: true })); });
}());
