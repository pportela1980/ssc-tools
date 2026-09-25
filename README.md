# Instruments for Complexity

This repository publishes [tools.systemsandcomplexity.school](https://tools.systemsandcomplexity.school/) through GitHub Pages. `index.html` is the public catalogue; `CNAME` connects the custom domain. Each instrument is a standalone HTML page, so its existing URL should remain stable.

## Public catalogue

| Instrument | Public page | Source |
| --- | --- | --- |
| You Are in the System | `/you-are-in-the-system-v2.html` | This repository |
| The Pendulum | `https://pportela1980.github.io/pendulum/` | [pendulum](https://github.com/pportela1980/pendulum) |
| Attractors and Chaos | `/lorenz.html` | This repository |
| Three-Body Problem | `/threebody_bites.html` | This repository |
| Polarisation Dynamics | `/polarisation.html` | This repository |
| Conflict System Dynamics | `https://pportela1980.github.io/aravane-sd/aravane_oscillator.html` | [aravane-sd](https://github.com/pportela1980/aravane-sd) |
| When Societies Bifurcate | `/conflict-dynamics-story.html` | This repository |
| Network Science Simulator | `https://pportela1980.github.io/networks/networks.html` | [networks](https://github.com/pportela1980/networks) |

`hormuz_cascade.html` and `threshold_diagnostic_v1.html` are present in this repository but are not in the public catalogue. The former is an embeddable fragment; the latter is a separate diagnostic with an email integration. Keep them unlisted until their role in this collection is decided.

## Maintaining the site

1. Edit `index.html` to change the catalogue or its text. Cards are grouped by theme; add a card to the appropriate section and update its count.
2. Edit an instrument in its source repository. Do not move or rename published HTML files without preserving the old URL.
3. Check the public page and each changed link after GitHub Pages finishes publishing.

The catalogue has no build step or JavaScript dependency. Open `index.html` locally for a quick layout review; local links to instruments require a local web server or the published site.
