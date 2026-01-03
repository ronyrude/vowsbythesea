/*!
 * shared-menu/menu-loader.js  —  UTF-8 (no BOM), plain JS
 * Loads menu.html into #site-nav and wires up mobile + hover-intent dropdown.
 */
(function () {
  'use strict';

  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(async function () {
    var mount = document.getElementById('site-nav');
    if (!mount) return;

    // Default to ./shared-menu/menu.html (relative to each page using it)
    var includePath = mount.getAttribute('data-include') || './shared-menu/menu.html';

    try {
      var res = await fetch(includePath, { credentials: 'same-origin', cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var html = await res.text();

      // If a whole HTML doc got returned (e.g., 404 page), bail out
      if (/<html[\s>]/i.test(html)) throw new Error('Fetched an HTML document instead of the partial. Path: ' + includePath);

      mount.innerHTML = html;
      initMenuInteractivity(mount);
    } catch (err) {
      console.error('Shared menu load failed:', err);
      mount.innerHTML =
        '<nav role="navigation" style="padding:12px 16px;background:#111425;color:#fff;">' +
          '<a href="/" style="color:#fff;font-weight:700;margin-right:12px">Vows By The Sea</a>' +
          '<a href="/packages.html" style="color:#fff;margin-right:12px">Packages</a>' +
          '<a href="/#contact" style="color:#fff">Contact</a>' +
        '</nav>';
    }
  });

  function initMenuInteractivity(root) {
    var nav = root.querySelector('nav');
    if (!nav) return;

    // Mobile hamburger
    var menuToggle = nav.querySelector('.menu-toggle');
    var linksWrap  = nav.querySelector('.links');
    if (menuToggle && linksWrap) {
      menuToggle.addEventListener('click', function () {
        var nowOpen = !nav.classList.contains('open');
        nav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(nowOpen));
      });
    }

    // Locations dropdown with hover-intent + click toggle
    var loc     = nav.querySelector('.locations');
    var opener  = loc ? loc.querySelector('.dropbtn') : null;
    var dd      = loc ? loc.querySelector('.dropdown') : null;
    if (!loc || !dd) return;

    var openTimer = null, closeTimer = null;
    function openDD()  { clearTimeout(closeTimer); openTimer  = setTimeout(function(){ loc.classList.add('open'); opener && opener.setAttribute('aria-expanded','true'); }, 100); }
    function closeDD() { clearTimeout(openTimer);  closeTimer = setTimeout(function(){ loc.classList.remove('open'); opener && opener.setAttribute('aria-expanded','false'); }, 220); }

    // Desktop hover/focus with small delay so it doesn't vanish immediately
    ['mouseenter','focusin'].forEach(function (t) { loc.addEventListener(t, openDD); });
    ['mouseleave','focusout'].forEach(function (t) {
      loc.addEventListener(t, function (e) {
        var rel = e.relatedTarget;
        var stillInside = rel && loc.contains(rel);
        var focusedInside = loc.contains(document.activeElement);
        if (!stillInside && !focusedInside) closeDD();
      });
    });

    // Touch/click toggle
    if (opener) {
      opener.addEventListener('click', function (e) {
        e.preventDefault();
        var willOpen = !loc.classList.contains('open');
        loc.classList.toggle('open');
        opener.setAttribute('aria-expanded', String(willOpen));
      });
    }

    // Close on Escape
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        loc.classList.remove('open');
        opener && opener.setAttribute('aria-expanded','false');
      }
    });
  }
})();