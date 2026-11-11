/* =====================================================================
   LAVIENT CAPITAL — site script
   Không dùng thư viện ngoài. Mọi cấu hình nằm trong SITE bên dưới.
   ===================================================================== */

/* ============ CẤU HÌNH — chỉnh tại đây ============ */
const SITE = {
  // Ảnh chân dung (bỏ file vào landing/img/ rồi điền đường dẫn). Để trống = hiển thị monogram.
  portrait: "",

  // Kênh liên hệ THẬT. Để trống = không hiện. Không điền link giả.
  links: {
    email: "",       // vd: "you@domain.com"
    community: "",   // nút "Join The Community"
    website: "",     // nút "Explore LAVIENT CAPITAL"
  },

  // ===== MẠNG XÃ HỘI — nơi DUY NHẤT quản lý link =====
  // url: dán link chính thức. Để "" thì nền tảng hiện ở trạng thái "link chưa cập nhật" (không bấm được).
  // enabled: false để ẩn hẳn nền tảng khỏi toàn bộ trang.
  socialLinks: {
    tiktok: { name: "TikTok", url: "", enabled: true, description: "Short-form financial insights, trading knowledge and market perspectives.", descriptionVi: "Nhận định tài chính ngắn, kiến thức giao dịch và góc nhìn thị trường.", cta: "Follow", ctaVi: "Theo dõi" },
    youtube: { name: "YouTube", url: "", enabled: true, description: "In-depth trading education, market analysis and long-form content.", descriptionVi: "Giáo dục giao dịch chuyên sâu, phân tích thị trường và nội dung dài.", cta: "Subscribe", ctaVi: "Đăng ký" },
    facebook: { name: "Facebook", url: "", enabled: true, description: "Brand updates, announcements and community engagement.", descriptionVi: "Cập nhật thương hiệu, thông báo và tương tác cộng đồng.", cta: "Follow", ctaVi: "Theo dõi" },
    telegram: { name: "Telegram", url: "", enabled: true, description: "Market updates, trading insights and community communication.", descriptionVi: "Cập nhật thị trường, góc nhìn giao dịch và trao đổi cộng đồng.", cta: "Join", ctaVi: "Tham gia" },
    instagram: { name: "Instagram", url: "", enabled: true, description: "Brand identity, visual content and behind-the-scenes.", descriptionVi: "Nhận diện thương hiệu, nội dung hình ảnh và hậu trường.", cta: "Follow", ctaVi: "Theo dõi" },
    discord: { name: "Discord", url: "", enabled: true, description: "Trading community, discussions, learning and member interaction.", descriptionVi: "Cộng đồng giao dịch, thảo luận, học hỏi và tương tác giữa thành viên.", cta: "Join", ctaVi: "Tham gia" },
  },

  // Địa chỉ nhận tin nhắn từ form (Formspree, Google Apps Script, webhook CRM...).
  formEndpoint: "",

  // Dãy chứng nhận chạy ngang. Thêm ảnh: bỏ file vào landing/img/ rồi thêm 1 dòng.
  // Trường: src, w, h (kích thước ảnh), firm, title, verify (link xác thực của quỹ, tuỳ chọn).
  // Danh sách trống thì khu vực đó tự ẩn.
  certificates: {
    mine: [
      { src: "img/my-fundednext-elite.webp", w: 601, h: 402, firm: "FundedNext", title: "Elite Trader" },
      { src: "img/my-the5ers-funded-5k.webp", w: 1000, h: 1000, firm: "The5ers", title: "Funded Trader · High Stakes 5K" },
      { src: "img/my-the5ers-payout-226.webp", w: 1000, h: 1000, firm: "The5ers", title: "Payout Received $226.14" },
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
  const set = l => {
    I18N.lang = l;
    document.documentElement.lang = l;
    // quét lại mỗi lần đổi: phần tử được nhân bản sau khi tải (dải ảnh chạy vòng) vẫn đổi ngôn ngữ đúng
    $$("[data-i18n]").forEach(el => {
      if (!("en" in el.dataset)) el.dataset.en = el.innerHTML;
      el.innerHTML = l === "vi" ? el.dataset.vi : el.dataset.en;
    });
    $("#toTop").setAttribute("aria-label", l === "vi" ? "Lên đầu trang" : "Back to Top");
    $("#burger").setAttribute("aria-label", l === "vi" ? "Mở menu" : "Open menu");
    store.set("lang", l);
  };
  const saved = store.get("lang");
  set(saved || (/^vi/i.test(navigator.language || "") ? "vi" : "en"));
  I18N.set = set;
})();

/* ---------- Language dropdown (dùng lại I18N.set; chỉ thay phần giao diện chọn ngôn ngữ) ---------- */
(function langDropdown() {
  const dd = $("#langDd"), btn = $("#lang"), list = $("#langList"), opts = $$("[role=option]", list);
  const NAMES = { en: "Language", vi: "Ngôn ngữ" };
  const sync = () => {
    $(".lang-code", btn).textContent = I18N.lang.toUpperCase();
    btn.setAttribute("aria-label", NAMES[I18N.lang] + ": " + I18N.lang.toUpperCase());
    list.setAttribute("aria-label", NAMES[I18N.lang]);
    opts.forEach(o => { const on = o.dataset.lang === I18N.lang; o.setAttribute("aria-selected", on); o.classList.toggle("is-on", on); });
  };
  const isOpen = () => dd.classList.contains("open");
  const open = () => { dd.classList.add("open"); btn.setAttribute("aria-expanded", "true"); (opts.find(o => o.dataset.lang === I18N.lang) || opts[0]).focus(); };
  const close = back => { dd.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); if (back) btn.focus(); };
  const pick = o => { if (o.dataset.lang !== I18N.lang) I18N.set(o.dataset.lang); sync(); close(true); };
  btn.addEventListener("click", () => isOpen() ? close() : open());
  btn.addEventListener("keydown", e => { if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); open(); } });
  opts.forEach(o => o.addEventListener("click", () => pick(o)));
  list.addEventListener("keydown", e => {
    const i = opts.indexOf(document.activeElement);
    if (e.key === "ArrowDown") { e.preventDefault(); opts[(i + 1) % opts.length].focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); opts[(i - 1 + opts.length) % opts.length].focus(); }
    else if (e.key === "Home") { e.preventDefault(); opts[0].focus(); }
    else if (e.key === "End") { e.preventDefault(); opts[opts.length - 1].focus(); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (i >= 0) pick(opts[i]); }
    else if (e.key === "Escape") { e.preventDefault(); close(true); }
    else if (e.key === "Tab") close();
  });
  document.addEventListener("click", e => { if (isOpen() && !dd.contains(e.target)) close(); });
  sync();
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

/* ---------- count-up (Achievements): chạy một lần khi khối số vào viewport, lệch nhau ~150ms ---------- */
(function countUp() {
  const wrap = $("#achievements .stats"); if (!wrap) return;
  const els = $$("[data-count]", wrap);
  const fmt = (v, d) => v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const ease = p => 1 - Math.pow(1 - p, 4); // ease-out mượt
  const run = (el, i) => {
    const to = parseFloat(el.dataset.count), d = +el.dataset.dec || 0, dur = 2200;
    setTimeout(() => {
      const t0 = performance.now();
      (function tick(t) {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = p < 1 ? fmt(to * ease(p), d) : fmt(to, d);
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }, i * 150);
  };
  if (reduce || !("IntersectionObserver" in window)) return; // giữ nguyên giá trị cuối có sẵn trong HTML
  els.forEach(el => { el.textContent = fmt(0, +el.dataset.dec || 0); });
  wrap.classList.add("cu-wait");
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.disconnect();
    $$(".num", wrap).forEach((n, i) => n.style.setProperty("--cu-d", (i * .15).toFixed(2) + "s"));
    wrap.classList.remove("cu-wait"); wrap.classList.add("cu-go");
    els.forEach((el, i) => run(el, i));
  }), { threshold: .3 });
  io.observe(wrap);
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
        const ac = new AbortController(), to = setTimeout(() => ac.abort(), 12000);
        const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, signal: ac.signal, body: JSON.stringify({ ...d, source: location.href, time: new Date().toISOString() }) });
        clearTimeout(to);
        if (!r.ok) throw new Error(r.status);
      } else if (email) {
        location.href = `mailto:${email}?subject=${encodeURIComponent("Message from " + d.name)}&body=${encodeURIComponent(d.message + "\n\n" + d.name + " <" + d.email + ">")}`;
      } else {
        const arr = JSON.parse(store.get("contact_demo") || "[]");
        arr.push({ ...d, time: new Date().toISOString() });
        store.set("contact_demo", JSON.stringify(arr));
      }
      const demoOnly = !endpoint && !email;
      msg.textContent = demoOnly ? (I18N.lang === "vi" ? "Chế độ thử nghiệm: tin nhắn CHƯA được gửi đi (chỉ lưu tạm trên trình duyệt)." : "Demo mode: your message was NOT sent (stored in this browser only).") : m.ok;
      msg.classList.add(demoOnly ? "bad" : "ok"); form.reset();
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
    const ver = /^https?:\/\//i.test(c.verify || "") ? ` · <a href="${esc(c.verify)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">Verify</a>` : "";
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
      let guard = 0;
      do { g.insertAdjacentHTML("beforeend", items); } while (g.scrollWidth < innerWidth * 1.2 && ++guard < 12);
      if (reduce) return;
      const w = g.getBoundingClientRect().width;
      const g2 = g.cloneNode(true);
      g2.setAttribute("aria-hidden", "true");
      $$("button", g2).forEach(b => { b.tabIndex = -1; });
      track.appendChild(g2);
      track.style.setProperty("--w", w + "px");
      track.style.setProperty("--dur", Math.max(w / 45, 24) + "s");
      track.classList.add("run");
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
    en: { dark: "Dark Mode", light: "Light Mode", tip: t => `Switch to ${t === "dark" ? "light" : "dark"} mode`, aria: t => `Theme: ${t === "dark" ? "Dark" : "Light"} mode. Switch to ${t === "dark" ? "light" : "dark"} mode` },
    vi: { dark: "Chế độ tối", light: "Chế độ sáng", tip: t => `Chuyển sang chế độ ${t === "dark" ? "sáng" : "tối"}`, aria: t => `Giao diện: chế độ ${t === "dark" ? "tối" : "sáng"}. Chuyển sang chế độ ${t === "dark" ? "sáng" : "tối"}` },
  };
  const get = () => root.getAttribute("data-theme") === "light" ? "light" : "dark";
  const paint = () => {
    const t = get(), l = L[I18N.lang] || L.en;
    $$("[data-theme-toggle]").forEach(b => {
      b.setAttribute("aria-pressed", String(t === "dark"));
      b.setAttribute("aria-label", l.aria(t));
      b.dataset.tip = l.tip(t); b.removeAttribute("title");
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





/* ---------- Hero: địa cầu kỹ thuật số (canvas thuần, không thư viện) ----------
   Hiệu ứng chính: địa cầu wireframe xoay chậm. Phụ: xung dữ liệu chạy dọc vài cung nối. Còn lại tĩnh.
   Các nút là điểm trừu tượng, không gắn tên địa danh và không thể hiện dữ liệu giao dịch. */
(function heroGlobe() {
  const cv = $("#globeCv");
  if (!cv) return;
  const ctx = cv.getContext && cv.getContext("2d");
  if (!ctx) return;
  const mobile = matchMedia("(max-width: 767px)").matches;
  const still = reduce || mobile;                       // tĩnh trên mobile và khi giảm chuyển động
  const rad = d => d * Math.PI / 180;
  const fx = () => { const cs = getComputedStyle(document.documentElement); const v = n => (cs.getPropertyValue(n) || "").trim(); return { line: v("--fx-line") || "191,195,198", dot: v("--fx-dot") || "212,175,55", hi: v("--fx-hi") || "255,240,194", a: parseFloat(v("--fx-a")) || 1 }; };
  let FX = fx();
  const c1 = a => `rgba(${FX.line},${Math.min(1, a * FX.a)})`;      // đường nét
  const c2 = a => `rgba(${FX.dot},${Math.min(1, a)})`;                // chấm nút
  const c3 = a => `rgba(${FX.hi},${Math.min(1, a)})`;                 // xung sáng

  let vel = 0;                                         // vận tốc xoay do người dùng kéo (rad/ms)
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
    ctx.strokeStyle = c1(a); ctx.stroke();
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
    g.addColorStop(0, c1(.04)); g.addColorStop(1, c1(0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(W / 2, H / 2, R * 1.25, 0, 7); ctx.fill();
    // vĩ tuyến & kinh tuyến
    for (let lat = -60; lat <= 60; lat += 30) curve(t => vec(lat, t * 360 - 180), 72, 0.34, 0.1);
    for (let lon = 0; lon < 360; lon += 30) curve(t => vec(t * 180 - 90, lon), 48, 0.34, 0.1);
    // đường viền cầu
    ctx.beginPath(); ctx.arc(W / 2, H / 2, R, 0, 7); ctx.strokeStyle = c1(.28); ctx.stroke();
    // quỹ đạo mảnh + vệ tinh nhỏ
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(rad(-24));
    ctx.beginPath(); ctx.ellipse(0, 0, R * 1.32, R * 0.36, 0, 0, 7); ctx.strokeStyle = c1(.2); ctx.stroke();
    const oa = (now / 14000) % (Math.PI * 2);
    ctx.beginPath(); ctx.arc(Math.cos(oa) * R * 1.32, Math.sin(oa) * R * 0.36, 2, 0, 7); ctx.fillStyle = c3(.55); ctx.fill();
    ctx.restore();
    // cung kết nối
    ARCS.forEach(([a, b]) => curve(t => arcPoint(a, b, t), 40, 0.3, 0.07));
    // xung dữ liệu chạy chậm
    PULSE.forEach((idx, k) => {
      const [a, b] = ARCS[idx], t = ((now / (7000 + k * 1700)) + k * 0.27) % 1, v = arcPoint(a, b, t);
      if (v[2] < -0.05) return;
      const p = P(v); ctx.beginPath(); ctx.arc(p[0], p[1], 2.1, 0, 7); ctx.fillStyle = c3(.75); ctx.fill();
      for (let i = 1; i <= 6; i++) {                     // vệt mờ phía sau
        const q = P(arcPoint(a, b, Math.max(0, t - i * 0.012)));
        ctx.beginPath(); ctx.arc(q[0], q[1], 1.5, 0, 7); ctx.fillStyle = c3(0.28 - i * 0.04); ctx.fill();
      }
    });
    // nút: sáng nhẹ khi con trỏ tới gần (desktop)
    NODES.forEach(([la, lo]) => {
      const v = vec(la, lo); if (v[2] < 0) return;
      const p = P(v); let near = 0;
      if (mx !== null) near = Math.max(0, 1 - Math.hypot(p[0] - mx, p[1] - my) / 110);
      ctx.beginPath(); ctx.arc(p[0], p[1], 2.8 + near * 2.2, 0, 7);
      ctx.fillStyle = c2(0.7 + near * 0.3); ctx.fill();
      if (near > 0.05) { ctx.beginPath(); ctx.arc(p[0], p[1], 7 + near * 7, 0, 7); ctx.strokeStyle = c3(near * 0.35); ctx.stroke(); }
    });
  }
  function loop(now) {
    raf = requestAnimationFrame(loop);
    if (now - last < (document.documentElement.classList.contains("lite") ? 66 : 33)) return;   // 30fps (15fps ở chế độ nhẹ)
    const dt = last ? Math.min(now - last, 100) : 33; last = now;
    rot += dt * 0.000042 + vel * dt; vel *= 0.93;                                // ~1 vòng / 2 phút
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
      // kéo ngang trong hero để xoay địa cầu
      let dragging = false, lx = 0, lt = 0;
      hero.addEventListener("pointerdown", e => {
        if (e.button !== 0 || e.target.closest("a,button,input,textarea,select,.chip")) return;
        dragging = true; lx = e.clientX; lt = performance.now(); hero.style.userSelect = "none";
      });
      addEventListener("pointermove", e => {
        if (!dragging) return;
        const now = performance.now(), dx = e.clientX - lx;
        rot += dx * 0.0042; vel = Math.max(-0.004, Math.min(0.004, dx * 0.0042 / Math.max(now - lt, 8)));
        lx = e.clientX; lt = now;
      });
      addEventListener("pointerup", () => { dragging = false; hero.style.userSelect = ""; });
    }
    start();
  }
  // đổi sang Light: dừng; về Dark: chạy lại
  new MutationObserver(() => { FX = fx(); size(); frame(performance.now()); start(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
})();

/* =====================================================================
   MOTION ENGINE — tất cả dùng chung nhịp ở :root (--d1/--d2/--d3/--stagger)
   ===================================================================== */
(function motion() {
  const root = document.documentElement;
  const wide = matchMedia("(min-width: 768px)").matches;

  /* --- 1. Chữ: hiện từng từ (h1 khi tải, h2/trích dẫn khi cuộn tới) --- */
  const splitEl = el => {
    let i = 0;
    const walk = n => [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.append(p); return; }
          const w = document.createElement("span"), wi = document.createElement("span");
          w.className = "w"; wi.className = "wi"; wi.style.setProperty("--i", i++); wi.textContent = p;
          w.append(wi); frag.append(w);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1 && !c.classList.contains("w")) walk(c);
    });
    el.classList.add("split"); walk(el);
  };
  const targets = $$("h1, .sec-head h2, .big-quote, .cn-h, .fs-quote");
  if (!reduce) {
    targets.forEach(splitEl);
    const h1 = $("h1");
    h1.style.setProperty("--base", ".5s");
    requestAnimationFrame(() => requestAnimationFrame(() => h1.classList.add("go")));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("go"); io.unobserve(e.target); }
    }), { threshold: .45 });
    targets.filter(t => t !== h1).forEach(t => io.observe(t));
    // đổi ngôn ngữ: tách lại từ, không chạy lại hiệu ứng
    new MutationObserver(() => targets.forEach(t => { t.classList.remove("split"); splitEl(t); t.classList.add("instant", "go"); }))
      .observe(root, { attributes: true, attributeFilter: ["lang"] });
  }

  /* --- 2. Đường kẻ section vẽ ra khi vào tầm nhìn --- */
  const sio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("seen"); sio.unobserve(e.target); } }), { threshold: .08 });
  $$(".section").forEach(s => sio.observe(s));

  /* --- 3. Icon: chuẩn hoá độ dài nét để animate vẽ lại --- */
  $$(".ico svg path, .ico svg circle").forEach(p => p.setAttribute("pathLength", "1"));

  if (reduce || !wide) return;                           // phần còn lại chỉ cho desktop

  /* --- 4. Parallax theo tiến trình cuộn (một biến CSS, chỉ trong màn hình đầu) --- */
  const hero = $(".hero");
  let ticking = false;
  addEventListener("scroll", () => {
    if (ticking || scrollY > 1100) return;
    ticking = true;
    requestAnimationFrame(() => { hero.style.setProperty("--sy", Math.min(scrollY, 1000)); ticking = false; });
  }, { passive: true });

  if (!hoverOk) return;

  /* --- 5. Ánh sáng theo con trỏ trong hero --- */
  const ptr = $(".hero-pointer");
  hero.addEventListener("pointermove", e => {
    const r = hero.getBoundingClientRect();
    ptr.style.transform = `translate3d(${e.clientX - r.left}px,${e.clientY - r.top}px,0)`;
    hero.classList.add("lit");
  }, { passive: true });
  hero.addEventListener("pointerleave", () => hero.classList.remove("lit"));

  /* --- 6. Thẻ: nghiêng ≤2.2° --- */
  const TILT = ".card, .stat, .cred, .tl-c";
  $$(TILT).forEach(el => el.classList.add("tilt"));
  let cur = null, raf = 0;
  document.addEventListener("pointermove", e => {
    const el = e.target.closest?.(TILT);
    if (cur && cur !== el) { cur.style.setProperty("--rx", "0deg"); cur.style.setProperty("--ry", "0deg"); }
    cur = el;
    if (!el) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.setProperty("--ry", (x * 4.4).toFixed(2) + "deg");
      el.style.setProperty("--rx", (-y * 4.4).toFixed(2) + "deg");
    });
  }, { passive: true });
  document.addEventListener("pointerleave", () => { if (cur) { cur.style.setProperty("--rx", "0deg"); cur.style.setProperty("--ry", "0deg"); cur = null; } });

  /* --- 7. Nút: nam châm nhẹ + phản hồi khi nhấn --- */
  $$(".btn-lg, .nav-cta").forEach(b => {
    b.classList.add("mag");
    let x = 0, y = 0;
    const set = (sc) => { b.style.transform = `translate3d(${x}px,${y}px,0)${sc ? " scale(.97)" : ""}`; };
    b.addEventListener("pointermove", e => {
      const r = b.getBoundingClientRect();
      x = Math.max(-6, Math.min(6, (e.clientX - r.left - r.width / 2) * .14));
      y = Math.max(-5, Math.min(5, (e.clientY - r.top - r.height / 2) * .2));
      set(false);
    });
    b.addEventListener("pointerleave", () => { x = y = 0; b.style.transform = ""; });
    b.addEventListener("pointerdown", () => set(true));
    b.addEventListener("pointerup", () => set(false));
  });
})();

(function heroDust() {
  const cv = $("#dustCv");
  if (!cv || reduce || !matchMedia("(min-width: 768px)").matches) return;
  const ctx = cv.getContext("2d"); if (!ctx) return;
  const col = () => (getComputedStyle(document.documentElement).getPropertyValue("--fx-line") || "191,195,198").trim();
  let LC = col();
  let W = 0, H = 0, raf = 0, last = 0, vis = true;
  const N = 34, ps = [];
  const size = () => { const d = Math.min(devicePixelRatio || 1, 1.5); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
  const mk = (fresh) => ({ x: Math.random() * W, y: fresh ? Math.random() * H : H + 10, v: 5 + Math.random() * 9, dx: (Math.random() - .5) * 3, r: .7 + Math.random() * .9, a: .1 + Math.random() * .16, ph: Math.random() * 6.28 });
  size(); for (let i = 0; i < N; i++) ps.push(mk(true));
  function tick(now) {
    raf = requestAnimationFrame(tick);
    if (document.documentElement.classList.contains("lite")) { stop(); return; }
    if (now - last < 42) return;
    const dt = Math.min((now - last) / 1000, .1) || .042; last = now;
    ctx.clearRect(0, 0, W, H);
    ps.forEach((p, i) => {
      p.y -= p.v * dt; p.x += p.dx * dt;
      if (p.y < -10) ps[i] = mk(false);
      const tw = .65 + .35 * Math.sin(now / 2400 + p.ph), fade = Math.min(1, Math.max(0, (p.y / H) * 3), Math.max(0, (H - p.y) / 60));
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fillStyle = `rgba(${LC},${(p.a * tw * fade * 1.4).toFixed(3)})`; ctx.fill();
    });
  }
  const start = () => { if (!raf && vis && !document.hidden) raf = requestAnimationFrame(tick); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; last = 0; };
  new IntersectionObserver(es => { vis = es[0].isIntersecting; vis ? start() : stop(); }).observe(cv);
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
  addEventListener("resize", size);
  new MutationObserver(() => { LC = col(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  start();
})();


/* tạm dừng các hoạt ảnh CSS của hero khi không còn nhìn thấy */
(function pauseHero() {
  const hero = $(".hero"); if (!hero || !("IntersectionObserver" in window)) return;
  new IntersectionObserver(es => hero.classList.toggle("paused", !es[0].isIntersecting)).observe(hero);
})();


/* ---------- Chuyển cảnh section: section cũ mờ dần khi section kế tiếp tiến lên (desktop) ---------- */
(function sectionTransitions() {
  if (reduce || !matchMedia("(min-width: 1024px) and (hover: hover)").matches) return;
  const secs = $$(".section");
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = innerHeight;
    secs.forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh) { return; }
      // chỉ mờ ở 55% cuối cuộc đời section, khi đáy section đang rời khỏi màn hình
      const q = r.bottom < vh * .55 ? Math.min(1, 1 - r.bottom / (vh * .55)) : 0;
      s.style.setProperty("--q", q.toFixed(3));
    });
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();

/* ---------- Dừng hoạt ảnh vệt sáng ở section không nhìn thấy ---------- */
(function sheenIdle() {
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("idle", !e.isIntersecting)), { rootMargin: "100px" });
  $$(".hero,.section").forEach(s => { s.classList.add("idle"); io.observe(s); });
})();


/* ---------- 3D spatial depth: con trỏ điều khiển độ nghiêng/độ sâu các lớp hero (desktop) ---------- */
(function heroDepth() {
  if (reduce || !hoverOk || !matchMedia("(min-width: 768px)").matches) return;
  const hero = $(".hero"); if (!hero) return;
  let raf = 0;
  hero.addEventListener("pointermove", e => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      hero.style.setProperty("--py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
  }, { passive: true });
  hero.addEventListener("pointerleave", () => { hero.style.setProperty("--px", 0); hero.style.setProperty("--py", 0); });
})();


/* ---------- Bộ điều tiết chất lượng thích ứng ----------
   Đo tốc độ khung hình sau khi tải; nếu thiết bị chạy dưới 40fps thì chuyển sang chế độ nhẹ. */
(function perfGovernor() {
  if (reduce) return;
  const root = document.documentElement;
  const measure = () => {
    if (document.hidden) { setTimeout(measure, 2000); return; }
    let n = 0; const t0 = performance.now();
    (function f() {
      n++; const dt = performance.now() - t0;
      if (dt < 1500) requestAnimationFrame(f);
      else if (n / (dt / 1000) < 40) root.classList.add("lite");
    })();
  };
  addEventListener("load", () => setTimeout(measure, 2800));
})();


/* =====================================================================
   SOCIAL ECOSYSTEM — mọi vị trí hiển thị đọc từ SITE.socialLinks
   Logo: Simple Icons (CC0). Tên và logo là nhãn hiệu của từng nền tảng.
   ===================================================================== */
(function social() {
  const ICONS = {"tiktok": {"path": "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z", "hex": "#BFC3C6"}, "youtube": {"path": "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z", "hex": "#FF0000"}, "facebook": {"path": "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z", "hex": "#0866FF"}, "telegram": {"path": "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z", "hex": "#26A5E4"}, "instagram": {"path": "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077", "hex": "#FF0069"}, "discord": {"path": "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z", "hex": "#5865F2"}};
  const list = Object.entries(SITE.socialLinks || {}).filter(([k, v]) => v && v.enabled !== false && ICONS[k]);
  const clean = u => { try { const x = new URL(String(u).trim()); return /^https?:$/.test(x.protocol) ? x.href : ""; } catch { return ""; } };
  const items = list.map(([k, v]) => ({ key: k, ...v, href: clean(v.url), icon: ICONS[k] }));
  const live = items.filter(i => i.href);
  const NS = "http://www.w3.org/2000/svg";
  const svg = i => { const s = document.createElementNS(NS, "svg"); s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("aria-hidden", "true"); s.setAttribute("focusable", "false"); const p = document.createElementNS(NS, "path"); p.setAttribute("d", i.icon.path); p.setAttribute("fill", "currentColor"); s.append(p); return s; };
  const vi = () => I18N.lang === "vi";
  const txt = (i, f) => vi() ? (i[f + "Vi"] || i[f]) : i[f];

  const anchor = (i, cls) => {
    const el = document.createElement(i.href ? "a" : "span");
    el.className = "soc " + cls; el.style.setProperty("--brand", i.icon.hex); el.dataset.platform = i.key;
    if (i.href) { el.href = i.href; el.target = "_blank"; el.rel = "noopener noreferrer"; el.setAttribute("aria-label", i.name + (vi() ? " (mở tab mới)" : " (opens in a new tab)")); }
    else { el.setAttribute("aria-disabled", "true"); el.setAttribute("role", "link"); el.setAttribute("aria-label", i.name + (vi() ? " — link chưa cập nhật" : " — link not set yet")); }
    return el;
  };
  const icon = (i, cls) => { const el = anchor(i, cls); el.append(svg(i)); const t = document.createElement("span"); t.className = "tipx"; t.textContent = i.name + (i.href ? "" : (vi() ? " · sắp có" : " · coming soon")); el.append(t); return el; };

  function render() {
    // header + hero: chỉ nền tảng có link thật; footer: đủ tất cả (nền tảng chưa có link ở dạng vô hiệu)
    const fill = (sel, set, cls, max) => { const box = $(sel); if (!box) return; box.replaceChildren(); set.slice(0, max || 99).forEach(i => { const li = document.createElement("li"); li.append(icon(i, cls)); box.append(li); }); box.hidden = !set.length; };
    fill("#navSocial", live, "soc-sm", 4);
    fill("#heroSocial", live, "soc-sm");
    fill("#footSocial", items, "soc-sm");
    const hs = $("#heroSocialWrap"); if (hs) hs.hidden = !live.length;
    // section riêng
    const grid = $("#socialGrid"); if (!grid) return;
    grid.replaceChildren();
    items.forEach(i => {
      const card = anchor(i, "soc-card glass");
      const top = document.createElement("div"); top.className = "soc-top";
      const ic = document.createElement("span"); ic.className = "soc-ic"; ic.append(svg(i));
      const nm = document.createElement("h3"); nm.textContent = i.name;
      top.append(ic, nm);
      const p = document.createElement("p"); p.textContent = txt(i, "description");
      const cta = document.createElement("span"); cta.className = "soc-cta";
      cta.textContent = i.href ? txt(i, "cta") : (vi() ? "Link chưa cập nhật" : "Link not set yet");
      if (i.href) { const ar = document.createElementNS(NS, "svg"); ar.setAttribute("viewBox", "0 0 24 24"); ar.setAttribute("aria-hidden", "true"); ar.innerHTML = '<path d="M5 12h14M13 6l6 6-6 6"/>'; cta.append(ar); }
      card.append(top, p, cta); grid.append(card);
    });
    $("#community").hidden = !items.length;
  }
  render();
  new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });

  // ánh sáng theo con trỏ + nam châm nhẹ cho icon (desktop)
  if (hoverOk && !reduce) {
    document.addEventListener("pointermove", e => {
      const c = e.target.closest?.(".soc-card, .soc-sm"); if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px");
      if (c.classList.contains("soc-sm") && c.href) c.style.transform = `translate(${((e.clientX - r.left) / r.width - .5) * 5}px,${((e.clientY - r.top) / r.height - .5) * 5}px)`;
    }, { passive: true });
    document.addEventListener("pointerout", e => { const c = e.target.closest?.(".soc-sm"); if (c) c.style.transform = ""; });
  }
  // không cho bấm khi chưa có link
  document.addEventListener("click", e => { const d = e.target.closest?.('.soc[aria-disabled="true"]'); if (d) e.preventDefault(); });
})();


/* ---------- Triết lý: dải ảnh tự chạy (dùng lại .achv / .achv-track.run) ---------- */
(function philRun() {
  const box = $(".phil-gallery"); if (!box || reduce) return;
  const orig = [...box.children];
  orig.forEach(f => { const s = document.createElement("span"); s.className = "ph-sheen"; s.setAttribute("aria-hidden", "true"); f.insertBefore(s, f.querySelector("figcaption")); $("img", f).loading = "eager"; f.classList.add("in"); });
  const build = () => {
    box.innerHTML = ""; box.className = "achv phil-run";
    const track = document.createElement("div"); track.className = "achv-track";
    const g = document.createElement("div"); g.className = "achv-group"; track.appendChild(g); box.appendChild(track);
    orig.forEach(f => g.appendChild(f));
    let guard = 0;
    while (g.scrollWidth < innerWidth * 1.2 && ++guard < 6) orig.forEach(f => { const c = f.cloneNode(true); c.setAttribute("aria-hidden", "true"); g.appendChild(c); });
    const w = g.getBoundingClientRect().width, g2 = g.cloneNode(true);
    g2.setAttribute("aria-hidden", "true"); track.appendChild(g2);
    track.style.setProperty("--w", w + "px");
    track.style.setProperty("--dur", Math.max(w / 40, 28) + "s");
    track.classList.add("run");
  };
  build();
  let t, lastW = innerWidth;
  addEventListener("resize", () => { clearTimeout(t); t = setTimeout(() => { if (Math.abs(innerWidth - lastW) > 40) { lastW = innerWidth; build(); } }, 250); });
})();

/* dừng dải chứng nhận khi ngoài màn hình (tiết kiệm pin) */
(function achvIdle() {
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("off", !e.isIntersecting)));
  $$(".achv").forEach(a => io.observe(a));
})();


/* ---------- The LAVIENT Method: thắp sáng nút 01 → 05 lần lượt, chỉ một lần ---------- */
(function method() {
  const tl = $("#methodTl"); if (!tl) return;
  const steps = $$(".mt-step", tl);
  const geom = () => {                                   // trục chạy từ nút 01 đến nút 05
    const tr = tl.getBoundingClientRect(), c = n => { const r = $(".mt-node", n).getBoundingClientRect(); return r.top + r.height / 2 - tr.top; };
    const t0 = c(steps[0]), t1 = c(steps[steps.length - 1]);
    tl.style.setProperty("--lt", t0 + "px"); tl.style.setProperty("--lb", (tr.height - t1) + "px"); return [t0, t1 - t0];
  };
  const lit = el => {
    el.classList.add("on");
    const [t0, len] = geom(), nr = $(".mt-node", el).getBoundingClientRect(), tr = tl.getBoundingClientRect();
    tl.style.setProperty("--p", Math.max(0, Math.min(1, (nr.top + nr.height / 2 - tr.top - t0) / len)).toFixed(4));
  };
  if (reduce || !("IntersectionObserver" in window)) { steps.forEach(lit); tl.style.setProperty("--p", 1); return; }
  let last = -1;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    // luôn theo thứ tự: không sáng bước sau khi bước trước chưa sáng
    const idx = steps.indexOf(e.target);
    for (let k = last + 1; k <= idx; k++) setTimeout(() => lit(steps[k]), (k - last - 1) * 450);
    last = Math.max(last, idx);
  }), { threshold: .35, rootMargin: "0px 0px -8% 0px" });
  steps.forEach(st => io.observe(st));
  addEventListener("resize", () => { geom(); const on = steps.filter(x => x.classList.contains("on")).pop(); if (on) lit(on); });
})();


/* ---------- Founder story: CTA cộng đồng dùng link sẵn có nếu đã cấu hình ---------- */
(function founder() {
  const url = (SITE.links.community || "").trim(), a = $("#fsCommunity");
  if (a && /^https?:\/\//i.test(url)) { a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; }
})();
