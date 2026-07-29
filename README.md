# 🍫 ChocoDelight BD

**ChocoDelight BD** is a full-featured e-commerce website for a premium Bangladeshi chocolate brand. It includes a public-facing storefront and a complete admin management panel with authentication, product/order/category CRUD, a notification system, dynamic content settings, and more — all powered by **localStorage** (no backend required).

---

## ✨ Features

### 🛍️ Public Storefront
| Feature | Description |
|---------|-------------|
| **Product Listing** | Browse all products with category, price, and stock filters |
| **Product Details** | View full product info: description, stock, weight, dimensions, SEO meta |
| **Search** | Real-time search by name or category |
| **Category Filter** | Multi-select checkboxes to filter products |
| **Price Range** | Slider to filter by max price |
| **Sorting** | Sort by name, price (asc/desc), default |
| **Cart** | Add/remove items, update quantities, coupon support |
| **Checkout** | Shipping info, order notes, order summary, stock validation |
| **Wishlist** | Add/remove products, persisted in localStorage |
| **Hero Carousel** | 3-image auto-play carousel with dot navigation |
| **Related Products** | Shown on product detail page |
| **Responsive** | Fully responsive for desktop, tablet, and mobile |

### 🔐 Admin Panel (`admin.html`)
| Feature | Description |
|---------|-------------|
| **Login System** | Session-based authentication with credentials stored in localStorage |
| **Dashboard** | Stats: total products, orders, categories, messages, subscribers, out-of-stock alerts |
| **Orders Management** | View all orders with status badges, mark as completed |
| **Products CRUD** | Add / Edit / Delete products with name, price, stock, SEO meta, dimensions, image |
| **Categories CRUD** | Add / Edit / Delete categories; dynamically updates product dropdowns |
| **Wishlist Viewer** | View all wishlisted products per user |
| **Messages** | View contact form submissions, mark as read |
| **Subscribers** | View newsletter subscribers, mark as read |
| **Notifications** | Dedicated admin section (bottom of admin page) + bell dropdown showing all activity |
| **Website Settings** | Editable content for all pages: hero, featured, testimonials, newsletter, about, contact, footer |

### ⚙️ Website Settings
Collapsible sections with individual save buttons:

| Section | Editable Fields |
|---------|----------------|
| **Logo & Navigation** | Logo text, menu items, footer contact info |
| **Home Page** | Hero title/desc, featured, categories, testimonials, offer banner, newsletter |
| **Shop Page** | Page title, description |
| **About Page** | Title, description, paragraphs, "Why Choose" section |
| **Contact Page** | Title, description, form title, location/phone/email/hours labels & values |
| **Footer Settings** | Quick links, category links, contact details, social media URLs |

---

## 🧰 Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Structure |
| **CSS3** | Styling with CSS variables, grid, flexbox, animations |
| **Vanilla JS** | All logic — no frameworks |
| **localStorage** | Data persistence (products, orders, cart, wishlist, settings, categories, subscribers, messages) |
| **sessionStorage** | Admin authentication |
| **Font Awesome** | Icons |
| **Google Fonts** | Poppins & Playfair Display |

---

## 📁 Project Structure

```
choco-delight-bd/
├── index.html              # Home page (hero, featured, categories, testimonials, newsletter)
├── shop.html               # Product listing with filters, search, sorting
├── product-details.html    # Single product detail page
├── about.html              # About the brand
├── contact.html            # Contact form
├── checkout.html           # Order checkout (Tailwind CSS)
├── admin.html              # Full admin management panel
├── README.md
├── css/
│   ├── style.css           # Main stylesheet
│   ├── admin.css           # Admin panel styles
│   ├── animations.css      # Scroll & hover animations
│   └── responsive.css      # Mobile/tablet responsiveness
├── js/
│   ├── data.js             # Data layer: products, settings, categories, localStorage, seed data
│   ├── main.js             # Public site logic: rendering, filtering, cart, wishlist, product details
│   ├── admin.js            # Admin panel logic: CRUD, settings, notifications, auth, dashboard
│   ├── cart.js             # Cart logic
│   └── checkout.js         # Checkout form handling, stock deduction, order placement
└── assets/images/          # Static images
```

---

## 🗄️ Data Storage

All data is stored in the browser's `localStorage`. No server or database required.

| Key | Type | Description |
|-----|------|-------------|
| `products` | `Array` | Product objects with id, name, price, category, description, image, stock, SEO meta, dimensions |
| `settings` | `Object` | Website content settings (logo, menu, footer, home/shop/about/contact pages, footer details) |
| `categories` | `Array` | Category objects `{ value, label }` |
| `cart` | `Array` | Cart items |
| `orders` | `Array` | Placed orders with shipping info, items, totals |
| `wishlist` | `Array` | Wishlisted product IDs |
| `subscribers` | `Array` | Newsletter subscriber emails |
| `messages` | `Array` | Contact form submissions |
| `coupon` | `String` | Active coupon code |
| `adminCreds` | `Object` | Admin username & password |
| `sessionStorage` | | `adminLoggedIn` flag for admin auth |

### Seed Data
On first visit, the site auto-seeds:
- **18 products** across 3 categories (Dark, Milk, Gift Hampers)
- **3 categories** with labels and values
- **Default settings** for all editable page content

---

## 🔐 Admin Login

| Credential | Value |
|------------|-------|
| **URL** | `admin.html` |
| **Username** | `amina` |
| **Password** | `amina123` |

Login is session-based — credentials can be changed by directly editing `localStorage.adminCreds`.

---

## 📬 Notifications

The admin notification bell tracks:
- **Wishlist** products added by customers
- **Messages** from the contact form
- **Subscribers** who sign up for the newsletter

Each type shows a count badge and a dropdown with mark-as-read functionality. Read status is stored in separate localStorage keys (`readWishlist`, `readMessages`, `readSubscribers`).

---

## 🚀 How to Use

1. **Open `index.html`** — browse products, add to cart, manage wishlist
2. **Open `shop.html`** — filter by category, price, search, sort
3. **Open `product-details.html?id=1`** — view product details (pass product id)
4. **Open `checkout.html`** — place an order
5. **Open `admin.html`** — login with `amina` / `amina123` to manage everything

No build tools, no installation, no server — just open any HTML file in a browser.

---

## 👩‍💼 Owner

**Amina Begum** — Founder of ChocoDelight BD
