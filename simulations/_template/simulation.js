/* Replace this moving-dot example with the new simulator's model and drawing code. */
(function () {
  'use strict';
  const canvas = document.getElementById('simulation-canvas');
  const context = canvas.getContext('2d');
  const speed = document.getElementById('speed');
  const speedValue = document.getElementById('speed-value');
  let phase = 0;
  let frame = null;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width));
    canvas.height = Math.max(1, Math.round(rect.height));
    draw();
  }

  function draw() {
    context.fillStyle = '#111110';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#D85A30';
    const x = canvas.width * (0.5 + 0.35 * Math.sin(phase));
    context.beginPath();
    context.arc(x, canvas.height / 2, 8, 0, Math.PI * 2);
    context.fill();
  }

  function tick() {
    phase += 0.02 * Number(speed.value);
    draw();
    frame = requestAnimationFrame(tick);
  }

  const shell = SimulationShell.init({
    actions: {
      run: function () { if (frame === null) frame = requestAnimationFrame(tick); shell.setRunning(true); },
      pause: function () { if (frame !== null) cancelAnimationFrame(frame); frame = null; shell.setRunning(false); },
      reset: function () { phase = 0; draw(); }
    }
  });
  shell.setRunning(false);
  speed.addEventListener('input', function () { speedValue.value = Number(speed.value).toFixed(1) + '×'; });
  window.addEventListener('resize', resize);
  resize();
}());
