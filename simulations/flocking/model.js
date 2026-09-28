/* Boids-style synchronous local steering on a toroidal field. No leader. */
(function () {
  'use strict';
  function create(options, seed) {
    let state = seed || 42;
    const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
    const width = 1000, height = 420, velocity = 2.2;
    const agents = Array.from({ length: options.agents }, () => { const angle = random() * Math.PI * 2; return { x: random() * width, y: random() * height, vx: Math.cos(angle) * velocity, vy: Math.sin(angle) * velocity }; });
    let time = 0, pointer = null, neighbourMean = 0;
    function offset(a, b, span) { let d = b - a; if (d > span / 2) d -= span; if (d < -span / 2) d += span; return d; }
    function steer(x, y, agent) {
      const length = Math.hypot(x, y); if (length < .00001) return [0, 0];
      let sx = x / length * velocity - agent.vx, sy = y / length * velocity - agent.vy;
      const magnitude = Math.hypot(sx, sy), limit = .055;
      if (magnitude > limit) { sx *= limit / magnitude; sy *= limit / magnitude; }
      return [sx, sy];
    }
    function step() {
      let total = 0;
      const next = agents.map(agent => {
        let count = 0, ax = 0, ay = 0, cx = 0, cy = 0, sx = 0, sy = 0;
        agents.forEach(other => {
          if (other === agent) return;
          const dx = offset(agent.x, other.x, width), dy = offset(agent.y, other.y, height), distance = Math.hypot(dx, dy);
          if (distance >= options.radius) return;
          count++; ax += other.vx; ay += other.vy; cx += dx; cy += dy;
          if (distance > .00001 && distance < Math.max(12, options.radius * .4)) { sx -= dx / (distance * distance); sy -= dy / (distance * distance); }
        });
        total += count;
        const separation = steer(sx, sy, agent), alignment = count ? steer(ax / count, ay / count, agent) : [0,0], cohesion = count ? steer(cx / count, cy / count, agent) : [0,0];
        let fx = separation[0] * options.separation + alignment[0] * options.alignment + cohesion[0] * options.cohesion;
        let fy = separation[1] * options.separation + alignment[1] * options.alignment + cohesion[1] * options.cohesion;
        if (pointer) {
          const dx = offset(pointer.x, agent.x, width), dy = offset(pointer.y, agent.y, height), distance = Math.hypot(dx, dy);
          if (distance > .001 && distance < 90) { fx += dx / distance * .16 * (1 - distance / 90); fy += dy / distance * .16 * (1 - distance / 90); }
        }
        let vx = agent.vx + fx * options.speed, vy = agent.vy + fy * options.speed;
        const magnitude = Math.hypot(vx, vy) || velocity; vx = vx / magnitude * velocity; vy = vy / magnitude * velocity;
        return { x: (agent.x + vx * options.speed + width) % width, y: (agent.y + vy * options.speed + height) % height, vx, vy };
      });
      next.forEach((agent, i) => Object.assign(agents[i], agent));
      neighbourMean = total / agents.length; time++;
    }
    function metrics() { if (time === 0) { let count = 0; agents.forEach(a => agents.forEach(b => { if (a !== b && Math.hypot(offset(a.x,b.x,width),offset(a.y,b.y,height)) < options.radius) count++; })); neighbourMean = count / agents.length; } const sum = agents.reduce((s, a) => [s[0] + a.vx / velocity, s[1] + a.vy / velocity], [0,0]); return { t: time, agreement: Math.hypot(sum[0],sum[1]) / agents.length * 100, neighbours: neighbourMean }; }
    return { width, height, agents, options, step, metrics, setPointer: p => { pointer = p; }, getPointer: () => pointer };
  }
  window.FlockingModel = { create };
}());
