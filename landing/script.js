/* ============ CẤU HÌNH — chỉnh tại đây ============ */
const CONFIG = {
  // Hạn ưu đãi (ISO). Chỉ nên dùng hạn THẬT, đừng reset giả để tạo áp lực.
  offerDeadline: "2026-12-31T23:59:59+07:00",
  // Địa chỉ nhận lead (Google Apps Script, Formspree, Make/Zapier webhook, CRM...).
  // Để trống = chỉ lưu tạm trên trình duyệt (chế độ demo).
  formEndpoint: "",
  // Link chuyển hướng sau khi đăng ký (Zalo/Telegram group...). Để trống = hiện thông báo.
  thankYouUrl: "",
  // Dãy chứng nhận chạy ngang. Thêm ảnh: bỏ file vào landing/img/ rồi thêm 1 dòng ở đây.
  // owner: ghi đúng "Học viên" hoặc "Của tôi" để nhãn không gây hiểu nhầm (để trống = không hiện).
  // verify: (tuỳ chọn) link xác thực của quỹ — rất nên có để tăng độ tin cậy.
  certificates: [
    { src: "img/cert-payout.webp", w: 594, h: 572, firm: "The5ers", title: "Total Payouts", owner: "Học viên" },
    { src: "img/cert-funded.webp", w: 600, h: 580, firm: "The5ers", title: "Funded Certificate", owner: "Học viên" },
    { src: "img/cert-qt.webp", w: 709, h: 628, firm: "QT Funded", title: "Phase Pass $5,000", owner: "Học viên" },
  ],
};
/* ================================================= */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

$("#year").textContent = new Date().getFullYear();

/* --- Mobile menu --- */
const burger = $("#burger"), menu = $("#menu");
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
$$("#menu a").forEach(a => a.addEventListener("click", () => {
  menu.classList.remove("open");
  burger.setAttribute("aria-expanded", false);
}));

/* --- Scroll: nav, back-to-top, sticky CTA --- */
const nav = $("#nav"), toTop = $("#toTop"), sticky = $("#stickyCta");
const onScroll = () => {
  const y = scrollY;
  nav.classList.toggle("scrolled", y > 40);
  toTop.classList.toggle("show", y > 600);
  sticky.classList.toggle("show", y > 700 && !inView($("#dang-ky")));
};
const inView = el => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };
addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));

/* --- Reveal on scroll --- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: .12 });
$$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 90 + "ms"; io.observe(el); });

/* --- Counters --- */
const counters = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  counters.unobserve(e.target);
  const el = e.target, to = +el.dataset.count, suf = el.dataset.suffix || "";
  if (reduce) { el.textContent = to.toLocaleString("vi-VN") + suf; return; }
  const t0 = performance.now(), dur = 1600;
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
    el.textContent = v.toLocaleString("vi-VN") + suf;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}), { threshold: .6 });
$$("[data-count]").forEach(el => counters.observe(el));

/* --- Countdown --- */
const cd = $("#countdown"), end = new Date(CONFIG.offerDeadline).getTime();
const pad = n => String(n).padStart(2, "0");
function tickCd() {
  const d = end - Date.now();
  if (isNaN(end) || d <= 0) { $("#topbar").style.display = "none"; return; }
  const s = Math.floor(d / 1000);
  cd.textContent = `${pad(Math.floor(s / 86400))}n ${pad(Math.floor(s % 86400 / 3600))}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`;
}
tickCd(); setInterval(tickCd, 1000);

/* --- Preselect plan from CTA --- */
$$("[data-plan]").forEach(a => a.addEventListener("click", () => {
  const plan = a.dataset.plan, sel = $("#planSelect");
  if (!plan) return;
  const opt = [...sel.options].find(o => o.text.startsWith(plan));
  if (opt) sel.value = opt.value;
}));

/* --- Tilt cards --- */
if (!reduce && matchMedia("(hover:hover)").matches) {
  $$(".tilt").forEach(c => {
    c.addEventListener("mousemove", e => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    c.addEventListener("mouseleave", () => c.style.transform = "");
  });
}

/* --- Lead form --- */
const form = $("#leadForm"), msg = $("#formMsg");
form.addEventListener("submit", async e => {
  e.preventDefault();
  $$(".err", form).forEach(x => x.classList.remove("err"));
  msg.className = "form-msg";
  const f = new FormData(form), data = Object.fromEntries(f);
  const bad = [];
  if (!data.name?.trim()) bad.push("name");
  if (!/^(\+?84|0)\d{8,10}$/.test((data.phone || "").replace(/[\s.\-]/g, ""))) bad.push("phone");
  if (!/^\S+@\S+\.\S+$/.test(data.email || "")) bad.push("email");
  if (!data.level) bad.push("level");
  bad.forEach(n => form.elements[n].classList.add("err"));
  if (bad.length || !form.elements.agree.checked) {
    msg.textContent = bad.length ? "Vui lòng kiểm tra các trường được đánh dấu đỏ." : "Vui lòng xác nhận đã đọc cảnh báo rủi ro.";
    msg.classList.add("bad"); return;
  }
  data.source = location.href;
  data.time = new Date().toISOString();
  const btn = form.querySelector("button"); btn.disabled = true; btn.textContent = "Đang gửi...";
  try {
    if (CONFIG.formEndpoint) {
      const r = await fetch(CONFIG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error(r.status);
    } else {
      const k = "leads_demo", arr = JSON.parse(localStorage.getItem(k) || "[]");
      arr.push(data); localStorage.setItem(k, JSON.stringify(arr));
    }
    msg.textContent = "✅ Đăng ký thành công! Tôi sẽ liên hệ bạn trong 24 giờ.";
    msg.classList.add("ok"); form.reset();
    try { sessionStorage.setItem("registered", "1"); } catch {}
    if (CONFIG.thankYouUrl) setTimeout(() => location.href = CONFIG.thankYouUrl, 1200);
  } catch {
    msg.textContent = "Gửi chưa thành công, vui lòng thử lại.";
    msg.classList.add("bad");
  } finally { btn.disabled = false; btn.textContent = "Đăng ký ngay"; }
});

/* --- Exit-intent popup (1 lần / phiên, bỏ qua nếu đã đăng ký) --- */
const modal = $("#exitModal");
const seen = () => { try { return sessionStorage.getItem("exitSeen") || sessionStorage.getItem("registered"); } catch { return true; } };
const showModal = () => {
  if (seen()) return;
  try { sessionStorage.setItem("exitSeen", "1"); } catch {}
  modal.hidden = false;
};
document.addEventListener("mouseleave", e => { if (e.clientY <= 0 && scrollY > 800) showModal(); });
const closeModal = () => modal.hidden = true;
$("#exitClose").addEventListener("click", closeModal);
$("#exitCta").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* --- Hero candlestick canvas --- */
(function candles() {
  const cv = $("#candles"); if (!cv || reduce) return;
  const ctx = cv.getContext("2d"); let W, H, bars = [];
  const GAP = 26, BW = 10;
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.ceil(W / GAP) + 2; bars = [];
    let p = H * .6;
    for (let i = 0; i < n; i++) { const b = next(p); bars.push(b); p = b.c; }
  }
  function next(p) {
    const o = p, c = Math.max(H * .15, Math.min(H * .85, o + (Math.random() - .48) * 46));
    return { o, c, h: Math.min(o, c) - Math.random() * 26, l: Math.max(o, c) + Math.random() * 26 };
  }
  let off = 0, last = 0;
  function draw(t) {
    const dt = Math.min(t - last, 50); last = t; off += dt * .02;
    if (off >= GAP) { off -= GAP; bars.shift(); const lb = bars[bars.length - 1]; bars.push(next(lb.c)); }
    ctx.clearRect(0, 0, W, H);
    bars.forEach((b, i) => {
      const x = i * GAP - off, up = b.c < b.o;
      const col = up ? "255,179,0" : "255,100,0";
      ctx.strokeStyle = `rgba(${col},.55)`; ctx.fillStyle = `rgba(${col},${up ? .5 : .22})`;
      ctx.beginPath(); ctx.moveTo(x + BW / 2, b.h); ctx.lineTo(x + BW / 2, b.l); ctx.stroke();
      const top = Math.min(b.o, b.c), hgt = Math.max(Math.abs(b.o - b.c), 2);
      ctx.fillRect(x, top, BW, hgt); ctx.strokeRect(x, top, BW, hgt);
    });
    if (!document.hidden) requestAnimationFrame(draw); else document.addEventListener("visibilitychange", () => requestAnimationFrame(draw), { once: true });
  }
  resize(); addEventListener("resize", resize); requestAnimationFrame(draw);
})();

/* ===== POLISH: tiến trình cuộn, đèn rọi, ánh sáng thẻ, thị sai ===== */
(function polish() {
  const prog = $("#progress"), hero = $(".hero");
  const upd = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (!reduce) hero.style.setProperty("--py", scrollY);
  };
  addEventListener("scroll", upd, { passive: true }); upd();

  if (reduce || !matchMedia("(hover:hover)").matches) return;

  const spot = $("#spot");
  addEventListener("mousemove", e => {
    spot.classList.add("on");
    spot.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
  }, { passive: true });
  document.addEventListener("mouseleave", () => spot.classList.remove("on"));

  // ánh sáng bám con trỏ trên từng thẻ
  document.addEventListener("mousemove", e => {
    const t = e.target.closest?.(".card,.plan,.rung,.steps li");
    if (!t) return;
    const r = t.getBoundingClientRect();
    t.style.setProperty("--mx", e.clientX - r.left + "px");
    t.style.setProperty("--my", e.clientY - r.top + "px");
  }, { passive: true });

  // thị sai nhiều lớp trong hero
  const vis = $(".hero-visual"), layers = $$("[data-depth]", vis);
  const term = $(".terminal");
  hero.addEventListener("mousemove", e => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    layers.forEach(l => {
      if (l === term) return;
      const d = +l.dataset.depth;
      l.style.translate = `${-x * d}px ${-y * d}px`;
    });
    term.style.transform = `rotateY(${-10 + x * 8}deg) rotateX(${5 - y * 8}deg)`;
  });
  hero.addEventListener("mouseleave", () => {
    layers.forEach(l => l.style.translate = "");
    term.style.transform = "";
  });
})();

/* ===== thị sai nhẹ cho ảnh nền ===== */
(function photoParallax() {
  if (reduce) return;
  const photos = $$(".bg-photo");
  const run = () => photos.forEach(p => {
    const r = p.parentElement.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    p.style.transform = `translate3d(0,${(r.top + r.height / 2 - innerHeight / 2) * -.09}px,0)`;
  });
  addEventListener("scroll", run, { passive: true }); run();
})();

/* ===== nạp ảnh nền theo nhu cầu (tiết kiệm băng thông) ===== */
(function lazyBg() {
  const els = $$(".bg-photo[data-bg]");
  const load = el => { el.style.backgroundImage = `url(${el.dataset.bg})`; };
  if (!("IntersectionObserver" in window)) { els.forEach(load); return; }
  const o = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { load(e.target); o.unobserve(e.target); }
  }), { rootMargin: "700px 0px" });
  els.forEach(el => o.observe(el));
})();

/* ===== Dãy chứng nhận chạy liên tục + lightbox ===== */
(function achievements() {
  const track = $("#achvTrack");
  if (!track) return;
  const esc = t => String(t ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const items = (CONFIG.certificates || []).map(c => {
    const alt = `Chứng nhận ${c.title} của ${c.firm}`;
    const owner = c.owner ? ` · <i>${esc(c.owner)}</i>` : "";
    const ver = c.verify ? ` · <a href="${esc(c.verify)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">Xác thực</a>` : "";
    return `<button class="achv-card" type="button"><img src="${esc(c.src)}" alt="${esc(alt)}" width="${+c.w}" height="${+c.h}" loading="lazy"><span class="achv-cap"><b>${esc(c.firm)}</b> · ${esc(c.title)}${owner}${ver}</span></button>`;
  });
  if (!items.length) { $("#thanh-tuu").hidden = true; return; }
  const make = () => { const d = document.createElement("div"); d.className = "achv-group"; return d; };

  function build() {
    track.innerHTML = "";
    const g = make();
    track.appendChild(g);
    let guard = 0;
    do { g.insertAdjacentHTML("beforeend", items.join("")); } while (g.scrollWidth < innerWidth * 1.2 && ++guard < 12);
    const w = g.getBoundingClientRect().width;
    const g2 = g.cloneNode(true);
    g2.setAttribute("aria-hidden", "true");
    $$("button", g2).forEach(b => b.tabIndex = -1);
    track.appendChild(g2);
    track.style.setProperty("--w", w + "px");
    track.style.setProperty("--dur", Math.max(w / 55, 20) + "s");
  }
  build();
  let t; let lastW = innerWidth;
  addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(() => { if (Math.abs(innerWidth - lastW) > 40) { lastW = innerWidth; build(); } }, 250);
  });

  const lb = $("#lightbox"), img = $("#lbImg");
  const close = () => { lb.hidden = true; };
  track.addEventListener("click", e => {
    const card = e.target.closest(".achv-card");
    if (!card) return;
    const im = $("img", card);
    img.src = im.currentSrc || im.src;
    img.alt = im.alt;
    lb.hidden = false;
  });
  lb.addEventListener("click", close);
  $("#lbClose").addEventListener("click", close);
  addEventListener("keydown", e => { if (e.key === "Escape") close(); });
})();
