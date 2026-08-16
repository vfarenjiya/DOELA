/* ============================================================
   DOELA — js/store.js
   The "browser database": cart, wishlist, and local profile.
   Everything reads/writes through Store — never raw localStorage.
   ============================================================ */

const STORE_KEYS = {
  cart:    "doela_cart",     // [{ id, name, price, size, qty }]
  wish:    "doela_wish",     // ["ivory-drape-saree", ...]
  profile: "doela_profile",  // { name, phone, address }
};

const Store = {
  /* Read safely — returns fallback if missing or corrupt */
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      console.warn("Store.get failed for", key, e);
      return fallback;
    }
  },

  /* Write any JSON value */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("Store.set failed for", key, e);
    }
  },

  remove(key) { localStorage.removeItem(key); },

  /* ---------- typed helpers ---------- */
  getCart()     { return this.get(STORE_KEYS.cart, []); },
  saveCart(c)   { this.set(STORE_KEYS.cart, c); },

  getWish()     { return this.get(STORE_KEYS.wish, []); },
  saveWish(w)   { this.set(STORE_KEYS.wish, w); },

  getProfile()  { return this.get(STORE_KEYS.profile, {}); },
  saveProfile(p){ this.set(STORE_KEYS.profile, p); },

  /* ---------- cart ---------- */
  addToCart(item) {
    // item = { id, name, price, size, qty }
    const cart = this.getCart();
    const existing = cart.find(i => i.id === item.id && i.size === item.size);
    if (existing) {
      existing.qty += item.qty;        // same product+size -> bump quantity
    } else {
      cart.push({ ...item });          // new line item
    }
    this.saveCart(cart);
    return cart;
  },

  removeFromCart(id, size) {
    this.saveCart(this.getCart().filter(i => !(i.id === id && i.size === size)));
  },

  clearCart() { this.saveCart([]); },

  cartCount() {                       // total items (header badge)
    return this.getCart().reduce((sum, i) => sum + i.qty, 0);
  },

  cartTotal() {                       // subtotal in rupees
    return this.getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  /* ---------- wishlist ---------- */
  isWished(id) { return this.getWish().includes(id); },

  toggleWish(id) {
    const w = this.getWish();
    const i = w.indexOf(id);
    i >= 0 ? w.splice(i, 1) : w.push(id);
    this.saveWish(w);
    return i < 0;                      // true if it was ADDED
  },
};

Store.keys = STORE_KEYS;