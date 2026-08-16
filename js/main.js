/* ============================================================
   DOELA — js/main.js
   Shared on EVERY page:
     - mobile nav toggle
     - search overlay (searches PRODUCTS in the browser)
     - header cart + wishlist badge counts
     - wishlist heart toggle (works on any card, even added later)
     - toast() popup helper
   Depends on: store.js (Store), products.js (PRODUCTS, formatPrice)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initSearch();
  updateHeaderBadges();
  initWishlistButtons();
});

/* ---------- 1. Mobile navigation ---------- */
function initMobileNav() {
  const burger = document.getElementById("hamburger");
  const nav    = document.getElementById("mainNav");
  if (!burger || !nav) return;

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
    burger.textContent = open ? "✕" : "☰";
  });

  nav.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      burger.textContent = "☰";
      burger.setAttribute("aria-expanded", false);
    })
  );
}

/* ---------- 2. Search overlay ---------- */
function initSearch() {
  const overlay = document.getElementById("searchOverlay");
  if (!overlay) return;

  const openBtns = document.querySelectorAll("[data-open-search]");
  const closeBtn = overlay.querySelector(".search-close");
  const input    = overlay.querySelector("input");
  const results  = overlay.querySelector(".search-results");

  const open  = () => { overlay.classList.add("open"); setTimeout(() => input.focus(), 50); };
  const close = () => { overlay.classList.remove("open"); input.value = ""; results.innerHTML = ""; };

  openBtns.forEach(b => b.addEventListener("click", open));
  closeBtn?.addEventListener("click", close);
  overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ""; return; }

    const matches = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.replace("-", " ").includes(q)
    ).slice(0, 6);

    results.innerHTML = matches.length
      ? matches.map(p => `
          <a href="product.html?id=${p.id}">
            ${p.name} <span style="opacity:.6">${formatPrice(p.price)}</span>
          </a>`).join("")
      : `<p style="opacity:.6;padding:14px 0">No pieces match “${escapeHtml(q)}”.</p>`;
  });
}

/* ---------- 3. Header badges (cart + wishlist counts) ---------- */
function updateHeaderBadges() {
  setBadge("cartCount", Store.cartCount());
  setBadge("wishCount", Store.getWish().length);
}
function setBadge(id, n) {
  document.querySelectorAll("#" + id).forEach(el => {
    el.textContent = n;
    el.style.display = n > 0 ? "grid" : "none";   // hide the dot when zero
  });
}

/* ---------- 4. Wishlist hearts (one handler covers every card) ---------- */
function initWishlistButtons() {
  document.body.addEventListener("click", e => {
    const btn = e.target.closest(".wish");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();                 // don't trigger the card link

    const id    = btn.dataset.id;
    const added = Store.toggleWish(id);
    btn.classList.toggle("active", added);
    btn.textContent = added ? "♥" : "♡";
    setBadge("wishCount", Store.getWish().length);
    toast(added ? "Added to wishlist ♥" : "Removed from wishlist");
  });

  paintWishlistHearts();
}
function paintWishlistHearts() {
  document.querySelectorAll(".wish[data-id]").forEach(btn => {
    const on = Store.isWished(btn.dataset.id);
    btn.classList.toggle("active", on);
    btn.textContent = on ? "♥" : "♡";
  });
}
window.paintWishlistHearts = paintWishlistHearts;   // reused by other pages

/* ---------- 5. Toast popup ---------- */
let toastTimer;
function toast(message) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}
window.toast = toast;                    // reused by other pages

/* ---------- tiny util ---------- */
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c =>
    ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c])
  );
}
window.escapeHtml = escapeHtml;