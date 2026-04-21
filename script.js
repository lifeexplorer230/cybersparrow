/* Cyber Sparrow landing — typewriter animation + controls */
(() => {
    "use strict";

    const SCREEN = document.getElementById("screen");
    const PREFERS_REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Content blocks — terminal-style. Text is placeholder; Roman edits copy after build.
    const BLOCKS = [
        {
            lines: [
                { prompt: "cybersparrow --help" },
                { stdout: "Cyber Sparrow — security research engagement" },
                { stdout: "Основатель: Roman Воробьёв + AI-ассистент" },
            ],
        },
        {
            lines: [
                { prompt: "cybersparrow status --last-month" },
                { stdout: "Confirmed vulnerabilities at:" },
                { stdout: "  Ozon · Avito · Cloud.ru · СберТех · Альфа-Банк" },
                { stdout: "  Т-Банк · Timeweb · Wildberries · Autoteka · MaxPoster" },
                { stdout: "  Ренессанс Жизнь" },
                { stdout: "International: Neon · Zooplus" },
            ],
        },
        {
            lines: [
                { prompt: "cybersparrow pipeline" },
                { stdout: '<span class="info">phase 1</span> recon           → subdomains, endpoints, tech fingerprint' },
                { stdout: '<span class="info">phase 2</span> hypotheses      → 1500+ rules matched, prioritized by EV' },
                { stdout: '<span class="info">phase 3</span> validate        → runtime confirmation gate, no theory' },
                { stdout: '<span class="info">phase 4</span> report          → CVSS 3.0, PoC, remediation' },
            ],
        },
        {
            lines: [
                { prompt: "cybersparrow severity-table" },
                { sev: true },
            ],
        },
        {
            lines: [
                { prompt: "cybersparrow pricing" },
                { stdout: "Base rate + bonus per confirmed finding." },
                { stdout: "Exact quote per project (perimeter size defines scope)." },
            ],
        },
        {
            lines: [
                { prompt: "cybersparrow requirements" },
                {
                    html: `<ul class="checklist">
<li>2× retail test accounts</li>
<li>2× B2B test accounts (if applicable)</li>
<li>Scope document</li>
<li>Contact person</li>
</ul>`,
                },
            ],
        },
        {
            lines: [
                { prompt: "cybersparrow contact" },
            ],
            form: true,
        },
    ];

    const SEVERITY = [
        ["sev-crit", "Critical", "9.0–10.0", "RCE, data breach, account takeover"],
        ["sev-high", "High", "7.0–8.9", "Targeted ATO, PII access, privesc"],
        ["sev-med", "Medium", "4.0–6.9", "SSRF, info leak, weak crypto"],
        ["sev-low", "Low", "0.1–3.9", "Missing SRI, weak headers"],
        ["sev-info", "Info", "—", "Best-practice notes"],
    ];

    // Sound ------------------------------------------------------------------
    let soundOn = false;
    let audioCtx = null;
    function click() {
        if (!soundOn) return;
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            o.connect(g); g.connect(audioCtx.destination);
            o.frequency.value = 1500 + Math.random() * 600;
            g.gain.setValueAtTime(0.012, audioCtx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
            o.start();
            o.stop(audioCtx.currentTime + 0.04);
        } catch (e) { /* ignore */ }
    }

    // Typewriter -------------------------------------------------------------
    let aborted = false;
    let skipRequested = false;

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    async function typeInto(el, text, speedMs) {
        if (skipRequested || PREFERS_REDUCED) {
            el.innerHTML = text;
            return;
        }
        // If text has HTML tags, insert whole (no char-by-char through raw html)
        if (/<[^>]+>/.test(text)) {
            el.innerHTML = text;
            return;
        }
        el.textContent = "";
        for (let i = 0; i < text.length; i++) {
            if (skipRequested) { el.textContent = text; return; }
            el.textContent += text[i];
            if (text[i] !== " ") click();
            await sleep(speedMs);
        }
    }

    function renderSeverity(container) {
        const tbl = document.createElement("div");
        tbl.className = "sev-table";
        for (const [cls, name, range, desc] of SEVERITY) {
            const s1 = document.createElement("span");
            s1.className = cls;
            s1.textContent = name;
            const s2 = document.createElement("span");
            s2.className = "muted";
            s2.textContent = range;
            const s3 = document.createElement("span");
            s3.textContent = desc;
            tbl.append(s1, s2, s3);
        }
        container.appendChild(tbl);
    }

    function renderForm(container) {
        const box = document.createElement("div");
        box.className = "form-box";
        box.innerHTML = `
<form id="contact-form" autocomplete="off" novalidate>
  <label for="contact">email or telegram</label>
  <input id="contact" name="contact" type="text" required placeholder="you@example.com or @handle">
  <label for="company">company (optional)</label>
  <input id="company" name="company" type="text">
  <label for="message">message (optional)</label>
  <textarea id="message" name="message" rows="2"></textarea>
  <div class="honeypot" aria-hidden="true">
    <label for="website">leave empty</label>
    <input id="website" name="website" type="text" tabindex="-1" autocomplete="off">
  </div>
  <button type="submit" class="submit-btn">↵ send</button>
</form>
<div class="form-status" id="form-status" aria-live="polite"></div>`;
        container.appendChild(box);
        container.querySelector("#contact-form").addEventListener("submit", handleSubmit);
    }

    function handleSubmit(ev) {
        ev.preventDefault();
        const form = ev.currentTarget;
        const status = document.getElementById("form-status");
        status.classList.remove("error");

        // Honeypot — silent drop
        if (form.website.value.trim()) {
            status.textContent = "✓ sent — we'll reply shortly.";
            form.reset();
            return;
        }
        const contact = form.contact.value.trim();
        if (!contact) {
            status.textContent = "! contact field required.";
            status.classList.add("error");
            return;
        }
        const subject = "Cyber Sparrow — new contact";
        const body =
            `Contact: ${contact}\n` +
            `Company: ${form.company.value.trim() || "-"}\n` +
            `Message: ${form.message.value.trim() || "-"}\n`;
        const mailto = "mailto:hello@cybersparrow.tech?subject=" +
            encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        window.location.href = mailto;
        status.textContent = "✓ opening your mail client…";
        // For production: replace mailto with POST to Formspree / own endpoint.
    }

    // Block rendering --------------------------------------------------------
    async function renderLine(container, line) {
        if (line.prompt !== undefined) {
            const div = document.createElement("div");
            div.className = "prompt";
            container.appendChild(div);
            await typeInto(div, line.prompt, 18);
        } else if (line.stdout !== undefined) {
            const div = document.createElement("div");
            div.className = "stdout";
            container.appendChild(div);
            await typeInto(div, line.stdout, 12);
        } else if (line.html !== undefined) {
            const div = document.createElement("div");
            div.className = "stdout";
            div.innerHTML = line.html;
            container.appendChild(div);
            if (!skipRequested && !PREFERS_REDUCED) await sleep(180);
        } else if (line.sev) {
            renderSeverity(container);
            if (!skipRequested && !PREFERS_REDUCED) await sleep(180);
        }
    }

    async function renderBlock(block) {
        const div = document.createElement("div");
        div.className = "block";
        SCREEN.appendChild(div);
        // trigger transition
        await sleep(10);
        div.classList.add("visible");
        for (const line of block.lines) {
            if (aborted) return;
            await renderLine(div, line);
            if (!skipRequested && !PREFERS_REDUCED) await sleep(120);
        }
        if (block.form) renderForm(div);
    }

    async function runSequence() {
        SCREEN.innerHTML = "";
        aborted = false;
        skipRequested = false;
        // initial cursor
        const cursor = document.createElement("span");
        cursor.className = "cursor";
        SCREEN.appendChild(cursor);
        await sleep(400);
        cursor.remove();
        for (const block of BLOCKS) {
            if (aborted) return;
            await renderBlock(block);
            if (!skipRequested && !PREFERS_REDUCED) await sleep(260);
        }
    }

    function skipAll() {
        skipRequested = true;
    }

    function replayAll() {
        aborted = true;
        setTimeout(() => { runSequence(); }, 60);
    }

    function toggleSound(btn) {
        soundOn = !soundOn;
        btn.setAttribute("aria-pressed", String(soundOn));
        btn.textContent = soundOn ? "🔊 sound" : "🔇 sound";
    }

    // Wire controls ----------------------------------------------------------
    document.addEventListener("click", ev => {
        const btn = ev.target.closest(".toggle");
        if (!btn) return;
        const action = btn.dataset.action;
        if (action === "skip") skipAll();
        else if (action === "replay") replayAll();
        else if (action === "sound") toggleSound(btn);
    });

    // Kick off ---------------------------------------------------------------
    document.addEventListener("DOMContentLoaded", runSequence);
    if (document.readyState !== "loading") runSequence();
})();
