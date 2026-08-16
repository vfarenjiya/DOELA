/* ============================================================
   DOELA — js/collections.js
   Shop page engine: read filters + sort -> filter -> sort ->
   paginate PRODUCTS -> render the grid.
   Depends on: products.js (PRODUCTS, CATEGORIES, SIZES, COLORS,
               categoryCount, formatPrice, colorHex), store.js, main.js
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productGrid");
  if (!grid) return;                 // not the shop page -> stop quietly

  /* ---- filter state (single source of truth) ---- */
  const state = {
    category: "all",
    sizes:    new Set(),
    colors:   new Set(),
    stock:    "all",                 // "all" | "in" | "out"
    maxPrice: 10000,
    sort:     "newest",
    page:     1,
  };
  const PER_PAGE = 12;

  buildCategoryFilter();
  buildSizeFilter();
  buildColorFilter();
  wireControls();
  render();                          // first paint

  /* ---------- build sidebar from data ---------- */
  function buildCategoryFilter() {
    const wrap = document.getElementById("filterCategory");
    if (!wrap) return;
    const all = [{ id: "all", label: "All" }, ...CATEGORIES];
    wrap.innerHTML = all.map(c => `
      <label>
        <input type="radio" name="category" value="${c.id}" ${c.id === "all" ? "checked" : ""}>
        ${c.label} <span style="opacity:.55">(${c.id === "all" ? PRODUCTS.length : categoryCount(c.id)})</span>
      </label>`).join("");
  }

  function buildSizeFilter() {
    const wrap = document.getElementById("filterSize");
    if (!wrap) return;
    wrap.innerHTML = SIZES.map(s =>
      `<label><input type="checkbox" name="size" value="${s}"> ${s}</label>`).join("");
  }

  function buildColorFilter() {
    const wrap = document.getElementById("filterColor");
    if (!wrap) return;
    wrap.innerHTML = COLORS.map(c => `
      <button type="button" class="swatch" data-color="${c.id}"
              style="background:${c.hex}" title="${c.id}" aria-label="${c.id}"></button>`).join("");
  }

  /* ---------- wire controls -> mutate state -> re-render ---------- */
  function wireControls() {
    document.querySelectorAll('input[name="category"]').forEach(el =>
      el.addEventListener("change", () => { state.category = el.value; state.page = 1; render(); })
    );

    document.querySelectorAll('input[name="size"]').forEach(el =>
      el.addEventListener("change", () => {
        el.checked ? state.sizes.add(el.value) : state.sizes.delete(el.value);
        state.page = 1; render();
      })
    );

    document.querySelectorAll(".swatch[data-color]").forEach(sw =>
      sw.addEventListener("click", () => {
        const c = sw.dataset.color;
        sw.classList.toggle("selected");
        sw.classList.contains("selected") ? state.colors.add(c) : state.colors.delete(c);
        state.page = 1; render();
      })
    );

    document.querySelectorAll('input[name="stock"]').forEach(el =>
      el.addEventListener("change", () => { state.stock = el.value; state.page = 1; render(); })
    );

    const price = document.getElementById("priceRange");
    const priceVal = document.getElementById("priceValue");
    if (price) price.addEventListener("input", () => {
      state.maxPrice = +price.value;
      if (priceVal) priceVal.textContent = formatPrice(state.maxPrice);
      state.page = 1; render();
    });

    const sort = document.getElementById("sortBy");
    if (sort) sort.addEventListener("change", () => { state.sort = sort.value; state.page = 1; render(); });

    const clear = document.getElementById("clearFilters");
    if (clear) clear.addEventListener("click", resetFilters);
  }

  function resetFilters() {
    state.category = "all"; state.sizes.clear(); state.colors.clear();
    state.stock = "all"; state.maxPrice = 10000; state.sort = "newest"; state.page = 1;
    document.querySelectorAll('input[name="category"]').forEach(r => r.checked = (r.value === "all"));
    document.querySelectorAll('input[name="size"]').forEach(r => r.checked = false);
    document.querySelectorAll('input[name="stock"]').forEach(r => r.checked = (r.value === "all"));
    document.querySelectorAll(".swatch.selected").forEach(s => s.classList.remove("selected"));
    const price = document.getElementById("priceRange"); if (price) price.value = 10000;
    const priceVal = document.getElementById("priceValue"); if (priceVal) priceVal.textContent = formatPrice(10000);
    const sort = document.getElementById("sortBy"); if (sort) sort.value = "newest";
    render();
  }

  /* ---------- filter -> sort -> paginate ---------- */
  function getFiltered() {
    let list = PRODUCTS.filter(p =>
      (state.category === "all" || p.category === state.category) &&
      (state.sizes.size  === 0  || p.sizes.some(s => state.sizes.has(s))) &&
      (state.colors.size === 0  || p.colors.some(c => state.colors.has(c))) &&
      (state.stock === "all" || (state.stock === "in" ? p.inStock : !p.inStock)) &&
      p.price <= state.maxPrice
    );

    const sorters = {
      "newest":     (a, b) => (b.isNew - a.isNew) || (b.reviewCount - a.reviewCount),
      "price-low":  (a, b) => a.price - b.price,
      "price-high": (a, b) => b.price - a.price,
      "popular":    (a, b) => b.reviewCount - a.reviewCount,
    };
    list.sort(sorters[state.sort] || sorters.newest);
    return list;
  }

  /* ---------- render grid + count + pagination ---------- */
  function render() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * PER_PAGE;
    const pageItems = filtered.slice(start, start + PER_PAGE);

    const countEl = document.getElementById("resultCount");
    if (countEl) {
      const from = filtered.length ? start + 1 : 0;
      const to   = Math.min(start + PER_PAGE, filtered.length);
      countEl.textContent = `Showing ${from}–${to} of ${filtered.length} results`;
    }

    grid.innerHTML = pageItems.length
      ? pageItems.map(cardHTML).join("")
      : `<p class="section-sub" style="grid-column:1/-1">No pieces match these filters. <a href="#" id="emptyReset" style="color:var(--brown)">Clear all</a></p>`;

    document.getElementById("emptyReset")?.addEventListener("click", e => { e.preventDefault(); resetFilters(); });

    renderPagination(totalPages);
    window.paintWishlistHearts();      // sync hearts on the new cards
  }

  function cardHTML(p) {
    return `
      <article class="card">
        <button class="wish" data-id="${p.id}" aria-label="Add to wishlist">♡</button>
        <a href="product.html?id=${p.id}">
          <div class="card-media">
            ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
            <img src="${p.img}" alt="${p.name}" loading="lazy">
          </div>
          <h3>${p.name}</h3>
          <p class="price">${p.inStock ? formatPrice(p.price) : "<s>" + formatPrice(p.price) + "</s> Sold out"}</p>
        </a>
      </article>`;
  }

  function renderPagination(totalPages) {
    const wrap = document.getElementById("pagination");
    if (!wrap) return;
    if (totalPages <= 1) { wrap.innerHTML = ""; return; }

    let html = "";
    for (let i = 1; i <= totalPages; i++) {
      html += `<button data-page="${i}" class="${i === state.page ? "active" : ""}">${i}</button>`;
    }
    wrap.innerHTML =
      `<button data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""}>←</button>` +
      html +
      `<button data-page="${state.page + 1}" ${state.page === totalPages ? "disabled" : ""}>→</button>`;

    wrap.querySelectorAll("button[data-page]").forEach(b =>
      b.addEventListener("click", () => {
        const p = +b.dataset.page;
        if (p >= 1 && p <= totalPages) { state.page = p; render(); window.scrollTo({ top: 0, behavior: "smooth" }); }
      })
    );
  }
});

/* ---------- read ?cat= from the URL (so home cards can pre-filter) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const cat = new URLSearchParams(location.search).get("cat");
  if (cat) {
    const radio = document.querySelector(`input[name="category"][value="${cat}"]`);
    if (radio) { radio.checked = true; radio.dispatchEvent(new Event("change")); }
  }
});