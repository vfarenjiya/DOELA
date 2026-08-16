/* ============================================================
   DOELA — js/products.js   (YOUR CATALOGUE — edit this file)
   ------------------------------------------------------------
   ADD A PRODUCT: copy any { ... } block below, change the fields,
                  save its photo as images/products/<id>.webp
   SOLD OUT:      set  inStock: false   and   badge: "SOLD OUT"
   INSTANT BUY:   paste a Razorpay Payment Link into  payLink
                  (bank UPI = 0% fee). Leave "" to hide Buy Now.
   Image names must be lowercase kebab-case and match exactly.
   ============================================================ */

/* ---------- Categories (drives the shop filter sidebar) ---------- */
const CATEGORIES = [
  { id: "sarees",      label: "Sarees" },
  { id: "dresses",     label: "Dresses" },
  { id: "co-ord-sets", label: "Co-ord Sets" },
  { id: "blouses",     label: "Blouses" },
  { id: "accessories", label: "Accessories" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const COLORS = [
  { id: "ivory",     hex: "#f3ead9" },
  { id: "champagne", hex: "#e7d3b3" },
  { id: "blush",     hex: "#e9c9c2" },
  { id: "rose",      hex: "#c98a86" },
  { id: "gold",      hex: "#cda35a" },
  { id: "sage",      hex: "#9aa37e" },
];

/* ---------- The products ---------- */
const PRODUCTS = [
  {
    id: "ivory-drape-saree",
    name: "Ivory Drape Saree",
    price: 5890,
    category: "sarees",
    colors: ["ivory", "blush", "rose"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    badge: "BEST SELLER",
    isNew: true,
    rating: 4.8,
    reviewCount: 326,
    img: "images/products/ivory-drape-saree.webp",
    gallery: [
      "images/products/ivory-drape-saree.webp",
      "images/products/ivory-drape-saree-2.webp",
      "images/products/ivory-drape-saree-3.webp",
    ],
    payLink: "",   // <- paste your Razorpay Payment Link here to enable Buy Now
    description: "A timeless ivory drape saree crafted in soft satin silk with a subtle sheen. Perfect for intimate celebrations and elegant evenings.",
    material: "Satin silk · Dry clean only · Made in India",
    shipping: "Ships in 3–5 working days. Free shipping on orders above ₹5,000.",
  },

  {
    id: "champagne-satin-co-ord",
    name: "Champagne Satin Co-ord Set",
    price: 4290,
    category: "co-ord-sets",
    colors: ["champagne", "ivory"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    badge: "NEW",
    isNew: true,
    rating: 4.7,
    reviewCount: 88,
    img: "images/products/champagne-satin-co-ord.webp",
    gallery: ["images/products/champagne-satin-co-ord.webp"],
    payLink: "",
    description: "A fluid champagne satin co-ord — cropped top and wide-leg trousers — for effortless festive dressing.",
    material: "Satin · Hand wash cold · Made in India",
    shipping: "Ships in 3–5 working days.",
  },

  {
    id: "beige-halter-maxi",
    name: "Beige Halter Maxi Dress",
    price: 3890,
    category: "dresses",
    colors: ["champagne", "sage"],
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    badge: "",
    isNew: true,
    rating: 4.6,
    reviewCount: 54,
    img: "images/products/beige-halter-maxi.webp",
    gallery: ["images/products/beige-halter-maxi.webp"],
    payLink: "",
    description: "A floor-length halter maxi in warm beige, cut for movement and quiet luxury.",
    material: "Crepe · Dry clean only · Made in India",
    shipping: "Ships in 3–5 working days.",
  },

  {
    id: "gold-drape-skirt-set",
    name: "Gold Drape Skirt Set",
    price: 4490,
    category: "co-ord-sets",
    colors: ["gold", "champagne"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    badge: "",
    isNew: false,
    rating: 4.9,
    reviewCount: 142,
    img: "images/products/gold-drape-skirt-set.webp",
    gallery: ["images/products/gold-drape-skirt-set.webp"],
    payLink: "",
    description: "A draped gold skirt set that catches the light — made for wedding guests who mean business.",
    material: "Silk blend · Dry clean only · Made in India",
    shipping: "Ships in 3–5 working days.",
  },

  {
    id: "classic-pleated-blouse",
    name: "Classic Pleated Blouse",
    price: 2190,
    category: "blouses",
    colors: ["ivory"],
    sizes: ["XS", "S", "M", "L"],
    inStock: false,                 // <- SOLD OUT example
    badge: "SOLD OUT",
    isNew: false,
    rating: 4.5,
    reviewCount: 61,
    img: "images/products/classic-pleated-blouse.webp",
    gallery: ["images/products/classic-pleated-blouse.webp"],
    payLink: "",
    description: "An everyday-luxe pleated blouse in ivory — the quiet backbone of every DOELA wardrobe.",
    material: "Cotton silk · Hand wash cold · Made in India",
    shipping: "Currently out of stock. Join the waitlist via WhatsApp.",
  },

  {
    id: "peach-organza-saree",
    name: "Peach Organza Saree",
    price: 6990,
    category: "sarees",
    colors: ["blush", "ivory"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    inStock: true,
    badge: "NEW",
    isNew: true,
    rating: 4.9,
    reviewCount: 73,
    img: "images/products/peach-organza-saree.webp",
    gallery: ["images/products/peach-organza-saree.webp"],
    payLink: "",
    description: "Airy peach organza with a hand-finished border — weightless, luminous, unforgettable.",
    material: "Organza · Dry clean only · Made in India",
    shipping: "Ships in 3–5 working days.",
  },

  {
    id: "beige-drape-dress",
    name: "Beige Drape Dress",
    price: 3690,
    category: "dresses",
    colors: ["champagne", "ivory"],
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    badge: "",
    isNew: false,
    rating: 4.4,
    reviewCount: 39,
    img: "images/products/beige-drape-dress.webp",
    gallery: ["images/products/beige-drape-dress.webp"],
    payLink: "",
    description: "A softly draped beige dress for the chapters in between — brunches, farewells, golden hours.",
    material: "Crepe · Hand wash cold · Made in India",
    shipping: "Ships in 3–5 working days.",
  },

  {
    id: "ivory-satin-co-ord",
    name: "Ivory Satin Co-ord Set",
    price: 4490,
    category: "co-ord-sets",
    colors: ["ivory", "champagne"],
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    badge: "",
    isNew: false,
    rating: 4.7,
    reviewCount: 95,
    img: "images/products/ivory-satin-co-ord.webp",
    gallery: ["images/products/ivory-satin-co-ord.webp"],
    payLink: "",
    description: "Polished ivory satin, tailored into a co-ord that reads formal without trying.",
    material: "Satin · Dry clean only · Made in India",
    shipping: "Ships in 3–5 working days.",
  },
  // To add more: copy any block above, change the fields, add a comma after }.
];

/* ---------- Reviews (curated; collect new ones via a Google Form link) ---------- */
const REVIEWS = [
  { name: "Meera R.",  stars: 5, product: "ivory-drape-saree",      text: "Wore the Ivory Drape for Onam — three generations of us in DOELA. The fabric photographs like a dream." },
  { name: "Ananya K.", stars: 5, product: "peach-organza-saree",    text: "The peach organza is even lighter in person. Packaging felt like unwrapping a gift to myself." },
  { name: "Priya S.",  stars: 4, product: "champagne-satin-co-ord", text: "Beautiful drape and true to size. Took one star off only because I want it in more colours!" },
  { name: "Dolly V.",  stars: 5, product: "gold-drape-skirt-set",   text: "Wore the gold set to a wedding and was stopped twice. Worth every rupee." },
];

/* ---------- Helpers (the rest of the site uses these — don't edit unless asked) ---------- */
const getProduct    = (id) => PRODUCTS.find(p => p.id === id);
const byCategory    = (catId) => catId === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === catId);
const categoryCount = (catId) => PRODUCTS.filter(p => p.category === catId).length;
const relatedProducts = (product, limit = 4) =>
  PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, limit);
const formatPrice = (n) => "₹ " + Number(n).toLocaleString("en-IN");
const colorHex    = (colorId) => (COLORS.find(c => c.id === colorId) || {}).hex || "#ccc";