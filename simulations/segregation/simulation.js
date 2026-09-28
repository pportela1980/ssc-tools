(function () {
  'use strict';
  const view = Experiment.canvas('field'), c = Experiment.colors;
  const input = id => document.getElementById(id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let model, metrics, happiness, moves = [], movedAt = 0;
  function inspect() { metrics = model.metrics(); happiness = Array.from(model.grid, (_, i) => model.isHappy(i)); }
  function reset() { model = SegregationModel.create({ threshold: +input('threshold').value, radius: +input('radius').value, mix: 50, empty: +input('empty').value }, 42); moves = []; inspect(); }
  function duration() { return Math.min(800, 850 / +input('speed').value); }
  function draw() {
    const ctx = view.context, w = view.width, h = view.height;
    ctx.fillStyle = '#d8ddd0'; ctx.fillRect(0, 0, w, h);
    const span = Math.min(w - 24, h - 22), cell = span / (model.size + 1.5), left = (w - span) / 2, top = (h - span) / 2;
    const position = p => ({ x: left + (p % model.size + .5 + Math.floor(p % model.size / 6) * .5) * cell, y: top + (Math.floor(p / model.size) + .5 + Math.floor(Math.floor(p / model.size) / 6) * .5) * cell });
    // Four residential blocks separated by quiet streets, with every vacant home drawn.
    ctx.strokeStyle = '#bec8b7'; ctx.lineWidth = cell * .35;
    for (let i = 1; i < 4; i++) {
      const offset = (i * 6 + (i - .5) * .5) * cell;
      ctx.beginPath(); ctx.moveTo(left + offset, top - 2); ctx.lineTo(left + offset, top + span + 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(left - 2, top + offset); ctx.lineTo(left + span + 2, top + offset); ctx.stroke();
    }
    const progress = reducedMotion ? 1 : Math.min(1, (performance.now() - movedAt) / duration());
    const movingTargets = new Set(progress < 1 ? moves.map(m => m.to) : []);
    model.grid.forEach((type, i) => {
      const p = position(i), r = cell * .31;
      ctx.fillStyle = type === 1 ? '#b97550' : type === 2 ? '#4d808b' : '#d8ddd0';
      ctx.strokeStyle = type ? '#485447' : '#9eaa97'; ctx.lineWidth = .7;
      ctx.beginPath(); ctx.moveTo(p.x-r,p.y-r*.25); ctx.lineTo(p.x,p.y-r*1.1); ctx.lineTo(p.x+r,p.y-r*.25); ctx.lineTo(p.x+r,p.y+r); ctx.lineTo(p.x-r,p.y+r); ctx.closePath(); ctx.fill(); ctx.stroke();
      if (type && !movingTargets.has(i)) {
        ctx.fillStyle = '#f4efe4'; ctx.fillRect(p.x-r*.22,p.y+r*.2,r*.44,r*.65);
        if (!happiness[i]) { ctx.strokeStyle = '#76402a'; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.arc(p.x,p.y,cell*.47,0,Math.PI*2); ctx.stroke(); }
      }
    });
    if (progress < 1) moves.forEach(move => {
      const from = position(move.from), to = position(move.to), t = progress * progress * (3 - 2 * progress);
      ctx.strokeStyle = '#4a594878'; ctx.lineWidth = .8; ctx.setLineDash([2,4]); ctx.beginPath(); ctx.moveTo(from.x,from.y); ctx.lineTo(to.x,to.y); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = move.type === 1 ? c.orange : c.blue; ctx.strokeStyle = '#344234'; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.arc(from.x+(to.x-from.x)*t,from.y+(to.y-from.y)*t,Math.max(3,cell*.3),0,Math.PI*2); ctx.fill(); ctx.stroke();
    });
    input('satisfied').textContent = metrics.satisfied.toFixed(0) + '%'; input('mixing').textContent = metrics.mixing.toFixed(0) + '%';
    view.element.setAttribute('aria-label', 'Neighbourhood: ' + metrics.satisfied.toFixed(0) + '% of residents satisfied; ' + metrics.mixing.toFixed(0) + '% of neighbour contacts across groups. Rings mark households that want to move.');
  }
  const app = Experiment.mount({ reset, draw, step: () => { const active = model.step(); inspect(); const used = new Set(); moves = model.moves.slice().reverse().filter(m => { if (used.has(m.to) || model.grid[m.to] !== m.type) return false; used.add(m.to); return true; }).slice(0,16); movedAt = performance.now(); return active; }, resize: view.resize, rate: () => +input('speed').value, transition: duration, finished: 'Everyone has settled' });
  ['threshold', 'radius'].forEach(id => input(id).addEventListener('input', () => { model.options[id] = +input(id).value; app.pause(); moves = []; inspect(); draw(); }));
  input('empty').addEventListener('input', app.reset);
  Experiment.presets(app, { integrated: {threshold:0,empty:20,radius:1,speed:1}, mild: {threshold:35,empty:20,radius:1,speed:1}, strong: {threshold:75,empty:20,radius:1,speed:1} });
}());
