# Nimbus: modern SaaS demo site for testing Optimize

A static, **modern SaaS-style website** (dark/light theme, bento layout, pricing toggle, ROI calculator, multi-step signup,
demo-request form, blog, and a tiny single-page-app docs) built as a **second, very different test site** next to the
Aurora Coffee store. No backend, no build step. Everything is fictional; forms send nothing anywhere.

Pages: Home · Pricing · Features (+ ROI calculator) · Blog / Post · Docs (**single-page app**, `?page=` routes) · Sign up (3 steps) ·
Welcome · Book a demo · 404.

## 1. Connect it to Optimize (2 minutes)
1. Optimize dashboard → **Add site** → name `Nimbus demo`, domain = this site's address (you can edit it later).
2. Open it → **Install & settings** → copy the **Site ID** (`site_ab12cd34ef`).
3. Edit [`optimize.config.js`](optimize.config.js): set `site` (and `origin` if your dashboard isn't the default). Commit and push.

Until `site` is set the site works normally but nothing is tracked. (`?optimize_site=site_xxxx` on any URL tries another site
without redeploying.) On a real website you would paste the snippet from *Install & settings* into `<head>` instead.

## 2. Run locally
```
python -m http.server 5500       # open http://localhost:5500
```

## 3. GitHub and Vercel
```
git remote add origin https://github.com/<you>/nimbus-saas-demo-site.git
git push -u origin main
```
Vercel → Add New → Project → import → Framework **Other**, no build command, no output directory → Deploy. Keep it embeddable
(no `X-Frame-Options` / `frame-ancestors`) so the dashboard's *Show here* preview works, and avoid a strict CSP.

## 4. What to test
| Feature in Optimize | Try this on Nimbus |
|---|---|
| **A/B test** | Home: change `#hero-title`, `#hero-sub` or `#hero-cta`. Pricing: change `#cta-team` text or `#pricing-title`. Goal: click `#hero-cta`, or the event `signup_complete`. |
| **Personalization: Change the page** | *Edit page visually* on Home: replace `#hero-img` (**upload** your own), change the headline, hide the announcement bar. Audience: returning visitors, mobile, UTM source `google`... |
| **3rd-visit popup / form** | Rule *Visit number ≥ 3*. Add `?controls=1` for **Simulate next visit** / **Reset visitor**. Inline target: `#lead-slot`. |
| **Funnel: signup** | Home → `/pricing.html` → event `select_plan` → `/signup.html` → events `signup_start`, `signup_step` → event `signup_complete` (fires on `/welcome.html`). |
| **Funnel: demo** | `/features.html` → event `calculator_used` → `/demo.html` → event `demo_request`. |
| **SPA support** | `/docs.html`: sidebar links change the page with `history.pushState`. Each click should count as a page view; campaigns re-evaluate. |
| **Heatmaps / scroll depth** | Long Home page; the blog post (`/post.html?slug=planning-without-meetings`) is a scroll-depth test. |
| **Clicks / rage clicks** | Pricing's billing switch, tour tabs on Home; click a dead area 3× quickly. |
| **Forms** | `#signup-form` (3 steps) and `#demo-form`: *Behavior → Forms* shows starts vs submits. |
| **Custom events** | `toggle_billing` `select_plan` `tour_tab` `calculator_used` `signup_start` `signup_step` `signup_complete` `demo_request` `lead_capture` `share_click` `view_post` `docs_nav` `theme_toggle` |
| **Consent** | Cookie banner calls `OT.consent(true/false)`. Turn on *Require consent* in Optimize to see nothing tracked until *Accept*. |
| **Dark mode** | The ◐ button; campaigns/editor should look right in both themes. |

### Handy selectors
`#hero` `#hero-title` `#hero-sub` `#hero-cta` `#hero-secondary` `#hero-fine` `#hero-img` `#features-title` `#tour` `#cta-title` `#lead-slot` `#lead-form`
`#billing-toggle` `#cta-starter` `#cta-team` `#cta-business` `#signup-form` `#su-submit` `#demo-form` `#demo-submit` `#docs-nav` `#docs-view`

All illustrations are original SVGs generated for this demo.
