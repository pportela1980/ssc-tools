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

`you-are-in-the-system-v2.html` is the guided reading experience and embeds six simulations. The root HTML files remain at their published URLs for existing links. Keep those paths working when changing the canonical simulation pages.

`hormuz_cascade.html` is an embeddable fragment, not a complete standalone page. `threshold_diagnostic_v1.html` is a separate diagnostic with external integrations. Both remain available at their original paths and are not listed in the catalogue.

## Maintaining the site

1. Edit `index.html` to update catalogue text and links. Cards are grouped by theme; update the section count when adding a card.
2. Edit the canonical HTML file under `simulations/<name>/`. If its corresponding root-level legacy file should reflect the same change, update that copy as well until a deliberate redirect is introduced.
3. Keep the guided reading iframe and full-screen links in sync with the canonical paths.
4. Check the catalogue, each changed simulation, the guided reading embeds, and the legacy URLs after deployment. The site is also published at `https://complexitytools.netlify.app/`; verify that deployment separately.

The `threshold` and `governance-patterns` repositories are separate projects and are not part of this simulation collection.
