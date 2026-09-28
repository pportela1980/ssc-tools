/* Renewable stock, heterogeneous harvesters and imperfect information. */
(function () {
  'use strict';
  function create(options, seed) {
    let state = seed || 42;
    const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
    const agents = Array.from({ length: options.agents }, () => ({ appetite: 1.1 + random() * 1.8, restraint: .15 + random() * .85, belief: options.capacity * .8, harvest: 0 }));
    let resource = options.capacity * .8, time = 0, harvest = 0, growth = 0;
    const history = [{ t: 0, resource }];
    function step() {
      const start = resource;
      // Logistic renewal: zero is absorbing; tiny positive stocks can recover slowly.
      growth = options.regeneration / 100 * resource * (1 - resource / options.capacity);
      resource = Math.max(0, Math.min(options.capacity, resource + growth));
      const precision = options.visibility / 100;
      const observations = agents.map(agent => {
        const noisy = Math.max(0, Math.min(options.capacity, resource + (random() - .5) * (1 - precision) * options.capacity * .8));
        return agent.belief + (.04 + precision * .76) * (noisy - agent.belief);
      });
      const shared = observations.reduce((a, b) => a + b, 0) / agents.length;
      const desired = agents.map((agent, i) => {
        agent.belief = options.communication ? observations[i] * .25 + shared * .75 : observations[i];
        const scarcity = Math.max(0, Math.min(1, agent.belief / (options.capacity * .55)));
        let want = agent.appetite * options.pressure * ((1 - agent.restraint) + agent.restraint * scarcity);
        if (options.communication) {
          const believedGrowth = options.regeneration / 100 * agent.belief * (1 - agent.belief / options.capacity);
          const fair = Math.max(0, believedGrowth / agents.length);
          // More receptive agents adjust to a negotiated share; others partially comply.
          want = want * (1 - agent.restraint * .8) + Math.min(want, fair) * agent.restraint * .8;
        }
        if (options.monitoring) {
          const estimatedGrowth = options.regeneration / 100 * agent.belief * (1 - agent.belief / options.capacity);
          want = Math.min(want, Math.max(0, estimatedGrowth / agents.length));
        }
        return want;
      });
      const total = desired.reduce((a, b) => a + b, 0), fraction = total > 0 ? Math.min(1, resource / total) : 0;
      harvest = 0;
      agents.forEach((agent, i) => { agent.harvest = desired[i] * fraction; harvest += agent.harvest; });
      resource = Math.max(0, resource - harvest); if (resource < .000001) resource = 0;
      time++; history.push({ t: time, resource, harvest, growth }); if (history.length > 240) history.shift();
      return { start, growth, harvest, end: resource };
    }
    function metrics() {
      const recent = history.slice(-20).map(h => h.resource);
      let regime = 'Observing';
      if (resource === 0) regime = 'Collapsed';
      else if (resource < options.capacity * .1) regime = 'Near depletion';
      else if (time >= 20) {
        const change = recent[recent.length - 1] - recent[0];
        const spread = Math.max(...recent) - Math.min(...recent);
        regime = change > options.capacity * .03 ? 'Recovering' : change < -options.capacity * .03 ? 'Declining' : spread < options.capacity * .02 ? 'Stabilising' : 'Fluctuating';
      }
      return { t: time, resource, harvest, growth, regime };
    }
    return { agents, history, options, step, metrics };
  }
  window.CommonsModel = { create };
}());
