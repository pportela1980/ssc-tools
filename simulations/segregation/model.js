/* Schelling-style relocation: sequential random empty-cell moves, local rules only. */
(function () {
  'use strict';
  function create(options, seed) {
    let state = seed || 42;
    const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
    const size = 36, grid = new Uint8Array(size * size), empty = [];
    let time = 0, moved = 0;
    const positions = Array.from(grid.keys());
    for (let i = positions.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [positions[i], positions[j]] = [positions[j], positions[i]]; }
    const occupied = Math.round(grid.length * (1 - options.empty / 100));
    const orange = Math.round(occupied * options.mix / 100);
    positions.forEach((p, i) => { if (i < occupied) grid[p] = i < orange ? 1 : 2; else empty.push(p); });
    function neighbours(p) {
      const row = Math.floor(p / size), col = p % size; let same = 0, total = 0;
      for (let dy = -options.radius; dy <= options.radius; dy++) for (let dx = -options.radius; dx <= options.radius; dx++) {
        if (!dx && !dy) continue;
        const x = col + dx, y = row + dy;
        if (x < 0 || y < 0 || x >= size || y >= size) continue;
        const other = grid[y * size + x]; if (!other) continue;
        total++; if (other === grid[p]) same++;
      }
      return { same, total, share: total ? same / total : 1 };
    }
    function metrics() {
      let happy = 0, count = 0, mixing = 0, contacts = 0;
      grid.forEach((type, p) => { if (!type) return; const n = neighbours(p); count++; if (n.share >= options.threshold / 100) happy++; mixing += n.total - n.same; contacts += n.total; });
      return { t: time, satisfied: count ? happy / count * 100 : 100, mixing: contacts ? mixing / contacts * 100 : 0, moved, count };
    }
    function step() {
      moved = 0;
      const agents = positions.filter(p => grid[p]);
      for (let i = agents.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [agents[i], agents[j]] = [agents[j], agents[i]]; }
      agents.forEach(p => {
        if (!empty.length || neighbours(p).share >= options.threshold / 100) return;
        const slot = Math.floor(random() * empty.length), target = empty[slot];
        grid[target] = grid[p]; grid[p] = 0; empty[slot] = p; moved++;
      });
      time++; return moved > 0;
    }
    return { size, grid, options, step, metrics };
  }
  window.SegregationModel = { create };
}());
