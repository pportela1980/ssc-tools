/* Optional, framework-free bindings for the shared simulation shell. */
(function () {
  'use strict';

  function init(options) {
    const settings = options || {};
    const root = settings.root || document;
    const actions = settings.actions || {};

    root.querySelectorAll('[data-shell-tab]').forEach(function (button) {
      button.addEventListener('click', function () {
        const selected = button.dataset.shellTab;
        root.querySelectorAll('[data-shell-tab]').forEach(function (tab) {
          const active = tab.dataset.shellTab === selected;
          tab.classList.toggle('active', active);
          tab.setAttribute('aria-selected', String(active));
        });
        root.querySelectorAll('[data-shell-panel]').forEach(function (panel) {
          panel.classList.toggle('active', panel.dataset.shellPanel === selected);
        });
      });
    });

    root.querySelectorAll('[data-shell-action]').forEach(function (button) {
      const handler = actions[button.dataset.shellAction];
      if (typeof handler === 'function') {
        button.addEventListener('click', handler);
      }
    });

    return {
      setRunning: function (running) {
        root.querySelectorAll('[data-shell-action="run"]').forEach(function (button) {
          button.disabled = Boolean(running);
        });
        root.querySelectorAll('[data-shell-action="pause"]').forEach(function (button) {
          button.disabled = !running;
        });
      }
    };
  }

  window.SimulationShell = { init: init };
}());
