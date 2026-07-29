let products = [];

function reloadProducts() {
  products = getProducts();
  console.log('[main.js] Products reloaded:', products.length, 'products');
}

reloadProducts();

function showToast(message, type) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast ' + (type || '');
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.classList.toggle('show', window.scrollY > 400);
  }
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

const backToTop = document.getElementById('backToTop');
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const animateOnScroll = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in, .slide-up, .stagger-children').forEach(el => {
    observer.observe(el);
  });
};

function handleImageError(img) {
  console.log('[main.js] Image failed to load:', img.src);
  img.style.display = 'none';
  const fallback = document.createElement('span');
  fallback.style.cssText = 'font-size:4rem;display:flex;align-items:center;justify-content:center;height:100%;';
  fallback.textContent = '\u{1F36B}';
  img.parentElement.appendChild(fallback);
}

function buyNow(id) {
  const allProducts = getProducts();
  const product = allProducts.find(p => p.id === Number(id));
  if (!product) return;
  cart = [{ id: product.id, qty: 1 }];
  saveCart();
  window.location.href = 'checkout.html';
}

function renderPagination(containerId, currentPage, totalPages, onPageClick) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (totalPages <= 1) { container.innerHTML = ''; return; }

  let html = '<button class="page-btn" onclick="' + containerId.replace('Pagination', '') + 'PageClick(' + (currentPage - 1) + ')" ' + (currentPage <= 1 ? 'disabled' : '') + '><i class="fas fa-chevron-left"></i></button>';

  let startP = Math.max(1, currentPage - 2);
  let endP = Math.min(totalPages, currentPage + 2);
  if (endP - startP < 4) {
    if (startP === 1) endP = Math.min(totalPages, startP + 4);
    else startP = Math.max(1, endP - 4);
  }

  if (startP > 1) { html += '<button class="page-btn" onclick="' + containerId.replace('Pagination', '') + 'PageClick(1)">1</button>'; if (startP > 2) html += '<span class="page-info">...</span>'; }

  for (let i = startP; i <= endP; i++) {
    html += '<button class="page-btn' + (i === currentPage ? ' active' : '') + '" onclick="' + containerId.replace('Pagination', '') + 'PageClick(' + i + ')">' + i + '</button>';
  }

  if (endP < totalPages) { if (endP < totalPages - 1) html += '<span class="page-info">...</span>'; html += '<button class="page-btn" onclick="' + containerId.replace('Pagination', '') + 'PageClick(' + totalPages + ')">' + totalPages + '</button>'; }

  html += '<button class="page-btn" onclick="' + containerId.replace('Pagination', '') + 'PageClick(' + (currentPage + 1) + ')" ' + (currentPage >= totalPages ? 'disabled' : '') + '><i class="fas fa-chevron-right"></i></button>';

  container.innerHTML = html;
}

function productPageClick(page) { shopPage = page; filterProducts(); }

function createProductCard(product) {
  const oos = product.inStock === false;
  let imgHtml;
  if (product.image && product.image.trim()) {
    imgHtml = `<img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;" onerror="handleImageError(this)">`;
  } else {
    imgHtml = '<span style="font-size:4rem;display:flex;align-items:center;justify-content:center;height:100%;">&#127851;</span>';
  }

  const oosOverlay = oos ? '<div class="oos-badge">Out of Stock</div>' : '';

  return `
    <div class="product-card${oos ? ' oos' : ''}" data-id="${product.id}" data-category="${product.category}" data-price="${product.price}" data-name="${product.name}">
      <a href="product-details.html?id=${product.id}" class="product-image" style="position:relative;">${imgHtml}${oosOverlay}
        <button class="wishlist-btn" onclick="event.preventDefault(); toggleWishlist(${product.id})" title="Add to Wishlist"><i class="far fa-heart"></i></button>
      </a>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <a href="product-details.html?id=${product.id}" class="product-name">${product.name}</a>
        <div class="product-price">${formatBDT(product.price)}</div>
        <div class="card-buttons">
          <button class="add-to-cart" onclick="addToCart(${product.id})"${oos ? ' disabled' : ''}>
            <i class="fas fa-shopping-bag"></i> Add to Cart
          </button>
          <button class="buy-now" onclick="buyNow(${product.id})"${oos ? ' disabled' : ''}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderFeaturedProducts() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const featured = products.slice(0, 9);
  grid.innerHTML = featured.map(createProductCard).join('');
}

let shopPage = 1;
function getPerPage() { return parseInt(localStorage.getItem('shopPerPage')) || 10; }

function renderProducts(productList) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const perPage = getPerPage();
  const total = productList.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (shopPage > totalPages) shopPage = totalPages;

  const start = (shopPage - 1) * perPage;
  const pageItems = productList.slice(start, start + perPage);

  const count = document.getElementById('resultCount');
  if (count) count.textContent = 'Showing ' + pageItems.length + ' of ' + total + ' product' + (total !== 1 ? 's' : '');

  const bar = document.getElementById('paginationBar');

  if (total === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--gray);"><div style="font-size:3rem; margin-bottom:15px;">🔍</div><div style="font-size:1.2rem; font-weight:500; margin-bottom:6px; color:var(--text);">Nothing here yet!</div><div style="font-size:0.9rem; line-height:1.6;">We couldn\'t find any chocolates matching your criteria.<br>Try adjusting the price range or clearing the filters above.</div></div>';
    if (bar) bar.style.display = 'none';
    return;
  }
  if (bar) bar.style.display = 'flex';
  const pageInfo = document.getElementById('pageInfoText');
  if (pageInfo) pageInfo.textContent = 'Page ' + shopPage + ' of ' + totalPages;
  grid.innerHTML = pageItems.map(createProductCard).join('');
  renderPagination('productPagination', shopPage, totalPages, p => { shopPage = p; filterProducts(); });
}

function changePerPage(val) {
  localStorage.setItem('shopPerPage', val);
  const sel = document.getElementById('shopPerPage');
  if (sel) sel.value = val;
  shopPage = 1;
  filterProducts();
}

function filterProducts() {
  shopPage = 1;
  if (!document.getElementById('productGrid')) return;

  let filtered = [...products];

  const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm));
  }

  const checkedCategories = [];
  document.querySelectorAll('.sidebar .filter-group input[type="checkbox"]:checked').forEach(cb => {
    if (cb.value === 'in-stock') return;
    checkedCategories.push(cb.value);
  });
  const allCats = document.querySelectorAll('.sidebar .filter-group input[type="checkbox"]');
  const someUnchecked = Array.from(allCats).some(cb => !cb.checked && cb.value !== 'in-stock');
  if (someUnchecked && checkedCategories.length > 0) {
    filtered = filtered.filter(p => checkedCategories.includes(p.category));
  }

  const inStockCb = document.querySelector('[value="in-stock"]');
  if (inStockCb && inStockCb.checked) {
    filtered = filtered.filter(p => p.inStock !== false);
  }

  const priceRange = document.getElementById('priceRange');
  if (priceRange) {
    const maxPrice = parseInt(priceRange.value);
    document.getElementById('priceLabel').textContent = formatBDT(maxPrice);
    filtered = filtered.filter(p => p.price <= maxPrice);
  }

  const sortVal = document.getElementById('sortSelect')?.value || 'default';
  if (sortVal === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (sortVal === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  else if (sortVal === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

  renderProducts(filtered);
}

function resetFilters() {
  document.querySelectorAll('.sidebar input[type="checkbox"]').forEach(cb => cb.checked = true);
  document.getElementById('priceRange').value = 5000;
  document.getElementById('priceLabel').textContent = formatBDT(5000);
  if (document.getElementById('searchInput')) document.getElementById('searchInput').value = '';
  if (document.getElementById('sortSelect')) document.getElementById('sortSelect').value = 'default';
  filterProducts();
}

function applyUrlFilter() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  if (category) {
    document.querySelectorAll('.sidebar input[type="checkbox"]').forEach(cb => {
      if (cb.value === 'in-stock') return;
      cb.checked = cb.value === category;
    });
    filterProducts();
  }
}

function loadProductDetails() {
  const container = document.getElementById('productDetails');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  const product = products.find(p => p.id === id);

  if (!product) {
    container.innerHTML = '<div style="text-align:center;padding:40px;">Product not found. <a href="shop.html" class="btn btn-primary">Back to Shop</a></div>';
    return;
  }

  document.title = product.metaTitle || (product.name + ' – ChocoDelight BD');
  document.getElementById('breadcrumbProduct').textContent = product.name;
  document.getElementById('productPageTitle').textContent = product.name;

  let imgHtml;
  if (product.image && product.image.trim()) {
    imgHtml = `<img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;" onerror="handleImageError(this)">`;
  } else {
    imgHtml = '<span style="font-size:6rem;display:flex;align-items:center;justify-content:center;height:100%;">&#127851;</span>';
  }

  const oos = product.inStock === false;

  const wlActive = isInWishlist(product.id);

  const specRows = [];
  if (product.weight) specRows.push(`<div class="prod-spec-item"><i class="fas fa-weight"></i><div><div class="spec-label">Weight</div><div class="spec-value">${product.weight}g</div></div></div>`);
  if (product.height && product.width) specRows.push(`<div class="prod-spec-item"><i class="fas fa-ruler-combined"></i><div><div class="spec-label">Dimensions</div><div class="spec-value">${product.height} × ${product.width} cm</div></div></div>`);
  specRows.push(`<div class="prod-spec-item"><i class="fas fa-truck"></i><div><div class="spec-label">Shipping</div><div class="spec-value">Free</div></div></div>`);
  specRows.push(`<div class="prod-spec-item"><i class="fas fa-box"></i><div><div class="spec-label">Category</div><div class="spec-value">${product.category}</div></div></div>`);

  container.innerHTML = `
    <div class="product-gallery">
      <div class="main-image">${imgHtml}${oos ? '<div class="oos-overlay">Out of Stock</div>' : ''}</div>
    </div>
    <div class="product-info-details">
      <div class="prod-cat-badge"><i class="fas fa-tag"></i> ${product.category}</div>
      <h1>${product.name}</h1>
      <div class="prod-price-row">
        <span class="prod-price-large">${formatBDT(product.price)}</span>
      </div>
      <p class="product-description">${product.description || 'No description available.'}</p>
      <div class="prod-specs">${specRows.join('')}</div>
      <div class="prod-availability">
        <span class="dot" style="background:${oos ? '#EF4444' : '#10B981'};"></span>
        ${oos ? 'Out of Stock' : 'In Stock'}
      </div>
      <div class="product-actions">
        <button class="btn btn-primary" onclick="addToCart(${product.id})"${oos ? ' disabled' : ''}><i class="fas fa-shopping-bag"></i> Add to Cart</button>
        <button class="btn btn-secondary" onclick="buyNow(${product.id})"${oos ? ' disabled' : ''}><i class="fas fa-bolt"></i> Buy Now</button>
        <button class="btn-wishlist ${wlActive ? 'active' : ''}" onclick="toggleWishlist(${product.id}); loadProductDetails();" title="Wishlist"><i class="${wlActive ? 'fas' : 'far'} fa-heart"></i></button>
      </div>
    </div>
  `;

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
  document.getElementById('relatedProducts').innerHTML = related.map(createProductCard).join('');
}

let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

function isInWishlist(id) {
  return wishlist.includes(id);
}

function toggleWishlist(id) {
  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast('Removed from wishlist');
  } else {
    wishlist.push(id);
    showToast('Added to wishlist');
    const prod = products.find(p => p.id === id);
    if (prod) {
      const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifs.unshift({ id: Date.now() + '_' + Math.random().toString(36).slice(2,6), type: 'wishlist', title: 'New Wishlist Item', desc: prod.name, date: new Date().toISOString() });
      localStorage.setItem('notifications', JSON.stringify(notifs));
    }
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishlistUI();
}

function showWishlist() {
  const overlay = document.getElementById('wishlistOverlay');
  const container = document.getElementById('wishlistItems');
  if (!overlay || !container) return;

  if (wishlist.length === 0) {
    container.innerHTML = '<p style="color:var(--gray);">Your wishlist is empty.</p>';
  } else {
    container.innerHTML = wishlist.map(id => {
      const p = products.find(pr => pr.id === id);
      return p ? `<div style="display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border);">
        <span>${p.image ? '<img src="' + p.image + '" style="width:24px;height:24px;object-fit:cover;border-radius:4px;vertical-align:middle;margin-right:8px;" onerror="this.outerHTML=\'&#127851;\'">' : '&#127851;'} ${p.name}</span>
        <span style="font-weight:600; color:var(--secondary);">${formatBDT(p.price)}</span>
      </div>` : '';
    }).join('');
  }
  overlay.classList.add('active');
}

function closeWishlist() {
  document.getElementById('wishlistOverlay')?.classList.remove('active');
}

function updateWishlistUI() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const card = btn.closest('.product-card');
    if (!card) return;
    const id = Number(card.dataset.id);
    const active = isInWishlist(id);
    btn.classList.toggle('active', active);
    btn.querySelector('i').className = active ? 'fas fa-heart' : 'far fa-heart';
  });
}

document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = e.target.querySelector('input');
  if (input.value) {
    const subs = JSON.parse(localStorage.getItem('subscribers') || '[]');
    const email = input.value.trim();
    if (!subs.some(s => s.email === email)) {
      subs.unshift({ email, date: new Date().toISOString() });
      localStorage.setItem('subscribers', JSON.stringify(subs));
      const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifs.unshift({ id: Date.now() + '_' + Math.random().toString(36).slice(2,6), type: 'subscriber', title: 'New Subscriber', desc: email, date: new Date().toISOString() });
      localStorage.setItem('notifications', JSON.stringify(notifs));
    }
    showToast('Thank you for subscribing! Check your inbox for a sweet surprise.', 'success');
    input.value = '';
  }
});

document.getElementById('contactForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = {
    id: Date.now(),
    name: document.getElementById('contactName')?.value || '',
    email: document.getElementById('contactEmail')?.value || '',
    subject: document.getElementById('contactSubject')?.value || '',
    message: document.getElementById('contactMessage')?.value || '',
    date: new Date().toISOString()
  };
  const msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  msgs.unshift(msg);
  localStorage.setItem('contactMessages', JSON.stringify(msgs));
  const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifs.unshift({ id: Date.now() + '_' + Math.random().toString(36).slice(2,6), type: 'message', title: 'New Message from ' + msg.name, desc: msg.subject || msg.message.slice(0,60), date: new Date().toISOString() });
  localStorage.setItem('notifications', JSON.stringify(notifs));
  window.dispatchEvent(new CustomEvent('contactMessagesChanged'));
  showToast('Your message has been sent! We will get back to you within 24 hours.', 'success');
  e.target.reset();
});

function renderCategoryFilters() {
  const container = document.getElementById('categoryFilters');
  if (!container) return;
  const cats = typeof getCategories === 'function' ? getCategories() : [];
  container.innerHTML = cats.map(c => `<label><input type="checkbox" value="${c.value}" onchange="filterProducts()" checked> ${c.label}</label>`).join('');
}

function initPage() {
  console.log('[main.js] initPage() called');
  reloadProducts();
  applySettings();
  renderFeaturedProducts();
  renderCategoryFilters();

  if (document.getElementById('productGrid')) {
    const pp = document.getElementById('shopPerPage');
    if (pp) pp.value = getPerPage();
    renderProducts(products);
    applyUrlFilter();
  }

  if (document.getElementById('productDetails')) {
    loadProductDetails();
  }

  updateCartCount();
  updateWishlistUI();
  animateOnScroll();

  if (hamburger && navLinks) {
    const h = hamburger;
    const n = navLinks;
    h.addEventListener('click', () => {
      h.classList.toggle('active');
      n.classList.toggle('active');
    });
    n.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        h.classList.remove('active');
        n.classList.remove('active');
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', initPage);

window.addEventListener('custom:productsChanged', () => {
  console.log('[main.js] productsChanged event received - reloading products');
  reloadProducts();
  if (document.getElementById('featuredGrid')) renderFeaturedProducts();
  if (document.getElementById('productGrid')) filterProducts();
  if (document.getElementById('productDetails')) loadProductDetails();
});

window.addEventListener('custom:settingsChanged', () => {
  console.log('[main.js] settingsChanged event received - reapplying settings');
  applySettings();
});
