# Cyber Sparrow — landing

Landing page for selling private security research engagements.
Claude Code terminal aesthetic: dark bg, monospace, typewriter animation.

## Deploy to GitHub Pages

1. Create a new GitHub repo (e.g. `romanvorobyev/cybersparrow`).
2. Copy `cybersparrow/` contents to repo root (move, don't nest).
3. Commit + push to `main` branch.
4. In GitHub repo settings → Pages:
   - Source: `Deploy from a branch`, branch `main`, folder `/ (root)`
   - Custom domain: `cybersparrow.tech`
   - Wait for DNS check, then enable "Enforce HTTPS"
5. DNS (at domain registrar):
   - `A` records for apex `cybersparrow.tech` to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - OR `CNAME` if you use `www.cybersparrow.tech`:
     - `www` → `<username>.github.io`

HTTPS certificate is auto-issued by GitHub Pages via Let's Encrypt — nothing
to configure beyond the checkbox.

## Local preview

No build step. Open `index.html` directly in a browser, or run:

```bash
cd cybersparrow && python3 -m http.server 8000
# open http://localhost:8000
```

## Editing text

All on-screen content lives in `script.js` → `BLOCKS` array (lines 9-70).
Each block is a terminal "command" with its stdout lines. Edit strings,
save, reload browser.

For multi-paragraph stdout: add more `{ stdout: "..." }` entries in the
block's `lines` array.

For a new section: append a new block object to `BLOCKS`. Keep the
`$ cybersparrow <verb>` prompt convention so the aesthetic stays consistent.

## Form backend

Current MVP: `mailto:hello@cybersparrow.tech` — opens user's mail client.
Zero server dependency, works on GitHub Pages.

Swap to Formspree (free tier 50/month) when ready:
1. Sign up at formspree.io, get a form endpoint like `https://formspree.io/f/abcdwxyz`.
2. In `script.js` `handleSubmit()`, replace the `mailto:` branch with:
   ```js
   fetch("https://formspree.io/f/abcdwxyz", {
     method: "POST", headers: {"Accept":"application/json"},
     body: new FormData(form)
   }).then(r => r.ok
     ? (status.textContent = "✓ sent", form.reset())
     : (status.textContent = "! send failed, try again", status.classList.add("error")));
   ```

## File layout

```
cybersparrow/
├── index.html      — semantic markup, 7 terminal sections
├── style.css       — terminal aesthetic, mobile responsive, reduced-motion aware
├── script.js       — typewriter animation + controls + form submit
├── favicon.svg     — minimalist prompt icon
├── CNAME           — cybersparrow.tech (for GitHub Pages custom domain)
├── .nojekyll       — disables Jekyll processing on GH Pages
└── README.md       — this file
```

## Accessibility

- `prefers-reduced-motion` respected — animation disabled, content shown
  instantly.
- `aria-live="polite"` on terminal output — screen readers announce.
- Form fields have proper labels, keyboard navigable.
- Honeypot hidden via position-off-screen (not `display:none` which some
  screen readers expose).

## Controls visible to visitor

- `↻ replay` — restart animation from zero
- `⏭ skip` — jump straight to full content
- `🔇 sound` — toggle typing click (off by default)

## Placeholder text (edit before marketing launch)

Section 1 (hero) mentions "Основатель: Roman Воробьёв" — adjust if you
prefer different positioning.

Section 2 target list is current as of 2026-04-21. Update when new
confirmed engagements close.

Pricing section is deliberately vague ("Base rate + bonus per finding")
— keep it that way until a public rate sheet is ready.
