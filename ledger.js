// Fact Ledger selection. State is the claim id, taken from the element the user acted on.
// Fixtures themselves are static markup in index.html (data-claim-id / data-source-id).
(() => {
  const ledger = document.getElementById('ledger');
  if (!ledger) return;
  const tabs = [...ledger.querySelectorAll('[role="tab"]')];
  const panels = new Map([...ledger.querySelectorAll('[role="tabpanel"]')].map((p) => [p.dataset.claimId, p]));
  const ids = tabs.map((t) => t.dataset.claimId);

  function select(id, { focus = false } = {}) {
    if (!panels.has(id)) return;
    for (const tab of tabs) {
      const on = tab.dataset.claimId === id;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
    }
    for (const [pid, panel] of panels) panel.hidden = pid !== id;
  }

  ledger.addEventListener('click', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (tab) select(tab.dataset.claimId);
  });

  ledger.addEventListener('keydown', (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (!tab) return;
    const i = ids.indexOf(tab.dataset.claimId);
    const next = {
      ArrowDown: ids[(i + 1) % ids.length],
      ArrowRight: ids[(i + 1) % ids.length],
      ArrowUp: ids[(i - 1 + ids.length) % ids.length],
      ArrowLeft: ids[(i - 1 + ids.length) % ids.length],
      Home: ids[0],
      End: ids[ids.length - 1],
    }[e.key];
    if (!next) return;
    e.preventDefault();
    select(next, { focus: true });
  });

  // Initial state: the tab that markup marks selected (c1).
  select(tabs.find((t) => t.getAttribute('aria-selected') === 'true').dataset.claimId);
})();
