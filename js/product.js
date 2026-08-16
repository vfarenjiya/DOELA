/* ============================================================
   DOELA — js/product.js
   Product page engine: one template + ?id= -> look up -> fill.
   Buy Now opens a Razorpay Payment Link (bank UPI = 0% fee).
   Depends on: products.js (getProduct, relatedProducts, formatPrice,
               colorHex, REVIEWS), store.js (Store), main.js (toast, paintWishlistHearts)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("productRoot");
  if (!root) return;                 // not the product page -> stop quietly

  /* ---- 1. Which product? ---- */
  const id = new URLSearchParams(location.search).get("id");
  const product = getProduct(id);

  if (!product) {                    // unknown/missing id -> friendly message
    root.innerHTML = `
      <div class="container section" style="text-align:center">
        <h1>We couldn't find that piece.</h1>
        <p class="section-sub">It may have moved or the link is incomplete.</p>
        <a href="collections.html" class="btn btn-primary" style="margin-top:18px">Browse Collections</a>
      </div>`;
    return;
  }

  /* ---- local selection state for this visit ---- */
  let selectedSize  = product.sizes.includes("M") ? "M" : product.sizes[0];
  let selectedColor = product.colors[0];
  let qty = 1;

  /* ---- 2. Fill static fields ---- */
  document.title = `${product.name} – DOELA`;
  setText("p-name", product.name);
  setText("p-price", formatPrice(product.price));
  setText("p-desc", product.description);
  setText("p-desc-full", product.description);
  setText("acc-material", product.material);
  setText("acc-shipping", product.shipping);
  setText("crumb-product", product.name);

  const starsEl = document.getElementById("p-stars");
  if (starsEl) starsEl.textContent = "★".repeat(Math.round(product.rating)) + "☆".repeat(5 - Math.round(product.rating));
  setText("p-rating-text", `${product.rating.toFixed(1)} (${product.reviewCount} reviews)`);

  const wishBtn = document.getElementById("p-wish");
  if (wishBtn) {
    wishBtn.dataset.id = product.id;
    const on = Store.isWished(product.id);
    wishBtn.classList.toggle("active", on);
    wishBtn.textContent = on ? "♥ Added" : "♡ Add to Wishlist";
  }

  /* ---- 3. Gallery + thumbnails ---- */
  const mainImg = document.getElementById("p-main-img");
  const thumbs  = document.getElementById("p-thumbs");
  if (mainImg) mainImg.src = product.gallery[0];
  if (thumbs) {
    thumbs.innerHTML = product.gallery
      .map((src, i) => `<img src="${src}" alt="${product.name} view ${i + 1}" class="${i === 0 ? "active" : ""}">`)
      .join("");
    thumbs.addEventListener("click", e => {
      if (e.target.tagName !== "IMG") return;
      mainImg.src = e.target.src;
      thumbs.querySelectorAll("img").forEach(t => t.classList.remove("active"));
      e.target.classList.add("active");
    });
  }

  /* ---- 4. Color swatches ---- */
  const colorWrap = document.getElementById("p-colors");
  if (colorWrap) {
    colorWrap.innerHTML = product.colors
      .map(c => `<button type="button" class="swatch ${c === selectedColor ? "selected" : ""}"
                          data-color="${c}" style="background:${colorHex(c)}" aria-label="${c}"></button>`)
      .join("");
    colorWrap.addEventListener("click", e => {
      const sw = e.target.closest(".swatch"); if (!sw) return;
      selectedColor = sw.dataset.color;
      colorWrap.querySelectorAll(".swatch").forEach(s => s.classList.remove("selected"));
      sw.classList.add("selected");
      setText("p-color-name", selectedColor);
    });
    setText("p-color-name", selectedColor);
  }

  /* ---- 5. Size buttons ---- */
  const sizeWrap = document.getElementById("p-sizes");
  if (sizeWrap) {
    sizeWrap.innerHTML = product.sizes
      .map(s => `<button type="button" class="${s === selectedSize ? "selected" : ""}" data-size="${s}">${s}</button>`)
      .join("");
    sizeWrap.addEventListener("click", e => {
      const b = e.target.closest("button[data-size]"); if (!b) return;
      selectedSize = b.dataset.size;
      sizeWrap.querySelectorAll("button").forEach(x => x.classList.remove("selected"));
      b.classList.add("selected");
    });
  }

  /* ---- 6. Quantity stepper ---- */
  const qtyEl = document.getElementById("p-qty");
  document.getElementById("qty-minus")?.addEventListener("click", () => { if (qty > 1) { qty--; qtyEl.textContent = qty; } });
  document.getElementById("qty-plus") ?.addEventListener("click", () => { if (qty < 10) { qty++; qtyEl.textContent = qty; } });

  /* ---- 7. Add to Cart -> localStorage ---- */
  const addBtn = document.getElementById("add-to-cart");
  if (addBtn) {
    if (!product.inStock) { addBtn.disabled = true; addBtn.textContent = "Sold Out"; }
    addBtn.addEventListener("click", () => {
      Store.addToCart({ id: product.id, name: product.name, price: product.price, size: selectedSize, qty });
      document.querySelectorAll("#cartCount").forEach(el => { el.textContent = Store.cartCount(); el.style.display = "grid"; });
      toast(`Added to cart · ${product.name} (${selectedSize})`);
    });
  }

  /* ---- 8. Buy Now -> Razorpay Payment Link (UPI = 0% MDR) ---- */
  const buyBtn = document.getElementById("buy-now");
  if (buyBtn) {
    if (product.payLink) {
      buyBtn.innerHTML = "Buy Now · Pay via UPI";
      buyBtn.addEventListener("click", () => {
        Store.set("doela_pending", { id: product.id, size: selectedSize, qty, ts: Date.now() });
        window.open(product.payLink, "_blank");   // customer pays on rzp.io (new tab)
      });
    } else {
      buyBtn.style.display = "none";              // no link configured -> hide gracefully
    }
  }

  /* ---- 9. Reviews ---- */
  const productReviews = REVIEWS.filter(r => r.product === product.id);
  setText("acc-review-count", `${product.reviewCount} Reviews`);
  const reviewList = document.getElementById("review-list");
  if (reviewList) {
    reviewList.innerHTML = productReviews.length
      ? productReviews.map(r => `
          <div style="padding:14px 0;border-bottom:1px solid var(--line)">
            <div class="stars">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div>
            <strong>${r.name}</strong>
            <p style="margin:.3em 0 0;color:var(--muted)">${r.text}</p>
          </div>`).join("")
      : `<p style="color:var(--muted);padding:14px 0">Be the first to review this piece.</p>`;
  }

  /* ---- 10. You may also like ---- */
  const related = document.getElementById("related-grid");
  if (related) {
    related.innerHTML = relatedProducts(product).map(p => `
      <article class="card">
        <button class="wish" data-id="${p.id}" aria-label="Add to wishlist">♡</button>
        <a href="product.html?id=${p.id}">
          <div class="card-media"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
          <h3>${p.name}</h3>
          <p class="price">${formatPrice(p.price)}</p>
        </a>
      </article>`).join("");
    window.paintWishlistHearts();
  }

  /* ---- helper ---- */
  function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value ?? ""; }
});