let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = count;
  });
}

function addToCart(id) {
  id = Number(id);
  const allProducts = getProducts();
  const product = allProducts.find(p => p.id === id);
  if (!product) return;

  let qty = 1;
  const qtyInput = document.getElementById('detailQty');
  if (qtyInput) qty = parseInt(qtyInput.value) || 1;

  const existing = cart.find(item => Number(item.id) === id);
  if (existing) {
    existing.qty += qty;
    if (existing.qty > 10) existing.qty = 10;
  } else {
    cart.push({ id: id, qty: qty });
  }
  saveCart();
  showToast(product.name + ' added to cart!', 'success');
  renderCart();
  renderCheckoutSummary();
}

function removeFromCart(id) {
  id = Number(id);
  cart = cart.filter(item => Number(item.id) !== id);
  saveCart();
  renderCart();
  renderCheckoutSummary();
}

function updateCartQty(id, delta) {
  id = Number(id);
  const item = cart.find(i => Number(i.id) === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty < 1) {
    removeFromCart(id);
    return;
  }
  if (item.qty > 10) item.qty = 10;
  saveCart();
  renderCart();
  renderCheckoutSummary();
}

function getCartTotal() {
  let subtotal = 0;
  const allProducts = getProducts();
  cart.forEach(item => {
    const p = allProducts.find(pr => pr.id === Number(item.id));
    if (p) subtotal += p.price * item.qty;
  });
  return subtotal;
}

function getShipping() {
  if (appliedCoupon && appliedCoupon.type === 'freeship') return 0;
  const subtotal = getCartTotal();
  return subtotal >= 1000 ? 0 : 100;
}

function getDiscount() {
  if (!appliedCoupon) return 0;
  const subtotal = getCartTotal();
  if (appliedCoupon.type === 'percent') {
    return Math.round(subtotal * appliedCoupon.discount / 100);
  }
  return 0;
}

function getFinalTotal() {
  return Math.max(0, getCartTotal() - getDiscount() + getShipping());
}

let appliedCoupon = null;
const validCoupons = {
  'CHOCO25': { discount: 25, type: 'percent' },
  'SWEET10': { discount: 10, type: 'percent' },
  'FREESHIP': { discount: 0, type: 'freeship' }
};

function applyCoupon() {
  const input = document.getElementById('couponInput');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  if (!code) {
    showToast('Please enter a coupon code.', 'error');
    return;
  }
  const coupon = validCoupons[code];
  if (!coupon) {
    showToast('Invalid coupon code.', 'error');
    return;
  }
  appliedCoupon = { code, ...coupon };
  showToast('Coupon applied! You got ' + (coupon.type === 'freeship' ? 'free shipping' : coupon.discount + '% off'), 'success');
  updateCartSummary();
  renderCheckoutSummary();
}

function handleCartImageError(img) {
  console.log('[cart.js] Cart image failed to load:', img.src);
  img.style.display = 'none';
  const fallback = document.createElement('span');
  fallback.style.cssText = 'font-size:2rem;display:flex;align-items:center;justify-content:center;height:100%;';
  fallback.textContent = '\u{1F36B}';
  img.parentElement.appendChild(fallback);
}

function renderCart() {
  const container = document.getElementById('cartItems');
  if (!container) return;

  const allProducts = getProducts();

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="padding:40px; text-align:center; color:var(--gray);">
        <i class="fas fa-shopping-bag" style="font-size:3rem; margin-bottom:15px; display:block;"></i>
        <p>Your cart is empty.</p>
        <a href="shop.html" class="btn btn-primary" style="margin-top:15px;">Start Shopping</a>
      </div>
    `;
    updateCartSummary();
    return;
  }

  container.innerHTML = cart.map(item => {
    const p = allProducts.find(pr => pr.id === Number(item.id));
    if (!p) return '';
    const imgHtml = p.image
      ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" onerror="handleCartImageError(this)">`
      : '<span style="font-size:2rem;display:flex;align-items:center;justify-content:center;height:100%;">&#127851;</span>';
    return `
      <div class="cart-item">
        <div class="cart-item-image">${imgHtml}</div>
        <div class="cart-item-details">
          <h4>${p.name}</h4>
          <p>${p.category}</p>
        </div>
        <div class="cart-item-price">${formatBDT(p.price)}</div>
        <div class="cart-item-quantity">
          <button onclick="updateCartQty(${p.id}, -1)">-</button>
          <input type="text" value="${item.qty}" readonly>
          <button onclick="updateCartQty(${p.id}, 1)">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${p.id})"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;
  }).join('');

  updateCartSummary();
}

function updateCartSummary() {
  const subtotal = getCartTotal();
  const discount = getDiscount();
  const shipping = getShipping();
  const total = getFinalTotal();

  const subtotalEl = document.getElementById('subtotal');
  const discountEl = document.getElementById('discount');
  const shippingEl = document.getElementById('shipping');
  const totalEl = document.getElementById('totalAmount');

  if (subtotalEl) subtotalEl.textContent = formatBDT(subtotal);
  if (discountEl) discountEl.textContent = discount > 0 ? '- ' + formatBDT(discount) : 'BDT 0';
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : formatBDT(shipping);
  if (totalEl) totalEl.textContent = formatBDT(total);
}

function renderCheckoutSummary() {
  const container = document.getElementById('checkoutItems');
  const totalEl = document.getElementById('checkoutTotal');
  const shippingEl = document.getElementById('checkoutShipping');
  const couponDiv = document.getElementById('checkoutCoupon');
  const checkoutDiscount = document.getElementById('checkoutDiscount');

  const allProducts = getProducts();

  if (!container && !totalEl) return;

  if (container) {
    if (cart.length === 0) {
      container.innerHTML = '<p style="color:var(--gray); font-size:0.9rem;">No items in cart.</p>';
    } else {
      container.innerHTML = cart.map(item => {
        const p = allProducts.find(pr => pr.id === Number(item.id));
        if (!p) return '';
        return `<div class="summary-row"><span>${p.name} x${item.qty}</span><span>${formatBDT(p.price * item.qty)}</span></div>`;
      }).join('');
    }
  }

  if (shippingEl) shippingEl.textContent = getShipping() === 0 ? 'Free' : formatBDT(getShipping());
  if (totalEl) totalEl.textContent = formatBDT(getFinalTotal());

  if (couponDiv && checkoutDiscount) {
    if (appliedCoupon) {
      couponDiv.style.display = 'flex';
      document.getElementById('checkoutCouponCode').textContent = appliedCoupon.code;
      checkoutDiscount.textContent = formatBDT(getDiscount());
    } else {
      couponDiv.style.display = 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  renderCheckoutSummary();
});
