let ordersPage = 1;
let productsPage = 1;
let messagesPage = 1;
let subscriberPage = 1;
let wishlistPage = 1;

/* ---- Admin Login ---- */
function getAdminCreds() {
  try { return JSON.parse(localStorage.getItem('adminCreds')) || { user: 'amina', pass: 'amina123' }; }
  catch(e) { return { user: 'admin', pass: 'admin123' }; }
}
function saveAdminCreds(c) { localStorage.setItem('adminCreds', JSON.stringify(c)); }

function checkAdminAuth() {
  const overlay = document.getElementById('loginOverlay');
  const layout = document.getElementById('adminLayout');
  if (sessionStorage.getItem('adminLoggedIn') === 'true') {
    overlay.classList.add('hidden');
    layout.style.display = 'flex';
    return;
  }
  overlay.classList.remove('hidden');
  layout.style.display = 'none';
}

function adminLogin(e) {
  e.preventDefault();
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value.trim();
  const creds = getAdminCreds();
  if (u === creds.user && p === creds.pass) {
    sessionStorage.setItem('adminLoggedIn', 'true');
    document.getElementById('loginOverlay').classList.add('hidden');
    document.getElementById('adminLayout').style.display = 'flex';
    document.getElementById('sidebarUserName').textContent = u.charAt(0).toUpperCase() + u.slice(1);
    showToast('Welcome back, ' + u + '!', 'success');
    refreshAll();
  } else {
    showToast('Invalid username or password.', 'error');
  }
}

function adminLogout() {
  sessionStorage.removeItem('adminLoggedIn');
  document.getElementById('loginOverlay').classList.remove('hidden');
  document.getElementById('adminLayout').style.display = 'none';
  document.getElementById('loginPass').value = '';
}
function getMsgsPerPage() { return parseInt(localStorage.getItem('adminMsgsPerPage')) || 10; }
function getSubsPerPage() { return parseInt(localStorage.getItem('adminSubsPerPage')) || 15; }
function getWishlistPerPage() { return parseInt(localStorage.getItem('adminWishlistPerPage')) || 20; }
function getAdminPerPage() { return parseInt(localStorage.getItem('adminPerPage')) || 20; }
function getAdminProductsPerPage() { return parseInt(localStorage.getItem('adminProductsPerPage')) || 20; }

function showToast(message, type) {
  const toast = document.getElementById('adminToast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast ' + (type || '');
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

function switchSection(section) {
  document.querySelectorAll('.section-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav a').forEach(el => el.classList.remove('active'));
  document.getElementById('section-' + section).classList.add('active');
  document.querySelector(`.sidebar-nav a[data-section="${section}"]`).classList.add('active');
  if (section === 'orders') renderOrdersTable();
  if (section === 'wishlist') { renderAdminWishlist(); dismissTypeNotifs('wishlist'); }
  if (section === 'messages') { renderAdminMessages(); dismissTypeNotifs('message'); }
  if (section === 'subscribers') { renderAdminSubscribers(); dismissTypeNotifs('subscriber'); }
  if (section === 'categories') renderCategoriesTable();
  if (section === 'notifications') renderNotificationsTable();
}

document.querySelectorAll('.sidebar-nav a[data-section]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    switchSection(link.dataset.section);
  });
});

function getOrders() {
  try { return JSON.parse(localStorage.getItem('orders') || '[]'); } catch (e) { return []; }
}

function saveOrders(orders) {
  localStorage.setItem('orders', JSON.stringify(orders));
  window.dispatchEvent(new CustomEvent('ordersChanged'));
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function statusClass(status) {
  const map = {
    'Pending': 'status-pending',
    'Confirmed': 'status-confirmed',
    'Processing': 'status-processing',
    'On the Way': 'status-ontheway',
    'Delivered': 'status-delivered',
    'Cancelled': 'status-cancelled',
    'Pending Verification': 'status-pending'
  };
  return map[status] || 'status-pending';
}

function isInDateRange(dateStr, filter) {
  if (!filter || filter === '') return true;
  const d = new Date(dateStr);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (filter === 'today') return d >= startOfToday;
  if (filter === 'week') {
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    return d >= startOfWeek;
  }
  if (filter === 'month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return d >= startOfMonth;
  }
  return true;
}

function renderOrdersTable() {
  const orders = getOrders();
  const search = (document.getElementById('orderSearch')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('orderStatusFilter')?.value || '';
  const dateFilter = document.getElementById('orderDateFilter')?.value || '';

  const filtered = orders.filter(o => {
    const matchesSearch = !search ||
      o.orderNo?.toLowerCase().includes(search) ||
      o.customer?.phone?.includes(search) ||
      o.customer?.name?.toLowerCase().includes(search);
    const matchesStatus = !statusFilter || o.status === statusFilter;
    const matchesDate = isInDateRange(o.date, dateFilter);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / getAdminPerPage()));
  if (ordersPage > totalPages) ordersPage = totalPages;

  const start = (ordersPage - 1) * getAdminPerPage();
  const pageItems = filtered.slice(start, start + getAdminPerPage());

  const tbody = document.getElementById('ordersTableBody');
  const countEl = document.getElementById('orderCount');
  if (countEl) countEl.textContent = pageItems.length + ' of ' + total + ' orders (' + getAdminPerPage() + '/page)';

  if (total === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--gray);">No orders found.</td></tr>';
    document.getElementById('ordersPagination').innerHTML = '';
    updateNotificationBadge();
    return;
  }

  tbody.innerHTML = pageItems.map(o => `
    <tr>
      <td><strong>${o.orderNo || 'N/A'}</strong></td>
      <td>${o.customer?.name || 'N/A'}</td>
      <td>${o.customer?.phone || 'N/A'}</td>
      <td>${o.payment || 'N/A'}</td>
      <td style="font-size:0.8rem;">${o.transactionId || '—'}</td>
      <td><strong>${formatBDT(o.total)}</strong></td>
      <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
      <td style="font-size:0.8rem;white-space:nowrap;">${formatDate(o.date)}</td>
      <td>
        <div class="actions" style="flex-wrap:nowrap;">
          <button class="btn btn-secondary btn-sm" onclick="viewOrder('${o.orderNo}')" title="View Details"><i class="fas fa-eye"></i></button>
          <button class="btn btn-primary btn-sm" onclick="changeOrderStatus('${o.orderNo}')" title="Change Status"><i class="fas fa-edit"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
  adminPagination('ordersPagination', ordersPage, totalPages, p => { ordersPage = p; renderOrdersTable(); });
  updateNotificationBadge();
}

function changeAdminPerPage(val) {
  localStorage.setItem('adminPerPage', val);
  const sel = document.getElementById('adminPerPage');
  if (sel) sel.value = val;
  ordersPage = 1;
  renderOrdersTable();
}

function changeAdminProductsPerPage(val) {
  localStorage.setItem('adminProductsPerPage', val);
  const sel = document.getElementById('adminProductsPerPage');
  if (sel) sel.value = val;
  productsPage = 1;
  renderProductsTable();
}

function changeMsgsPerPage(val) {
  localStorage.setItem('adminMsgsPerPage', val);
  const sel = document.getElementById('msgsPerPage');
  if (sel) sel.value = val;
  messagesPage = 1;
  renderAdminMessages();
}

function changeSubsPerPage(val) {
  localStorage.setItem('adminSubsPerPage', val);
  const sel = document.getElementById('subsPerPage');
  if (sel) sel.value = val;
  subscriberPage = 1;
  renderAdminSubscribers();
}

function changeWishlistPerPage(val) {
  localStorage.setItem('adminWishlistPerPage', val);
  const sel = document.getElementById('wishlistPerPage');
  if (sel) sel.value = val;
  wishlistPage = 1;
  renderAdminWishlist();
}

function viewOrder(orderNo) {
  const orders = getOrders();
  const o = orders.find(x => x.orderNo === orderNo);
  if (!o) { showToast('Order not found.', 'error'); return; }

  document.getElementById('detailOrderId').textContent = o.orderNo;

  const items = o.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = 0;
  const total = o.total || subtotal + shipping;

  const itemsHtml = items.length > 0 ? items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${formatBDT(item.price)}</td>
      <td>${formatBDT(item.price * item.qty)}</td>
    </tr>
  `).join('') : '<tr><td colspan="4" style="text-align:center;color:var(--gray);">No items</td></tr>';

  document.getElementById('orderDetailBody').innerHTML = `
    <div class="order-info-grid">
      <div class="order-info-item"><label>Customer Name</label><p>${o.customer?.name || 'N/A'}</p></div>
      <div class="order-info-item"><label>Phone Number</label><p>${o.customer?.phone || 'N/A'}</p></div>
      <div class="order-info-item"><label>Address</label><p>${[o.customer?.address, o.customer?.city, o.customer?.district].filter(Boolean).join(', ') || 'N/A'}</p></div>
      <div class="order-info-item"><label>Order Date</label><p>${formatDate(o.date)}</p></div>
      <div class="order-info-item"><label>Payment Method</label><p>${o.payment || 'N/A'}</p></div>
      <div class="order-info-item"><label>Transaction ID</label><p>${o.transactionId || '—'}</p></div>
      <div class="order-info-item"><label>Payment Phone</label><p>${o.paymentPhone || '—'}</p></div>
      <div class="order-info-item"><label>Status</label><p><span class="status-badge ${statusClass(o.status)}">${o.status}</span></p></div>
    </div>
    ${o.orderNotes ? `<div style="margin-bottom:16px;"><label style="font-size:0.75rem;color:var(--gray);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">Order Notes</label><p style="font-size:0.85rem;background:var(--bg);padding:10px 14px;border-radius:6px;border:1px solid var(--border);">${o.orderNotes}</p></div>` : ''}
    <h4 style="font-size:0.9rem;color:var(--primary);margin-bottom:8px;">Products</h4>
    <div class="table-wrapper">
      <table class="order-products-table">
        <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
    </div>
    <div class="order-summary-box">
      <div class="row"><span>Subtotal</span><span>${formatBDT(subtotal)}</span></div>
      <div class="row"><span>Shipping</span><span>Free</span></div>
      <div class="row total"><span>Total</span><span>${formatBDT(total)}</span></div>
    </div>
    <div style="margin-top:20px;text-align:right;">
      <label style="font-size:0.8rem;font-weight:500;margin-right:8px;">Update Status:</label>
      <select class="status-select" onchange="updateOrderStatus('${o.orderNo}', this.value)" style="padding:6px 12px;">
        ${['Pending', 'Confirmed', 'Processing', 'On the Way', 'Delivered', 'Cancelled'].map(s =>
          `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`
        ).join('')}
      </select>
    </div>
  `;

  document.getElementById('orderDetailOverlay').classList.add('active');
}

function closeOrderDetail() {
  document.getElementById('orderDetailOverlay').classList.remove('active');
}

function changeOrderStatus(orderNo) {
  const orders = getOrders();
  const o = orders.find(x => x.orderNo === orderNo);
  if (!o) { showToast('Order not found.', 'error'); return; }

  const statuses = ['Pending', 'Confirmed', 'Processing', 'On the Way', 'Delivered', 'Cancelled'];
  const currentIdx = statuses.indexOf(o.status);
  const nextIdx = currentIdx < statuses.length - 1 ? currentIdx + 1 : 0;
  const newStatus = statuses[nextIdx];

  if (!confirm(`Change status of ${orderNo} from "${o.status}" to "${newStatus}"?`)) return;

  o.status = newStatus;
  saveOrders(orders);
  renderOrdersTable();
  renderDashboard();
  showToast('Order status updated successfully', 'success');
}

function updateOrderStatus(orderNo, newStatus) {
  const orders = getOrders();
  const o = orders.find(x => x.orderNo === orderNo);
  if (!o) { showToast('Order not found.', 'error'); return; }

  if (o.status === newStatus) return;

  o.status = newStatus;
  saveOrders(orders);
  renderOrdersTable();
  renderDashboard();
  showToast('Order status updated successfully', 'success');
}

function updateNotificationBadge() {
  const orders = getOrders();
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Pending Verification').length;
  const allProducts = getProducts();
  const oos = allProducts.filter(p => p.inStock === false).length;

  document.getElementById('sidebarOrderCount').textContent = pendingOrders > 0 ? pendingOrders + ' pending' : '';
  document.getElementById('orderAlertText').textContent = pendingOrders + ' pending order' + (pendingOrders !== 1 ? 's' : '');

  const oosAlert = document.getElementById('prodAlert');
  const oosText = document.getElementById('prodAlertText');
  if (oos > 0) {
    oosAlert.classList.add('show');
    oosText.textContent = oos + ' out-of-stock product' + (oos !== 1 ? 's' : '');
  } else {
    oosAlert.classList.remove('show');
  }
  updateNotifBell();
}

function renderDashboard() {
  const products = getProducts();
  const orders = getOrders();

  document.getElementById('statProducts').textContent = products.length;
  const categories = [...new Set(products.map(p => p.category))];
  document.getElementById('statCategories').textContent = categories.length;

  document.getElementById('statTotalOrders').textContent = orders.length;
  const pendingCount = orders.filter(o => o.status === 'Pending' || o.status === 'Pending Verification').length;
  document.getElementById('statPendingOrders').textContent = pendingCount;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  document.getElementById('statDeliveredOrders').textContent = deliveredCount;
  const revenue = orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + (o.total || 0), 0);
  document.getElementById('statTotalRevenue').textContent = formatBDT(revenue);

  const recentOrders = orders.slice(0, 5);
  const dashOrdersTbody = document.getElementById('dashboardOrdersTable');
  if (orders.length === 0) {
    dashOrdersTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--gray);">No orders yet.</td></tr>';
  } else {
    dashOrdersTbody.innerHTML = recentOrders.map(o => `
      <tr>
        <td><strong>${o.orderNo}</strong></td>
        <td>${o.customer?.name || 'N/A'}</td>
        <td>${formatBDT(o.total)}</td>
        <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
        <td style="font-size:0.8rem;">${formatDate(o.date)}</td>
      </tr>
    `).join('');
  }

  const recent = products.slice(-5).reverse();
  const tbody = document.getElementById('dashboardProductsTable');
  if (products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--gray);">No products yet.</td></tr>';
    return;
  }
  tbody.innerHTML = recent.map(p => `
    <tr>
      <td><div class="table-product-img"><img src="${p.image}" alt="${p.name}" style="width:40px;height:40px;object-fit:cover;border-radius:8px;" onerror="this.outerHTML='<span style=font-size:1.5rem>&#127851;</span>'"></div></td>
      <td><strong>${p.name}</strong></td>
      <td>${formatBDT(p.price)}</td>
      <td><span class="badge badge-${p.category.toLowerCase().replace(/[^a-z]/g, '')}">${p.category}</span></td>
    </tr>
  `).join('');
  updateNotificationBadge();
}

function renderProductsTable() {
  const products = getProducts();
  const total = products.length;
  const perPage = getAdminProductsPerPage();
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (productsPage > totalPages) productsPage = totalPages;
  const start = (productsPage - 1) * perPage;
  const pageItems = products.slice(start, start + perPage);

  document.getElementById('productCount').textContent = pageItems.length + ' of ' + total + ' products (' + perPage + '/page)';
  const tbody = document.getElementById('productsTableBody');
  if (total === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--gray);">No products yet. Click "Add Product" to get started.</td></tr>';
    document.getElementById('productsPagination').innerHTML = '';
    return;
  }
  tbody.innerHTML = pageItems.map(p => {
    const stock = p.stock !== undefined ? p.stock : (p.inStock === false ? 0 : '-');
    const inStock = stock === '-' ? (p.inStock !== false) : stock > 0;
    return `<tr>
      <td>
        <div class="table-product-img">
          <img src="${p.image}" alt="${p.name}" style="width:40px;height:40px;object-fit:cover;border-radius:8px;" onerror="this.outerHTML='<span style=font-size:1.5rem>&#127851;</span>'">
        </div>
      </td>
      <td><strong>${p.name}</strong></td>
      <td>${formatBDT(p.price)}</td>
      <td><span class="badge badge-${p.category.toLowerCase().replace(/[^a-z]/g, '')}">${p.category}</span></td>
      <td style="text-align:center;font-weight:600;">${stock === '-' ? '—' : stock}</td>
      <td><span style="color:${inStock ? 'var(--success)' : 'var(--danger)'};">${stock === '-' ? (p.inStock !== false ? 'In Stock' : 'Out of Stock') : (inStock ? 'In Stock' : 'Out of Stock')}</span></td>
      <td>
        <div class="actions">
          <button class="btn btn-secondary btn-sm" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');
  adminPagination('productsPagination', productsPage, totalPages, p => { productsPage = p; renderProductsTable(); });
}

function populateCategoryDropdown() {
  const sel = document.getElementById('productCategory');
  if (!sel) return;
  const cats = getCategories();
  const current = sel.value;
  sel.innerHTML = '<option value="">Select Category</option>' + cats.map(c => `<option value="${c.value}">${c.label}</option>`).join('');
  sel.value = current;
}

function showProductForm(product) {
  populateCategoryDropdown();
  const container = document.getElementById('productFormContainer');
  container.style.display = 'block';
  document.getElementById('productFormTitle').textContent = product ? 'Edit Product' : 'Add New Product';
  document.getElementById('productFormSubmit').innerHTML = product
    ? '<i class="fas fa-save"></i> <span>Update Product</span>'
    : '<i class="fas fa-save"></i> <span>Save Product</span>';
  document.getElementById('productId').value = product ? product.id : '';
  document.getElementById('productName').value = product ? product.name : '';
  document.getElementById('productPrice').value = product ? product.price : '';
  document.getElementById('productCategory').value = product ? product.category : '';
  document.getElementById('productDescription').value = product ? product.description : '';
  document.getElementById('productImage').value = product ? product.image || '' : '';
  document.getElementById('productStock').value = product ? (product.stock !== undefined ? product.stock : '') : '';
  document.getElementById('productMetaTitle').value = product ? product.metaTitle || '' : '';
  document.getElementById('productMetaDesc').value = product ? product.metaDesc || '' : '';
  document.getElementById('productMetaKeywords').value = product ? product.metaKeywords || '' : '';
  document.getElementById('productHeight').value = product ? (product.height !== undefined ? product.height : '') : '';
  document.getElementById('productWidth').value = product ? (product.width !== undefined ? product.width : '') : '';
  document.getElementById('productWeight').value = product ? (product.weight !== undefined ? product.weight : '') : '';
  document.getElementById('productInStock').checked = product ? (product.inStock !== false) : true;
  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cancelProductForm() {
  document.getElementById('productFormContainer').style.display = 'none';
  document.getElementById('productForm').reset();
  document.getElementById('productId').value = '';
}

function saveProduct(e) {
  e.preventDefault();
  const id = document.getElementById('productId').value;
  const name = document.getElementById('productName').value.trim();
  const price = document.getElementById('productPrice').value.trim();
  const stockRaw = document.getElementById('productStock').value.trim();
  const category = document.getElementById('productCategory').value;
  const description = document.getElementById('productDescription').value.trim();
  const image = document.getElementById('productImage').value.trim();
  const inStock = document.getElementById('productInStock').checked;
  const metaTitle = document.getElementById('productMetaTitle').value.trim();
  const metaDesc = document.getElementById('productMetaDesc').value.trim();
  const metaKeywords = document.getElementById('productMetaKeywords').value.trim();
  const heightRaw = document.getElementById('productHeight').value.trim();
  const widthRaw = document.getElementById('productWidth').value.trim();
  const weightRaw = document.getElementById('productWeight').value.trim();

  if (!name || !price || !category || !description) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }
  if (isNaN(price) || Number(price) <= 0) {
    showToast('Please enter a valid price.', 'error');
    return;
  }

  const stock = stockRaw !== '' ? Math.max(0, Math.floor(Number(stockRaw))) : undefined;
  const height = heightRaw !== '' ? Number(heightRaw) : undefined;
  const width = widthRaw !== '' ? Number(widthRaw) : undefined;
  const weight = weightRaw !== '' ? Number(weightRaw) : undefined;
  const products = getProducts();

  const extra = { metaTitle: metaTitle || undefined, metaDesc: metaDesc || undefined, metaKeywords: metaKeywords || undefined, height, width, weight };

  if (id) {
    const idx = products.findIndex(p => p.id === Number(id));
    if (idx > -1) {
      products[idx] = { ...products[idx], name, price: Number(price), stock, category, description, image: image || '', inStock: stock !== undefined ? stock > 0 : inStock, ...extra };
      saveProducts(products);
      showToast('Product updated successfully!', 'success');
    }
  } else {
    const newProduct = { id: generateId(), name, price: Number(price), stock, category, description, image: image || '', inStock: stock !== undefined ? stock > 0 : true, ...extra };
    products.push(newProduct);
    saveProducts(products);
    showToast('Product added successfully!', 'success');
  }

  cancelProductForm();
  renderDashboard();
  renderProductsTable();
}

function editProduct(id) {
  const product = getProductById(id);
  if (product) showProductForm(product);
}

function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  let products = getProducts();
  products = products.filter(p => p.id !== Number(id));
  saveProducts(products);
  renderDashboard();
  renderProductsTable();
  showToast('Product deleted successfully!', 'success');
}

/* ==================== CATEGORIES CRUD ==================== */
let editCategoryIndex = -1;

function getCategories() {
  const data = localStorage.getItem('categories');
  if (data) { try { return JSON.parse(data); } catch (e) {} }
  const defs = [{ value: 'Dark', label: 'Dark Chocolate' }, { value: 'Milk', label: 'Milk Chocolate' }, { value: 'Gift Hampers', label: 'Gift Hampers' }];
  localStorage.setItem('categories', JSON.stringify(defs));
  return defs;
}

function saveCategories(cats) {
  localStorage.setItem('categories', JSON.stringify(cats));
}

function renderCategoriesTable() {
  const cats = getCategories();
  const products = getProducts();
  const tbody = document.getElementById('categoriesTableBody');
  if (!tbody) return;
  tbody.innerHTML = cats.map((cat, i) => {
    const count = products.filter(p => p.category === cat.value).length;
    return `<tr>
      <td><strong>${cat.label}</strong> <span style="color:var(--gray);font-size:0.8rem;">(${cat.value})</span></td>
      <td>${count}</td>
      <td>
        <button class="btn btn-sm" onclick="editCategory(${i})"><i class="fas fa-edit"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deleteCategory(${i})"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`;
  }).join('');
}

function showAddCategoryForm() {
  editCategoryIndex = -1;
  document.getElementById('categoryFormTitle').textContent = 'Add Category';
  document.getElementById('categoryValue').value = '';
  document.getElementById('categoryLabel').value = '';
  document.getElementById('categoryFormOverlay').style.display = 'flex';
}

function editCategory(index) {
  const cats = getCategories();
  const cat = cats[index];
  if (!cat) return;
  editCategoryIndex = index;
  document.getElementById('categoryFormTitle').textContent = 'Edit Category';
  document.getElementById('categoryValue').value = cat.value;
  document.getElementById('categoryLabel').value = cat.label;
  document.getElementById('categoryFormOverlay').style.display = 'flex';
}

function hideCategoryForm() {
  document.getElementById('categoryFormOverlay').style.display = 'none';
}

function saveCategoryForm() {
  const value = document.getElementById('categoryValue').value.trim();
  const label = document.getElementById('categoryLabel').value.trim();
  if (!value || !label) { showToast('Both fields are required.', 'error'); return; }
  const cats = getCategories();
  const exists = cats.some((c, i) => c.value.toLowerCase() === value.toLowerCase() && i !== editCategoryIndex);
  if (exists) { showToast('A category with this value already exists.', 'error'); return; }
  if (editCategoryIndex >= 0) {
    cats[editCategoryIndex] = { value, label };
  } else {
    cats.push({ value, label });
  }
  saveCategories(cats);
  hideCategoryForm();
  renderCategoriesTable();
  showToast(editCategoryIndex >= 0 ? 'Category updated!' : 'Category added!', 'success');
  editCategoryIndex = -1;
}

function deleteCategory(index) {
  if (!confirm('Delete this category? Products with this category will keep the value but it won\'t appear in the category list.')) return;
  const cats = getCategories();
  cats.splice(index, 1);
  saveCategories(cats);
  renderCategoriesTable();
  showToast('Category deleted!', 'success');
}

const SETTINGS_GROUPS = {
  home: ['heroTitle', 'heroDesc', 'featuredTitle', 'featuredSubtitle', 'categoriesTitle', 'categoriesSubtitle', 'testimonialsTitle', 'testimonialsSubtitle', 'offerTag', 'offerTitle', 'offerDesc', 'newsletterTitle', 'newsletterDesc'],
  shop: ['shopTitle', 'shopDesc'],
  about: ['aboutTitle', 'aboutDesc', 'aboutSectionTitle', 'aboutPara1', 'aboutPara2', 'aboutPara3', 'aboutWhyTitle', 'aboutWhySubtitle'],
  contact: ['contactTitle', 'contactDesc', 'contactFormTitle', 'contactLocationLabel', 'contactLocationValue', 'contactPhoneLabel', 'contactPhoneValue', 'contactEmailLabel', 'contactEmailValue', 'contactHoursLabel', 'contactHoursValue']
};

const KEY_TO_GROUP = {};
Object.keys(SETTINGS_GROUPS).forEach(group => {
  SETTINGS_GROUPS[group].forEach(key => { KEY_TO_GROUP[key] = group; });
});

const TOP_LEVEL_IDS = ['settingLogo', 'settingLogoIcon', 'settingFavicon', 'settingMenu', 'settingFooter', 'footerAddress', 'footerPhone', 'footerEmail', 'footerHours', 'footerQuickLinks', 'footerCategoryLinks', 'footerFacebook', 'footerInstagram', 'footerYoutube', 'footerWhatsapp'];

function loadSettings() {
  const data = localStorage.getItem(STORAGE_KEYS.settings);
  let s = {};
  if (data) { try { s = JSON.parse(data); } catch (e) { s = {}; } }

  document.getElementById('settingLogo').value = s.logo || DEFAULT_SETTINGS.logo;
  document.getElementById('settingLogoIcon').value = s.logoIcon || '';
  document.getElementById('settingFavicon').value = s.favicon || DEFAULT_SETTINGS.favicon || '';
  document.getElementById('settingFooter').value = s.footer || DEFAULT_SETTINGS.footer;
  document.getElementById('settingMenu').value = Array.isArray(s.menu) ? s.menu.join(', ') : (Array.isArray(DEFAULT_SETTINGS.menu) ? DEFAULT_SETTINGS.menu.join(', ') : '');
  document.getElementById('footerAddress').value = s.footerAddress || DEFAULT_SETTINGS.footerAddress || '';
  document.getElementById('footerPhone').value = s.footerPhone || DEFAULT_SETTINGS.footerPhone || '';
  document.getElementById('footerEmail').value = s.footerEmail || DEFAULT_SETTINGS.footerEmail || '';
  document.getElementById('footerHours').value = s.footerHours || DEFAULT_SETTINGS.footerHours || '';
  document.getElementById('footerQuickLinks').value = Array.isArray(s.footerQuickLinks) ? s.footerQuickLinks.join(', ') : (Array.isArray(DEFAULT_SETTINGS.footerQuickLinks) ? DEFAULT_SETTINGS.footerQuickLinks.join(', ') : '');
  document.getElementById('footerCategoryLinks').value = Array.isArray(s.footerCategoryLinks) ? s.footerCategoryLinks.join(', ') : (Array.isArray(DEFAULT_SETTINGS.footerCategoryLinks) ? DEFAULT_SETTINGS.footerCategoryLinks.join(', ') : '');
  document.getElementById('footerFacebook').value = s.footerFacebook || DEFAULT_SETTINGS.footerFacebook || '';
  document.getElementById('footerInstagram').value = s.footerInstagram || DEFAULT_SETTINGS.footerInstagram || '';
  document.getElementById('footerYoutube').value = s.footerYoutube || DEFAULT_SETTINGS.footerYoutube || '';
  document.getElementById('footerWhatsapp').value = s.footerWhatsapp || DEFAULT_SETTINGS.footerWhatsapp || '';

  document.querySelectorAll('#section-settings input, #section-settings textarea').forEach(el => {
    if (TOP_LEVEL_IDS.includes(el.id)) return;
    const val = s.home?.[el.id] ?? s.shop?.[el.id] ?? s.about?.[el.id] ?? s.contact?.[el.id];
    const groups = ['home', 'shop', 'about', 'contact'];
    let fallback = '';
    for (const g of groups) {
      if (DEFAULT_SETTINGS[g] && DEFAULT_SETTINGS[g][el.id] !== undefined) {
        fallback = DEFAULT_SETTINGS[g][el.id];
        break;
      }
    }
    el.value = (val !== undefined && val !== '') ? val : fallback;
  });
}

function saveSectionSettings(section) {
  const data = localStorage.getItem(STORAGE_KEYS.settings);
  const settings = data ? JSON.parse(data) : {};
  if (!settings.home) settings.home = {};
  if (!settings.shop) settings.shop = {};
  if (!settings.about) settings.about = {};
  if (!settings.contact) settings.contact = {};

  if (section === 'footer') {
    settings.footerAddress = document.getElementById('footerAddress').value.trim();
    settings.footerPhone = document.getElementById('footerPhone').value.trim();
    settings.footerEmail = document.getElementById('footerEmail').value.trim();
    settings.footerHours = document.getElementById('footerHours').value.trim();
    const qlRaw = document.getElementById('footerQuickLinks').value.trim();
    settings.footerQuickLinks = qlRaw ? qlRaw.split(',').map(s => s.trim()).filter(s => s) : [];
    const catRaw = document.getElementById('footerCategoryLinks').value.trim();
    settings.footerCategoryLinks = catRaw ? catRaw.split(',').map(s => s.trim()).filter(s => s) : [];
    settings.footerFacebook = document.getElementById('footerFacebook').value.trim();
    settings.footerInstagram = document.getElementById('footerInstagram').value.trim();
    settings.footerYoutube = document.getElementById('footerYoutube').value.trim();
    settings.footerWhatsapp = document.getElementById('footerWhatsapp').value.trim();
    saveSettings(settings);
    showToast('Footer settings saved!', 'success');
    return;
  }

  const groups = { home: HOME_KEYS, shop: SHOP_KEYS, about: ABOUT_KEYS, contact: CONTACT_KEYS };
  const keys = groups[section];
  if (!keys) return;
  keys.forEach(key => {
    const el = document.getElementById(key);
    if (el) settings[section][key] = el.value.trim();
  });
  saveSettings(settings);
  const label = section.charAt(0).toUpperCase() + section.slice(1);
  showToast(label + ' page settings saved!', 'success');
}

function saveSettingsForm() {
  const logo = document.getElementById('settingLogo').value.trim();
  if (!logo) { showToast('Logo text cannot be empty.', 'error'); return; }

  const menuRaw = document.getElementById('settingMenu').value.trim();
  const menu = menuRaw ? menuRaw.split(',').map(s => s.trim()).filter(s => s) : [];
  if (menu.length === 0) { showToast('Add at least one menu item (comma separated).', 'error'); return; }

  const data = localStorage.getItem(STORAGE_KEYS.settings);
  const settings = data ? JSON.parse(data) : {};
  settings.logo = logo;
  settings.logoIcon = document.getElementById('settingLogoIcon').value.trim();
  settings.favicon = document.getElementById('settingFavicon').value.trim();
  settings.menu = menu;
  settings.footer = document.getElementById('settingFooter').value.trim();

  saveSettings(settings);
  showToast('Logo & Navigation saved!', 'success');
}

function adminPagination(containerId, currentPage, totalPages, onPageClick) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = '<button class="page-btn" onclick="adminPageClick(\'' + containerId + '\',' + (currentPage - 1) + ')" ' + (currentPage <= 1 ? 'disabled' : '') + '><i class="fas fa-chevron-left"></i></button>';

  let startP = Math.max(1, currentPage - 2);
  let endP = Math.min(totalPages, currentPage + 2);
  if (endP - startP < 4) {
    if (startP === 1) endP = Math.min(totalPages, startP + 4);
    else startP = Math.max(1, endP - 4);
  }

  if (startP > 1) { html += '<button class="page-btn" onclick="adminPageClick(\'' + containerId + '\',1)">1</button>'; if (startP > 2) html += '<span class="page-info">...</span>'; }

  for (let i = startP; i <= endP; i++) {
    html += '<button class="page-btn' + (i === currentPage ? ' active' : '') + '" onclick="adminPageClick(\'' + containerId + '\',' + i + ')">' + i + '</button>';
  }

  if (endP < totalPages) { if (endP < totalPages - 1) html += '<span class="page-info">...</span>'; html += '<button class="page-btn" onclick="adminPageClick(\'' + containerId + '\',' + totalPages + ')">' + totalPages + '</button>'; }

  html += '<button class="page-btn" onclick="adminPageClick(\'' + containerId + '\',' + (currentPage + 1) + ')" ' + (currentPage >= totalPages ? 'disabled' : '') + '><i class="fas fa-chevron-right"></i></button>';

  container.innerHTML = html;
}

function adminPageClick(containerId, page) {
  if (containerId === 'ordersPagination') { ordersPage = page; renderOrdersTable(); }
  else if (containerId === 'productsPagination') { productsPage = page; renderProductsTable(); }
  else if (containerId === 'messagesPagination') { messagesPage = page; renderAdminMessages(); }
  else if (containerId === 'subscriberPagination') { subscriberPage = page; renderAdminSubscribers(); }
  else if (containerId === 'wishlistPagination') { wishlistPage = page; renderAdminWishlist(); }
}

function renderAdminWishlist() {
  const perPage = getWishlistPerPage();
  const ids = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const all = getProducts();
  const items = ids.map(id => all.find(p => p.id === Number(id))).filter(Boolean);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (wishlistPage > totalPages) wishlistPage = totalPages;
  const start = (wishlistPage - 1) * perPage;
  const pageItems = items.slice(start, start + perPage);

  document.getElementById('wishlistCount').textContent = total + ' product' + (total !== 1 ? 's' : '');
  document.getElementById('sidebarWishlistCount').textContent = unreadCount('readWishlist', total);
  const tbody = document.getElementById('wishlistTableBody');
  if (total === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--gray);">No products in wishlist yet.</td></tr>';
    document.getElementById('wishlistPagination').innerHTML = '';
    return;
  }
  tbody.innerHTML = pageItems.map(p => {
    const rid = p.id;
    const read = isRead('readWishlist', rid);
    return `<tr class="${read ? 'row-read' : ''}">
      <td><div class="table-product-img"><img src="${p.image}" alt="${p.name}" style="width:40px;height:40px;object-fit:cover;border-radius:8px;" onerror="this.outerHTML='<span style=font-size:1.5rem>&#127851;</span>'"></div></td>
      <td><strong>${p.name}</strong></td>
      <td>${formatBDT(p.price)}</td>
      <td><span class="badge badge-${p.category.toLowerCase().replace(/[^a-z]/g, '')}">${p.category}</span></td>
      <td><span style="color:${p.inStock !== false ? 'var(--success)' : 'var(--danger)'};">${p.inStock !== false ? 'In Stock' : 'Out of Stock'}</span></td>
      <td>${read ? '<button class="btn-read done" onclick="markWishlistRead(' + rid + ')" title="Mark as unread"><i class="fas fa-check"></i></button>' : '<button class="btn-read" onclick="markWishlistRead(' + rid + ')" title="Mark as read"><i class="fas fa-check"></i></button>'}</td>
    </tr>`;
  }).join('');
  adminPagination('wishlistPagination', wishlistPage, totalPages, p => { wishlistPage = p; renderAdminWishlist(); });
}

function renderAdminMessages() {
  const perPage = getMsgsPerPage();
  const all = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (messagesPage > totalPages) messagesPage = totalPages;
  const start = (messagesPage - 1) * perPage;
  const pageItems = all.slice(start, start + perPage);

  document.getElementById('messagesCount').textContent = total + ' message' + (total !== 1 ? 's' : '');
  document.getElementById('sidebarMessageCount').textContent = unreadCount('readMessages', total);
  const tbody = document.getElementById('messagesTableBody');
  if (total === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--gray);">No messages yet.</td></tr>';
    document.getElementById('messagesPagination').innerHTML = '';
    return;
  }
  const realIndex = (m, i) => start + i;
  tbody.innerHTML = pageItems.map((m, i) => {
    const rid = m.id;
    const read = isRead('readMessages', rid + '');
    return `<tr style="cursor:pointer;" class="${read ? 'row-read' : ''}" onclick="viewMessage(${realIndex(m, i)})">
      <td style="font-size:0.8rem;white-space:nowrap;">${new Date(m.date).toLocaleDateString('en-BD', {day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}</td>
      <td><strong>${escHtml(m.name)}</strong></td>
      <td><a href="mailto:${escHtml(m.email)}" style="color:var(--accent);font-size:0.85rem;">${escHtml(m.email)}</a></td>
      <td>${escHtml(m.subject || '—')}</td>
      <td style="max-width:220px;font-size:0.85rem;color:var(--gray);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(m.message)}</td>
      <td>${read ? '<button class="btn-read done" onclick="event.stopPropagation();markMsgRead(\'' + rid + '\')" title="Mark as unread"><i class="fas fa-check"></i></button>' : '<button class="btn-read" onclick="event.stopPropagation();markMsgRead(\'' + rid + '\')" title="Mark as read"><i class="fas fa-check"></i></button>'}</td>
      <td><button class="btn btn-danger btn-sm" onclick="event.stopPropagation();deleteMessage(${realIndex(m, i)})" title="Delete"><i class="fas fa-trash"></i></button></td>
    </tr>`;
  }).join('');
  adminPagination('messagesPagination', messagesPage, totalPages, p => { messagesPage = p; renderAdminMessages(); });
}

function deleteMessage(index) {
  if (!confirm('Delete this message?')) return;
  const msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  msgs.splice(index, 1);
  localStorage.setItem('contactMessages', JSON.stringify(msgs));
  if (messagesPage > Math.ceil(msgs.length / getMsgsPerPage())) messagesPage = Math.max(1, Math.ceil(msgs.length / getMsgsPerPage()));
  renderAdminMessages();
  showToast('Message deleted.', 'success');
}

function deleteAllMessages() {
  if (!confirm('Delete all messages?')) return;
  localStorage.setItem('contactMessages', '[]');
  messagesPage = 1;
  renderAdminMessages();
  showToast('All messages deleted.', 'success');
}

function renderAdminSubscribers() {
  const perPage = getSubsPerPage();
  const all = JSON.parse(localStorage.getItem('subscribers') || '[]');
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (subscriberPage > totalPages) subscriberPage = totalPages;
  const start = (subscriberPage - 1) * perPage;
  const pageItems = all.slice(start, start + perPage);

  document.getElementById('subscriberCount').textContent = total + ' subscriber' + (total !== 1 ? 's' : '');
  document.getElementById('sidebarSubscriberCount').textContent = unreadCount('readSubscribers', total);
  const tbody = document.getElementById('subscriberTableBody');
  if (total === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:40px;color:var(--gray);">No subscribers yet.</td></tr>';
    document.getElementById('subscriberPagination').innerHTML = '';
    return;
  }
  const realIndex = (i) => start + i;
  tbody.innerHTML = pageItems.map((s, i) => {
    const read = isRead('readSubscribers', s.email);
    return `<tr class="${read ? 'row-read' : ''}">
      <td>${realIndex(i) + 1}</td>
      <td><a href="mailto:${escHtml(s.email)}" style="color:var(--accent);">${escHtml(s.email)}</a></td>
      <td style="font-size:0.85rem;">${new Date(s.date).toLocaleDateString('en-BD', {day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'})}</td>
      <td>${read ? '<button class="btn-read done" onclick="markSubRead(\'' + s.email + '\')" title="Mark as unread"><i class="fas fa-check"></i></button>' : '<button class="btn-read" onclick="markSubRead(\'' + s.email + '\')" title="Mark as read"><i class="fas fa-check"></i></button>'}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteSubscriber(${realIndex(i)})" title="Delete"><i class="fas fa-trash"></i></button></td>
    </tr>`;
  }).join('');
  adminPagination('subscriberPagination', subscriberPage, totalPages, p => { subscriberPage = p; renderAdminSubscribers(); });
}

function deleteSubscriber(index) {
  if (!confirm('Remove this subscriber?')) return;
  const subs = JSON.parse(localStorage.getItem('subscribers') || '[]');
  subs.splice(index, 1);
  localStorage.setItem('subscribers', JSON.stringify(subs));
  if (subscriberPage > Math.ceil(subs.length / getSubsPerPage())) subscriberPage = Math.max(1, Math.ceil(subs.length / getSubsPerPage()));
  renderAdminSubscribers();
  showToast('Subscriber removed.', 'success');
}

function deleteAllSubscribers() {
  if (!confirm('Remove all subscribers?')) return;
  localStorage.setItem('subscribers', '[]');
  subscriberPage = 1;
  renderAdminSubscribers();
  showToast('All subscribers removed.', 'success');
}

function viewMessage(index) {
  const msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  const m = msgs[index];
  if (!m) return;
  document.getElementById('messageDetailBody').innerHTML = `
    <div style="display:grid;gap:14px;">
      <div><strong style="color:var(--gray);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px;">Date</strong><br><span style="font-size:0.9rem;">${new Date(m.date).toLocaleString('en-BD')}</span></div>
      <div><strong style="color:var(--gray);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px;">Name</strong><br><span style="font-size:0.9rem;">${escHtml(m.name)}</span></div>
      <div><strong style="color:var(--gray);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px;">Email</strong><br><span style="font-size:0.9rem;"><a href="mailto:${escHtml(m.email)}" style="color:var(--accent);">${escHtml(m.email)}</a></span></div>
      <div><strong style="color:var(--gray);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px;">Subject</strong><br><span style="font-size:0.9rem;">${escHtml(m.subject || '—')}</span></div>
      <div><strong style="color:var(--gray);font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px;">Message</strong><br><span style="font-size:0.9rem;line-height:1.7;white-space:pre-wrap;word-break:break-word;">${escHtml(m.message)}</span></div>
    </div>
  `;
  document.getElementById('messageDetailOverlay').classList.add('active');
}
function closeMessageDetail() { document.getElementById('messageDetailOverlay').classList.remove('active'); }

function escHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

/* ---- Read-tracking for Wishlist / Messages / Subscribers ---- */
function getReadIds(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) { return []; }
}
function saveReadIds(key, arr) { localStorage.setItem(key, JSON.stringify(arr)); }
function markRead(key, id) {
  const arr = getReadIds(key);
  if (!arr.includes(id)) { arr.push(id); saveReadIds(key, arr); }
}
function unmarkRead(key, id) {
  let arr = getReadIds(key);
  arr = arr.filter(x => x !== id);
  saveReadIds(key, arr);
}
function toggleRead(key, id) {
  if (isRead(key, id)) { unmarkRead(key, id); } else { markRead(key, id); }
}
function unreadCount(key, total) { return total - getReadIds(key).length; }
function isRead(key, id) { return getReadIds(key).includes(id); }

/* ---- Mark as Read helpers ---- */
function markWishlistRead(id) { toggleRead('readWishlist', id); renderAdminWishlist(); }
function markMsgRead(id) { toggleRead('readMessages', id + ''); renderAdminMessages(); }
function markSubRead(email) { toggleRead('readSubscribers', email); renderAdminSubscribers(); }

/* ---- Notification system (Wishlist / Messages / Subscribers) ---- */
function getNotifs() { return JSON.parse(localStorage.getItem('notifications') || '[]'); }
function saveNotifs(n) { localStorage.setItem('notifications', JSON.stringify(n)); }

function pushNotif(type, title, desc) {
  const n = getNotifs();
  n.unshift({ id: Date.now() + '_' + Math.random().toString(36).slice(2,6), type, title, desc, date: new Date().toISOString() });
  saveNotifs(n);
}

function dismissNotif(id) {
  let n = getNotifs();
  n = n.filter(x => x.id !== id);
  saveNotifs(n);
  renderNotifDropdown();
  updateNotifBell();
}

function dismissTypeNotifs(type) {
  let n = getNotifs();
  n = n.filter(x => x.type !== type);
  saveNotifs(n);
  renderNotifDropdown();
  updateNotifBell();
}

function dismissAllNotifs() {
  saveNotifs([]);
  renderNotifDropdown();
  updateNotifBell();
  document.getElementById('notifDropdown').classList.remove('open');
  renderNotificationsTable();
}

function toggleNotifDropdown() {
  const dd = document.getElementById('notifDropdown');
  const wasOpen = dd.classList.contains('open');
  dd.classList.toggle('open');
  if (!wasOpen) { renderNotifDropdown(); } else { closeNotifDropdown(); }
}
function closeNotifDropdown() {
  const dd = document.getElementById('notifDropdown');
  dd.classList.remove('open');
}

function renderNotifDropdown() {
  const list = document.getElementById('notifList');
  const n = getNotifs();
  if (n.length === 0) {
    list.innerHTML = '<div class="notif-empty">No new notifications</div>';
    document.getElementById('notifClearAll').style.display = 'none';
    return;
  }
  document.getElementById('notifClearAll').style.display = 'block';
  list.innerHTML = n.map(x => {
    const iconClass = x.type === 'message' ? 'msg' : x.type === 'subscriber' ? 'sub' : 'wish';
    const icon = x.type === 'message' ? 'fa-envelope' : x.type === 'subscriber' ? 'fa-user-plus' : 'fa-heart';
    return `<div class="notif-item">
      <div class="notif-item-icon ${iconClass}"><i class="fas ${icon}"></i></div>
      <div class="notif-item-body">
        <div class="title">${escHtml(x.title)}</div>
        <div class="desc">${escHtml(x.desc)}</div>
        <div class="time">${timeAgo(x.date)}</div>
      </div>
      <div class="notif-dismiss-btn" onclick="event.stopPropagation();dismissNotif('${x.id}')" title="Mark as read"><i class="fas fa-check"></i></div>
    </div>`;
  }).join('');
}

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff/60) + 'm ago';
  if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
  return d.toLocaleDateString('en-BD', {day:'numeric', month:'short'});
}

function updateNotifBell() {
  const n = getNotifs();
  const badge = document.getElementById('notifBadge');
  if (n.length > 0) { badge.textContent = n.length; badge.classList.add('show'); }
  else { badge.classList.remove('show'); }
  const sb = document.getElementById('sidebarNotifCount');
  if (sb) sb.textContent = n.length > 0 ? n.length : '';
}

function renderNotificationsTable() {
  const notifs = getNotifs();
  const total = notifs.length;
  const perPage = 10;
  let page = 1;
  const render = (p) => {
    const start = (p - 1) * perPage;
    const pageItems = notifs.slice(start, start + perPage);
    const tbody = document.getElementById('notificationsTableBody');
    if (!tbody) return;
    if (pageItems.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--gray);padding:40px;">No notifications</td></tr>';
      return;
    }
    const iconMap = { message: ['fa-envelope', '#1E40AF', '#DBEAFE'], subscriber: ['fa-user-plus', '#065F46', '#D1FAE5'], wishlist: ['fa-heart', '#991B1B', '#FEE2E2'] };
    tbody.innerHTML = pageItems.map(x => {
      const [icon, color, bg] = iconMap[x.type] || ['fa-bell', '#92400E', '#FEF3C7'];
      return `<tr>
        <td><span style="display:inline-flex;align-items:center;gap:6px;"><span style="width:28px;height:28px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.75rem;background:${bg};color:${color};"><i class="fas ${icon}"></i></span> ${x.type}</span></td>
        <td>${escHtml(x.title)}</td>
        <td>${escHtml(x.desc)}</td>
        <td>${timeAgo(x.date)}</td>
        <td><button class="btn btn-sm" onclick="dismissNotif('${x.id}');renderNotificationsTable();" title="Mark as read"><i class="fas fa-check"></i></button></td>
      </tr>`;
    }).join('');
    adminPagination('notifPagination', p, Math.ceil(total / perPage), np => { page = np; render(np); });
  };
  render(1);
}

function refreshAll() {
  renderDashboard();
  renderProductsTable();
  renderOrdersTable();
  renderAdminWishlist();
  renderAdminMessages();
  renderAdminSubscribers();
  updateNotificationBadge();
}

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  const pp = document.getElementById('adminPerPage');
  if (pp) pp.value = getAdminPerPage();
  const pp2 = document.getElementById('adminProductsPerPage');
  if (pp2) pp2.value = getAdminProductsPerPage();
  const pp3 = document.getElementById('msgsPerPage');
  if (pp3) pp3.value = getMsgsPerPage();
  const pp4 = document.getElementById('subsPerPage');
  if (pp4) pp4.value = getSubsPerPage();
  const pp5 = document.getElementById('wishlistPerPage');
  if (pp5) pp5.value = getWishlistPerPage();
  refreshAll();
  loadSettings();
  window.addEventListener('custom:productsChanged', () => { refreshAll(); });
  window.addEventListener('ordersChanged', () => { ordersPage = 1; refreshAll(); });
  window.addEventListener('contactMessagesChanged', () => { refreshAll(); });
  window.addEventListener('storage', e => {
    if (e.key === 'orders' || e.key === 'choco_products' || e.key === 'wishlist' || e.key === 'contactMessages' || e.key === 'subscribers') { ordersPage = 1; refreshAll(); }
  });
  setInterval(() => {
    const curOrders = localStorage.getItem('orders');
    const curWish = localStorage.getItem('wishlist');
    const curMsgs = localStorage.getItem('contactMessages');
    const curSubs = localStorage.getItem('subscribers');
    const curProds = localStorage.getItem('choco_products') || localStorage.getItem('products');
    if (curOrders !== refreshAll._lastOrders || curWish !== refreshAll._lastWishlist || curMsgs !== refreshAll._lastMessages || curSubs !== refreshAll._lastSubs || curProds !== refreshAll._lastProds) {
      refreshAll._lastOrders = curOrders;
      refreshAll._lastWishlist = curWish;
      refreshAll._lastMessages = curMsgs;
      refreshAll._lastSubs = curSubs;
      refreshAll._lastProds = curProds;
      refreshAll();
    }
  }, 5000);

  document.getElementById('notifBtn').addEventListener('click', e => {
    if (e.target.closest('#notifDropdown')) return;
    toggleNotifDropdown();
  });
  document.addEventListener('click', e => {
    const dd = document.getElementById('notifDropdown');
    if (dd && dd.classList.contains('open') && !e.target.closest('#notifBtn')) {
      closeNotifDropdown();
    }
  });

});
