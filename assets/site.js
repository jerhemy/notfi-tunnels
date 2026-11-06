// Tab groups ([data-tabs]); arrow keys move between tabs.
for (const group of document.querySelectorAll('[data-tabs]')) {
  const tabs = [...group.querySelectorAll('[role="tab"]')];
  const select = (tab) => {
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    }
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      const next = tabs[(i + step + tabs.length) % tabs.length];
      select(next);
      next.focus();
    });
  });
}

// Highlight the download that matches this computer.
(async () => {
  const ua = navigator.userAgent;
  const os = /Windows/i.test(ua) ? 'windows' : /Mac OS X|Macintosh/i.test(ua) ? 'macos'
    : /Linux|X11/i.test(ua) && !/Android/i.test(ua) ? 'linux' : null;
  if (!os) return;
  let arch = null;
  try {
    const hints = await navigator.userAgentData?.getHighEntropyValues(['architecture', 'bitness']);
    if (hints?.architecture === 'arm') arch = hints.bitness === '32' ? 'arm' : 'arm64';
    else if (hints?.architecture === 'x86') arch = 'x64';
  } catch { /* not available */ }
  if (!arch && /aarch64|arm64/i.test(ua)) arch = 'arm64';
  const card = document.querySelector(`.platform[data-os="${os}"]`);
  if (!card) return;
  card.classList.add('detected');
  const label = document.createElement('span');
  label.className = 'yours';
  label.textContent = 'Your computer';
  card.querySelector('h3').append(label);
  const button = arch && card.querySelector(`[data-arch="${arch}"]`);
  if (button) button.classList.add('primary');
})();
