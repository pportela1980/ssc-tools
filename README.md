# Instruments for Complexity

This repository publishes [tools.systemsandcomplexity.school](https://tools.systemsandcomplexity.school/) through GitHub Pages. `index.html` is the public catalogue; `CNAME` connects the custom domain. The public simulations are standalone HTML pages under `simulations/<name>/index.html`. There is no build step.

## Public collection

| Instrument | Canonical path | Previous public path |
| --- | --- | --- |
| The Pendulum | `/simulations/pendulum/` | `https://pportela1980.github.io/pendulum/` |
| Attractors and Chaos | `/simulations/lorenz/` | `/lorenz.html` |
| Three-Body Problem | `/simulations/three-body/` | `/threebody_bites.html` |
| Polarisation Dynamics | `/simulations/polarisation/` | `/polarisation.html` |
| Conflict System Dynamics | `/simulations/aravane-oscillator/` | `https://pportela1980.github.io/aravane-sd/aravane_oscillator.html` |
| When Societies Bifurcate | `/simulations/social-bifurcations/` | `/conflict-dynamics-story.html` |
| Network Science Simulator | `/simulations/networks/` | `https://pportela1980.github.io/networks/networks.html` |

The earlier pendulum variant is preserved at `/simulations/pendulum/legacy.html`, corresponding to the extensionless `index` file in the original repository. It is not the version linked from the catalogue.

`you-are-in-the-system-v2.html` is the guided reading experience and embeds six simulations. The original root simulation URLs remain available as redirects to the canonical pages. Keep those redirects working for existing links.

`hormuz_cascade.html` is an embeddable fragment, not a complete standalone page. `threshold_diagnostic_v1.html` is a separate diagnostic with external integrations. Both remain available at their original paths and are not listed in the catalogue.

## Maintaining the site

1. Edit `index.html` to update catalogue text and links. Cards are grouped by theme; update the section count when adding a card.
2. Edit the canonical HTML file under `simulations/<name>/`. The original root URLs redirect to the canonical pages; maintain only the canonical simulation code.
3. Keep the guided reading iframe and full-screen links in sync with the canonical paths.
4. Check the catalogue, each changed simulation, the guided reading embeds, and the legacy URLs after deployment. The site is also published at `https://complexitytools.netlify.app/`; verify that deployment separately.

The `threshold` and `governance-patterns` repositories are separate projects and are not part of this simulation collection.

## Shared simulation shell

The site remains static HTML, CSS and browser JavaScript. There is no framework, package manager or build step. The shell is **opt-in**: Lorenz is the pilot; the other six published simulations still use their existing self-contained files.

| Repeated pattern found in the simulations | Convention for new simulations |
| --- | --- |
| SSC branding, title and short framing text | Header with `sim-shell__title` and `sim-shell__question` or `sim-shell__framing` |
| Canvas area and surrounding card or chart frame | `sim-shell__visualization-panel`, `sim-shell__visualization-frame`, `sim-shell__canvas` |
| Sliders, parameter labels, scenario switches and action buttons | `sim-shell__control-grid`, `sim-shell__actions`, `sim-shell__button`; keep domain-specific controls local |
| Reset and optional run/pause actions | `data-shell-action` buttons wired to page callbacks with `SimulationShell.init()` |
| Tabs between simulation and explanation | Optional `data-shell-tab` / `data-shell-panel` bindings |
| “What you are seeing”, science/guide panels and footers | `sim-shell__interpretation` and `sim-shell__footer` |
| Different typefaces, palettes, charts and model-specific graphics | Keep in each simulation's CSS and JS; configure the shell through `--shell-*` CSS variables |

These are recurring roles, not identical designs. The shell shares layout and interaction hooks; it does not impose one chart style, palette or mathematical model on every page.

### Files and usage

- `assets/css/simulation-shell.css` provides the responsive header, visualization, controls, action, interpretation and footer layout. Its selectors use `sim-shell__*` classes, so pages that have not adopted it are unaffected.
- `assets/js/simulation-shell.js` provides `SimulationShell.init({ actions: { reset, run, pause } })`. Include only the actions a simulator needs. It binds optional tabs and returns `setRunning(boolean)` to update run/pause button states.
- `simulations/_template/` is a copyable starter with a framing question, canvas, speed control, run/pause/reset, explanation and catalogue link. It is not part of the public catalogue. Copy it to `simulations/<new-name>/`, then replace the example drawing and explanation.
- `simulations/lorenz/` is the first adopted simulator. `index.html` contains content and structure; `lorenz.css` contains its palette and unique visual rules; `lorenz.js` contains the Lorenz model, rendering, scenarios and parameter logic. Shared files load first, then local files.

Use relative asset paths such as `../../assets/css/simulation-shell.css` and `../../assets/js/simulation-shell.js` from a simulation directory. Keep the public page at `/simulations/<name>/`; add its catalogue link only when the new simulator is ready. Existing redirect URLs and the guided reading links must keep working.

## Experiments and the four families

The catalogue now follows human questions rather than academic categories. The eleven experiments keep their own public URLs:

| Family | Experiments |
| --- | --- |
| 01 — When prediction breaks | Pendulum, Lorenz / attractors, Three-body, Social bifurcations |
| 02 — When structure shapes behaviour | Networks (including cascades), Who Created This Pattern? |
| 03 — When order emerges | Nobody Is in Charge, The Commons |
| 04 — When interventions fight back | The Delay Trap, Aravane / conflict system dynamics, Polarisation |

Schelling also illustrates emergence; it is listed once, under structure. Threshold, the Hormuz fragment and the guided reading retain their existing URLs and are not forced into the four families. The guided reading remains available from the homepage. The existing seven simulations and redirects are preserved.

### Four new experiments

- `/simulations/segregation/` — **Who Created This Pattern?** Two groups of households on a 24×24 neighbourhood map. Coloured houses distinguish groups; outlined houses are vacant and rings mark unhappy residents. Up to 16 sampled moves animate each round. Integrated, Mild preference and Strong sorting presets restart from the same seeded arrangement. Unhappy agents move to random vacancies in shuffled, sequential rounds. Similarity preference and neighbourhood radius pause the map for inspection; empty-home share recreates it. Population mix stays balanced to keep the controls compact. Satisfaction is a local threshold measure. The mixing indicator is the share of occupied neighbour contacts crossing categories; its baseline depends on population mix. Boundaries do not wrap.
- `/simulations/commons/` — **The Commons.** A literal fishing lake has 20–40 heterogeneous fishers and logistic fish renewal. Fish density shows remaining stock, boat-side marks show individual catches, and moving fish and ripples expose harvesting and regrowth. Symbols represent quantities, not individual fish. The stock history is a small supporting chart below the controls. Abundant lake, Fragile ecosystem, Heavy pressure and Communication helps? provide comparable starting points. Appetite, restraint and imperfect beliefs differ between agents. Communication shares observations and adjusts requests toward estimated renewable shares; monitoring caps requests using those estimates. Available harvest is allocated proportionally when scarce. Zero stock is absorbing until reset. These illustrative rules can sustain or exhaust the stock; communication does not guarantee success. Capacity and agent count recreate the experiment.
- `/simulations/delay-trap/` — **The Delay Trap.** A shower replaces the inventory metaphor while preserving the public URL. A hot–cold tap mixes water between 15°C and 55°C; the pipe carries that temperature for a fixed number of one-second steps before it reaches the shower. Coloured packets expose changes still travelling, and a thermometer marks the comfortable target. The automatic controller repeatedly adjusts the tap based on current temperature without accounting for earlier turns in transit; response increases correction gain, while patience reduces each turn. Manual mode holds the tap at the user’s setting until changed. Short pipe, Overcorrecting and Patient adjustments compare convergence with oscillation. Delay changes restart the pipe, initially filled with 35°C water. Playback speed changes wall-clock pacing; it does not change the simulated delay. A small temperature history supports the scene. This is an illustrative feedback model, not real shower engineering.
- `/simulations/flocking/` — **Nobody Is in Charge.** 60–100 bird-like agents use synchronous separation, alignment and cohesion within a local radius. Short trails clarify direction; toggles expose the rules as Keep some space, Match direction and Stay together. Each toggle preserves its strength setting when re-enabled. Coordinating, No shared direction and Loose flock offer three starting balances. The field wraps; there is no leader. Pointer proximity adds a local disturbance. Heading agreement is the magnitude of mean unit velocity, not a measure of collective quality. Agent count recreates the flock; other rules change live.

Each new page leads with a literal scene, a one-line Try this prompt and 3–4 presets. Controls come next; small readouts and optional supporting histories follow. Explanatory blocks stay under 120 words. Animation respects reduced-motion preferences for scene transitions.

Each uses the existing `sim-shell__*` classes and `SimulationShell.init()` actions. The extra shared experiment styles reuse the catalogue's SSC palette and typography. There are no new libraries, frameworks, services, package managers or production build steps.

```text
assets/
  css/simulation-shell.css       # Existing shared shell
  css/experiments.css            # Compact controls, readouts and canvas layout
  js/simulation-shell.js        # Existing transport bindings
  js/experiments.js              # Canvas sizing, charts and animation transport
simulations/
  segregation/                  # index.html, model.js, simulation.js
  commons/                      # index.html, model.js, simulation.js
  delay-trap/                   # index.html, model.js, simulation.js
  flocking/                     # index.html, model.js, simulation.js
  ...                           # Existing experiments and reusable _template
tests/experiments.test.js       # Optional model checks; not loaded by the site
```

The new pages separate model rules (`model.js`) from browser drawing and controls (`simulation.js`). Play/Pause/Step/Reset are shared. Reset pauses and recreates the initial conditions using the current settings; the seeded experiments repeat the same arrangement for fair comparisons. Changing speed affects playback, not a stored history. Pages pause when hidden and resize their canvases without resetting the model.

### Verification

Open each page through a static HTTP server. Check Play/Pause/Step/Reset, live parameter changes, the browser console and a narrow screen. All local assets use relative paths; catalogue/back links use the site's existing root paths. The homepage can run as plain HTML.

Optional developer checks run with `node tests/experiments.test.js`, using only Node's built-in assertions and VM. They verify conservation of agents/resource, different Commons regimes, exact temperature transport delays and oscillation, bounded flock motion and effects of local rules. The checks also verify that visible happiness matches local rules, manual taps hold their setting, temperatures stay within mixing bounds, and patient delayed corrections settle. Node is only a test runner; visitors and publication require no Node or build process.
