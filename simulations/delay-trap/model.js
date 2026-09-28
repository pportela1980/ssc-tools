/* Compact delayed stock correction. Orders in flight are deliberately not netted out. */
(function () {
  'use strict';
  function create(options) {
    const pipeline = Array.from({ length: options.delay }, () => options.demand);
    let stock = 40, time = 0, ordered = options.demand, arrival = options.demand, nextManual = null;
    const history = [{ t: 0, stock, demand: options.demand, ordered }];
    function setOrder(value) { nextManual = Math.max(0, Math.min(80, Number(value) || 0)); }
    function step() {
      arrival = pipeline.shift();
      stock += arrival - options.demand;
      if (options.mode === 'manual') { ordered = nextManual === null ? 0 : nextManual; nextManual = null; }
      else {
        const desired = Math.max(0, Math.min(80, options.demand + options.response * (40 - stock)));
        const alpha = options.smoothing / 100;
        ordered = Math.max(0, Math.min(80, ordered + alpha * (desired - ordered)));
      }
      pipeline.push(ordered); time++;
      history.push({ t: time, stock, demand: options.demand, ordered }); if (history.length > 240) history.shift();
      return { arrival, demand: options.demand, ordered, stock };
    }
    function metrics() { return { t: time, stock, ordered, arrival, pipeline: pipeline.reduce((a, b) => a + b, 0), nextManual }; }
    return { options, pipeline, history, setOrder, step, metrics };
  }
  window.DelayModel = { create };
}());
