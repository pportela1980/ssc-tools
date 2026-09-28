/* Illustrative shower: tap mixing is immediate; the water reaching you is delayed. */
(function () {
  'use strict';
  const cold = 15, hot = 55;
  function create(options) {
    let tap = .5, temperature = 35, time = 0;
    const pipeline = Array.from({ length: options.delay }, () => temperature);
    const history = [{ t: 0, temperature, target: options.target }];
    function setTap(percent) { tap = Math.max(0, Math.min(100, Number(percent) || 0)) / 100; }
    function step() {
      const before = temperature, travelling = pipeline.slice();
      temperature = pipeline.shift();
      if (options.mode === 'automatic') {
        // The controller sees current water, without accounting for earlier changes in the pipe.
        tap = Math.max(0, Math.min(1, tap + .02 * options.response * (options.target - temperature) * (1 - options.patience / 100)));
      }
      const entering = cold + tap * (hot - cold);
      pipeline.push(entering); time++;
      history.push({ t: time, temperature, target: options.target }); if (history.length > 240) history.shift();
      return { before, temperature, entering, travelling };
    }
    function metrics() { return { t: time, temperature, tap: tap * 100, entering: cold + tap * (hot - cold) }; }
    return { options, pipeline, history, setTap, step, metrics };
  }
  window.DelayModel = { create, cold, hot };
}());
