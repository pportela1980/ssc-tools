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
