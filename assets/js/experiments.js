/* Canvas and transport helpers for the new static experiments. No model rules here. */
(function () {
  'use strict';
  const colors = { ink: '#f4efe4', muted: '#9ea99c', orange: '#df9d70', green: '#b5caa5', blue: '#7daab2', grid: '#3b433b', bg: '#111510' };
  function canvas(id) {
    const element = document.getElementById(id);
    const context = element.getContext('2d');
    function resize() {
      const rect = element.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(rect.width * ratio);
      element.height = Math.round(rect.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    resize();
    return { element, context, resize, get width() { return element.clientWidth; }, get height() { return element.clientHeight; } };
  }
  function clear(view) { view.context.fillStyle = colors.bg; view.context.fillRect(0, 0, view.width, view.height); }
  function chart(view, history, series, options) {
    clear(view);
    if (!history.length) return;
    const cfg = options || {}, ctx = view.context, left = 44, right = view.width - 12, top = 16, bottom = view.height - 30;
    const min = cfg.min === undefined ? Math.min(0, ...history.flatMap(row => series.map(s => row[s.key]))) : cfg.min;
    const max = cfg.max === undefined ? Math.max(1, ...history.flatMap(row => series.map(s => row[s.key]))) * 1.12 : cfg.max;
    const y = value => bottom - (value - min) / Math.max(.001, max - min) * (bottom - top);
    ctx.font = '10px monospace'; ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const value = min + (max - min) * i / 4;
      ctx.strokeStyle = colors.grid; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(left, y(value)); ctx.lineTo(right, y(value)); ctx.stroke();
      ctx.fillStyle = colors.muted; ctx.fillText(Math.round(value), left - 8, y(value) + 3);
    }
    if (cfg.target !== undefined) { ctx.setLineDash([4, 5]); ctx.strokeStyle = colors.muted; ctx.beginPath(); ctx.moveTo(left, y(cfg.target)); ctx.lineTo(right, y(cfg.target)); ctx.stroke(); ctx.setLineDash([]); }
    series.forEach(s => {
      ctx.strokeStyle = s.color; ctx.lineWidth = 1.8; ctx.beginPath();
      history.forEach((row, i) => { const px = left + i / Math.max(1, history.length - 1) * (right - left); if (i === 0) ctx.moveTo(px, y(row[s.key])); else ctx.lineTo(px, y(row[s.key])); });
      ctx.stroke();
      if (history.length === 1) { ctx.beginPath(); ctx.arc(left, y(history[0][s.key]), 3, 0, Math.PI * 2); ctx.fillStyle = s.color; ctx.fill(); }
    });
    ctx.fillStyle = colors.muted; ctx.textAlign = 'left'; ctx.fillText('t ' + history[0].t, left, view.height - 9);
    ctx.textAlign = 'right'; ctx.fillText('t ' + history[history.length - 1].t, right, view.height - 9);
  }
  function controls() {
    document.querySelectorAll('input[type=range]').forEach(input => {
      const output = document.querySelector('output[for="' + input.id + '"]');
      const update = () => { if (output) output.value = input.value + (input.dataset.unit || ''); };
      input.addEventListener('input', update); update();
    });
  }
  function mount(options) {
    let frame = null, running = false, last = null, accumulator = 0;
    const status = document.getElementById('status');
    function pause(message) {
      running = false; if (frame !== null) cancelAnimationFrame(frame); frame = null; last = null; accumulator = 0;
      shell.setRunning(false); status.textContent = message || 'Paused';
    }
    function advance() {
      const keepGoing = options.step(); options.draw();
      if (keepGoing === false) pause(options.finished || 'Settled');
    }
    function tick(time) {
      if (!running) return;
      if (last !== null) accumulator += Math.min(time - last, 200);
      last = time;
      const interval = 1000 / options.rate();
      let count = 0;
      while (accumulator >= interval && running && count++ < 12) { accumulator -= interval; advance(); }
      if (running) frame = requestAnimationFrame(tick);
    }
    function run() { if (running) return; running = true; last = null; shell.setRunning(true); status.textContent = 'Running'; frame = requestAnimationFrame(tick); }
    function reset() { pause(); options.reset(); options.draw(); }
    const shell = SimulationShell.init({ actions: { run, pause: () => pause(), reset, step: advance } });
    shell.setRunning(false); controls(); reset();
    window.addEventListener('resize', () => { options.resize(); options.draw(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
    return { pause, reset, draw: options.draw };
  }
  window.Experiment = { colors, canvas, clear, chart, mount };
}());
