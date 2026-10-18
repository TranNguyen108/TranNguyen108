/* ============ i18n ============ */
const I18N = {
  en: {
    roles: ["Full-Stack Developer", "Flutter Developer", "Problem Solver"],
    projectsTitle: "Things I've built.",
    loading: "Loading projects from GitHub…",
    loadError: "Could not load live projects — showing featured work instead.",
    viewCode: "Code ↗",
    updated: "Updated",
    featured: "Featured",
    noDesc: "A project from my GitHub."
  },
  vi: {
    roles: ["Lập trình viên Full-Stack", "Lập trình viên Flutter", "Người giải quyết vấn đề"],
    projectsTitle: "Những thứ mình đã làm.",
    loading: "Đang tải dự án từ GitHub…",
    loadError: "Không tải được dự án trực tiếp — đang hiện các dự án nổi bật.",
    viewCode: "Xem code ↗",
    updated: "Cập nhật",
    featured: "Nổi bật",
    noDesc: "Một dự án từ GitHub của mình."
  }
};
let lang = "en";
const t = (k) => I18N[lang][k];

/* ============ language toggle ============ */
const langBtn = document.getElementById("lang-toggle");
function applyLang() {
  document.documentElement.lang = lang === "vi" ? "vi" : "en";
  document.querySelectorAll("[data-en]").forEach((el) => {
    el.textContent = lang === "vi" ? el.dataset.vi : el.dataset.en;
  });
  langBtn.textContent = lang === "vi" ? "EN" : "VI";
  restartTyping();
  renderProjects(window._repos || null);
}
langBtn.addEventListener("click", () => {
  lang = lang === "en" ? "vi" : "en";
  try { localStorage.setItem("nc-lang", lang); } catch (e) {}
  applyLang();
});
try {
  const saved = localStorage.getItem("nc-lang");
  if (saved === "vi" || saved === "en") lang = saved;
} catch (e) {}

/* ============ typing effect ============ */
const typedEl = document.getElementById("typed");
let typeTimer = null;
function restartTyping() {
  if (typeTimer) { clearTimeout(typeTimer); typeTimer = null; }
  const roles = I18N[lang].roles;
  let ri = 0, ci = 0, deleting = false;
  function tick() {
    const word = roles[ri];
    typedEl.textContent = word.slice(0, ci);
    let delay = deleting ? 38 : 75;
    if (!deleting && ci === word.length) { delay = 1600; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 350; }
    else ci += deleting ? -1 : 1;
    typeTimer = setTimeout(tick, delay);
  }
  tick();
}

/* ============ particle canvas ============ */
(function () {
  const cv = document.getElementById("particles");
  const ctx = cv.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W, H, pts = [];
  function resize() {
    W = cv.width = window.innerWidth; H = cv.height = window.innerHeight;
    const n = Math.min(90, Math.floor((W * H) / 22000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.8 + 0.6,
      c: Math.random() > 0.5 ? "34,211,238" : "167,139,250"
    }));
  }
  function step() {
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
      ctx.fillStyle = `rgba(${p.c},.7)`; ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
      if (d < 130 * 130) {
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(120,140,200,${0.14 * (1 - d / 16900)})`; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    if (!reduced) requestAnimationFrame(step);
  }
  window.addEventListener("resize", resize);
  resize(); step();
})();

/* ============ scroll reveal ============ */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ============ animated counters ============ */
const cio = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count, dur = 1400, t0 = performance.now();
    (function count(now) {
      const p = Math.min((now - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * ease);
      if (p < 1) requestAnimationFrame(count);
    })(t0);
    cio.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll(".stat-num").forEach((el) => cio.observe(el));

/* ============ mobile menu ============ */
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.querySelector(".nav-links");
menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => navLinks.classList.remove("open")));

/* ============ projects from GitHub ============ */
const LANG_COLORS = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5", PHP: "#4F5D95",
  Dart: "#00B4AB", HTML: "#e34c26", CSS: "#563d7c", EJS: "#a91e50", Shell: "#89e051"
};
const FEATURED = {
  "neutral-calendar-app": { en: "Minimalist Flutter productivity app — calendar tasks, daily focus and analytics.", vi: "App năng suất Flutter tối giản — quản lý task theo lịch, tập trung mỗi ngày và phân tích." },
  "flower-shop": { en: "Full e-commerce flower store in PHP/MySQL — cart, vouchers, payments, admin panel.", vi: "Website bán hoa hoàn chỉnh bằng PHP/MySQL — giỏ hàng, voucher, thanh toán, trang quản trị." },
  "nhacohoa": { en: "Modern business site built with Next.js, TypeScript and Tailwind.", vi: "Website doanh nghiệp hiện đại bằng Next.js, TypeScript và Tailwind." },
  "ai-chat-bot": { en: "AI chatbot with Python backend and web frontend.", vi: "Chatbot AI với backend Python và giao diện web." },
  "ATC_Tool-": { en: "Python desktop automation tool with GUI.", vi: "Công cụ tự động hoá desktop bằng Python, có giao diện." },
  "voteSYW": { en: "Real-time voting web app with Node.js and MongoDB.", vi: "Web app bình chọn thời gian thực bằng Node.js và MongoDB." }
};
const grid = document.getElementById("project-grid");

function fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", { month: "short", year: "numeric" }); }
  catch (e) { return ""; }
}
function cardHTML(r) {
  const featured = FEATURED[r.name];
  const desc = featured ? featured[lang] : (r.description || t("noDesc"));
  const color = LANG_COLORS[r.language] || "#8b94a9";
  return `<article class="proj${featured ? " proj-featured" : ""}">
    <div class="proj-top">
      <span class="proj-lang"><span class="lang-dot" style="background:${color}"></span>${r.language || "Code"}</span>
      ${featured ? `<span class="proj-tag">${t("featured")}</span>` : `<span class="proj-stars">★ ${r.stargazers_count || 0}</span>`}
    </div>
    <h3><a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a></h3>
    <p>${desc}</p>
    <div class="proj-meta"><span>${t("updated")}: ${fmtDate(r.updated_at)}</span><a class="proj-link" href="${r.html_url}" target="_blank" rel="noopener">${t("viewCode")}</a></div>
  </article>`;
}
function renderProjects(repos) {
  if (!repos) return;
  const list = repos
    .filter((r) => !r.fork && r.name.toLowerCase() !== "trannguyen108")
    .sort((a, b) => (FEATURED[b.name] ? 1 : 0) - (FEATURED[a.name] ? 1 : 0) || new Date(b.updated_at) - new Date(a.updated_at));
  grid.innerHTML = list.map(cardHTML).join("");
  grid.querySelectorAll(".proj").forEach((el, i) => {
    el.classList.add("reveal"); el.style.transitionDelay = Math.min(i * 60, 400) + "ms"; io.observe(el);
  });
}
async function loadProjects() {
  grid.innerHTML = `<p style="color:var(--muted)">${t("loading")}</p>`;
  try {
    const res = await fetch("https://api.github.com/users/TranNguyen108/repos?per_page=100");
    if (!res.ok) throw new Error("API " + res.status);
    const repos = await res.json();
    window._repos = repos;
    renderProjects(repos);
  } catch (e) {
    grid.innerHTML = `<p style="color:var(--muted)">${t("loadError")}</p>` +
      Object.keys(FEATURED).map((name) => cardHTML({
        name, html_url: "https://github.com/TranNguyen108/" + name,
        language: "Code", stargazers_count: 0, updated_at: new Date().toISOString(), description: null
      })).join("");
    grid.querySelectorAll(".proj").forEach((el) => { el.classList.add("reveal"); io.observe(el); });
  }
}

/* ============ init ============ */
applyLang();
loadProjects();
