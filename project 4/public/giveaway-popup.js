/* ════════════════════════════════════════════════════════════
   PERREO ELÉCTRICO — GIVEAWAY POPUP v2 (site-integrated build)
   - Fires at 25% scroll, 24h dismiss memory
   - Captures First Name, Email, Phone
   - Auto-detects city from URL at submit time (SPA-safe)
   - Posts to /api/giveaway (server-side relay -> ClickFunnels)
     master tag: giveaway_entrant  |  city tag: city_xxx
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.__PE_POPUP_LOADED) return;
  window.__PE_POPUP_LOADED = true;

  var API_URL = '/api/giveaway';

  var CITY_MAP = {
    'denver': 'city_denver',
    'chicago': 'city_chicago',
    'milwaukee': 'city_milwaukee',
    'seattle': 'city_seattle',
    'portland': 'city_portland',
    'pasco': 'city_pasco',
    'greensboro': 'city_greensboro',
    'salt-lake': 'city_saltlakecity',
    'slc': 'city_saltlakecity',
    'kansas-city': 'city_kansascity',
    'kc': 'city_kansascity',
    'st-louis': 'city_stlouis',
    'stl': 'city_stlouis',
    'nashville': 'city_nashville'
  };

  var SCROLL_PCT = 0.25;
  var RESHOW_HOURS = 24;
  var STORAGE_KEY = 'pe_gw_ts';
  var DONE_KEY = 'pe_gw_done';

  var CSS = "" +
    "#pe-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99998;backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);}" +
    "#pe-overlay.active{display:flex;align-items:center;justify-content:center;padding:16px;animation:pe-fade-in 0.3s ease;}" +
    "@keyframes pe-fade-in{from{opacity:0}to{opacity:1}}" +
    "@keyframes pe-slide-up{from{opacity:0;transform:translateY(28px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}" +
    "#pe-modal{position:relative;width:100%;max-width:500px;background:#000;border:1px solid #1c1c1c;box-shadow:0 0 80px rgba(220,30,80,0.22),0 0 140px rgba(232,160,32,0.08);animation:pe-slide-up 0.35s ease;overflow:hidden;}" +
    "#pe-close{position:absolute;top:13px;right:15px;background:none;border:none;cursor:pointer;color:#3a3a3a;font-size:24px;line-height:1;font-family:Arial,sans-serif;transition:color 0.2s;z-index:10;}" +
    "#pe-close:hover{color:#dc1e50;}" +
    ".pe-top-bar{height:3px;background:linear-gradient(90deg,#dc1e50,#e8601a,#e8a020,#e8601a,#dc1e50);}" +
    ".pe-badge{background:linear-gradient(90deg,#dc1e50,#e8601a,#e8a020);text-align:center;padding:7px 20px;font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:4px;color:#000;}" +
    ".pe-logo-wrap{padding:26px 40px 0;text-align:center;}" +
    ".pe-logo-wrap img{width:100%;max-width:260px;display:block;margin:0 auto;filter:drop-shadow(0 0 12px rgba(220,30,80,0.5)) drop-shadow(0 0 28px rgba(180,100,0,0.22));}" +
    ".pe-line{height:1px;margin:16px 0 0;background:linear-gradient(90deg,transparent,#dc1e50,#e8a020,#dc1e50,transparent);opacity:0.6;}" +
    ".pe-headline-block{padding:22px 36px 0;text-align:center;}" +
    ".pe-eyebrow{font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:5px;color:#dc1e50;margin-bottom:6px;}" +
    ".pe-headline{font-family:'Bebas Neue',sans-serif;font-size:48px;line-height:1.0;letter-spacing:2px;background:linear-gradient(135deg,#fff 30%,#e8a020 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:10px;}" +
    ".pe-subhead{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:300;color:#777;line-height:1.55;}" +
    ".pe-subhead strong{color:#fff;font-weight:600;}" +
    ".pe-prizes{display:flex;gap:8px;justify-content:center;padding:18px 36px 0;flex-wrap:wrap;}" +
    ".pe-prize{display:flex;align-items:center;gap:6px;background:#080808;border:1px solid #1e1e1e;padding:8px 14px;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:600;color:#fff;letter-spacing:0.5px;}" +
    ".pe-form-wrap{padding:22px 36px 0;}" +
    ".pe-form-wrap input{display:block;width:100%;background:#060606;border:1px solid #1e1e1e;border-bottom-color:#2e2e2e;color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:400;padding:13px 15px;margin-bottom:9px;outline:none;transition:border-color 0.2s,box-shadow 0.2s;-webkit-appearance:none;border-radius:0;box-sizing:border-box;}" +
    ".pe-form-wrap input::placeholder{color:#333;}" +
    ".pe-form-wrap input:focus{border-color:#dc1e50;box-shadow:0 0 0 1px rgba(220,30,80,0.18);}" +
    ".pe-cta{display:block;width:100%;margin-top:4px;padding:15px 20px;background:linear-gradient(135deg,#dc1e50,#e8601a,#e8a020);border:none;cursor:pointer;font-family:'Bebas Neue',sans-serif;font-size:19px;letter-spacing:4px;color:#000;text-transform:uppercase;transition:opacity 0.2s,transform 0.1s;position:relative;overflow:hidden;}" +
    ".pe-cta:hover{opacity:0.9;}.pe-cta:active{transform:scale(0.99);}.pe-cta:disabled{opacity:0.45;cursor:not-allowed;}" +
    ".pe-cta::after{content:'';position:absolute;top:0;left:-100%;width:55%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent);animation:pe-shimmer 2.8s infinite;}" +
    "@keyframes pe-shimmer{0%{left:-100%}55%{left:150%}100%{left:150%}}" +
    ".pe-fine-print{text-align:center;padding:12px 36px 0;font-family:'Barlow Condensed',sans-serif;font-size:11.5px;color:#2d2d2d;line-height:1.9;}" +
    ".pe-fine-print a{color:#3a3a3a;text-decoration:underline;}" +
    ".pe-no-thanks{display:block;width:100%;text-align:center;padding:14px 0 20px;font-family:'Barlow Condensed',sans-serif;font-size:12px;color:#222;cursor:pointer;letter-spacing:1.5px;text-transform:uppercase;border:none;background:none;transition:color 0.2s;}" +
    ".pe-no-thanks:hover{color:#444;}" +
    ".pe-success{display:none;padding:44px 36px;text-align:center;}" +
    ".pe-success-icon{font-size:44px;margin-bottom:14px;}" +
    ".pe-success h2{font-family:'Bebas Neue',sans-serif;font-size:34px;letter-spacing:2px;background:linear-gradient(135deg,#fff 30%,#e8a020 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:10px;}" +
    ".pe-success p{font-family:'Barlow Condensed',sans-serif;font-size:18px;color:#777;line-height:1.65;margin-bottom:22px;}" +
    ".pe-success-cta{display:inline-block;padding:13px 34px;background:linear-gradient(135deg,#dc1e50,#e8601a,#e8a020);font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:3px;color:#000;text-decoration:none;}" +
    "@media (max-width:480px){.pe-headline{font-size:38px;}.pe-headline-block,.pe-form-wrap,.pe-fine-print,.pe-prizes,.pe-logo-wrap{padding-left:22px;padding-right:22px;}}";

  var HTML = "" +
    '<div id="pe-modal" role="dialog" aria-modal="true" aria-label="Perreo Electrico giveaway">' +
    '<button id="pe-close" aria-label="Close">&times;</button>' +
    '<div class="pe-top-bar"></div>' +
    '<div class="pe-badge">⚡ WEEKLY GIVEAWAY &nbsp;—&nbsp; ONE WINNER EVERY SUNDAY ⚡</div>' +
    '<div class="pe-logo-wrap"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/f1027de7-2038-4cb2-b32d-e3b0cf3875c1/workspace-310419/Oxido.png" alt="Perreo Electrico" /></div>' +
    '<div class="pe-line"></div>' +
    '<div class="pe-headline-block">' +
    '<div class="pe-eyebrow">ENTER TO WIN</div>' +
    '<div class="pe-headline">FREE TICKET<br>+ FREE TEE</div>' +
    '<p class="pe-subhead">Every Sunday we pick <strong>one winner</strong>.<br/>Drop your info — you’re in.</p>' +
    '</div>' +
    '<div class="pe-prizes">' +
    '<div class="pe-prize">🎟️ &nbsp;Free Entry</div>' +
    '<div class="pe-prize">👕 &nbsp;Perreo Tee</div>' +
    '<div class="pe-prize">🔔 &nbsp;First Access</div>' +
    '</div>' +
    '<div id="pe-form-content">' +
    '<div class="pe-form-wrap">' +
    '<form id="pe-form" novalidate>' +
    '<input type="text" id="pe-fname" name="first_name" placeholder="First name" autocomplete="given-name" required />' +
    '<input type="email" id="pe-email" name="email" placeholder="Email address" autocomplete="email" required />' +
    '<input type="tel" id="pe-phone" name="phone_number" placeholder="Mobile number (for texts)" autocomplete="tel" required />' +
    '<button type="submit" class="pe-cta" id="pe-submit">ENTER NOW — IT’S FREE →</button>' +
    '</form>' +
    '</div>' +
    '<div class="pe-fine-print">One winner every Sunday. No purchase necessary.<br/>By entering you agree to receive emails &amp; texts from Perreo Eléctrico.<br/><a href="#">Unsubscribe anytime.</a></div>' +
    '<button class="pe-no-thanks" id="pe-no-thanks">No thanks — I don’t want free stuff</button>' +
    '</div>' +
    '<div class="pe-success" id="pe-success">' +
    '<div class="pe-success-icon">🔥</div>' +
    '<h2>YOU’RE IN THE DRAW</h2>' +
    '<p>We pick every Sunday.<br/>We’ll text you if you win.<br/>In the meantime — find your show.</p>' +
    '<a href="https://tour.perreo-electrico.com" class="pe-success-cta">SEE ALL TOUR DATES →</a>' +
    '</div>' +
    '</div>';

  function detectCity() {
    var path = (window.location.pathname + window.location.search).toLowerCase();
    for (var key in CITY_MAP) {
      if (CITY_MAP.hasOwnProperty(key) && path.indexOf(key) !== -1) {
        return CITY_MAP[key];
      }
    }
    return 'city_unknown';
  }

  function init() {
    // Fonts
    var font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&display=swap';
    document.head.appendChild(font);

    // Styles
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // DOM
    var overlay = document.createElement('div');
    overlay.id = 'pe-overlay';
    overlay.innerHTML = HTML;
    document.body.appendChild(overlay);

    var submitBtn = document.getElementById('pe-submit');
    var hasShown = false;

    function showPopup(force) {
      if (hasShown && !force) return;
      if (!force && isDismissed()) return;
      hasShown = true;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function hidePopup() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    function dismissPopup() {
      try { localStorage.setItem(STORAGE_KEY, Date.now()); } catch (e) {}
      hidePopup();
    }
    function isDismissed() {
      try {
        if (localStorage.getItem(DONE_KEY)) return true; // already entered: never reshow
        var ts = localStorage.getItem(STORAGE_KEY);
        if (!ts) return false;
        return (Date.now() - parseInt(ts, 10)) < (RESHOW_HOURS * 3600000);
      } catch (e) { return false; }
    }

    function onScroll() {
      var scrolled = window.scrollY || window.pageYOffset;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      if (scrolled / docHeight >= SCROLL_PCT) {
        showPopup();
        window.removeEventListener('scroll', onScroll);
      }
    }
    setTimeout(function () {
      window.addEventListener('scroll', onScroll, { passive: true });
    }, 1500);

    // Re-arm on SPA navigation (home <-> city landing pages)
    function onRouteChange() {
      hasShown = false;
      window.removeEventListener('scroll', onScroll);
      setTimeout(function () {
        window.addEventListener('scroll', onScroll, { passive: true });
      }, 1500);
    }
    var _push = history.pushState;
    history.pushState = function () {
      _push.apply(this, arguments);
      onRouteChange();
    };
    window.addEventListener('popstate', onRouteChange);

    document.getElementById('pe-close').addEventListener('click', dismissPopup);
    document.getElementById('pe-no-thanks').addEventListener('click', dismissPopup);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) dismissPopup();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) dismissPopup();
    });

    function highlight(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.style.borderColor = '#dc1e50';
      el.addEventListener('input', function () { this.style.borderColor = ''; }, { once: true });
    }

    function findTicketUrl() {
      var links = document.querySelectorAll('a[href]');
      for (var i = 0; i < links.length; i++) {
        var a = links[i];
        var href = a.getAttribute('href') || '';
        var text = (a.textContent || '').toLowerCase();
        if (href.indexOf('http') === 0 && href.indexOf('perreo-electrico') === -1) {
          if (/eventbrite|theticketing|ticket|linktr/.test(href.toLowerCase()) || text.indexOf('ticket') !== -1) {
            return href;
          }
        }
      }
      return null;
    }

    function showSuccess() {
      try { localStorage.setItem(DONE_KEY, '1'); } catch (e) {}
      document.getElementById('pe-form-content').style.display = 'none';
      document.getElementById('pe-success').style.display = 'block';

      // On a city landing page: send them straight to tickets
      var onCityPage = detectCity() !== 'city_unknown' || window.location.pathname.indexOf('/event') === 0;
      var ticketUrl = onCityPage ? findTicketUrl() : null;
      if (ticketUrl) {
        var cta = document.querySelector('.pe-success-cta');
        if (cta) { cta.href = ticketUrl; cta.textContent = 'GET YOUR TICKETS \u2192'; }
        setTimeout(function () { window.location.href = ticketUrl; }, 1600);
      } else {
        setTimeout(dismissPopup, 9000);
      }
    }

    document.getElementById('pe-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var fname = document.getElementById('pe-fname').value.trim();
      var email = document.getElementById('pe-email').value.trim();
      var phone = document.getElementById('pe-phone').value.trim();

      var missing = false;
      if (!fname) { highlight('pe-fname'); missing = true; }
      if (!email) { highlight('pe-email'); missing = true; }
      if (!phone) { highlight('pe-phone'); missing = true; }
      if (missing) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { highlight('pe-email'); return; }

      submitBtn.disabled = true;
      submitBtn.textContent = 'ENTERING...';

      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: fname,
          email: email,
          phone: phone,
          city_tag: detectCity(),
          page_url: window.location.href
        })
      })
      .then(function () { showSuccess(); })
      .catch(function (err) {
        console.error('[PE Popup] error:', err);
        showSuccess();
      });
    });

    window.PEPopup = { show: showPopup, hide: hidePopup };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
