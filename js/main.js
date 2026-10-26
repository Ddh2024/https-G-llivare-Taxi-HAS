(() => {
  "use strict";

  const CFG = window.AURORA_CONFIG;
  const PLACES = window.AURORA_PLACES;
  const ROUTES = window.AURORA_ROUTES;
  const SV = window.AURORA_SV;
  const EN_JS = window.AURORA_EN_JS;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const byId = Object.fromEntries(PLACES.map((p) => [p.id, p]));

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };

  // ---------- i18n ----------
  const EN = {};
  $$("[data-i18n]").forEach((el) => { EN[el.dataset.i18n] = el.textContent; });
  $$("[data-i18n-ph]").forEach((el) => { EN[el.dataset.i18nPh] = el.placeholder; });

  let lang = "en";
  const t = (key) => (lang === "sv" ? SV[key] : EN[key] ?? EN_JS[key]) ?? EN_JS[key] ?? key;

  function applyLang(next) {
    lang = next === "sv" ? "sv" : "en";
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    const btn = $("#langToggle");
    btn.textContent = lang === "sv" ? "EN" : "SV";
    btn.setAttribute("aria-label", lang === "sv" ? "Switch to English" : "Byt till svenska");
    store.set("lang", lang);
    renderRoutes();
    renderPlaces();
    updateEstimate();
    if (lastKp != null) showKp(lastKp);
  }

  // ---------- helpers ----------
  const clean = (s, max) => String(s ?? "").replace(/[\u0000-\u001F\u007F\u2028\u2029]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
  const findPlace = (name) => {
    const n = clean(name, 120).toLowerCase();
    return PLACES.find((p) => p.name.toLowerCase() === n) || null;
  };

  function distanceKm(a, b) {
    const R = 6371, rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
    const straight = 2 * R * Math.asin(Math.sqrt(h));
    return straight * (straight > 30 ? 1.3 : 1.2); // rough road-distance factor
  }

  function estimate(a, b) {
    const km = distanceKm(a, b);
    const speed = km < 15 ? 40 : 75;
    const min = Math.max(5, Math.round(((km / speed) * 60 + 3) / 5) * 5);
    const kmRounded = km < 10 ? Math.max(1, Math.round(km)) : Math.round(km / 5) * 5;
    return { km: kmRounded, min };
  }

  const fareFor = (a, b) => CFG.fixedFares[`${a.id}>${b.id}`] ?? CFG.fixedFares[`${b.id}>${a.id}`] ?? null;

  function formatDuration(min) {
    if (min < 60) return `${min} ${t("js.min")}`;
    const h = Math.floor(min / 60), m = min % 60;
    return m ? `${h} h ${m} ${t("js.min")}` : `${h} h`;
  }

  // ---------- booking form ----------
  const form = $("#booking");
  const fromEl = $("#from"), toEl = $("#to");
  const dateEl = $("#date"), timeEl = $("#time");
  const errEl = $("#formError");
  const loadedAt = Date.now();
  let lastSend = 0;

  const dl = $("#placeList");
  PLACES.forEach((p) => {
    const o = document.createElement("option");
    o.value = p.name;
    dl.appendChild(o);
  });

  const fillSelect = (sel, from, to, selected) => {
    for (let i = from; i <= to; i++) {
      const o = document.createElement("option");
      o.value = String(i);
      o.textContent = String(i);
      if (i === selected) o.selected = true;
      sel.appendChild(o);
    }
  };
  fillSelect($("#pax"), 1, 8, 2);
  fillSelect($("#bags"), 0, 10, 2);

  const pad = (n) => String(n).padStart(2, "0");
  const localDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  (function initWhen() {
    const d = new Date(Date.now() + 45 * 60000);
    d.setMinutes(Math.ceil(d.getMinutes() / 5) * 5, 0, 0);
    dateEl.value = localDate(d);
    dateEl.min = localDate(new Date());
    const max = new Date(); max.setFullYear(max.getFullYear() + 1);
    dateEl.max = localDate(max);
    timeEl.value = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  })();

  const isNow = () => form.elements.when.value === "now";
  $$('input[name="when"]', form).forEach((r) =>
    r.addEventListener("change", () => { $("#whenRow").hidden = isNow(); })
  );

  $("#swap").addEventListener("click", () => {
    [fromEl.value, toEl.value] = [toEl.value, fromEl.value];
    updateEstimate();
  });

  function updateEstimate() {
    const out = $("#estimate");
    const a = findPlace(fromEl.value), b = findPlace(toEl.value);
    if (!a || !b || a.id === b.id) { out.hidden = true; return; }
    const e = estimate(a, b);
    const fare = fareFor(a, b);
    out.textContent = `${t("js.approx")} ${e.km} km · ${formatDuration(e.min)} · ${fare ? `${t("js.fixed")} ${fare} kr` : t("js.onRequest")}`;
    out.hidden = false;
  }
  fromEl.addEventListener("input", updateEstimate);
  toEl.addEventListener("input", updateEstimate);

  function prefill(fromId, toId) {
    if (fromId && byId[fromId]) fromEl.value = byId[fromId].name;
    if (toId && byId[toId]) toEl.value = byId[toId].name;
    updateEstimate();
    form.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    (fromEl.value ? toEl.value ? $("#name") : toEl : fromEl).focus({ preventScroll: true });
  }

  function showError(key) {
    errEl.textContent = t(key);
    errEl.hidden = false;
  }

  function buildMessage(data) {
    const lines = [
      `🚖 ${t("js.msg.title")} – ${CFG.name}`,
      `${t("js.msg.from")}: ${data.from}`,
      `${t("js.msg.to")}: ${data.to}`,
      `${t("js.msg.when")}: ${data.when}`,
      `${t("js.msg.pax")}: ${data.pax} · ${t("js.msg.bags")}: ${data.bags}`,
    ];
    if (data.ref) lines.push(`${t("js.msg.ref")}: ${data.ref}`);
    if (data.extras.length) lines.push(`${t("js.msg.extras")}: ${data.extras.map((x) => t(`js.extra.${x}`)).join(", ")}`);
    if (data.note) lines.push(`${t("js.msg.note")}: ${data.note}`);
    lines.push(`${t("js.msg.name")}: ${data.name}`, `${t("js.msg.phone")}: ${data.phone}`);
    if (data.estimate) lines.push(`(${data.estimate})`);
    return lines.join("\n");
  }

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    errEl.hidden = true;

    // Basic bot protection: honeypot, too-fast submits and rapid repeats.
    if (form.elements.website.value) return;
    if (Date.now() - loadedAt < 2500 || Date.now() - lastSend < 8000) return;

    const f = form.elements;
    const data = {
      from: clean(f.from.value, 120),
      to: clean(f.to.value, 120),
      pax: Math.min(8, Math.max(1, parseInt(f.pax.value, 10) || 1)),
      bags: Math.min(10, Math.max(0, parseInt(f.bags.value, 10) || 0)),
      ref: clean(f.ref.value, 20).replace(/[^A-Za-z0-9 -]/g, ""),
      extras: $$('input[name="extra"]:checked', form).map((c) => c.value).filter((v) => EN_JS[`js.extra.${v}`]),
      note: clean(f.note.value, 400),
      name: clean(f.name.value, 60),
      phone: clean(f.phone.value, 20),
    };

    if (!data.from || !data.to) { showError("js.err.route"); (data.from ? toEl : fromEl).focus(); return; }

    if (isNow()) {
      data.when = t("js.msg.now");
    } else {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateEl.value) || !/^\d{2}:\d{2}$/.test(timeEl.value)) { showError("js.err.when"); dateEl.focus(); return; }
      const when = new Date(`${dateEl.value}T${timeEl.value}`);
      if (Number.isNaN(when.getTime())) { showError("js.err.when"); dateEl.focus(); return; }
      if (when.getTime() < Date.now() - 5 * 60000) { showError("js.err.past"); timeEl.focus(); return; }
      data.when = `${dateEl.value} ${timeEl.value}`;
    }

    if (!data.name) { showError("js.err.name"); f.name.focus(); return; }
    if (!/^\+?[0-9][0-9 ()-]{5,18}$/.test(data.phone)) { showError("js.err.phone"); f.phone.focus(); return; }

    const est = $("#estimate");
    if (!est.hidden) data.estimate = est.textContent;

    const msg = buildMessage(data);
    lastSend = Date.now();

    if (ev.submitter && ev.submitter.value === "email") {
      const subject = `${t("js.msg.title")}: ${data.from} → ${data.to}`;
      window.location.href = `mailto:${CFG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;
    } else {
      window.open(`https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    }
  });

  // ---------- popular routes ----------
  function renderRoutes() {
    const wrap = $("#routes");
    wrap.textContent = "";
    ROUTES.forEach(([fromId, toId]) => {
      const a = byId[fromId], b = byId[toId];
      if (!a || !b) return;
      const e = estimate(a, b);
      const fare = fareFor(a, b);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "route";
      const top = document.createElement("span");
      top.className = "route__path";
      const s1 = document.createElement("b"); s1.textContent = a.name;
      const arrow = document.createElement("i"); arrow.textContent = "→"; arrow.setAttribute("aria-hidden", "true");
      const s2 = document.createElement("b"); s2.textContent = b.name;
      top.append(s1, arrow, s2);
      const meta = document.createElement("span");
      meta.className = "route__meta";
      meta.textContent = `${t("js.approx")} ${e.km} km · ${formatDuration(e.min)}${fare ? ` · ${fare} kr` : ""}`;
      const go = document.createElement("span");
      go.className = "route__go";
      go.textContent = t("js.book");
      btn.append(top, meta, go);
      btn.addEventListener("click", () => prefill(fromId, toId));
      wrap.appendChild(btn);
    });
  }

  // ---------- destinations ----------
  let activeCat = "all";
  function renderPlaces() {
    const list = $("#placeGrid");
    list.textContent = "";
    PLACES.filter((p) => activeCat === "all" || p.cat === activeCat).forEach((p) => {
      const li = document.createElement("li");
      li.className = `place place--${p.cat}`;
      const name = document.createElement("strong"); name.textContent = p.name;
      const area = document.createElement("span"); area.className = "place__area";
      const fromKiruna = p.area === "Kiruna" ? "" : ` · ${t("js.approx")} ${estimate(byId["kiruna-centre"], p).km} km`;
      area.textContent = `${p.area}${fromKiruna}`;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "place__btn";
      btn.textContent = t("js.bookHere");
      btn.setAttribute("aria-label", `${t("js.bookHere")}: ${p.name}`);
      btn.addEventListener("click", () => prefill(null, p.id));
      li.append(name, area, btn);
      list.appendChild(li);
    });
  }
  $("#filters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activeCat = chip.dataset.cat;
    $$(".chip").forEach((c) => {
      const on = c === chip;
      c.classList.toggle("is-on", on);
      c.setAttribute("aria-pressed", String(on));
    });
    renderPlaces();
  });

  $$("[data-prefill-to]").forEach((a) =>
    a.addEventListener("click", (e) => { e.preventDefault(); prefill(null, a.dataset.prefillTo); })
  );

  // ---------- northern lights (Kp) ----------
  let lastKp = null;
  function showKp(kp) {
    lastKp = kp;
    $("#kpValue").textContent = kp.toFixed(1);
    $("#kpVerdict").textContent = t(kp >= 4 ? "js.kp.high" : kp >= 2 ? "js.kp.mid" : "js.kp.low");
    $("#kpBar").style.width = `${Math.min(100, (kp / 9) * 100)}%`;
    $("#kpCard").hidden = false;
  }

  async function loadKp() {
    if (!CFG.auroraWidget || !window.fetch) return;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    try {
      const res = await fetch("https://services.swpc.noaa.gov/json/planetary_k_index_1m.json", {
        signal: ctrl.signal, credentials: "omit", referrerPolicy: "no-referrer", cache: "no-store",
      });
      if (!res.ok) return;
      const rows = await res.json();
      if (!Array.isArray(rows) || !rows.length) return;
      const last = rows[rows.length - 1];
      const kp = Number(last.estimated_kp ?? last.kp_index);
      if (Number.isFinite(kp) && kp >= 0 && kp <= 9) showKp(kp);
    } catch { /* offline or blocked: widget stays hidden */ } finally {
      clearTimeout(timer);
    }
  }

  // ---------- hero video ----------
  function loadHeroVideo() {
    const v = $("#heroVideo");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (!v || reduce || saveData) return;
    const add = (src, type) => {
      const s = document.createElement("source");
      s.src = src; s.type = type;
      v.appendChild(s);
    };
    if (v.dataset.srcWebm) add(v.dataset.srcWebm, "video/webm");
    add(v.dataset.srcMp4, "video/mp4");
    v.addEventListener("canplay", () => { v.classList.add("is-ready"); v.play().catch(() => {}); }, { once: true });
    v.load();
  }

  // ---------- misc ----------
  const nav = $(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  $("#year").textContent = String(new Date().getFullYear());
  $("#langToggle").addEventListener("click", () => applyLang(lang === "sv" ? "en" : "sv"));

  const urlLang = new URLSearchParams(location.search).get("lang");
  const initial = urlLang || store.get("lang") || ((navigator.language || "").toLowerCase().startsWith("sv") ? "sv" : "en");
  applyLang(initial);
  loadHeroVideo();
  loadKp();
})();
