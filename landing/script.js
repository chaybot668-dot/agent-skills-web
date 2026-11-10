/* =====================================================================
   LUCIUS CAPITAL — site script
   Không dùng thư viện ngoài. Mọi cấu hình nằm trong SITE bên dưới.
   ===================================================================== */

/* ============ CẤU HÌNH — chỉnh tại đây ============ */
const SITE = {
  // Ảnh chân dung (bỏ file vào landing/img/ rồi điền đường dẫn). Để trống = hiển thị monogram.
  portrait: "",

  // Kênh liên hệ THẬT. Chỉ kênh nào có giá trị mới hiện ra; để trống thì nút/biểu tượng tự ẩn.
  // Không điền link giả.
  links: {
    email: "",       // vd: "you@domain.com"
    community: "",   // vd: link nhóm Telegram/Zalo/Discord  -> nút "Join The Community"
    website: "",     // vd: trang thương hiệu               -> nút "Explore Lucius Capital"
    facebook: "", youtube: "", instagram: "", telegram: "", zalo: "", tiktok: "",
  },

  // Địa chỉ nhận tin nhắn từ form (Formspree, Google Apps Script, webhook CRM...).
  formEndpoint: "",

  // Dãy chứng nhận chạy ngang. Thêm ảnh: bỏ file vào landing/img/ rồi thêm 1 dòng.
  // Trường: src, w, h (kích thước ảnh), firm, title, verify (link xác thực của quỹ, tuỳ chọn).
  // Danh sách trống thì khu vực đó tự ẩn.
  certificates: {
    mine: [
      { src: "img/my-ftmo-profit-split.webp", w: 1080, h: 1080, firm: "FTMO", title: "Profit Split" },
      { src: "img/my-the5ers-funded.webp", w: 600, h: 600, firm: "The5ers", title: "Funded Certificate" },
      { src: "img/my-the5ers-total-a.webp", w: 1040, h: 992, firm: "The5ers", title: "Total Payouts" },
      { src: "img/my-the5ers-total-b.webp", w: 1024, h: 1024, firm: "The5ers", title: "Total Payouts" },
      { src: "img/my-the5ers-payout.webp", w: 600, h: 580, firm: "The5ers", title: "Payout $4,373.88" },
      { src: "img/my-topstep-funded.webp", w: 1054, h: 814, firm: "Topstep", title: "Funded Trader" },
      // { src: "img/my-ftmo-profit.webp", w: 1080, h: 1080, firm: "FTMO", title: "Profit Split", verify: "" },
    ],
    students: [
      { src: "img/cert-payout.webp", w: 594, h: 572, firm: "The5ers", title: "Total Payouts" },
      { src: "img/cert-funded.webp", w: 600, h: 580, firm: "The5ers", title: "Funded Certificate" },
      { src: "img/cert-qt.webp", w: 709, h: 628, firm: "QT Funded", title: "Phase Pass $5,000" },
    ],
  },
};
/* ================================================= */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hoverOk = matchMedia("(hover: hover)").matches;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* bỏ qua */ } },
};

/* ---------- i18n (EN / VI) ---------- */
const I18N = {
  msg: {
    en: { fill: "Please complete the highlighted fields.", ok: "Thank you — your message has been sent.", fail: "Could not send. Please try again.", sending: "Sending…" },
    vi: { fill: "Vui lòng điền đầy đủ các trường được đánh dấu.", ok: "Cảm ơn bạn — tin nhắn đã được gửi.", fail: "Chưa gửi được. Vui lòng thử lại.", sending: "Đang gửi…" },
  },
  lang: "en",
};
(function i18n() {
  const els = $$("[data-i18n]");
  els.forEach(el => { el.dataset.en = el.innerHTML; });
  const set = l => {
    I18N.lang = l;
    document.documentElement.lang = l;
    els.forEach(el => { el.innerHTML = l === "vi" ? el.dataset.vi : el.dataset.en; });
    $("#toTop").setAttribute("aria-label", l === "vi" ? "Lên đầu trang" : "Back to Top");
    $("#burger").setAttribute("aria-label", l === "vi" ? "Mở menu" : "Open menu");
    store.set("lang", l);
  };
  const saved = store.get("lang");
  set(saved || (/^vi/i.test(navigator.language || "") ? "vi" : "en"));
  $("#lang").addEventListener("click", () => set(I18N.lang === "en" ? "vi" : "en"));
})();

$("#year").textContent = new Date().getFullYear();

/* ---------- navigation ---------- */
(function nav() {
  const header = $("#nav"), menu = $("#menu"), burger = $("#burger");
  const setOpen = open => {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  };
  burger.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
  $$("a", menu).forEach(a => a.addEventListener("click", () => setOpen(false)));
  addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });

  // đánh dấu mục menu theo section đang xem
  const links = new Map($$("a", menu).map(a => [a.getAttribute("href").slice(1), a]));
  const secs = ["home", "about", "achievements", "journey", "philosophy", "approach", "connect"].map(id => document.getElementById(id)).filter(Boolean);
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.classList.remove("active"));
    const a = links.get(e.target.id);
    if (a) a.classList.add("active");
  }), { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach(s => io.observe(s));

  const toTop = $("#toTop"), prog = $("#progress");
  let ticking = false;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle("scrolled", y > 30);
    toTop.classList.toggle("show", y > 640);
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
})();

/* ---------- reveal on scroll ---------- */
(function reveal() {
  const items = $$(".reveal, .reveal-img");
  // so le nhẹ cho các phần tử cùng cha
  const seen = new Map();
  items.forEach(el => {
    const n = seen.get(el.parentElement) || 0;
    seen.set(el.parentElement, n + 1);
    el.style.setProperty("--d", Math.min(n, 5) * 0.08 + "s");
  });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: "0px 0px -5% 0px" });
  items.forEach(el => io.observe(el));
})();

/* ---------- count-up ---------- */
(function countUp() {
  const els = $$("[data-count]");
  const fmt = (v, d) => v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const run = el => {
    const to = parseFloat(el.dataset.count), d = +el.dataset.dec || 0;
    if (reduce) { el.textContent = fmt(to, d); return; }
    const t0 = performance.now(), dur = 1500;
    (function tick(t) {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e, d);
      if (p < 1) requestAnimationFrame(tick); else el.textContent = fmt(to, d);
    })(t0);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { io.unobserve(e.target); run(e.target); }
  }), { threshold: .6 });
  els.forEach(el => { if (!reduce) el.textContent = fmt(0, +el.dataset.dec || 0); io.observe(el); });
})();

/* ---------- timeline progress ---------- */
(function timeline() {
  const tl = $("#timeline"); if (!tl) return;
  const items = $$(".tl", tl);
  let ticking = false;
  const upd = () => {
    const r = tl.getBoundingClientRect(), vh = innerHeight;
    const p = Math.max(0, Math.min(1, (vh * .62 - r.top) / r.height));
    tl.style.setProperty("--p", reduce ? 1 : p.toFixed(4));
    items.forEach(li => {
      const b = li.getBoundingClientRect();
      li.classList.toggle("lit", reduce || b.top + b.height / 2 < vh * .66);
    });
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
  addEventListener("resize", upd);
  upd();
})();

/* ---------- parallax tinh tế ---------- */
(function parallax() {
  if (reduce) return;
  const els = $$("[data-parallax]");
  let ticking = false;
  const upd = () => {
    ticking = false;
    if (innerWidth < 720) { els.forEach(el => { el.style.translate = ""; }); return; }
    const vh = innerHeight;
    els.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const k = parseFloat(el.dataset.parallax) || 0;
      el.style.translate = `0 ${((r.top + r.height / 2) - vh / 2) * k * -1}px`;
    });
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
  addEventListener("resize", upd);
  upd();
})();

/* ---------- ánh sáng viền theo con trỏ ---------- */
if (hoverOk && !reduce) {
  document.addEventListener("pointermove", e => {
    const g = e.target.closest?.(".glass");
    if (!g) return;
    const r = g.getBoundingClientRect();
    g.style.setProperty("--mx", e.clientX - r.left + "px");
    g.style.setProperty("--my", e.clientY - r.top + "px");
  }, { passive: true });
}

/* ---------- chân dung ---------- */
(function portrait() {
  if (!SITE.portrait) return;
  const fig = $("#portrait");
  const img = new Image();
  img.alt = "Portrait";
  img.decoding = "async";
  img.onload = () => fig.insertBefore(img, fig.firstChild);
  img.src = SITE.portrait;
})();

/* ---------- liên hệ, mạng xã hội, CTA (chỉ hiện khi có dữ liệu thật) ---------- */
(function contact() {
  const L = SITE.links;
  const val = v => (v || "").trim();

  $$("[data-link]").forEach(a => {
    const url = val(L[a.dataset.link]);
    if (url) { a.href = url; a.hidden = false; }
  });

  const names = { facebook: "Facebook", youtube: "YouTube", instagram: "Instagram", telegram: "Telegram", zalo: "Zalo", tiktok: "TikTok" };
  const ul = $("#social");
  Object.keys(names).forEach(k => {
    const url = val(L[k]);
    if (!url) return;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = names[k];
    li.appendChild(a); ul.appendChild(li);
  });
  if (!ul.children.length) ul.hidden = true;

  const email = val(L.email);
  if (email) {
    const p = $("#footContact");
    const a = document.createElement("a");
    a.href = "mailto:" + email; a.textContent = email;
    p.appendChild(a); p.hidden = false;
  }

  // form: chỉ hiện khi có nơi nhận thật; môi trường thử nghiệm (file/localhost) hiện chế độ demo
  const box = $("#contact-form"), contactBtn = $("#ctaContact");
  const endpoint = val(SITE.formEndpoint);
  const canSend = !!(endpoint || email);
  const dev = location.protocol === "file:" || ["", "localhost", "127.0.0.1"].includes(location.hostname);
  if (canSend || dev) {
    box.hidden = false;
    $("#demoNote").hidden = canSend;
  } else if (email) {
    contactBtn.href = "mailto:" + email;
  } else {
    contactBtn.hidden = true;
  }
  const cta = $("#ctaLinks");
  if (!$$("a", cta).some(a => !a.hidden)) cta.hidden = true;

  const form = $("#leadForm"), msg = $("#formMsg");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const m = I18N.msg[I18N.lang];
    $$(".err", form).forEach(x => x.classList.remove("err"));
    msg.className = "form-msg";
    const d = Object.fromEntries(new FormData(form));
    const bad = [];
    if (!d.name?.trim()) bad.push("name");
    if (!/^\S+@\S+\.\S+$/.test(d.email || "")) bad.push("email");
    if (!d.message?.trim()) bad.push("message");
    bad.forEach(n => form.elements[n].classList.add("err"));
    if (bad.length) { msg.textContent = m.fill; msg.classList.add("bad"); return; }

    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true; msg.textContent = m.sending;
    try {
      if (endpoint) {
        const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...d, source: location.href, time: new Date().toISOString() }) });
        if (!r.ok) throw new Error(r.status);
      } else if (email) {
        location.href = `mailto:${email}?subject=${encodeURIComponent("Message from " + d.name)}&body=${encodeURIComponent(d.message + "\n\n" + d.name + " <" + d.email + ">")}`;
      } else {
        const arr = JSON.parse(store.get("contact_demo") || "[]");
        arr.push({ ...d, time: new Date().toISOString() });
        store.set("contact_demo", JSON.stringify(arr));
      }
      msg.textContent = m.ok; msg.classList.add("ok"); form.reset();
    } catch {
      msg.textContent = m.fail; msg.classList.add("bad");
    } finally { btn.disabled = false; }
  });
})();

/* ---------- dãy chứng nhận chạy liên tục + lightbox ---------- */
(function certificates() {
  const esc = t => String(t ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const card = c => {
    const alt = `Certificate: ${c.title} — ${c.firm}`;
    const ver = c.verify ? ` · <a href="${esc(c.verify)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">Verify</a>` : "";
    return `<button class="achv-card" type="button"><img src="${esc(c.src)}" alt="${esc(alt)}" width="${+c.w}" height="${+c.h}" loading="lazy" decoding="async"><span class="achv-cap"><b>${esc(c.firm)}</b> · ${esc(c.title)}${ver}</span></button>`;
  };
  const builders = [];
  $$(".achv-track[data-certs]").forEach(track => {
    const list = SITE.certificates[track.dataset.certs] || [];
    const wrap = track.closest("[data-proof]");
    if (!list.length) { wrap.hidden = true; return; }
    wrap.hidden = false;
    const items = list.map(card).join("");
    builders.push(() => {
      track.innerHTML = "";
      const g = document.createElement("div"); g.className = "achv-group"; track.appendChild(g);
      g.insertAdjacentHTML("beforeend", items);
    });
  });
  builders.forEach(b => b());
  let t, lastW = innerWidth;
  addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(() => { if (Math.abs(innerWidth - lastW) > 40) { lastW = innerWidth; builders.forEach(b => b()); } }, 250);
  });

  const lb = $("#lightbox"), img = $("#lbImg");
  const close = () => { lb.hidden = true; };
  document.addEventListener("click", e => {
    const c = e.target.closest(".achv-track .achv-card");
    if (!c) return;
    const im = $("img", c);
    img.src = im.currentSrc || im.src; img.alt = im.alt; lb.hidden = false;
  });
  lb.addEventListener("click", close);
  $("#lbClose").addEventListener("click", close);
  addEventListener("keydown", e => { if (e.key === "Escape") close(); });
})();


/* ---------- THEME: Light / Dark ----------
   Thứ tự ưu tiên: lựa chọn thủ công (localStorage) > cài đặt hệ điều hành.
   Script khởi tạo trong <head> đã áp theme trước khi vẽ để tránh nháy. */
(function theme() {
  const root = document.documentElement;
  const metaTheme = $('meta[name="theme-color"]');
  const L = {
    en: { dark: "Dark Mode", light: "Light Mode", aria: t => `Theme: ${t === "dark" ? "Dark" : "Light"} mode. Switch to ${t === "dark" ? "light" : "dark"} mode` },
    vi: { dark: "Chế độ tối", light: "Chế độ sáng", aria: t => `Giao diện: chế độ ${t === "dark" ? "tối" : "sáng"}. Chuyển sang chế độ ${t === "dark" ? "sáng" : "tối"}` },
  };
  const get = () => root.getAttribute("data-theme") === "light" ? "light" : "dark";
  const paint = () => {
    const t = get(), l = L[I18N.lang] || L.en;
    $$("[data-theme-toggle]").forEach(b => {
      b.setAttribute("aria-pressed", String(t === "dark"));
      b.setAttribute("aria-label", l.aria(t));
      b.title = l[t];
      const lab = $(".th-label", b); if (lab) lab.textContent = l[t];
    });
    root.style.colorScheme = t;
    if (metaTheme) metaTheme.content = t === "light" ? "#F4F1E9" : "#08090A";
  };
  const apply = (t, persist) => {
    if (t === get()) { if (persist) store.set("theme", t); return; }
    if (!reduce) {
      root.classList.add("theme-anim");
      clearTimeout(apply.t); apply.t = setTimeout(() => root.classList.remove("theme-anim"), 380);
    }
    root.setAttribute("data-theme", t);
    if (persist) store.set("theme", t);
    paint();
  };
  $$("[data-theme-toggle]").forEach(b => b.addEventListener("click", () => apply(get() === "dark" ? "light" : "dark", true)));
  // theo hệ điều hành khi người dùng chưa chọn thủ công
  const mq = matchMedia("(prefers-color-scheme: light)");
  const follow = e => { const saved = store.get("theme"); if (saved !== "light" && saved !== "dark") apply(e.matches ? "light" : "dark", false); };
  mq.addEventListener ? mq.addEventListener("change", follow) : mq.addListener(follow);
  // cập nhật nhãn khi đổi ngôn ngữ
  new MutationObserver(paint).observe(root, { attributes: true, attributeFilter: ["lang"] });
  paint();
})();


/* ---------- PWA: chỉ đăng ký khi chạy qua https/localhost; trang vẫn dùng bình thường nếu không có ---------- */
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
}


/* ---------- Approach: ảnh chuyển theo bước đang đọc ---------- */
(function approachImages() {
  const imgs = $$(".ap-img"), steps = $$("[data-ap-step]");
  if (!imgs.length || !steps.length || !("IntersectionObserver" in window)) return;
  const show = key => imgs.forEach(i => i.classList.toggle("is-on", i.dataset.ap === key));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { show(e.target.dataset.apStep); steps.forEach(s => s.classList.toggle("dim", s !== e.target)); }
  }), { rootMargin: "-40% 0px -45% 0px" });
  steps.forEach(s => io.observe(s));
})();


/* ---------- Hero: địa cầu kỹ thuật số (canvas thuần, không thư viện) ----------
   Hiệu ứng chính: địa cầu wireframe xoay chậm. Phụ: xung dữ liệu chạy dọc vài cung nối. Còn lại tĩnh.
   Các nút là điểm trừu tượng, không gắn tên địa danh và không thể hiện dữ liệu giao dịch. */
(function heroGlobe() {
  const cv = $("#globeCv");
  if (!cv || document.documentElement.getAttribute("data-theme") === "light") return;
  const ctx = cv.getContext && cv.getContext("2d");
  if (!ctx) return;
  const mobile = matchMedia("(max-width: 767px)").matches;
  const still = reduce || mobile;                       // tĩnh trên mobile và khi giảm chuyển động
  const rad = d => d * Math.PI / 180;
  // nút kết nối: [vĩ độ, kinh độ] trừu tượng
  const NODES = [[51, -1], [40, -74], [1, 104], [22, 114], [47, 8], [25, 55], [35, 139], [-34, 151], [-23, -46], [55, 37]];
  const ARCS = [[0, 1], [0, 3], [1, 8], [2, 3], [4, 5], [5, 2], [0, 4], [6, 3], [1, 9]];
  const PULSE = [0, 2, 4, 7];                           // chỉ vài cung có xung
  const TILT = rad(-18);
  let W = 0, H = 0, R = 0, dpr = 1, rot = rad(-40), raf = 0, last = 0, visible = true, mx = null, my = null;

  function size() {
    dpr = Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    R = Math.min(W, H) * 0.36;
  }
  // lat/lon -> vector đơn vị, quay quanh trục Y rồi nghiêng quanh trục X
  function vec(lat, lon, k) {
    const la = rad(lat), lo = rad(lon) + rot, r = k || 1;
    let x = Math.cos(la) * Math.sin(lo) * r, y = Math.sin(la) * r, z = Math.cos(la) * Math.cos(lo) * r;
    const y2 = y * Math.cos(TILT) - z * Math.sin(TILT), z2 = y * Math.sin(TILT) + z * Math.cos(TILT);
    return [x, y2, z2];
  }
  const P = v => [W / 2 + v[0] * R, H / 2 - v[1] * R];
  const line = (pts, a) => {
    ctx.beginPath();
    pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]));
    ctx.strokeStyle = `rgba(191,195,198,${a})`; ctx.stroke();
  };
  function curve(fn, n, aF, aB) {                        // vẽ đường cong, mặt trước đậm hơn mặt sau
    let seg = [], front = null;
    for (let i = 0; i <= n; i++) {
      const v = fn(i / n), f = v[2] > 0;
      if (front === null) front = f;
      if (f !== front) { line(seg, front ? aF : aB); seg = [seg[seg.length - 1]]; front = f; }
      seg.push(P(v));
    }
    line(seg, front ? aF : aB);
  }
  function arcPoint(a, b, t) {                           // cung tròn lớn nâng lên khỏi mặt cầu
    const A = vec(NODES[a][0], NODES[a][1]), B = vec(NODES[b][0], NODES[b][1]);
    const dot = Math.max(-1, Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2])), om = Math.acos(dot) || 1e-6;
    const s1 = Math.sin((1 - t) * om) / Math.sin(om), s2 = Math.sin(t * om) / Math.sin(om);
    const lift = 1 + 0.2 * Math.sin(Math.PI * t) * Math.min(1, om);
    return [(A[0] * s1 + B[0] * s2) * lift, (A[1] * s1 + B[1] * s2) * lift, (A[2] * s1 + B[2] * s2) * lift];
  }

  function frame(now) {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 0.8;
    // quầng rất nhẹ
    const g = ctx.createRadialGradient(W / 2, H / 2, R * 0.2, W / 2, H / 2, R * 1.25);
    g.addColorStop(0, "rgba(191,195,198,.035)"); g.addColorStop(1, "rgba(191,195,198,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(W / 2, H / 2, R * 1.25, 0, 7); ctx.fill();
    // vĩ tuyến & kinh tuyến
    for (let lat = -60; lat <= 60; lat += 30) curve(t => vec(lat, t * 360 - 180), 72, 0.34, 0.1);
    for (let lon = 0; lon < 360; lon += 30) curve(t => vec(t * 180 - 90, lon), 48, 0.34, 0.1);
    // đường viền cầu
    ctx.beginPath(); ctx.arc(W / 2, H / 2, R, 0, 7); ctx.strokeStyle = "rgba(191,195,198,.28)"; ctx.stroke();
    // quỹ đạo mảnh + vệ tinh nhỏ
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(rad(-24));
    ctx.beginPath(); ctx.ellipse(0, 0, R * 1.32, R * 0.36, 0, 0, 7); ctx.strokeStyle = "rgba(191,195,198,.2)"; ctx.stroke();
    const oa = (now / 14000) % (Math.PI * 2);
    ctx.beginPath(); ctx.arc(Math.cos(oa) * R * 1.32, Math.sin(oa) * R * 0.36, 2, 0, 7); ctx.fillStyle = "rgba(223,203,159,.55)"; ctx.fill();
    ctx.restore();
    // cung kết nối
    ARCS.forEach(([a, b]) => curve(t => arcPoint(a, b, t), 40, 0.3, 0.07));
    // xung dữ liệu chạy chậm
    PULSE.forEach((idx, k) => {
      const [a, b] = ARCS[idx], t = ((now / (7000 + k * 1700)) + k * 0.27) % 1, v = arcPoint(a, b, t);
      if (v[2] < -0.05) return;
      const p = P(v); ctx.beginPath(); ctx.arc(p[0], p[1], 2.1, 0, 7); ctx.fillStyle = "rgba(223,203,159,.75)"; ctx.fill();
      for (let i = 1; i <= 6; i++) {                     // vệt mờ phía sau
        const q = P(arcPoint(a, b, Math.max(0, t - i * 0.012)));
        ctx.beginPath(); ctx.arc(q[0], q[1], 1.5, 0, 7); ctx.fillStyle = `rgba(223,203,159,${0.28 - i * 0.04})`; ctx.fill();
      }
    });
    // nút: sáng nhẹ khi con trỏ tới gần (desktop)
    NODES.forEach(([la, lo]) => {
      const v = vec(la, lo); if (v[2] < 0) return;
      const p = P(v); let near = 0;
      if (mx !== null) near = Math.max(0, 1 - Math.hypot(p[0] - mx, p[1] - my) / 110);
      ctx.beginPath(); ctx.arc(p[0], p[1], 2.8 + near * 2.2, 0, 7);
      ctx.fillStyle = `rgba(198,166,107,${0.7 + near * 0.3})`; ctx.fill();
      if (near > 0.05) { ctx.beginPath(); ctx.arc(p[0], p[1], 7 + near * 7, 0, 7); ctx.strokeStyle = `rgba(223,203,159,${near * 0.35})`; ctx.stroke(); }
    });
  }
  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (now - last < 33) return;                         // ~30fps
    const dt = last ? Math.min(now - last, 100) : 33; last = now;
    rot += dt * 0.000042;                                // ~1 vòng / 2 phút
    frame(now);
  }
  function start() { if (!raf && visible && !document.hidden && !still) raf = requestAnimationFrame(loop); }
  function stop() { cancelAnimationFrame(raf); raf = 0; last = 0; }

  size(); frame(0);
  addEventListener("resize", () => { size(); frame(performance.now()); });
  if (!still) {
    new IntersectionObserver(es => { visible = es[0].isIntersecting; visible ? start() : stop(); }, { threshold: 0 }).observe(cv);
    document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
    if (hoverOk) {
      const hero = $(".hero");
      hero.addEventListener("pointermove", e => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; }, { passive: true });
      hero.addEventListener("pointerleave", () => { mx = my = null; });
    }
    start();
  }
  // đổi sang Light: dừng; về Dark: chạy lại
  new MutationObserver(() => {
    if (document.documentElement.getAttribute("data-theme") === "light") stop();
    else { size(); frame(performance.now()); start(); }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();
