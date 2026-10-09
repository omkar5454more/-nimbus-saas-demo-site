/* Loads the Optimize SDK exactly like the official snippet does (anti-flicker style + async script),
 * but reads the site ID and origin from optimize.config.js so you only edit one file.
 * Add  ?optimize_site=site_xxxx  to any URL to try a different site without redeploying. */
(function () {
  var cfg = window.OPTIMIZE_CONFIG || {};
  var fromUrl = new URLSearchParams(location.search).get("optimize_site");
  var site = fromUrl || cfg.site || "";
  // only accept well-formed values: this string ends up in a <script src>, so never trust anything else
  if (!/^site_[a-f0-9]{6,32}$/.test(site)) {
    if (!window.__optimizeWarned) { window.__optimizeWarned = true; console.warn("[Aurora demo] Optimize is not connected. Set `site` in optimize.config.js (current: " + site + ")."); }
    return;
  }
  var origin = String(cfg.origin || "").replace(/\/+$/, "");
  if (!/^https?:\/\/[A-Za-z0-9.-]+(:\d+)?$/.test(origin)) { console.warn("[Aurora demo] Invalid `origin` in optimize.config.js"); return; }

  var hide = document.createElement("style");
  hide.id = "ot-hide";
  hide.textContent = "body{opacity:0!important}";   // removed by the SDK as soon as page changes are applied
  document.head.appendChild(hide);
  setTimeout(function () { var h = document.getElementById("ot-hide"); if (h) h.remove(); }, 1500);

  var s = document.createElement("script");
  s.src = origin + "/sdk.js";
  s.async = true;
  s.setAttribute("data-site", site);
  document.head.appendChild(s);
})();
