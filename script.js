/* Cyber Sparrow landing — typewriter animation + controls + i18n */
(() => {
    "use strict";

    const SCREEN = document.getElementById("screen");
    const PREFERS_REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const LS_KEY = "cybersparrow_lang";
    function detectLang() {
        const stored = localStorage.getItem(LS_KEY);
        if (stored === "ru" || stored === "en") return stored;
        const langs = navigator.languages || [navigator.language || ""];
        return langs.some(l => String(l).toLowerCase().startsWith("ru")) ? "ru" : "en";
    }
    let lang = detectLang();

    const META = {
        ru: {
            title: "Cyber Sparrow — исследование безопасности",
            desc: "Исследование безопасности веб- и мобильной инфраструктуры. Подтверждённые уязвимости в Ozon, Avito, Cloud.ru, СберТех, Альфа-Банк, Т-Банк, Timeweb Cloud, Autoteka, MaxPoster. Международные проекты: Neon, Zooplus.",
            tgPreset: "Здравствуйте! Интересует исследование безопасности Cyber Sparrow.",
            tgBtn: "📨 Написать в Telegram →",
            langBtn: "🌐 RU",
        },
        en: {
            title: "Cyber Sparrow — applied security research",
            desc: "Applied security research for web and mobile infrastructure. Confirmed vulnerabilities in Ozon, Avito, Cloud.ru, SberTech, Alfa-Bank, T-Bank, Timeweb Cloud, Autoteka, MaxPoster. International: Neon, Zooplus.",
            tgPreset: "Hi! Interested in Cyber Sparrow security research.",
            tgBtn: "📨 Message on Telegram →",
            langBtn: "🌐 EN",
        },
    };

    const BLOCKS = {
        ru: [
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
                    { tg: true },
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
        ],
        en: [
            {
                lines: [
                    { prompt: "cybersparrow --help" },
                    { stdout: "Cyber Sparrow — applied security research" },
                    { stdout: "AI-assisted vulnerability discovery for your private perimeter" },
                ],
            },
            {
                lines: [
                    { prompt: "cybersparrow who" },
                    { stdout: "Roman Vorobyev — applied security researcher." },
                    { stdout: "" },
                    { stdout: "Cyber Sparrow — an AI assistant trained on a corpus of public reports," },
                    { stdout: "review methodologies, and an internal rule library" },
                    { stdout: '(<span class="info">1500+ heuristics</span> tied to confirmed findings).' },
                    { stdout: "" },
                    { stdout: "A single researcher with an AI multiplier:" },
                    { stdout: "parallel reconnaissance across thousands of endpoints + the full rule base" },
                    { stdout: "in memory during hypothesis generation." },
                ],
            },
            {
                lines: [
                    { prompt: "cybersparrow results --track-record" },
                    { stdout: "Confirmed vulnerabilities in Russian companies:" },
                    { stdout: '  <span class="ok">Ozon · Avito · Cloud.ru · SberTech · Alfa-Bank</span>' },
                    { stdout: '  <span class="ok">T-Bank · Timeweb Cloud · Autoteka · MaxPoster</span>' },
                    { stdout: "" },
                    { stdout: "International projects:" },
                    { stdout: '  <span class="info">Neon · Zooplus</span>' },
                    { stdout: "" },
                    { stdout: "Classes: Android mobile, SSO (ADFS, Keycloak), API (Strapi," },
                    { stdout: "GraphQL), access control, subdomain takeover, SSRF in IdP." },
                ],
            },
            {
                lines: [
                    { prompt: "cybersparrow pipeline" },
                    { stdout: '<span class="info">stage 1</span> recon       → subdomains (CT, DNS, crawling), endpoints,' },
                    { stdout: "                 JS bundles, API specs, ports, tech stack," },
                    { stdout: "                 CVE match, SRI, SBOM, expired domains," },
                    { stdout: "                 SSO/OAuth flow, redirect_uri, trust chains" },
                    { stdout: "" },
                    { stdout: '<span class="info">stage 2</span> hypotheses  → match the surface against the library (30+ categories:' },
                    { stdout: "                 IDOR, access control, injections, business logic," },
                    { stdout: "                 SSRF, XSS, crypto, supply chain, race conditions)" },
                    { stdout: "                 → prioritization by expected value" },
                    { stdout: "" },
                    { stdout: '<span class="info">stage 3</span> validation  → real exploitation with rate-limit hygiene' },
                    { stdout: "                 → confirmation gate: nothing reaches the report" },
                    { stdout: "                 without observed impact. No theoretical findings." },
                    { stdout: "" },
                    { stdout: '<span class="info">stage 4</span> report      → per-finding: CVSS 3.0, curl evidence,' },
                    { stdout: "                 screenshots, PoC script, business impact," },
                    { stdout: "                 remediation. + executive summary top-5." },
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
                    { stdout: "Full coverage of the public attack surface: 1-2 weeks" },
                    { stdout: "from the moment the agreement is signed and access is provided." },
                    { stdout: "Exact timeline depends on perimeter size." },
                ],
            },
            {
                lines: [
                    { prompt: "cybersparrow pricing" },
                    { stdout: "Hybrid model:" },
                    { stdout: '  <span class="ok">Base rate at the start</span> — covers pipeline setup' },
                    { stdout: "    (recon, hypothesis generation, AI tokens for validation)." },
                    { stdout: "    Depends on attack surface size." },
                    { stdout: "" },
                    { stdout: '  <span class="ok">Bonus per confirmed finding</span> — graded by CVSS.' },
                    { stdout: "    Specific amounts depend on company size" },
                    { stdout: "    and potential impact." },
                    { stdout: "" },
                    { stdout: '  <span class="muted">Found nothing → you pay only the base rate.</span>' },
                    { stdout: '  <span class="muted">Found something → per the agreed schedule.</span>' },
                    { stdout: "" },
                    { stdout: "Exact figures are agreed in the contract draft" },
                    { stdout: "after a preliminary assessment of your perimeter." },
                ],
            },
            {
                lines: [
                    { prompt: "cybersparrow requirements" },
                    {
                        html: `<ul class="checklist">
<li><b>Security research agreement</b> — assets in scope / out of scope / exclusions</li>
<li><b>2 × regular customer accounts</b> (individuals)</li>
<li><b>2 × B2B-tier accounts</b> (if there is a B2B perimeter)</li>
<li><b>Point of contact</b> for the engagement — for critical findings</li>
</ul>`,
                    },
                    { stdout: "" },
                    { stdout: '<span class="muted">Optional — deeper role-separation audit:</span>' },
                    { stdout: '<span class="muted">one account with elevated permissions (manager/admin).</span>' },
                ],
            },
            {
                lines: [
                    { prompt: "cybersparrow contact" },
                    { stdout: '<span class="muted"># To discuss research for your perimeter — message on Telegram.</span>' },
                    { tg: true },
                ],
            },
            {
                lines: [
                    { prompt: "cybersparrow whoami" },
                    { html: `<div class="company-info">
<span class="muted"># IP Vorobyev Roman Yurievich (sole proprietor, Russia)</span>
<span class="muted"># INN 771470569873</span>
<span class="muted"># Bank: Moscow branch of JSCB Modulbank</span>
<span class="muted"># BIK 044525092 · corr. 30101810645250000092</span>
<span class="muted"># Account 40802810270010344227</span>
<span class="muted"># Telegram <span class="info">@LifeExplorer23</span></span>
</div>` },
                ],
            },
        ],
    };

    const SEVERITY = {
        ru: [
            ["sev-crit", "Critical", "9.0–10.0", "RCE, массовая утечка, захват аккаунта, хищение средств"],
            ["sev-high", "High", "7.0–8.9", "ATO с min взаимодействием, PII, privesc между ролями"],
            ["sev-med", "Medium", "4.0–6.9", "SSRF внутр. сеть, ограниченное раскрытие, CSRF"],
            ["sev-low", "Low", "0.1–3.9", "Отсутствие SRI, слабые headers, подробные ошибки"],
            ["sev-info", "Info", "—", "Best-practice замечания для полноты отчёта"],
        ],
        en: [
            ["sev-crit", "Critical", "9.0–10.0", "RCE, mass data leak, account takeover, fund theft"],
            ["sev-high", "High", "7.0–8.9", "ATO with min interaction, PII, privilege escalation between roles"],
            ["sev-med", "Medium", "4.0–6.9", "SSRF to internal network, limited disclosure, CSRF"],
            ["sev-low", "Low", "0.1–3.9", "Missing SRI, weak headers, verbose errors"],
            ["sev-info", "Info", "—", "Best-practice notes for report completeness"],
        ],
    };

    function applyMeta() {
        document.documentElement.lang = lang;
        const t = document.querySelector("title[data-i18n-title]");
        if (t) t.textContent = META[lang].title;
        const d = document.querySelector('meta[data-i18n-desc]');
        if (d) d.setAttribute("content", META[lang].desc);
        const langBtn = document.querySelector('.toggle[data-action="lang"]');
        if (langBtn) langBtn.textContent = META[lang].langBtn;
    }

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
        for (const [cls, name, range, desc] of SEVERITY[lang]) {
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

    function renderTgButton(container) {
        const a = document.createElement("a");
        a.className = "tg-btn";
        a.href = "https://t.me/LifeExplorer23?text=" + encodeURIComponent(META[lang].tgPreset);
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = META[lang].tgBtn;
        const wrap = document.createElement("div");
        wrap.className = "stdout";
        wrap.appendChild(a);
        container.appendChild(wrap);
    }

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
        } else if (line.tg) {
            renderTgButton(container);
            if (!skipRequested && !PREFERS_REDUCED) await sleep(180);
        }
    }

    async function renderBlock(block) {
        const div = document.createElement("div");
        div.className = "block";
        SCREEN.appendChild(div);
        await sleep(10);
        div.classList.add("visible");
        for (const line of block.lines) {
            if (aborted) return;
            await renderLine(div, line);
            if (!skipRequested && !PREFERS_REDUCED) await sleep(120);
        }
    }

    async function runSequence() {
        SCREEN.innerHTML = "";
        aborted = false;
        skipRequested = false;
        const cursor = document.createElement("span");
        cursor.className = "cursor";
        SCREEN.appendChild(cursor);
        await sleep(400);
        cursor.remove();
        for (const block of BLOCKS[lang]) {
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

    function toggleLang() {
        lang = lang === "ru" ? "en" : "ru";
        try { localStorage.setItem(LS_KEY, lang); } catch (e) { /* ignore */ }
        applyMeta();
        aborted = true;
        setTimeout(() => { runSequence(); }, 60);
    }

    document.addEventListener("click", ev => {
        const btn = ev.target.closest(".toggle");
        if (!btn) return;
        const action = btn.dataset.action;
        if (action === "skip") skipAll();
        else if (action === "replay") replayAll();
        else if (action === "sound") toggleSound(btn);
        else if (action === "lang") toggleLang();
    });

    applyMeta();
    runSequence();
})();
