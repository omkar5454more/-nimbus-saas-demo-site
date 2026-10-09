/* Nimbus demo site: shared chrome, theme, cookie banner, page logic and (opt-in) test controls.
 * Everything is static and fictional. Forms don't send anything anywhere; nothing here reads or sends personal data. */
(function () {
  "use strict";
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var page = document.body.getAttribute("data-page") || "";
  var q = new URLSearchParams(location.search);
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  // ---------------------------------------------------------------- Optimize helpers (the SDK may load after us)
  function whenOT(fn) { var n = 0; (function go() { if (window.OT) return fn(window.OT); if (n++ < 40) setTimeout(go, 250); })(); }
  function track(name, props) { whenOT(function (OT) { OT.track(name, props || {}); }); }
  function toast(msg) {
    var t = $("#toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.style.display = "block"; clearTimeout(toast.t); toast.t = setTimeout(function () { t.style.display = "none"; }, 2400);
  }

  // ---------------------------------------------------------------- chrome
  function chrome() {
    var links = [["/features.html", "Features", "features"], ["/pricing.html", "Pricing", "pricing"], ["/docs.html", "Docs", "docs"], ["/blog.html", "Blog", "blog"]];
    var head = '<a class="skip" href="#main">Skip to content</a>' +
      (page === "home" ? '<div class="announce" id="announce"><span>🚀 <b>Nimbus 2.0</b> is here, with timelines that update themselves. <a href="/blog.html">See what’s new</a></span><button type="button" aria-label="Dismiss announcement" id="announce-x">×</button></div>' : "") +
      '<header class="site"><div class="wrap"><a class="logo" href="/index.html"><img src="/assets/img/favicon.svg" alt="" width="32" height="32">Nimbus</a>' +
      '<nav class="main" id="nav" aria-label="Main">' + links.map(function (l) { return '<a class="nav" href="' + l[0] + '"' + (page === l[2] || (l[2] === "blog" && page === "post") ? ' aria-current="page"' : "") + ">" + l[1] + "</a>"; }).join("") + '</nav>' +
      '<div class="actions"><button class="icon-btn" id="theme" type="button" aria-label="Toggle dark mode" title="Toggle dark mode">◐</button><a class="btn ghost sm" id="nav-demo" href="/demo.html">Book a demo</a><a class="btn sm" id="nav-cta" href="/signup.html">Start free trial</a>' +
      '<button class="icon-btn menu-btn" id="menu" type="button" aria-expanded="false" aria-controls="nav" aria-label="Menu">☰</button></div></div></header>';
    var foot = '<footer class="site"><div class="wrap"><div class="cols"><div><a class="logo" href="/index.html"><img src="/assets/img/favicon.svg" alt="" width="32" height="32">Nimbus</a><p class="muted" style="max-width:300px">Planning that stays out of your way. A fictional product for demonstrating website optimisation.</p></div>' +
      '<div><h4>Product</h4><a href="/features.html">Features</a><a href="/pricing.html">Pricing</a><a href="/docs.html">Docs</a><a href="/signup.html">Sign up</a></div>' +
      '<div><h4>Company</h4><a href="/blog.html">Blog</a><a href="/demo.html">Book a demo</a><a href="/features.html#roi">ROI calculator</a></div>' +
      '<div><h4>Legal</h4><a href="#" onclick="return false">Privacy</a><a href="#" onclick="return false">Terms</a></div></div>' +
      '<div class="legal">© Nimbus Labs. <b>Demo website for testing Optimize</b>: not a real product. No accounts are created and no data is sent anywhere.</div></div></footer>';
    document.body.insertAdjacentHTML("afterbegin", head); document.body.insertAdjacentHTML("beforeend", foot);
    $("#menu").addEventListener("click", function (e) { var o = $("#nav").classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded", String(o)); });
    $("#theme").addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = cur === "dark" ? "light" : "dark"; document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("nimbus_theme", next); } catch (e) { /* ignore */ } track("theme_toggle", { theme: next });
    });
    var ax = $("#announce-x"); if (ax) ax.addEventListener("click", function () { $("#announce").remove(); track("announcement_dismissed"); });
  }

  // fade-in on scroll
  function reveal() {
    var els = $$(".reveal"); if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  }

  // ---------------------------------------------------------------- pages
  var pages = {
    home: function () {
      var tabs = $$(".tab"), imgs = ["tour-board.svg", "tour-timeline.svg", "tour-reports.svg"];
      var copy = [["Boards that match how you work", "Kanban, list or calendar, with custom fields, filters and automation, all on the same tasks.", ["Drag-and-drop columns", "Custom fields and filters", "Automations without code"]],
        ["Timelines that update themselves", "Change a date and everything downstream moves. See conflicts before they become delays.", ["Dependencies you can see", "Workload by person", "One-click baseline"]],
        ["Reports your boss will actually read", "Live dashboards for velocity, cycle time and risk, ready to share as a link.", ["Velocity and burndown", "Cycle-time trends", "Shareable, always current"]]];
      function show(i) {
        tabs.forEach(function (t, j) { t.setAttribute("aria-selected", String(i === j)); });
        $("#tour-img").src = "/assets/img/" + imgs[i]; $("#tour-img").alt = copy[i][0];
        $("#tour-title").textContent = copy[i][0]; $("#tour-text").textContent = copy[i][1];
        $("#tour-list").innerHTML = copy[i][2].map(function (x) { return "<li>" + x + "</li>"; }).join("");
      }
      tabs.forEach(function (t, i) { t.addEventListener("click", function () { show(i); track("tour_tab", { tab: t.textContent.trim() }); }); }); show(0);
      // count-up stats
      $$("[data-count]").forEach(function (el) {
        var to = +el.getAttribute("data-count"), suf = el.getAttribute("data-suffix") || "", done = false;
        var run = function () { if (done) return; done = true; var t0 = performance.now(); (function f(t) { var p = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString() + suf; if (p < 1) requestAnimationFrame(f); })(t0); };
        if ("IntersectionObserver" in window) { var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { run(); io.disconnect(); } }); io.observe(el); } else { run(); }
      });
      var form = $("#lead-form");
      if (form) form.addEventListener("submit", function (e) {
        e.preventDefault(); var em = $("#lead-email").value.trim();
        track("lead_capture", { place: "cta_band" }); location.href = "/signup.html?email=" + encodeURIComponent(em);
      });
    },

    pricing: function () {
      var annual = true, sw = $("#billing-toggle");
      var plans = { starter: [0, 0], team: [12, 10], business: [24, 20] };
      function render() {
        sw.setAttribute("aria-checked", String(annual));
        Object.keys(plans).forEach(function (k) {
          var p = plans[k][annual ? 1 : 0]; $("#price-" + k).textContent = "$" + p;
          var cta = $("#cta-" + k); cta.href = "/signup.html?plan=" + k + "&billing=" + (annual ? "annual" : "monthly");
        });
        $$("[data-bill]").forEach(function (el) { el.textContent = annual ? "billed annually" : "billed monthly"; });
      }
      sw.addEventListener("click", function () { annual = !annual; render(); track("toggle_billing", { billing: annual ? "annual" : "monthly" }); });
      $$(".plan-cta").forEach(function (a) { a.addEventListener("click", function () { track("select_plan", { plan: a.getAttribute("data-plan"), billing: annual ? "annual" : "monthly" }); }); });
      render();
    },

    features: function () {
      var size = $("#c-size"), hrs = $("#c-hours"), rate = $("#c-rate"), used = false;
      function calc() {
        $("#v-size").textContent = size.value; $("#v-hours").textContent = hrs.value; $("#v-rate").textContent = "$" + rate.value;
        var saved = Math.round(+size.value * +hrs.value * 0.35 * +rate.value * 48);   // 35% of meeting/status time recovered, 48 working weeks
        var cost = +size.value * 12 * 12;
        $("#c-out").textContent = "$" + saved.toLocaleString(); $("#c-roi").textContent = saved > cost ? Math.round(saved / cost) + "× return on a Team plan" : "Add more hours or people to see a return";
        if (!used) { used = true; track("calculator_used", { team: +size.value }); }
      }
      [size, hrs, rate].forEach(function (el) { el.addEventListener("input", calc); }); calc(); used = false;
    },

    blog: function () {
      $("#posts").innerHTML = window.POSTS.map(function (p) {
        return '<a class="post-card" href="/post.html?slug=' + p.slug + '"><img src="/assets/img/' + p.cover + '" alt="" width="1200" height="630" loading="lazy"><div class="body"><span class="tag">' + p.tag + '</span><h3>' + p.title + '</h3><p class="muted" style="margin:0 0 10px">' + p.excerpt + '</p><span class="muted" style="font-size:14px">' + p.date + ' · ' + p.mins + ' min read</span></div></a>';
      }).join("");
    },

    post: function () {
      var p = window.POSTS.filter(function (x) { return x.slug === q.get("slug"); })[0], root = $("#post-root");
      if (!p) { root.innerHTML = '<div class="center" style="padding:80px 0"><h1>Post not found</h1><p><a class="btn" href="/blog.html">Back to the blog</a></p></div>'; return; }
      document.title = p.title + " | Nimbus";
      root.innerHTML = '<article class="post wrap narrow"><span class="tag">' + p.tag + '</span><h1 id="post-title">' + p.title + '</h1><div class="muted">' + p.date + ' · ' + p.mins + ' min read</div>' +
        '<img class="cover" id="post-cover" src="/assets/img/' + p.cover + '" alt="" width="1200" height="630">' +
        p.body.map(function (b) { return "<" + b[0] + ">" + b[1] + "</" + b[0] + ">"; }).join("") +
        '<div class="share"><b>Share this post:</b><button class="btn ghost sm" id="share-copy" type="button">Copy link</button><a class="btn ghost sm" id="share-x" href="#" onclick="return false">Post on X</a></div>' +
        '<div class="cta-band" style="margin-top:30px;padding:40px 26px"><h2 style="font-size:30px">Plan work that ships</h2><p>Try Nimbus free for 14 days.</p><a class="btn ghost" id="post-cta" href="/signup.html">Start free trial</a></div></article>';
      var bar = document.createElement("div"); bar.className = "read-progress"; document.body.appendChild(bar);
      window.addEventListener("scroll", function () { var h = document.documentElement; bar.style.width = Math.min(100, h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + "%"; }, { passive: true });
      $("#share-copy").addEventListener("click", function () { try { navigator.clipboard.writeText(location.href); } catch (e) { /* ignore */ } toast("Link copied"); track("share_click", { how: "copy", post: p.slug }); });
      $("#share-x").addEventListener("click", function () { track("share_click", { how: "x", post: p.slug }); });
      track("view_post", { post: p.slug });
    },

    signup: function () {
      var step = 1, form = $("#signup-form"), started = false;
      if (q.get("email")) $("#su-email").value = q.get("email").slice(0, 120);
      var plan = ["starter", "team", "business"].indexOf(q.get("plan")) > -1 ? q.get("plan") : "team";
      $$('input[name="plan"]').forEach(function (r) { r.checked = r.value === plan; });
      function go(n) {
        step = n; $$(".step").forEach(function (s) { s.hidden = +s.getAttribute("data-step") !== n; });
        $$(".steps span").forEach(function (s, i) { s.classList.toggle("on", i < n); });
        $("#su-title").textContent = ["", "Create your workspace", "Pick a plan", "Review and finish"][n];
        if (n === 3) $("#su-review").textContent = $("#su-name").value + " · " + $("#su-email").value + " · team of " + $("#su-size").value + " · " + $('input[name="plan"]:checked').value + " plan";
      }
      form.addEventListener("input", function () { if (!started) { started = true; track("signup_start", { plan: plan }); } });
      $$("[data-next]").forEach(function (b) { b.addEventListener("click", function () {
        var cur = $('.step[data-step="' + step + '"]'), bad = $$("input[required], select[required]", cur).filter(function (i) { return !i.checkValidity(); })[0];
        if (bad) { bad.reportValidity(); return; }
        track("signup_step", { step: step }); go(step + 1);
      }); });
      $$("[data-back]").forEach(function (b) { b.addEventListener("click", function () { go(step - 1); }); });
      form.addEventListener("submit", function (e) {
        e.preventDefault(); if (step !== 3) return;
        var sel = $('input[name="plan"]:checked').value;
        try { sessionStorage.setItem("nimbus_signup", JSON.stringify({ plan: sel, size: $("#su-size").value, id: "ws_" + Math.random().toString(36).slice(2, 8) })); } catch (err) { /* ignore */ }
        location.href = "/welcome.html";
      });
      go(1);
    },

    welcome: function () {
      var s = null; try { s = JSON.parse(sessionStorage.getItem("nimbus_signup")); } catch (e) { /* none */ }
      if (!s || !/^ws_[a-z0-9]{1,8}$/.test(s.id)) { $("#welcome-line").textContent = "This is a demo, so no workspace was created. Start a trial to see the flow."; return; }
      $("#welcome-line").textContent = "Your demo workspace (" + s.id + ") is ready on the " + s.plan + " plan. Nothing was actually created.";
      var key = "nimbus_signup_done_" + s.id; try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, "1"); } catch (e) { /* ignore */ }
      track("signup_complete", { plan: s.plan, team: +s.size });
    },

    demo: function () {
      $("#demo-form").addEventListener("submit", function (e) {
        e.preventDefault(); this.hidden = true; $("#demo-thanks").hidden = false; track("demo_request", { team: $("#d-size").value });
      });
    },

    docs: function () {
      var nav = $("#docs-nav"), view = $("#docs-view");
      nav.innerHTML = window.DOCS.map(function (d) { return '<a href="/docs.html?page=' + d.slug + '" data-slug="' + d.slug + '">' + d.title + "</a>"; }).join("");
      function current() { var s = q.get("page") || new URLSearchParams(location.search).get("page"); return window.DOCS.filter(function (d) { return d.slug === s; })[0] || window.DOCS[0]; }
      function render() {
        var d = current();
        document.title = d.title + " | Nimbus docs";
        $$("a", nav).forEach(function (a) { if (a.getAttribute("data-slug") === d.slug) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
        view.innerHTML = "<h1>" + d.title + "</h1>" + d.body.map(function (b) { return b[0] === "code" ? '<pre class="code">' + esc(b[1]) + "</pre>" : "<" + b[0] + ">" + esc(b[1]) + "</" + b[0] + ">"; }).join("");
        window.scrollTo(0, 0);
      }
      // single-page navigation: history.pushState + ?page= so a refresh works on any static host
      nav.addEventListener("click", function (e) {
        var a = e.target.closest("a"); if (!a) return; e.preventDefault();
        history.pushState({}, "", "/docs.html?page=" + a.getAttribute("data-slug")); q = new URLSearchParams(location.search); render();
        track("docs_nav", { page: a.getAttribute("data-slug") });
      });
      window.addEventListener("popstate", function () { q = new URLSearchParams(location.search); render(); });
      render();
    }
  };

  // ---------------------------------------------------------------- cookie banner (talks to Optimize's consent API)
  function cookies() {
    var choice = null; try { choice = localStorage.getItem("nimbus_cookie"); } catch (e) { /* ignore */ }
    function apply(v) { whenOT(function (OT) { OT.consent(v === "yes"); }); }
    if (choice) { apply(choice); return; }
    var el = document.createElement("div"); el.id = "cookie"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Cookie preferences");
    el.innerHTML = '<p><b>We use one cookie</b> to recognise you between visits and improve this site. No ads, no selling data.</p><div class="row"><button class="btn sm" data-c="yes" type="button">Accept</button><button class="btn ghost sm" data-c="no" type="button">Decline</button></div>';
    document.body.appendChild(el);
    el.addEventListener("click", function (e) { var v = e.target.getAttribute && e.target.getAttribute("data-c"); if (!v) return; try { localStorage.setItem("nimbus_cookie", v); } catch (err) { /* ignore */ } el.remove(); apply(v); });
  }

  // ---------------------------------------------------------------- test-only panel: add ?controls=1 to any URL
  function controls() {
    if (q.get("controls") !== "1") return;
    var STORE = "_ot_v1";
    function read() { try { return JSON.parse(localStorage.getItem(STORE)); } catch (e) { return null; } }
    function write(s) { var raw = JSON.stringify(s); try { localStorage.setItem(STORE, raw); } catch (e) { /* ignore */ } document.cookie = "_ot=" + encodeURIComponent(raw) + ";max-age=31536000;path=/;SameSite=Lax"; }
    var el = document.createElement("div"); el.id = "demo-ctl"; el.setAttribute("data-ot-ignore", "1");
    el.innerHTML = '<div><b>Test controls</b> <span class="muted">(only with ?controls=1)</span></div><div id="dc-state" class="muted">Waiting for Optimize…</div>' +
      '<div class="row"><button id="dc-next" type="button">Simulate next visit</button><button id="dc-reset" type="button">Reset visitor</button><button id="dc-cookie" type="button">Reset cookie choice</button></div>' +
      '<div class="muted" style="margin-top:8px">A visit = a new session (30 min after the last page view). “Simulate” back-dates the last visit so the next load counts as a new one.</div>';
    document.body.appendChild(el);
    setInterval(function () { var s = $("#dc-state"); if (!s) return; if (!window.OT) { s.textContent = "Waiting for Optimize… (not connected, or consent not given)"; return; } var v = OT.visitor; s.innerHTML = "Visit <b>#" + v.visitNo + "</b> · " + (v.isReturning ? "returning" : "new") + " visitor · id " + v.id.slice(0, 8); }, 700);
    function afterSdk(fn) { window.addEventListener("pagehide", fn); location.reload(); }   // runs after the SDK's own pagehide save
    $("#dc-next").onclick = function () { afterSdk(function () { var s = read(); if (s) { s.last = Date.now() - 31 * 60 * 1000; write(s); } }); };
    $("#dc-reset").onclick = function () { afterSdk(function () { try { localStorage.removeItem(STORE); localStorage.removeItem("_ot_consent"); } catch (e) { /* ignore */ } document.cookie = "_ot=;max-age=0;path=/"; }); };
    $("#dc-cookie").onclick = function () { try { localStorage.removeItem("nimbus_cookie"); } catch (e) { /* ignore */ } location.reload(); };
  }

  chrome();
  if (pages[page]) pages[page]();
  reveal(); cookies(); controls();
})();
