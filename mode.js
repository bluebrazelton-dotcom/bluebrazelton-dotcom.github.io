/* Light / dark mode for bluebrazelton.com.
   Load in <head> without defer so the right colors apply before the page paints.
   - A visitor's own choice (the header button) is remembered in this browser.
   - With no saved choice, the page follows the device setting, live.
   - Sets <html data-mode="light|dark">; the CSS keys off that attribute.
   - Adds the sun/moon button to the site header, after the menu. */
(function () {
  var root = document.documentElement;
  var KEY = 'bb-mode';
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function saved() {
    try { var v = localStorage.getItem(KEY); return v === 'dark' || v === 'light' ? v : null; }
    catch (e) { return null; }
  }
  function system() { return mq && mq.matches ? 'dark' : 'light'; }
  function current() { return root.getAttribute('data-mode') === 'dark' ? 'dark' : 'light'; }
  function apply(mode) { root.setAttribute('data-mode', mode); sync(); }

  var MOON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.3 14.6A8.5 8.5 0 0 1 9.4 3.7a.6.6 0 0 0-.8-.7A9.7 9.7 0 1 0 21 15.4a.6.6 0 0 0-.7-.8z"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4.6" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 1.8v2.6M12 19.6v2.6M1.8 12h2.6M19.6 12h2.6M4.8 4.8l1.8 1.8M17.4 17.4l1.8 1.8M4.8 19.2l1.8-1.8M17.4 6.6l1.8-1.8"/></g></svg>';

  function sync() {
    var b = document.querySelector('.mode-toggle');
    if (!b) return;
    var dark = current() === 'dark';
    b.setAttribute('aria-pressed', dark ? 'true' : 'false');
    b.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    b.innerHTML = dark ? SUN : MOON;
  }

  apply(saved() || system());

  if (mq) {
    var onChange = function () { if (!saved()) apply(system()); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  function addButton() {
    if (document.querySelector('.mode-toggle')) return;
    var nav = document.querySelector('.site-header .nav, .site-header .site-nav');
    if (!nav) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'mode-toggle';
    b.setAttribute('aria-label', 'Dark mode');
    b.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch (e) {}
      apply(next);
    });
    nav.parentNode.insertBefore(b, nav.nextSibling);
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addButton);
  else addButton();
})();
