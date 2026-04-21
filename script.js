/* Cyber Sparrow landing — typewriter animation + controls */
(() => {
    "use strict";

    const SCREEN = document.getElementById("screen");
    const PREFERS_REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Content blocks — terminal-style. Finalized 2026-04-21 per
    // evidence/alfacapital/osint_2026-04-21/PROPOSAL_GENERIC.md.
    const BLOCKS = [
        {
            lines: [
                { prompt: "cybersparrow --help" },
                { stdout: "Cyber Sparrow — исследование безопасности" },
                { stdout: "AI-ассистированная разведка уязвимостей под частный периметр" },
            ],
        },
        {
            lines: [
                { prompt: "cybersparrow who" },
                { stdout: "Роман Воробьёв — исследователь в области прикладной безопасности." },
                { stdout: "" },
                { stdout: "Cyber Sparrow — AI-ассистент на корпусе публичных отчётов," },
                { stdout: "методологий рецензирования и внутренней библиотеке правил" },
                { stdout: '(<span class="info">1500+ эвристик</span>, привязанных к подтверждённым находкам).' },
                { stdout: "" },
                { stdout: "Один исследователь с мультипликатором в лице AI:" },
                { stdout: "параллельная разведка на тысячах конечных точек + вся rule-база" },
                { stdout: "в памяти при генерации гипотез." },
            ],
        },
        {
            lines: [
                { prompt: "cybersparrow results --track-record" },
                { stdout: "Подтверждённые уязвимости в российских компаниях:" },
                { stdout: '  <span class="ok">Ozon · Avito · Cloud.ru · СберТех · Альфа-Банк</span>' },
                { stdout: '  <span class="ok">Т-Банк · Timeweb Cloud · Autoteka · MaxPoster</span>' },
                { stdout: "" },
                { stdout: "Международные проекты:" },
                { stdout: '  <span class="info">Neon · Zooplus</span>' },
                { stdout: "" },
                { stdout: "Классы: Android-мобильные, SSO (ADFS, Keycloak), API (Strapi," },
                { stdout: "GraphQL), контроль доступа, захват поддоменов, SSRF в IdP." },
            ],
        },
        {
            lines: [
                { prompt: "cybersparrow pipeline" },
                { stdout: '<span class="info">этап 1</span> разведка    → поддомены (CT, DNS, crawling), endpoints,' },
                { stdout: "                 JS-бандлы, API-спеки, порты, тех. стек," },
                { stdout: "                 CVE-match, SRI, SBOM, expired domains," },
                { stdout: "                 SSO/OAuth flow, redirect_uri, trust chains" },
                { stdout: "" },
                { stdout: '<span class="info">этап 2</span> гипотезы    → match поверхности с библиотекой (30+ категорий:' },
                { stdout: "                 IDOR, access control, injections, бизнес-логика," },
                { stdout: "                 SSRF, XSS, crypto, supply chain, race conditions)" },
                { stdout: "                 → приоритизация по ожидаемой ценности" },
                { stdout: "" },
                { stdout: '<span class="info">этап 3</span> валидация   → реальная эксплуатация с rate-limit гигиеной' },
                { stdout: "                 → шлюз подтверждения: без observed impact в отчёт" },
                { stdout: "                 не идёт. Никаких теоретических уязвимостей." },
                { stdout: "" },
                { stdout: '<span class="info">этап 4</span> отчёт       → per-finding: CVSS 3.0, curl-evidence,' },
                { stdout: "                 screenshots, PoC скрипт, business impact," },
                { stdout: "                 рекомендации. + executive summary top-5." },
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
                { prompt: "cybersparrow timeline" },
                { stdout: "Полный охват публичной поверхности: 1-2 недели" },
                { stdout: "с момента подписания документов и передачи доступов." },
                { stdout: "Точный срок зависит от размера периметра." },
            ],
        },
        {
            lines: [
                { prompt: "cybersparrow pricing" },
                { stdout: "Гибридная модель:" },
                { stdout: '  <span class="ok">Базовая ставка на старте</span> — покрывает подготовку конвейера' },
                { stdout: "    (разведка, гипотезы, AI-токены на валидацию)." },
                { stdout: "    Зависит от объёма поверхности." },
                { stdout: "" },
                { stdout: '  <span class="ok">Бонус за каждую подтверждённую находку</span> — по градации CVSS.' },
                { stdout: "    Конкретные суммы зависят от крупности компании" },
                { stdout: "    и потенциального ущерба." },
                { stdout: "" },
                { stdout: '  <span class="muted">Ничего не нашли → платите только стартовую ставку.</span>' },
                { stdout: '  <span class="muted">Нашли → по согласованной сетке.</span>' },
                { stdout: "" },
                { stdout: "Точные цифры согласуются в проекте договора" },
                { stdout: "после предварительной оценки вашего периметра." },
            ],
        },
        {
            lines: [
                { prompt: "cybersparrow requirements" },
                {
                    html: `<ul class="checklist">
<li><b>Договор на проведение исследования безопасности</b> — активы в границах / вне границ / исключения</li>
<li><b>2 × аккаунта рядового клиента</b> (физ. лица)</li>
<li><b>2 × аккаунта B2B-уровня</b> (если есть B2B-периметр)</li>
<li><b>Контактное лицо</b> на время работы — для критических находок</li>
</ul>`,
                },
                { stdout: "" },
                { stdout: '<span class="muted">Опционально — углублённый аудит разграничения ролей:</span>' },
                { stdout: '<span class="muted">один аккаунт с расширенными правами (менеджер/админ).</span>' },
            ],
        },
        {
            lines: [
                { prompt: "cybersparrow contact" },
                { stdout: '<span class="muted"># Обсудить исследование для вашего периметра — напишите в Telegram.</span>' },
                { html: `<a class="tg-btn" href="https://t.me/LifeExplorer23?text=${encodeURIComponent('Здравствуйте! Интересует исследование безопасности Cyber Sparrow.')}" target="_blank" rel="noopener">📨 Написать в Telegram →</a>` },
            ],
        },
        {
            lines: [
                { prompt: "cybersparrow whoami" },
                { html: `<div class="company-info">
<span class="muted"># ИП Воробьёв Роман Юрьевич</span>
<span class="muted"># ИНН 771470569873</span>
<span class="muted"># Банк: Московский филиал АО КБ «Модульбанк»</span>
<span class="muted"># БИК 044525092 · к/с 30101810645250000092</span>
<span class="muted"># р/с 40802810270010344227</span>
<span class="muted"># Telegram <span class="info">@LifeExplorer23</span></span>
</div>` },
            ],
        },
    ];

    const SEVERITY = [
        ["sev-crit", "Critical", "9.0–10.0", "RCE, массовая утечка, захват аккаунта, хищение средств"],
        ["sev-high", "High", "7.0–8.9", "ATO с min взаимодействием, PII, privesc между ролями"],
        ["sev-med", "Medium", "4.0–6.9", "SSRF внутр. сеть, ограниченное раскрытие, CSRF"],
        ["sev-low", "Low", "0.1–3.9", "Отсутствие SRI, слабые headers, подробные ошибки"],
        ["sev-info", "Info", "—", "Best-practice замечания для полноты отчёта"],
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

    // Kick off — script has `defer`, so DOM is parsed when this runs.
    // Fire once; no DOMContentLoaded listener (would double-fire).
    runSequence();
})();
