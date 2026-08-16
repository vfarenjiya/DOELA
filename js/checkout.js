/* DOELA — js/checkout.js : renders the saved cart + WhatsApp checkout */
(function () {
  function initCart() {
    var wrap        = document.getElementById("cartItems");
    var checkoutBtn = document.getElementById("checkout-whatsapp");
    if (!wrap || !checkoutBtn) return;                 // not the cart page
    if (typeof Store     === "undefined") { alert("Cart error: store.js not loaded."); return; }
    if (typeof getProduct !== "function") { alert("Cart error: products.js not loaded."); return; }

    var YOUR_WHATSAPP = "917067136132";                // <-- your number: country code + digits, NO + or spaces
    var SHIPPING_FLAT = 199, FREE_ABOVE = 5000;

    var cName       = document.getElementById("cName");
    var cPhone      = document.getElementById("cPhone");
    var cAddress    = document.getElementById("cAddress");
    var sumSubtotal = document.getElementById("sumSubtotal");
    var sumShipping = document.getElementById("sumShipping");
    var sumTotal    = document.getElementById("sumTotal");

    var prof = Store.getProfile();
    if (cName    && prof.name)    cName.value    = prof.name;
    if (cPhone   && prof.phone)   cPhone.value   = prof.phone;
    if (cAddress && prof.address) cAddress.value = prof.address;

    function render() {
      var cart = Store.getCart();
      if (!cart || cart.length === 0) {
        wrap.innerHTML = '<p class="section-sub">Your cart is empty. <a href="collections.html" style="color:var(--brown)">Browse collections</a></p>';
        sumSubtotal.textContent = sumTotal.textContent = "₹ 0";
        sumShipping.textContent = "—";
        checkoutBtn.disabled = true;
        return;
      }
      wrap.innerHTML = cart.map(function (i, idx) {
        var img = (getProduct(i.id) || {}).img || "";
        return '' +
          '<div style="display:flex;gap:16px;align-items:center;padding:16px 0;border-bottom:1px solid var(--line)">' +
            '<img src="' + img + '" alt="" style="width:72px;height:90px;object-fit:cover;border-radius:4px;background:var(--panel)">' +
            '<div style="flex:1"><strong>' + i.name + '</strong><br>' +
              '<span style="color:var(--muted);font-size:.85rem">Size ' + i.size + ' · Qty ' + i.qty + '</span></div>' +
            '<div style="text-align:right">₹ ' + (i.price * i.qty).toLocaleString("en-IN") + '<br>' +
              '<button data-remove="' + idx + '" style="background:none;border:none;color:var(--brown);font-size:.78rem;margin-top:4px">Remove</button></div>' +
          '</div>';
      }).join("");

      var subtotal = Store.cartTotal();
      var shipping = subtotal >= FREE_ABOVE ? 0 : SHIPPING_FLAT;
      sumSubtotal.textContent = "₹ " + subtotal.toLocaleString("en-IN");
      sumShipping.textContent = shipping === 0 ? "FREE" : "₹ " + shipping;
      sumTotal.textContent    = "₹ " + (subtotal + shipping).toLocaleString("en-IN");
      checkoutBtn.disabled = false;
    }

    wrap.addEventListener("click", function (e) {
      var b = e.target.closest("[data-remove]");
      if (!b) return;
      var cart = Store.getCart();
      var i = cart[+b.dataset.remove];
      if (i) Store.removeFromCart(i.id, i.size);
      render();
      document.querySelectorAll("#cartCount").forEach(function (el) {
        el.textContent = Store.cartCount();
        el.style.display = Store.cartCount() ? "grid" : "none";
      });
    });

    [cName, cPhone, cAddress].forEach(function (el) {
      if (el) el.addEventListener("input", function () {
        Store.saveProfile({ name: cName.value, phone: cPhone.value, address: cAddress.value });
      });
    });

    checkoutBtn.addEventListener("click", function () {
      var cartNow = Store.getCart();
      if (!cartNow || cartNow.length === 0)     { alert("Your cart is empty — add a product first."); return; }
      if (YOUR_WHATSAPP === "91XXXXXXXXXX")     { alert("Set your WhatsApp number in js/checkout.js first."); return; }

      var subtotal = Store.cartTotal();
      var shipping = subtotal >= FREE_ABOVE ? 0 : SHIPPING_FLAT;
      var orderId  = "DOELA-" + Date.now().toString().slice(-6);

      var lines = ["🧵 New DOELA Order — " + orderId]
        .concat(cartNow.map(function (i) {
          return "• " + i.name + " | Size " + i.size + " | x" + i.qty + " | ₹" + (i.price * i.qty).toLocaleString("en-IN");
        }))
        .concat([
          "", "Subtotal: ₹" + subtotal.toLocaleString("en-IN"),
          "Shipping: " + (shipping === 0 ? "FREE" : "₹" + shipping),
          "Total: ₹" + (subtotal + shipping).toLocaleString("en-IN"), "",
          "Name: "    + (cName.value    || "-"),
          "Phone: "   + (cPhone.value   || "-"),
          "Address: " + (cAddress.value || "-"), "",
          "Please confirm availability and share UPI / bank details. Thank you!"
        ]);

      var text = lines.map(function (l) { return encodeURIComponent(l); }).join("%0A");
      window.open("https://api.whatsapp.com/send?phone=" + YOUR_WHATSAPP + "&text=" + text, "_blank");
    });

    render();   // <-- this draws your saved items immediately
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCart);
  } else {
    initCart();
  }
})();